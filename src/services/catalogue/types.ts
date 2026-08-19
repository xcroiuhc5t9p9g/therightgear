import { 
  Maker, 
  Model, 
  Generation, 
  VehicleVariant, 
  CanonicalEngine, 
  Manufacturer, 
  SearchFilters 
} from '../../types/index.js';

export type CatalogueSourceType = 'FIXTURE' | 'PERSISTENT';

export class CatalogueConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogueConfigurationError';
  }
}

export class CataloguePersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CataloguePersistenceError';
  }
}

export class CatalogueIntegrityError extends Error {
  public errors: CatalogueValidationIssue[];
  constructor(message: string, errors: CatalogueValidationIssue[] = []) {
    super(message);
    this.name = 'CatalogueIntegrityError';
    this.errors = errors;
  }
}

export interface CatalogueValidationIssue {
  severity: 'ERROR' | 'WARNING';
  entityType: 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT' | 'ENGINE';
  entityId: string;
  field?: string;
  message: string;
}

export interface CatalogueValidationResult {
  valid: boolean;
  errors: CatalogueValidationIssue[];
  warnings: CatalogueValidationIssue[];
  metrics: {
    makersCount: number;
    modelsCount: number;
    generationsCount: number;
    variantsCount: number;
    enginesCount: number;
  };
}

export interface ICatalogueProvider {
  readonly providerType: CatalogueSourceType;

  // Readiness / Health
  isReady(): Promise<boolean>;
  assertReady(): Promise<void>;

  // Makers
  getMakers(): Promise<Maker[]>;
  getMakerById(id: string): Promise<Maker | null>;
  getMakerBySlug(slug: string): Promise<Maker | null>;

  // Models
  getModels(): Promise<Model[]>;
  getModelsByMaker(makerIdOrSlug: string): Promise<Model[]>;
  getModelById(id: string): Promise<Model | null>;
  getModelBySlug(makerSlug: string, modelSlug: string): Promise<Model | null>;
  getModelByIdOrSlug(idOrSlug: string): Promise<Model | null>;

  // Generations
  getGenerations(): Promise<Generation[]>;
  getGenerationsByModel(modelIdOrSlug: string): Promise<Generation[]>;
  getGenerationById(id: string): Promise<Generation | null>;
  getGenerationBySlug(slug: string): Promise<Generation | null>;
  getGenerationByIdOrSlug(idOrSlug: string): Promise<Generation | null>;

  // Variants
  getVariants(): Promise<VehicleVariant[]>;
  getVariantsByGeneration(generationIdOrSlug: string): Promise<VehicleVariant[]>;
  getVariantsByModel(modelIdOrSlug: string): Promise<VehicleVariant[]>;
  getVariantById(id: string): Promise<VehicleVariant | null>;
  getVariantBySlug(slug: string): Promise<VehicleVariant | null>;
  getVariantByIdOrSlug(idOrSlug: string): Promise<VehicleVariant | null>;

  // Engines
  getCanonicalEngines(): Promise<CanonicalEngine[]>;
  getCanonicalEngineById(id: string): Promise<CanonicalEngine | null>;
  getCanonicalEngineBySlug(slug: string): Promise<CanonicalEngine | null>;
}

export interface ResolvedGenerationContext {
  generation: Generation | null;
  generationId: string;
  variants: VehicleVariant[];
  _startYear: number | null;
  _endYear: number | null;
}

export interface ResolvedModelHierarchy {
  maker: Maker | null;
  model: Model;
  generationContexts: ResolvedGenerationContext[];
  allVariants: VehicleVariant[];
}
