import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../../../types/index.js';
import { ICatalogueProvider } from '../types.js';

export class CataloguePersistenceError extends Error {
  public readonly code: string;
  constructor(code: string, message: string) {
    super(`[CataloguePersistenceError] ${code}: ${message}`);
    this.code = code;
    this.name = 'CataloguePersistenceError';
  }
}

export class PersistentCatalogueProvider implements ICatalogueProvider {
  public readonly providerType = 'PERSISTENT' as const;
  private isConfigured: boolean;

  constructor() {
    // Check if canonical persistent storage is configured (e.g. database credentials)
    this.isConfigured = false;
  }

  private assertAvailable(): void {
    if (!this.isConfigured) {
      throw new CataloguePersistenceError(
        'CATALOGUE_SOURCE_UNAVAILABLE',
        'Persistent catalogue storage is not configured or currently unavailable. Refusing silent fallback to fixtures.'
      );
    }
  }

  // --- MAKERS ---
  public getMakers(): Maker[] {
    this.assertAvailable();
    return [];
  }

  public getMakerById(id: string): Maker | null {
    this.assertAvailable();
    return null;
  }

  public getMakerBySlug(slug: string): Maker | null {
    this.assertAvailable();
    return null;
  }

  // --- MODELS ---
  public getModels(): Model[] {
    this.assertAvailable();
    return [];
  }

  public getModelsByMaker(makerIdOrSlug: string): Model[] {
    this.assertAvailable();
    return [];
  }

  public getModelById(id: string): Model | null {
    this.assertAvailable();
    return null;
  }

  public getModelBySlug(makerSlug: string, modelSlug: string): Model | null {
    this.assertAvailable();
    return null;
  }

  public getModelByIdOrSlug(idOrSlug: string): Model | null {
    this.assertAvailable();
    return null;
  }

  // --- GENERATIONS ---
  public getGenerations(): Generation[] {
    this.assertAvailable();
    return [];
  }

  public getGenerationsByModel(modelIdOrSlug: string): Generation[] {
    this.assertAvailable();
    return [];
  }

  public getGenerationById(id: string): Generation | null {
    this.assertAvailable();
    return null;
  }

  public getGenerationBySlug(slug: string): Generation | null {
    this.assertAvailable();
    return null;
  }

  public getGenerationByIdOrSlug(idOrSlug: string): Generation | null {
    this.assertAvailable();
    return null;
  }

  // --- VARIANTS ---
  public getVariants(): VehicleVariant[] {
    this.assertAvailable();
    return [];
  }

  public getVariantsByGeneration(generationIdOrSlug: string): VehicleVariant[] {
    this.assertAvailable();
    return [];
  }

  public getVariantById(id: string): VehicleVariant | null {
    this.assertAvailable();
    return null;
  }

  public getVariantBySlug(slug: string): VehicleVariant | null {
    this.assertAvailable();
    return null;
  }

  public getVariantByIdOrSlug(idOrSlug: string): VehicleVariant | null {
    this.assertAvailable();
    return null;
  }

  // --- ENGINES ---
  public getCanonicalEngines(): CanonicalEngine[] {
    this.assertAvailable();
    return [];
  }

  public getCanonicalEngineById(id: string): CanonicalEngine | null {
    this.assertAvailable();
    return null;
  }

  public getCanonicalEngineBySlug(slug: string): CanonicalEngine | null {
    this.assertAvailable();
    return null;
  }
}
