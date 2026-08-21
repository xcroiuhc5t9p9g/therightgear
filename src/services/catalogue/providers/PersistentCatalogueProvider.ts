import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../../../types/index.js';
import { ICatalogueProvider, CataloguePersistenceError, CatalogueIntegrityError } from '../types.js';
import { CATALOGUE_COLLECTIONS } from '../persistence/constants.js';
import { getAdminFirestore, checkFirestoreConnection } from '../persistence/firebaseAdmin.js';
import {
  validateAndNormalizeMaker,
  validateAndNormalizeModel,
  validateAndNormalizeGeneration,
  validateAndNormalizeVariant,
  validateAndNormalizeEngine
} from '../persistence/documentValidators.js';

/**
 * Production Persistent Catalogue Provider.
 * 
 * Serves canonical Maker / Model / Generation / Variant / Engine records directly from
 * server-side Firestore datastore.
 * 
 * Guarantees:
 * - Full async ICatalogueProvider compliance
 * - Strict canonical ID and relational foreign-key resolution
 * - Rejection of malformed documents at persistence boundary
 * - Rejection of ambiguous duplicate slug queries
 * - Zero fallback to in-memory fixtures (fails closed on persistent errors)
 */
export class PersistentCatalogueProvider implements ICatalogueProvider {
  public readonly providerType = 'PERSISTENT' as const;

  private customDb?: any;
  private readinessPromise: Promise<void> | null = null;
  private lastReadinessCheck: number = 0;
  private static readonly READINESS_CACHE_MS = 30000; // 30s cache for connectivity verification

  constructor(customDb?: any) {
    if (customDb) {
      this.customDb = customDb;
    }
  }

  private async getDb(): Promise<any> {
    return this.customDb || (await getAdminFirestore());
  }

  // --- READINESS ---
  public async isReady(): Promise<boolean> {
    try {
      await this.assertReady();
      return true;
    } catch {
      return false;
    }
  }

  public async assertReady(): Promise<void> {
    const now = Date.now();
    if (this.readinessPromise && (now - this.lastReadinessCheck < PersistentCatalogueProvider.READINESS_CACHE_MS)) {
      return this.readinessPromise;
    }

    this.readinessPromise = (async () => {
      try {
        if (this.customDb) {
          // If custom db injected, verify with simple query
          const snapshot = await this.customDb.collection(CATALOGUE_COLLECTIONS.makers).limit(1).get();
          this.lastReadinessCheck = Date.now();
          return;
        }
        // Run lightweight ping on makers collection
        await checkFirestoreConnection(CATALOGUE_COLLECTIONS.makers);
        this.lastReadinessCheck = Date.now();
      } catch (err: any) {
        this.readinessPromise = null;
        if (err instanceof CataloguePersistenceError || err instanceof CatalogueIntegrityError) {
          throw err;
        }
        throw new CataloguePersistenceError(`Persistent catalogue datastore is unavailable: ${err?.message || err}`);
      }
    })();

    return this.readinessPromise;
  }

  // --- MAKERS ---
  public async getMakers(): Promise<Maker[]> {
    await this.assertReady();
    try {
      const db = await this.getDb();
      const snapshot = await db.collection(CATALOGUE_COLLECTIONS.makers).get();
      return snapshot.docs.map((doc: any) => validateAndNormalizeMaker(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError('getMakers', err);
    }
  }

  public async getMakerById(id: string): Promise<Maker | null> {
    await this.assertReady();
    if (!id) return null;
    try {
      const db = await this.getDb();
      const doc = await db.collection(CATALOGUE_COLLECTIONS.makers).doc(id).get();
      if (!doc.exists) return null;
      return validateAndNormalizeMaker(doc.data(), doc.id);
    } catch (err: any) {
      this.handlePersistenceError(`getMakerById(${id})`, err);
    }
  }

  public async getMakerBySlug(slug: string): Promise<Maker | null> {
    await this.assertReady();
    if (!slug) return null;
    const cleanSlug = slug.trim();
    try {
      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.makers)
        .where('slug', '==', cleanSlug)
        .get();

      if (snapshot.docs.length > 1) {
        throw new CatalogueIntegrityError(
          `Integrity Violation: Multiple Maker documents found matching slug "${cleanSlug}".`,
          snapshot.docs.map((d: any) => ({
            severity: 'ERROR',
            entityType: 'MAKER',
            entityId: d.id,
            field: 'slug',
            message: `Duplicate Maker slug "${cleanSlug}".`
          }))
        );
      }

      if (snapshot.docs.length === 1) {
        const doc = snapshot.docs[0];
        return validateAndNormalizeMaker(doc.data(), doc.id);
      }

      // Fallback check by doc ID
      const directDoc = await db.collection(CATALOGUE_COLLECTIONS.makers).doc(cleanSlug).get();
      if (directDoc.exists) {
        return validateAndNormalizeMaker(directDoc.data(), directDoc.id);
      }

      return null;
    } catch (err: any) {
      this.handlePersistenceError(`getMakerBySlug(${cleanSlug})`, err);
    }
  }

  // --- MODELS ---
  public async getModels(): Promise<Model[]> {
    await this.assertReady();
    try {
      const db = await this.getDb();
      const snapshot = await db.collection(CATALOGUE_COLLECTIONS.models).get();
      return snapshot.docs.map((doc: any) => validateAndNormalizeModel(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError('getModels', err);
    }
  }

  public async getModelsByMaker(makerIdOrSlug: string): Promise<Model[]> {
    await this.assertReady();
    if (!makerIdOrSlug) return [];
    try {
      const maker = await this.getMakerBySlug(makerIdOrSlug);
      const makerId = maker ? maker.id : makerIdOrSlug;

      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.models)
        .where('maker_id', '==', makerId)
        .get();

      return snapshot.docs.map((doc: any) => validateAndNormalizeModel(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError(`getModelsByMaker(${makerIdOrSlug})`, err);
    }
  }

  public async getModelById(id: string): Promise<Model | null> {
    await this.assertReady();
    if (!id) return null;
    try {
      const db = await this.getDb();
      const doc = await db.collection(CATALOGUE_COLLECTIONS.models).doc(id).get();
      if (!doc.exists) return null;
      return validateAndNormalizeModel(doc.data(), doc.id);
    } catch (err: any) {
      this.handlePersistenceError(`getModelById(${id})`, err);
    }
  }

  public async getModelBySlug(makerSlug: string, modelSlug: string): Promise<Model | null> {
    await this.assertReady();
    if (!modelSlug) return null;
    const cleanModelSlug = modelSlug.trim();
    try {
      const maker = await this.getMakerBySlug(makerSlug);
      const makerId = maker ? maker.id : makerSlug;

      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.models)
        .where('maker_id', '==', makerId)
        .where('slug', '==', cleanModelSlug)
        .get();

      if (snapshot.docs.length > 1) {
        throw new CatalogueIntegrityError(
          `Integrity Violation: Multiple Model documents found matching maker "${makerId}" and slug "${cleanModelSlug}".`,
          snapshot.docs.map((d: any) => ({
            severity: 'ERROR',
            entityType: 'MODEL',
            entityId: d.id,
            field: 'slug',
            message: `Duplicate Model slug "${cleanModelSlug}" within maker "${makerId}".`
          }))
        );
      }

      if (snapshot.docs.length === 1) {
        const doc = snapshot.docs[0];
        return validateAndNormalizeModel(doc.data(), doc.id);
      }

      return null;
    } catch (err: any) {
      this.handlePersistenceError(`getModelBySlug(${makerSlug}, ${cleanModelSlug})`, err);
    }
  }

  public async getModelByIdOrSlug(idOrSlug: string): Promise<Model | null> {
    await this.assertReady();
    if (!idOrSlug) return null;
    const clean = idOrSlug.trim();
    try {
      // 1. Direct ID lookup
      const direct = await this.getModelById(clean);
      if (direct) return direct;

      // 2. Slug query
      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.models)
        .where('slug', '==', clean)
        .get();

      if (snapshot.docs.length > 1) {
        throw new CatalogueIntegrityError(
          `Integrity Violation: Multiple Model documents found matching slug "${clean}".`,
          snapshot.docs.map((d: any) => ({
            severity: 'ERROR',
            entityType: 'MODEL',
            entityId: d.id,
            field: 'slug',
            message: `Duplicate Model slug "${clean}".`
          }))
        );
      }

      if (snapshot.docs.length === 1) {
        const doc = snapshot.docs[0];
        return validateAndNormalizeModel(doc.data(), doc.id);
      }

      return null;
    } catch (err: any) {
      this.handlePersistenceError(`getModelByIdOrSlug(${clean})`, err);
    }
  }

  // --- GENERATIONS ---
  public async getGenerations(): Promise<Generation[]> {
    await this.assertReady();
    try {
      const db = await this.getDb();
      const snapshot = await db.collection(CATALOGUE_COLLECTIONS.generations).get();
      return snapshot.docs.map((doc: any) => validateAndNormalizeGeneration(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError('getGenerations', err);
    }
  }

  public async getGenerationsByModel(modelIdOrSlug: string): Promise<Generation[]> {
    await this.assertReady();
    if (!modelIdOrSlug) return [];
    try {
      const model = await this.getModelByIdOrSlug(modelIdOrSlug);
      const modelId = model ? model.id : modelIdOrSlug;

      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.generations)
        .where('model_id', '==', modelId)
        .get();

      return snapshot.docs.map((doc: any) => validateAndNormalizeGeneration(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError(`getGenerationsByModel(${modelIdOrSlug})`, err);
    }
  }

  public async getGenerationById(id: string): Promise<Generation | null> {
    await this.assertReady();
    if (!id) return null;
    try {
      const db = await this.getDb();
      const doc = await db.collection(CATALOGUE_COLLECTIONS.generations).doc(id).get();
      if (!doc.exists) return null;
      return validateAndNormalizeGeneration(doc.data(), doc.id);
    } catch (err: any) {
      this.handlePersistenceError(`getGenerationById(${id})`, err);
    }
  }

  public async getGenerationBySlug(slug: string): Promise<Generation | null> {
    await this.assertReady();
    if (!slug) return null;
    const cleanSlug = slug.trim();
    try {
      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.generations)
        .where('slug', '==', cleanSlug)
        .get();

      if (snapshot.docs.length > 1) {
        throw new CatalogueIntegrityError(
          `Integrity Violation: Multiple Generation documents found matching slug "${cleanSlug}".`,
          snapshot.docs.map((d: any) => ({
            severity: 'ERROR',
            entityType: 'GENERATION',
            entityId: d.id,
            field: 'slug',
            message: `Duplicate Generation slug "${cleanSlug}".`
          }))
        );
      }

      if (snapshot.docs.length === 1) {
        const doc = snapshot.docs[0];
        return validateAndNormalizeGeneration(doc.data(), doc.id);
      }

      // Check by doc ID
      const direct = await db.collection(CATALOGUE_COLLECTIONS.generations).doc(cleanSlug).get();
      if (direct.exists) {
        return validateAndNormalizeGeneration(direct.data(), direct.id);
      }

      return null;
    } catch (err: any) {
      this.handlePersistenceError(`getGenerationBySlug(${cleanSlug})`, err);
    }
  }

  public async getGenerationByIdOrSlug(idOrSlug: string): Promise<Generation | null> {
    await this.assertReady();
    if (!idOrSlug) return null;
    const clean = idOrSlug.trim();
    try {
      const direct = await this.getGenerationById(clean);
      if (direct) return direct;

      return this.getGenerationBySlug(clean);
    } catch (err: any) {
      this.handlePersistenceError(`getGenerationByIdOrSlug(${clean})`, err);
    }
  }

  // --- VARIANTS ---
  public async getVariants(): Promise<VehicleVariant[]> {
    await this.assertReady();
    try {
      const db = await this.getDb();
      const snapshot = await db.collection(CATALOGUE_COLLECTIONS.variants).get();
      return snapshot.docs.map((doc: any) => validateAndNormalizeVariant(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError('getVariants', err);
    }
  }

  public async getVariantsByGeneration(generationIdOrSlug: string): Promise<VehicleVariant[]> {
    await this.assertReady();
    if (!generationIdOrSlug) return [];
    try {
      const gen = await this.getGenerationByIdOrSlug(generationIdOrSlug);
      const genId = gen ? gen.id : generationIdOrSlug;

      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.variants)
        .where('generation_id', '==', genId)
        .get();

      return snapshot.docs.map((doc: any) => validateAndNormalizeVariant(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError(`getVariantsByGeneration(${generationIdOrSlug})`, err);
    }
  }

  public async getVariantsByModel(modelIdOrSlug: string): Promise<VehicleVariant[]> {
    await this.assertReady();
    if (!modelIdOrSlug) return [];
    try {
      const model = await this.getModelByIdOrSlug(modelIdOrSlug);
      const modelId = model ? model.id : modelIdOrSlug;

      const generations = await this.getGenerationsByModel(modelId);
      if (generations.length === 0) {
        return [];
      }

      const genIds = generations.map(g => g.id);
      
      const results: VehicleVariant[] = [];
      const CHUNK_SIZE = 30;
      const db = await this.getDb();

      for (let i = 0; i < genIds.length; i += CHUNK_SIZE) {
        const chunk = genIds.slice(i, i + CHUNK_SIZE);
        const snapshot = await db
          .collection(CATALOGUE_COLLECTIONS.variants)
          .where('generation_id', 'in', chunk)
          .get();

        for (const doc of snapshot.docs) {
          results.push(validateAndNormalizeVariant(doc.data(), doc.id));
        }
      }

      return results;
    } catch (err: any) {
      this.handlePersistenceError(`getVariantsByModel(${modelIdOrSlug})`, err);
    }
  }

  public async getVariantById(id: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    if (!id) return null;
    try {
      const db = await this.getDb();
      const doc = await db.collection(CATALOGUE_COLLECTIONS.variants).doc(id).get();
      if (!doc.exists) return null;
      return validateAndNormalizeVariant(doc.data(), doc.id);
    } catch (err: any) {
      this.handlePersistenceError(`getVariantById(${id})`, err);
    }
  }

  public async getVariantBySlug(slug: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    if (!slug) return null;
    const cleanSlug = slug.trim();
    try {
      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.variants)
        .where('slug', '==', cleanSlug)
        .get();

      if (snapshot.docs.length > 1) {
        throw new CatalogueIntegrityError(
          `Integrity Violation: Multiple VehicleVariant documents found matching slug "${cleanSlug}".`,
          snapshot.docs.map((d: any) => ({
            severity: 'ERROR',
            entityType: 'VARIANT',
            entityId: d.id,
            field: 'slug',
            message: `Duplicate Variant slug "${cleanSlug}".`
          }))
        );
      }

      if (snapshot.docs.length === 1) {
        const doc = snapshot.docs[0];
        return validateAndNormalizeVariant(doc.data(), doc.id);
      }

      // Check by doc ID
      const direct = await db.collection(CATALOGUE_COLLECTIONS.variants).doc(cleanSlug).get();
      if (direct.exists) {
        return validateAndNormalizeVariant(direct.data(), direct.id);
      }

      return null;
    } catch (err: any) {
      this.handlePersistenceError(`getVariantBySlug(${cleanSlug})`, err);
    }
  }

  public async getVariantByIdOrSlug(idOrSlug: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    if (!idOrSlug) return null;
    const clean = idOrSlug.trim();
    try {
      const direct = await this.getVariantById(clean);
      if (direct) return direct;

      return this.getVariantBySlug(clean);
    } catch (err: any) {
      this.handlePersistenceError(`getVariantByIdOrSlug(${clean})`, err);
    }
  }

  // --- ENGINES ---
  public async getCanonicalEngines(): Promise<CanonicalEngine[]> {
    await this.assertReady();
    try {
      const db = await this.getDb();
      const snapshot = await db.collection(CATALOGUE_COLLECTIONS.engines).get();
      return snapshot.docs.map((doc: any) => validateAndNormalizeEngine(doc.data(), doc.id));
    } catch (err: any) {
      this.handlePersistenceError('getCanonicalEngines', err);
    }
  }

  public async getCanonicalEngineById(id: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    if (!id) return null;
    try {
      const db = await this.getDb();
      const doc = await db.collection(CATALOGUE_COLLECTIONS.engines).doc(id).get();
      if (!doc.exists) return null;
      return validateAndNormalizeEngine(doc.data(), doc.id);
    } catch (err: any) {
      this.handlePersistenceError(`getCanonicalEngineById(${id})`, err);
    }
  }

  public async getCanonicalEngineBySlug(slug: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    if (!slug) return null;
    const cleanSlug = slug.trim();
    try {
      const db = await this.getDb();
      const snapshot = await db
        .collection(CATALOGUE_COLLECTIONS.engines)
        .where('slug', '==', cleanSlug)
        .get();

      if (snapshot.docs.length > 1) {
        throw new CatalogueIntegrityError(
          `Integrity Violation: Multiple CanonicalEngine documents found matching slug "${cleanSlug}".`,
          snapshot.docs.map((d: any) => ({
            severity: 'ERROR',
            entityType: 'ENGINE',
            entityId: d.id,
            field: 'slug',
            message: `Duplicate Engine slug "${cleanSlug}".`
          }))
        );
      }

      if (snapshot.docs.length === 1) {
        const doc = snapshot.docs[0];
        return validateAndNormalizeEngine(doc.data(), doc.id);
      }

      // Check by doc ID
      const direct = await db.collection(CATALOGUE_COLLECTIONS.engines).doc(cleanSlug).get();
      if (direct.exists) {
        return validateAndNormalizeEngine(direct.data(), direct.id);
      }

      return null;
    } catch (err: any) {
      this.handlePersistenceError(`getCanonicalEngineBySlug(${cleanSlug})`, err);
    }
  }

  // --- ERROR TRANSLATION ---
  private handlePersistenceError(operation: string, err: any): never {
    if (err instanceof CatalogueIntegrityError || err instanceof CataloguePersistenceError) {
      throw err;
    }

    const message = err?.message || String(err);
    console.error(`[TheRightGear PersistentCatalogueProvider] Error in ${operation}:`, message);

    throw new CataloguePersistenceError(
      `Persistent catalogue query failed in ${operation}: ${message}`
    );
  }
}
