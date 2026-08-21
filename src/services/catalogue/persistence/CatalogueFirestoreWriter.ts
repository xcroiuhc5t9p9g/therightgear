import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../../../types/index.js';
import { CATALOGUE_COLLECTIONS } from './constants.js';
import { getAdminFirestore } from './firebaseAdmin.js';
import { 
  validateAndNormalizeMaker, 
  validateAndNormalizeModel, 
  validateAndNormalizeGeneration, 
  validateAndNormalizeVariant, 
  validateAndNormalizeEngine 
} from './documentValidators.js';
import { CataloguePersistenceError, CatalogueIntegrityError } from '../types.js';

export interface HierarchyUpsertPayload {
  makers?: Maker[];
  models?: Model[];
  generations?: Generation[];
  variants?: VehicleVariant[];
  engines?: CanonicalEngine[];
}

/**
 * Server-Side Persistence Writer for Canonical Catalogue Entities.
 * 
 * Provides idempotent, parent-validated upsert operations for canonical data ingestion.
 * Strictly internal — not exposed to public API routes.
 */
export class CatalogueFirestoreWriter {
  private customDb?: any;

  constructor(customDb?: any) {
    this.customDb = customDb;
  }

  private async getDb(): Promise<any> {
    return this.customDb || (await getAdminFirestore());
  }

  // --- MAKERS ---
  public async upsertMaker(maker: Maker, transaction?: any): Promise<void> {
    const db = await this.getDb();
    const validated = validateAndNormalizeMaker(maker, maker.id);
    const docRef = db.collection(CATALOGUE_COLLECTIONS.makers).doc(validated.id);

    try {
      if (transaction) {
        transaction.set(docRef, validated, { merge: true });
      } else {
        await docRef.set(validated, { merge: true });
      }
    } catch (err: any) {
      throw new CataloguePersistenceError(`Failed to upsert Maker "${validated.id}": ${err?.message || err}`);
    }
  }

  // --- MODELS ---
  public async upsertModel(model: Model, transaction?: any, skipParentCheck = false): Promise<void> {
    const db = await this.getDb();
    const validated = validateAndNormalizeModel(model, model.id);

    if (!skipParentCheck) {
      const makerDoc = await db.collection(CATALOGUE_COLLECTIONS.makers).doc(validated.maker_id).get();
      if (!makerDoc.exists) {
        throw new CatalogueIntegrityError(
          `Cannot upsert Model "${validated.id}": referenced parent Maker "${validated.maker_id}" does not exist.`,
          [{
            severity: 'ERROR',
            entityType: 'MODEL',
            entityId: validated.id,
            field: 'maker_id',
            message: `Parent Maker "${validated.maker_id}" not found in persistent datastore.`
          }]
        );
      }
    }

    const docRef = db.collection(CATALOGUE_COLLECTIONS.models).doc(validated.id);
    try {
      if (transaction) {
        transaction.set(docRef, validated, { merge: true });
      } else {
        await docRef.set(validated, { merge: true });
      }
    } catch (err: any) {
      throw new CataloguePersistenceError(`Failed to upsert Model "${validated.id}": ${err?.message || err}`);
    }
  }

  // --- GENERATIONS ---
  public async upsertGeneration(generation: Generation, transaction?: any, skipParentCheck = false): Promise<void> {
    const db = await this.getDb();
    const validated = validateAndNormalizeGeneration(generation, generation.id);

    if (!skipParentCheck) {
      const modelDoc = await db.collection(CATALOGUE_COLLECTIONS.models).doc(validated.model_id).get();
      if (!modelDoc.exists) {
        throw new CatalogueIntegrityError(
          `Cannot upsert Generation "${validated.id}": referenced parent Model "${validated.model_id}" does not exist.`,
          [{
            severity: 'ERROR',
            entityType: 'GENERATION',
            entityId: validated.id,
            field: 'model_id',
            message: `Parent Model "${validated.model_id}" not found in persistent datastore.`
          }]
        );
      }
    }

    const docRef = db.collection(CATALOGUE_COLLECTIONS.generations).doc(validated.id);
    try {
      if (transaction) {
        transaction.set(docRef, validated, { merge: true });
      } else {
        await docRef.set(validated, { merge: true });
      }
    } catch (err: any) {
      throw new CataloguePersistenceError(`Failed to upsert Generation "${validated.id}": ${err?.message || err}`);
    }
  }

  // --- VARIANTS ---
  public async upsertVariant(variant: VehicleVariant, transaction?: any, skipParentCheck = false): Promise<void> {
    const db = await this.getDb();
    const validated = validateAndNormalizeVariant(variant, variant.id);

    if (!skipParentCheck) {
      const genDoc = await db.collection(CATALOGUE_COLLECTIONS.generations).doc(validated.generation_id).get();
      if (!genDoc.exists) {
        throw new CatalogueIntegrityError(
          `Cannot upsert VehicleVariant "${validated.id}": referenced parent Generation "${validated.generation_id}" does not exist.`,
          [{
            severity: 'ERROR',
            entityType: 'VARIANT',
            entityId: validated.id,
            field: 'generation_id',
            message: `Parent Generation "${validated.generation_id}" not found in persistent datastore.`
          }]
        );
      }
    }

    const docRef = db.collection(CATALOGUE_COLLECTIONS.variants).doc(validated.id);
    try {
      if (transaction) {
        transaction.set(docRef, validated, { merge: true });
      } else {
        await docRef.set(validated, { merge: true });
      }
    } catch (err: any) {
      throw new CataloguePersistenceError(`Failed to upsert VehicleVariant "${validated.id}": ${err?.message || err}`);
    }
  }

  // --- ENGINES ---
  public async upsertEngine(engine: CanonicalEngine, transaction?: any): Promise<void> {
    const db = await this.getDb();
    const validated = validateAndNormalizeEngine(engine, engine.id);
    const docRef = db.collection(CATALOGUE_COLLECTIONS.engines).doc(validated.id);

    try {
      if (transaction) {
        transaction.set(docRef, validated, { merge: true });
      } else {
        await docRef.set(validated, { merge: true });
      }
    } catch (err: any) {
      throw new CataloguePersistenceError(`Failed to upsert CanonicalEngine "${validated.id}": ${err?.message || err}`);
    }
  }

  // --- ATOMIC HIERARCHY UPSERT ---
  public async upsertHierarchy(payload: HierarchyUpsertPayload): Promise<{
    makersUpserted: number;
    modelsUpserted: number;
    generationsUpserted: number;
    variantsUpserted: number;
    enginesUpserted: number;
  }> {
    const db = await this.getDb();
    const makers = payload.makers || [];
    const models = payload.models || [];
    const generations = payload.generations || [];
    const variants = payload.variants || [];
    const engines = payload.engines || [];

    // 1. Pre-validate all entities before touching Firestore
    const validMakers = makers.map(m => validateAndNormalizeMaker(m, m.id));
    const validModels = models.map(m => validateAndNormalizeModel(m, m.id));
    const validGenerations = generations.map(g => validateAndNormalizeGeneration(g, g.id));
    const validVariants = variants.map(v => validateAndNormalizeVariant(v, v.id));
    const validEngines = engines.map(e => validateAndNormalizeEngine(e, e.id));

    // 2. Validate in-payload parent references
    const knownMakerIds = new Set(validMakers.map(m => m.id));
    const knownModelIds = new Set(validModels.map(m => m.id));
    const knownGenIds = new Set(validGenerations.map(g => g.id));

    for (const m of validModels) {
      if (!knownMakerIds.has(m.maker_id)) {
        const doc = await db.collection(CATALOGUE_COLLECTIONS.makers).doc(m.maker_id).get();
        if (!doc.exists) {
          throw new CatalogueIntegrityError(`Model "${m.id}" references unknown Maker "${m.maker_id}".`);
        }
      }
    }

    for (const g of validGenerations) {
      if (!knownModelIds.has(g.model_id)) {
        const doc = await db.collection(CATALOGUE_COLLECTIONS.models).doc(g.model_id).get();
        if (!doc.exists) {
          throw new CatalogueIntegrityError(`Generation "${g.id}" references unknown Model "${g.model_id}".`);
        }
      }
    }

    for (const v of validVariants) {
      if (!knownGenIds.has(v.generation_id)) {
        const doc = await db.collection(CATALOGUE_COLLECTIONS.generations).doc(v.generation_id).get();
        if (!doc.exists) {
          throw new CatalogueIntegrityError(`Variant "${v.id}" references unknown Generation "${v.generation_id}".`);
        }
      }
    }

    // 3. Perform batched writes
    const batch = db.batch();

    for (const m of validMakers) {
      batch.set(db.collection(CATALOGUE_COLLECTIONS.makers).doc(m.id), m, { merge: true });
    }
    for (const m of validModels) {
      batch.set(db.collection(CATALOGUE_COLLECTIONS.models).doc(m.id), m, { merge: true });
    }
    for (const g of validGenerations) {
      batch.set(db.collection(CATALOGUE_COLLECTIONS.generations).doc(g.id), g, { merge: true });
    }
    for (const v of validVariants) {
      batch.set(db.collection(CATALOGUE_COLLECTIONS.variants).doc(v.id), v, { merge: true });
    }
    for (const e of validEngines) {
      batch.set(db.collection(CATALOGUE_COLLECTIONS.engines).doc(e.id), e, { merge: true });
    }

    try {
      await batch.commit();
      return {
        makersUpserted: validMakers.length,
        modelsUpserted: validModels.length,
        generationsUpserted: validGenerations.length,
        variantsUpserted: validVariants.length,
        enginesUpserted: validEngines.length
      };
    } catch (err: any) {
      throw new CataloguePersistenceError(`Failed to commit hierarchy batch write: ${err?.message || err}`);
    }
  }
}
