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

  // Makers
  getMakers(): Maker[];
  getMakerById(id: string): Maker | null;
  getMakerBySlug(slug: string): Maker | null;

  // Models
  getModels(): Model[];
  getModelsByMaker(makerIdOrSlug: string): Model[];
  getModelById(id: string): Model | null;
  getModelBySlug(makerSlug: string, modelSlug: string): Model | null;
  getModelByIdOrSlug(idOrSlug: string): Model | null;

  // Generations
  getGenerations(): Generation[];
  getGenerationsByModel(modelIdOrSlug: string): Generation[];
  getGenerationById(id: string): Generation | null;
  getGenerationBySlug(slug: string): Generation | null;
  getGenerationByIdOrSlug(idOrSlug: string): Generation | null;

  // Variants
  getVariants(): VehicleVariant[];
  getVariantsByGeneration(generationIdOrSlug: string): VehicleVariant[];
  getVariantById(id: string): VehicleVariant | null;
  getVariantBySlug(slug: string): VehicleVariant | null;
  getVariantByIdOrSlug(idOrSlug: string): VehicleVariant | null;

  // Engines
  getCanonicalEngines(): CanonicalEngine[];
  getCanonicalEngineById(id: string): CanonicalEngine | null;
  getCanonicalEngineBySlug(slug: string): CanonicalEngine | null;
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
