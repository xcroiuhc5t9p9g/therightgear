import { 
  Maker, 
  Model, 
  Generation, 
  VehicleVariant, 
  CanonicalEngine, 
  Manufacturer, 
  SearchFilters,
  SearchResult,
  DiscoveryAction 
} from '../../types/index.js';
import { 
  ICatalogueProvider, 
  ResolvedModelHierarchy, 
  ResolvedGenerationContext, 
  CatalogueValidationResult,
  CatalogueIntegrityError
} from './types.js';
import { CatalogueProviderFactory } from './CatalogueProviderFactory.js';
import { CatalogueValidator } from './CatalogueValidator.js';
import { PERSON_FIXTURES } from '../../data/uiPeopleFixtures.js';

export function isPublicCanonicalFact(val: any): boolean {
  return val !== undefined && val !== null && val !== '' && val !== 'N/A' && val !== 'Unknown';
}

export function filterVehicleForPublic(vehicle: VehicleVariant): VehicleVariant {
  return { ...vehicle };
}

export class CatalogueRepository {
  private provider: ICatalogueProvider;
  private static startupLogged = false;
  private validationPromise: Promise<CatalogueValidationResult> | null = null;
  private initializationPromise: Promise<void> | null = null;

  constructor(customProvider?: ICatalogueProvider) {
    if (customProvider) {
      this.provider = customProvider;
    } else {
      this.provider = CatalogueProviderFactory.createProvider();
    }

    if (!CatalogueRepository.startupLogged) {
      CatalogueRepository.startupLogged = true;
      console.log(`[TheRightGear Catalogue] Active catalogue provider: ${this.provider.providerType}`);
    }

    // Trigger async initialization / validation promise immediately
    this.initializationPromise = this.initialize();
    this.initializationPromise.catch(err => {
      console.error('[TheRightGear Catalogue] Catalogue initialization error:', err?.message || err);
    });
  }

  public getProviderType(): string {
    return this.provider.providerType;
  }

  public async isReady(): Promise<boolean> {
    try {
      await this.assertReady();
      return true;
    } catch {
      return false;
    }
  }

  public async assertReady(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initialize();
    }
    await this.initializationPromise;
  }

  private async initialize(): Promise<void> {
    // 1. Assert underlying provider readiness
    await this.provider.assertReady();

    // 2. For FIXTURE provider, validate structural integrity and fail-fast on errors
    if (this.provider.providerType === 'FIXTURE') {
      const validation = await this.validate();
      if (!validation.valid && validation.errors.length > 0) {
        throw new CatalogueIntegrityError(
          `Catalogue fixture validation failed with ${validation.errors.length} structural error(s).`,
          validation.errors
        );
      }
    }
  }

  public async validate(): Promise<CatalogueValidationResult> {
    if (!this.validationPromise) {
      this.validationPromise = (async () => {
        const result = await CatalogueValidator.validate(this.provider, false);
        if (result.warnings.length > 0) {
          console.warn(
            `[TheRightGear Catalogue] Fixture validation produced ${result.warnings.length} warning(s):`,
            result.warnings.map(w => `[${w.entityType} ${w.entityId}] ${w.message}`)
          );
        }
        if (!result.valid && result.errors.length > 0) {
          console.error(
            `[TheRightGear Catalogue] Fixture validation failed with ${result.errors.length} error(s):`,
            result.errors.map(e => `[${e.entityType} ${e.entityId}] ${e.message}`)
          );
        }
        return result;
      })();
    }
    return this.validationPromise;
  }

  public async getHierarchy(): Promise<{
    makers: Maker[];
    models: Model[];
    generations: Generation[];
    variants: VehicleVariant[];
    engines: CanonicalEngine[];
  }> {
    const [makers, models, generations, variants, engines] = await Promise.all([
      this.getMakers(),
      this.getModels(),
      this.getGenerations(),
      this.getVariants(),
      this.getEngines()
    ]);
    return { makers, models, generations, variants, engines };
  }

  // --- MAKERS & MANUFACTURERS ---
  public async getMakers(): Promise<Maker[]> {
    await this.assertReady();
    const list = await this.provider.getMakers();
    return list.sort((a, b) => a.canonical_name.localeCompare(b.canonical_name));
  }

  public async getMakerById(id: string): Promise<Maker | null> {
    await this.assertReady();
    return this.provider.getMakerById(id);
  }

  public async getMakerBySlug(slug: string): Promise<Maker | null> {
    await this.assertReady();
    return this.provider.getMakerBySlug(slug);
  }

  public async getManufacturers(): Promise<Manufacturer[]> {
    const makers = await this.getMakers();
    return makers.map(m => ({
      id: m.id,
      slug: m.slug,
      official_name: m.official_name || m.canonical_name,
      country_code: m.country_code ?? null,
      founded_year: m.founded_year ?? null,
      active: m.active ?? true,
      logo_url: m.logo_url || `/brand/makers/${m.slug}.svg`,
      website_url: m.website_url
    }));
  }

  public async getPeopleByMaker(makerSlug: string) {
    await this.assertReady();
    return Object.values(PERSON_FIXTURES).filter(person => 
      person.related_organizations?.some(org => org.slug === makerSlug)
    );
  }

  // --- MODELS ---
  public async getModels(): Promise<Model[]> {
    await this.assertReady();
    const list = await this.provider.getModels();
    return list.sort((a, b) => {
      const yA = a.introduced_year ?? 9999;
      const yB = b.introduced_year ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public async getModelsByMaker(makerIdOrSlug: string): Promise<Model[]> {
    await this.assertReady();
    const list = await this.provider.getModelsByMaker(makerIdOrSlug);
    return list.sort((a, b) => {
      const yA = a.introduced_year ?? 9999;
      const yB = b.introduced_year ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public async getModelById(id: string): Promise<Model | null> {
    await this.assertReady();
    return this.provider.getModelById(id);
  }

  public async getModelBySlug(makerSlug: string, modelSlug: string): Promise<Model | null> {
    await this.assertReady();
    return this.provider.getModelBySlug(makerSlug, modelSlug);
  }

  public async getModelByIdOrSlug(idOrSlug: string): Promise<Model | null> {
    await this.assertReady();
    return this.provider.getModelByIdOrSlug(idOrSlug);
  }

  // --- GENERATIONS ---
  public async getGenerations(): Promise<Generation[]> {
    await this.assertReady();
    const list = await this.provider.getGenerations();
    return list.sort((a, b) => {
      const yA = a.production_start ?? 9999;
      const yB = b.production_start ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public async getGenerationsByModel(modelIdOrSlug: string): Promise<Generation[]> {
    await this.assertReady();
    const list = await this.provider.getGenerationsByModel(modelIdOrSlug);
    return list.sort((a, b) => {
      const yA = a.production_start ?? 9999;
      const yB = b.production_start ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public async getGenerationById(id: string): Promise<Generation | null> {
    await this.assertReady();
    return this.provider.getGenerationById(id);
  }

  public async getGenerationBySlug(slug: string): Promise<Generation | null> {
    await this.assertReady();
    return this.provider.getGenerationBySlug(slug);
  }

  public async getGenerationByIdOrSlug(idOrSlug: string): Promise<Generation | null> {
    await this.assertReady();
    return this.provider.getGenerationByIdOrSlug(idOrSlug);
  }

  // --- VARIANTS ---
  public async getVariants(): Promise<VehicleVariant[]> {
    await this.assertReady();
    const list = await this.provider.getVariants();
    return list.sort((a, b) => {
      const yA = a.model_year_from ?? 9999;
      const yB = b.model_year_from ?? 9999;
      if (yA !== yB) return yA - yB;
      return (a.variant_name || '').localeCompare(b.variant_name || '');
    });
  }

  public async getVariantsByGeneration(generationIdOrSlug: string): Promise<VehicleVariant[]> {
    await this.assertReady();
    const list = await this.provider.getVariantsByGeneration(generationIdOrSlug);
    return list.sort((a, b) => {
      const yA = a.model_year_from ?? 9999;
      const yB = b.model_year_from ?? 9999;
      if (yA !== yB) return yA - yB;
      return (a.variant_name || '').localeCompare(b.variant_name || '');
    });
  }

  public async getVariantsByModel(modelIdOrSlug: string): Promise<VehicleVariant[]> {
    await this.assertReady();
    const list = await this.provider.getVariantsByModel(modelIdOrSlug);
    return list.sort((a, b) => {
      const yA = a.model_year_from ?? 9999;
      const yB = b.model_year_from ?? 9999;
      if (yA !== yB) return yA - yB;
      return (a.variant_name || '').localeCompare(b.variant_name || '');
    });
  }

  public async getVariantById(id: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    return this.provider.getVariantById(id);
  }

  public async getVariantBySlug(slug: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    return this.provider.getVariantBySlug(slug);
  }

  public async getVariantByIdOrSlug(idOrSlug: string): Promise<VehicleVariant | null> {
    await this.assertReady();
    return this.provider.getVariantByIdOrSlug(idOrSlug);
  }

  public async getAllVariants(filters?: SearchFilters): Promise<{ total: number; vehicles: VehicleVariant[] }> {
    await this.assertReady();
    let filtered = await this.getVariants();
    
    if (filters) {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        filtered = filtered.filter(v => 
          v.manufacturer_name.toLowerCase().includes(q) ||
          v.model_name.toLowerCase().includes(q) ||
          v.variant_name.toLowerCase().includes(q) ||
          v.slug.toLowerCase().includes(q)
        );
      }
      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(v => v.category === filters.category);
      }
      if (filters.tier && filters.tier !== 'All') {
        filtered = filtered.filter(v => v.tier === filters.tier);
      }
      if (filters.manufacturerId) {
        const m = await this.getMakerBySlug(filters.manufacturerId);
        if (m) {
          filtered = filtered.filter(v => v.manufacturer_name.toLowerCase() === m.canonical_name.toLowerCase());
        }
      }
      if (filters.yearMin) {
        filtered = filtered.filter(v => (v.model_year_from ?? 0) >= filters.yearMin!);
      }
      if (filters.yearMax) {
        filtered = filtered.filter(v => ((v.model_year_to ?? v.model_year_from) ?? 9999) <= filters.yearMax!);
      }
    }

    return { total: filtered.length, vehicles: filtered };
  }

  // --- ENGINES ---
  public async getEngines(): Promise<CanonicalEngine[]> {
    await this.assertReady();
    return this.provider.getCanonicalEngines();
  }

  public async getEngineById(id: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    return this.provider.getCanonicalEngineById(id);
  }

  public async getEngineBySlug(slug: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    return this.provider.getCanonicalEngineBySlug(slug);
  }

  public async getPublicEngineBySlug(slug: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    return this.getEngineBySlug(slug);
  }

  public async getCanonicalEngineForVariant(variantId: string): Promise<CanonicalEngine | null> {
    await this.assertReady();
    const variant = await this.getVariantById(variantId);
    if (!variant || !variant.canonical_engine_id) {
      return null;
    }
    return this.getEngineById(variant.canonical_engine_id);
  }

  // --- SEARCH ---
  public async search(query: string): Promise<{ results: SearchResult[]; discovery: DiscoveryAction[] }> {
    await this.assertReady();
    const q = query.toLowerCase().trim();
    if (!q) return { results: [], discovery: [] };

    const [makers, models, generations, variants, engines] = await Promise.all([
      this.getMakers(),
      this.getModels(),
      this.getGenerations(),
      this.getVariants(),
      this.getEngines()
    ]);


    const results: SearchResult[] = [];

    // Match Makers
    makers.forEach(m => {
      if (m.canonical_name.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q)) {
        results.push({
          id: m.id,
          type: 'MAKER',
          title: m.canonical_name,
          subtitle: `Manufacturer • ${m.country_code || 'Global'}`,
          url: `/cars/${m.slug}`,
          makerSlug: m.slug
        });
      }
    });

    // Match Models
    models.forEach(m => {
      if (m.canonical_name.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q)) {
        const maker = makers.find(mk => mk.id === m.maker_id);
        results.push({
          id: m.id,
          type: 'MODEL',
          title: `${maker?.canonical_name || ''} ${m.canonical_name}`.trim(),
          subtitle: `Model • ${m.introduced_year || ''}`,
          url: `/cars/${maker?.slug || 'unknown'}/${m.slug}`,
          makerSlug: maker?.slug,
          modelSlug: m.slug
        });
      }
    });

    // Match Generations
    generations.forEach(g => {
      if (g.canonical_name.toLowerCase().includes(q) || g.generation_code?.toLowerCase().includes(q) || g.slug.toLowerCase().includes(q)) {
        const model = models.find(md => md.id === g.model_id);
        const maker = model ? makers.find(mk => mk.id === model.maker_id) : undefined;
        results.push({
          id: g.id,
          type: 'GENERATION',
          title: `${maker?.canonical_name || ''} ${model?.canonical_name || ''} ${g.canonical_name}`.trim(),
          subtitle: `Generation • ${g.generation_code || ''} (${g.production_start || ''}–${g.production_end || 'Pres'})`,
          url: `/cars/${maker?.slug || 'unknown'}/${model?.slug || 'unknown'}/${g.slug}`,
          makerSlug: maker?.slug,
          modelSlug: model?.slug,
          generationSlug: g.slug
        });
      }
    });

    // Match Variants
    variants.forEach(v => {
      if (
        v.variant_name.toLowerCase().includes(q) || 
        v.model_name.toLowerCase().includes(q) || 
        v.manufacturer_name.toLowerCase().includes(q) || 
        v.slug.toLowerCase().includes(q)
      ) {
        results.push({
          id: v.id,
          type: 'VARIANT',
          title: `${v.manufacturer_name} ${v.variant_name}`,
          subtitle: `${v.model_year_from || ''} • ${v.category || 'Variant'}`,
          url: `/vehicle/${v.slug}`,
          variantSlug: v.slug
        });
      }
    });

    // Match Engines
    engines.forEach(e => {
      const code = e.engine_code || '';
      const name = e.canonical_name || '';
      if (code.toLowerCase().includes(q) || name.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q)) {
        results.push({
          id: e.id,
          type: 'ENGINE',
          title: code ? `${code} (${name})` : name,
          subtitle: `Engine • ${e.specs?.displacement_cc || ''}cc ${e.specs?.architecture || ''}`.trim(),
          url: `/engine/${e.slug}`
        });
      }
    });

    const discovery: DiscoveryAction[] = [
      { id: 'disc-cars', title: `Explore cars matching "${query}"`, url: `/cars?query=${encodeURIComponent(query)}` },
      { id: 'disc-market', title: `View market analytics for "${query}"`, url: `/market?query=${encodeURIComponent(query)}` }
    ];

    return { results: results.slice(0, 15), discovery };
  }

  // --- HIERARCHY RESOLUTION (ASYNC, NO N+1) ---
  public async resolveModelHierarchy(modelIdOrSlug: string): Promise<ResolvedModelHierarchy | null> {
    await this.assertReady();
    if (!modelIdOrSlug) return null;
    const q = modelIdOrSlug.toLowerCase().trim();

    // 1. Resolve canonical Model directly
    let resolvedModel = await this.getModelByIdOrSlug(q);

    // 2. Fallback: resolve Model via Generation
    if (!resolvedModel) {
      const gen = await this.getGenerationByIdOrSlug(q);
      if (gen) {
        resolvedModel = await this.getModelById(gen.model_id);
      }
    }

    // 3. Fallback: resolve Model via Variant
    if (!resolvedModel) {
      const variant = await this.getVariantByIdOrSlug(q);
      if (variant) {
        if (variant.generation_id) {
          const gen = await this.getGenerationById(variant.generation_id);
          if (gen) {
            resolvedModel = await this.getModelById(gen.model_id);
          }
        }
        if (!resolvedModel && variant.model_name) {
          const models = await this.getModels();
          resolvedModel = models.find(m => m.canonical_name.toLowerCase() === variant.model_name.toLowerCase()) ?? null;
        }
      }
    }

    if (!resolvedModel) {
      return null;
    }

    // Fetch Maker, canonical Generations, and Model Variants in parallel
    const [maker, canonicalGenerations, allVariants] = await Promise.all([
      this.getMakerById(resolvedModel.maker_id),
      this.getGenerationsByModel(resolvedModel.id),
      this.getVariantsByModel(resolvedModel.id)
    ]);

    const genIds = new Set(canonicalGenerations.map(g => g.id));
    const generationContexts: ResolvedGenerationContext[] = [];

    canonicalGenerations.forEach(gen => {
      const genVars = allVariants.filter(v => v.generation_id === gen.id);
      let startYr = gen.production_start ?? null;
      let endYr = gen.production_end ?? null;
      genVars.forEach(v => {
        if (v.model_year_from != null && !isNaN(v.model_year_from)) {
          if (startYr === null || v.model_year_from < startYr) startYr = v.model_year_from;
        }
        if (v.model_year_to != null && !isNaN(v.model_year_to)) {
          if (endYr === null || v.model_year_to > endYr) endYr = v.model_year_to;
        }
      });
      generationContexts.push({
        generation: gen,
        generationId: gen.id,
        variants: genVars,
        _startYear: startYr,
        _endYear: endYr
      });
    });

    // Include any orphan generation IDs present in variants
    allVariants.forEach(v => {
      if (v.generation_id && !genIds.has(v.generation_id)) {
        let existing = generationContexts.find(g => g.generationId === v.generation_id);
        if (!existing) {
          existing = {
            generation: null,
            generationId: v.generation_id,
            variants: [],
            _startYear: null,
            _endYear: null
          };
          generationContexts.push(existing);
        }
        if (!existing.variants.some(existingV => existingV.id === v.id)) {
          existing.variants.push(v);
          if (v.model_year_from != null && !isNaN(v.model_year_from)) {
            if (existing._startYear === null || v.model_year_from < existing._startYear) existing._startYear = v.model_year_from;
          }
          if (v.model_year_to != null && !isNaN(v.model_year_to)) {
            if (existing._endYear === null || v.model_year_to > existing._endYear) existing._endYear = v.model_year_to;
          }
        }
      }
    });

    // Deterministic chronological sorting of generation contexts
    generationContexts.sort((a, b) => {
      const yA = a._startYear ?? 9999;
      const yB = b._startYear ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.generationId.localeCompare(b.generationId);
    });

    return {
      maker,
      model: resolvedModel,
      generationContexts,
      allVariants
    };
  }
}

// Authoritative Catalogue Repository Singleton
export const catalogueRepository = new CatalogueRepository();
