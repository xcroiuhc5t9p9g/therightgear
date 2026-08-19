import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../../../types/index.js';
import { ICatalogueProvider, CataloguePersistenceError } from '../types.js';

/**
 * Strict Production Persistent Catalogue Provider Boundary.
 * 
 * In accordance with DATA-14 / DATA-14R:
 * - This provider represents the future database/persistence datastore.
 * - When configured without an active backend connection, it MUST throw `CataloguePersistenceError`.
 * - It MUST NEVER silently return empty arrays or fall back to test fixtures.
 */
export class PersistentCatalogueProvider implements ICatalogueProvider {
  public readonly providerType = 'PERSISTENT' as const;

  // Readiness
  public async isReady(): Promise<boolean> {
    return false;
  }

  public async assertReady(): Promise<void> {
    throw new CataloguePersistenceError(
      'Persistent catalogue datastore is not configured. Server-side database integration is required for CATALOGUE_SOURCE=PERSISTENT.'
    );
  }

  // --- MAKERS ---
  public async getMakers(): Promise<Maker[]> {
    await this.assertReady();
    return [];
  }

  public async getMakerById(id: string): Promise<Maker | null> {
    await this.assertReady();
    return null;
  }

  public async getMakerBySlug(slug: string): Promise<Maker | null> {
    await this.assertReady();
    return null;
  }

  // --- MODELS ---
  public async getModels(): Promise<Model[]> {
    await this.assertReady();
    return [];
  }

  public async getModelsByMaker(makerIdOrSlug: string): Promise<Model[]> {
    await this.assertReady();
    return [];
  }

  public async getModelById(id: string): Promise<Model | null> {
    await this.assertReady();
    return null;
  }

  public async getModelBySlug(makerSlug: string, modelSlug: string): Promise<Model | null> {
    await this.assertReady();
    return null;
  }

  public async getModelByIdOrSlug(idOrSlug: string): Promise<Model | null> {
    await this.assertReady();
    return null;
  }

  // --- GENERATIONS ---
  public async getGenerations(): Promise<Generation[]> {
    await this.assertReady();
    return [];
  }

  public async getGenerationsByModel(modelIdOrSlug: string): Promise<Generation[]> {
    await this.assertReady();
    return [];
  }

  public async getGenerationById(id: string): Promise<Generation | null> {
    await this.assertReady();
    return null;
  }

  public async getGenerationBySlug(slug: string): Promise<Generation | null> {
    await this.assertReady();
    return null;
  }

  public async getGenerationByIdOrSlug(idOrSlug: string): Promise<Generation | null> {
    await this.assertReady();
    return null;
  }

  // --- VARIANTS ---
  public async getVariants(): Promise<VehicleVariant[]> {
    await this.assertReady();
    return [];
  }

  public async getVariantsByGeneration(generationIdOrSlug: string): Promise<VehicleVariant[]> {
    await this.assertReady();
    return [];
  }

  public async getVariantsByModel(modelIdOrSlug: string): Promise<VehicleVariant[]> {
    await this.assertReady();
    return [];
  }

  public async getVariantById(id: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    return null;
  }

  public async getVariantBySlug(slug: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    return null;
  }

  public async getVariantByIdOrSlug(idOrSlug: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    return null;
  }

  // --- ENGINES ---
  public async getCanonicalEngines(): Promise<CanonicalEngine[]> {
    await this.assertReady();
    return [];
  }

  public async getCanonicalEngineById(id: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    return null;
  }

  public async getCanonicalEngineBySlug(slug: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    return null;
  }
}
