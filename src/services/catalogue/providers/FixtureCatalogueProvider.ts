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

  // --- MAKERS ---
  public getMakers(): Maker[] {
    return this.makers.map(m => ({ ...m }));
  }

  public getMakerById(id: string): Maker | null {
    const found = this.makers.find(m => m.id === id);
    return found ? { ...found } : null;
  }

  public getMakerBySlug(slug: string): Maker | null {
    const s = slug.toLowerCase();
    const found = this.makers.find(m => m.slug.toLowerCase() === s || m.id.toLowerCase() === s);
    return found ? { ...found } : null;
  }

  // --- MODELS ---
  public getModels(): Model[] {
    return this.models.map(m => ({ ...m }));
  }

  public getModelsByMaker(makerIdOrSlug: string): Model[] {
    const maker = this.getMakerBySlug(makerIdOrSlug);
    const makerId = maker ? maker.id : makerIdOrSlug;
    return this.models
      .filter(m => m.maker_id === makerId || m.maker_id === `m-${makerIdOrSlug}`)
      .map(m => ({ ...m }));
  }

  public getModelById(id: string): Model | null {
    const found = this.models.find(m => m.id === id);
    return found ? { ...found } : null;
  }

  public getModelBySlug(makerSlug: string, modelSlug: string): Model | null {
    const makerModels = this.getModelsByMaker(makerSlug);
    const ms = modelSlug.toLowerCase();
    const found = makerModels.find(m => m.slug.toLowerCase() === ms || m.id.toLowerCase() === ms);
    return found ? { ...found } : null;
  }

  public getModelByIdOrSlug(idOrSlug: string): Model | null {
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
  public getGenerations(): Generation[] {
    return this.generations.map(g => ({ ...g }));
  }

  public getGenerationsByModel(modelIdOrSlug: string): Generation[] {
    const model = this.getModelByIdOrSlug(modelIdOrSlug);
    const modelId = model ? model.id : modelIdOrSlug;
    return this.generations
      .filter(g => g.model_id === modelId || g.model_id.endsWith(modelIdOrSlug))
      .map(g => ({ ...g }));
  }

  public getGenerationById(id: string): Generation | null {
    const found = this.generations.find(g => g.id === id);
    return found ? { ...found } : null;
  }

  public getGenerationBySlug(slug: string): Generation | null {
    const s = slug.toLowerCase();
    const found = this.generations.find(g => g.slug.toLowerCase() === s || g.id.toLowerCase() === s);
    return found ? { ...found } : null;
  }

  public getGenerationByIdOrSlug(idOrSlug: string): Generation | null {
    const q = idOrSlug.toLowerCase();
    const found = this.generations.find(g => 
      g.id === idOrSlug || 
      g.id.toLowerCase() === q || 
      g.slug.toLowerCase() === q
    );
    return found ? { ...found } : null;
  }

  // --- VARIANTS ---
  public getVariants(): VehicleVariant[] {
    return this.variants.map(v => ({ ...v }));
  }

  public getVariantsByGeneration(generationIdOrSlug: string): VehicleVariant[] {
    const gen = this.getGenerationByIdOrSlug(generationIdOrSlug);
    const genId = gen ? gen.id : generationIdOrSlug;
    return this.variants
      .filter(v => v.generation_id === genId || v.generation_id.endsWith(generationIdOrSlug))
      .map(v => ({ ...v }));
  }

  public getVariantById(id: string): VehicleVariant | null {
    const found = this.variants.find(v => v.id === id);
    return found ? { ...found } : null;
  }

  public getVariantBySlug(slug: string): VehicleVariant | null {
    const s = slug.toLowerCase();
    const found = this.variants.find(v => v.slug.toLowerCase() === s || v.id.toLowerCase() === s);
    return found ? { ...found } : null;
  }

  public getVariantByIdOrSlug(idOrSlug: string): VehicleVariant | null {
    const s = idOrSlug.toLowerCase();
    const found = this.variants.find(v => v.id === idOrSlug || v.id.toLowerCase() === s || v.slug.toLowerCase() === s);
    return found ? { ...found } : null;
  }

  // --- ENGINES ---
  public getCanonicalEngines(): CanonicalEngine[] {
    return this.engines.map(e => ({ ...e }));
  }

  public getCanonicalEngineById(id: string): CanonicalEngine | null {
    const found = this.engines.find(e => e.id === id);
    return found ? { ...found } : null;
  }

  public getCanonicalEngineBySlug(slug: string): CanonicalEngine | null {
    const s = slug.toLowerCase();
    const found = this.engines.find(e => e.slug.toLowerCase() === s);
    return found ? { ...found } : null;
  }
}
