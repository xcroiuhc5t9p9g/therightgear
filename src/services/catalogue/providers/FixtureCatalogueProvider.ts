import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../../../types/index.js';
import { ICatalogueProvider } from '../types.js';
import { 
  TEST_MAKERS, 
  TEST_MODELS, 
  TEST_GENERATIONS, 
  TEST_VARIANTS, 
  TEST_CANONICAL_ENGINES 
} from '../../../data/testCatalogue.js';

export class FixtureCatalogueProvider implements ICatalogueProvider {
  public readonly providerType = 'FIXTURE' as const;

  private makers: Maker[];
  private models: Model[];
  private generations: Generation[];
  private variants: VehicleVariant[];
  private engines: CanonicalEngine[];

  constructor() {
    // Clone fixture arrays to prevent accidental external in-memory mutation
    this.makers = TEST_MAKERS.map(m => ({ ...m }));
    this.models = TEST_MODELS.map(m => ({ ...m }));
    this.generations = TEST_GENERATIONS.map(g => ({ ...g }));
    this.variants = TEST_VARIANTS.map(v => ({ ...v }));
    this.engines = TEST_CANONICAL_ENGINES.map(e => ({ ...e }));
  }

  // --- READINESS ---
  public async isReady(): Promise<boolean> {
    return true;
  }

  public async assertReady(): Promise<void> {
    // Fixtures are always in-memory ready
  }

  // --- MAKERS ---
  public async getMakers(): Promise<Maker[]> {
    return this.makers.map(m => ({ ...m }));
  }

  public async getMakerById(id: string): Promise<Maker | null> {
    const found = this.makers.find(m => m.id === id);
    return found ? { ...found } : null;
  }

  public async getMakerBySlug(slug: string): Promise<Maker | null> {
    const s = slug.toLowerCase();
    const found = this.makers.find(m => m.slug.toLowerCase() === s || m.id.toLowerCase() === s);
    return found ? { ...found } : null;
  }

  // --- MODELS ---
  public async getModels(): Promise<Model[]> {
    return this.models.map(m => ({ ...m }));
  }

  public async getModelsByMaker(makerIdOrSlug: string): Promise<Model[]> {
    const maker = await this.getMakerBySlug(makerIdOrSlug);
    const makerId = maker ? maker.id : makerIdOrSlug;
    return this.models
      .filter(m => m.maker_id === makerId || m.maker_id === `m-${makerIdOrSlug}`)
      .map(m => ({ ...m }));
  }

  public async getModelById(id: string): Promise<Model | null> {
    const found = this.models.find(m => m.id === id);
    return found ? { ...found } : null;
  }

  public async getModelBySlug(makerSlug: string, modelSlug: string): Promise<Model | null> {
    const makerModels = await this.getModelsByMaker(makerSlug);
    const ms = modelSlug.toLowerCase();
    const found = makerModels.find(m => m.slug.toLowerCase() === ms || m.id.toLowerCase() === ms);
    return found ? { ...found } : null;
  }

  public async getModelByIdOrSlug(idOrSlug: string): Promise<Model | null> {
    const q = idOrSlug.toLowerCase();
    const found = this.models.find(m => 
      m.id === idOrSlug || 
      m.id.toLowerCase() === q || 
      m.slug.toLowerCase() === q ||
      m.canonical_name.toLowerCase() === q
    );
    return found ? { ...found } : null;
  }

  // --- GENERATIONS ---
  public async getGenerations(): Promise<Generation[]> {
    return this.generations.map(g => ({ ...g }));
  }

  public async getGenerationsByModel(modelIdOrSlug: string): Promise<Generation[]> {
    const model = await this.getModelByIdOrSlug(modelIdOrSlug);
    const modelId = model ? model.id : modelIdOrSlug;
    return this.generations
      .filter(g => g.model_id === modelId || g.model_id.endsWith(modelIdOrSlug))
      .map(g => ({ ...g }));
  }

  public async getGenerationById(id: string): Promise<Generation | null> {
    const found = this.generations.find(g => g.id === id);
    return found ? { ...found } : null;
  }

  public async getGenerationBySlug(slug: string): Promise<Generation | null> {
    const s = slug.toLowerCase();
    const found = this.generations.find(g => g.slug.toLowerCase() === s || g.id.toLowerCase() === s);
    return found ? { ...found } : null;
  }

  public async getGenerationByIdOrSlug(idOrSlug: string): Promise<Generation | null> {
    const q = idOrSlug.toLowerCase();
    const found = this.generations.find(g => 
      g.id === idOrSlug || 
      g.id.toLowerCase() === q || 
      g.slug.toLowerCase() === q ||
      g.canonical_name.toLowerCase() === q
    );
    return found ? { ...found } : null;
  }

  // --- VARIANTS ---
  public async getVariants(): Promise<VehicleVariant[]> {
    return this.variants.map(v => ({ ...v }));
  }

  public async getVariantsByGeneration(generationIdOrSlug: string): Promise<VehicleVariant[]> {
    const gen = await this.getGenerationByIdOrSlug(generationIdOrSlug);
    const genId = gen ? gen.id : generationIdOrSlug;
    return this.variants
      .filter(v => v.generation_id === genId || v.generation_id === generationIdOrSlug)
      .map(v => ({ ...v }));
  }

  public async getVariantsByModel(modelIdOrSlug: string): Promise<VehicleVariant[]> {
    const model = await this.getModelByIdOrSlug(modelIdOrSlug);
    const modelId = model ? model.id : modelIdOrSlug;
    const modelGens = await this.getGenerationsByModel(modelId);
    const genIds = new Set(modelGens.map(g => g.id));
    const modelName = model?.canonical_name.toLowerCase();

    return this.variants
      .filter(v => 
        (v.generation_id && genIds.has(v.generation_id)) ||
        (modelName && v.model_name && v.model_name.toLowerCase() === modelName)
      )
      .map(v => ({ ...v }));
  }

  public async getVariantById(id: string): Promise<VehicleVariant | null> {
    const found = this.variants.find(v => v.id === id);
    return found ? { ...found } : null;
  }

  public async getVariantBySlug(slug: string): Promise<VehicleVariant | null> {
    const s = slug.toLowerCase();
    const found = this.variants.find(v => v.slug.toLowerCase() === s || v.id.toLowerCase() === s);
    return found ? { ...found } : null;
  }

  public async getVariantByIdOrSlug(idOrSlug: string): Promise<VehicleVariant | null> {
    const q = idOrSlug.toLowerCase();
    const found = this.variants.find(v => 
      v.id === idOrSlug || 
      v.id.toLowerCase() === q || 
      v.slug.toLowerCase() === q
    );
    return found ? { ...found } : null;
  }

  // --- ENGINES ---
  public async getCanonicalEngines(): Promise<CanonicalEngine[]> {
    return this.engines.map(e => ({ ...e }));
  }

  public async getCanonicalEngineById(id: string): Promise<CanonicalEngine | null> {
    const found = this.engines.find(e => e.id === id);
    return found ? { ...found } : null;
  }

  public async getCanonicalEngineBySlug(slug: string): Promise<CanonicalEngine | null> {
    const s = slug.toLowerCase();
    const found = this.engines.find(e => e.slug.toLowerCase() === s || e.id.toLowerCase() === s);
    return found ? { ...found } : null;
  }
}
