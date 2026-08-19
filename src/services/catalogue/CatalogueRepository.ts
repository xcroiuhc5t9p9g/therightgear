import { 
  Maker, 
  Model, 
  Generation, 
  VehicleVariant, 
  CanonicalEngine, 
  Manufacturer, 
  SearchFilters, 
  SearchResult, 
  SearchIndexEntry, 
  SearchKey 
} from '../../types/index.js';
import { 
  ICatalogueProvider, 
  ResolvedModelHierarchy, 
  ResolvedGenerationContext, 
  CatalogueValidationResult 
} from './types.js';
import { FixtureCatalogueProvider } from './providers/FixtureCatalogueProvider.js';
import { PersistentCatalogueProvider } from './providers/PersistentCatalogueProvider.js';
import { CatalogueValidator } from './CatalogueValidator.js';
import { PERSON_FIXTURES } from '../../data/uiPeopleFixtures.js';

function normalizeQueryTechnical(query: string): string {
  return query.toLowerCase().trim().replace(/[-\s]/g, '');
}

function normalizeQueryStandard(query: string): string {
  return query.toLowerCase().trim();
}

export class CatalogueRepository {
  private provider: ICatalogueProvider;
  private searchIndex: SearchIndexEntry[] | null = null;
  private static startupLogged = false;

  constructor(customProvider?: ICatalogueProvider) {
    if (customProvider) {
      this.provider = customProvider;
    } else {
      const sourceEnv = (typeof process !== 'undefined' && process.env?.CATALOGUE_SOURCE) || 'FIXTURE';
      if (sourceEnv.toUpperCase() === 'PERSISTENT') {
        this.provider = new PersistentCatalogueProvider();
      } else {
        this.provider = new FixtureCatalogueProvider();
      }
    }

    if (!CatalogueRepository.startupLogged) {
      CatalogueRepository.startupLogged = true;
      console.log(`[TheRightGear Catalogue] Active catalogue provider: ${this.provider.providerType}`);
      // Validate fixture integrity on initialization
      if (this.provider.providerType === 'FIXTURE') {
        const validation = CatalogueValidator.validate(this.provider);
        if (!validation.valid) {
          console.warn(`[TheRightGear Catalogue] Fixture validation found ${validation.errors.length} errors:`, validation.errors);
        }
      }
    }
  }

  public getProviderType(): string {
    return this.provider.providerType;
  }

  public validate(): CatalogueValidationResult {
    return CatalogueValidator.validate(this.provider);
  }

  // --- MAKERS & MANUFACTURERS ---
  public getMakers(): Maker[] {
    return this.provider.getMakers().sort((a, b) => a.canonical_name.localeCompare(b.canonical_name));
  }

  public getMakerById(id: string): Maker | null {
    return this.provider.getMakerById(id);
  }

  public getMakerBySlug(slug: string): Maker | null {
    return this.provider.getMakerBySlug(slug);
  }

  public getManufacturers(): Manufacturer[] {
    return this.getMakers().map(m => ({
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

  public getPeopleByMaker(makerSlug: string) {
    return Object.values(PERSON_FIXTURES).filter(person => 
      person.related_organizations?.some(org => org.slug === makerSlug)
    );
  }

  // --- MODELS ---
  public getModels(): Model[] {
    return this.provider.getModels().sort((a, b) => {
      const yA = a.introduced_year ?? 9999;
      const yB = b.introduced_year ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public getModelsByMaker(makerIdOrSlug: string): Model[] {
    return this.provider.getModelsByMaker(makerIdOrSlug).sort((a, b) => {
      const yA = a.introduced_year ?? 9999;
      const yB = b.introduced_year ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public getModelById(id: string): Model | null {
    return this.provider.getModelById(id);
  }

  public getModelBySlug(makerSlug: string, modelSlug: string): Model | null {
    return this.provider.getModelBySlug(makerSlug, modelSlug);
  }

  public getModelByIdOrSlug(idOrSlug: string): Model | null {
    return this.provider.getModelByIdOrSlug(idOrSlug);
  }

  // --- GENERATIONS ---
  public getGenerations(): Generation[] {
    return this.provider.getGenerations().sort((a, b) => {
      const yA = a.production_start ?? 9999;
      const yB = b.production_start ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public getGenerationsByModel(modelIdOrSlug: string): Generation[] {
    return this.provider.getGenerationsByModel(modelIdOrSlug).sort((a, b) => {
      const yA = a.production_start ?? 9999;
      const yB = b.production_start ?? 9999;
      if (yA !== yB) return yA - yB;
      return a.canonical_name.localeCompare(b.canonical_name);
    });
  }

  public getGenerationById(id: string): Generation | null {
    return this.provider.getGenerationById(id);
  }

  public getGenerationBySlug(slug: string): Generation | null {
    return this.provider.getGenerationBySlug(slug);
  }

  public getGenerationByIdOrSlug(idOrSlug: string): Generation | null {
    return this.provider.getGenerationByIdOrSlug(idOrSlug);
  }

  // --- VARIANTS ---
  public getVariants(): VehicleVariant[] {
    return this.provider.getVariants().sort((a, b) => {
      const yA = a.model_year_from ?? 9999;
      const yB = b.model_year_from ?? 9999;
      if (yA !== yB) return yA - yB;
      return (a.variant_name || '').localeCompare(b.variant_name || '');
    });
  }

  public getVariantsByGeneration(generationIdOrSlug: string): VehicleVariant[] {
    return this.provider.getVariantsByGeneration(generationIdOrSlug).sort((a, b) => {
      const yA = a.model_year_from ?? 9999;
      const yB = b.model_year_from ?? 9999;
      if (yA !== yB) return yA - yB;
      return (a.variant_name || '').localeCompare(b.variant_name || '');
    });
  }

  public getVariantById(id: string): VehicleVariant | null {
    return this.provider.getVariantById(id);
  }

  public getVariantBySlug(slug: string): VehicleVariant | null {
    return this.provider.getVariantBySlug(slug);
  }

  public getVariantByIdOrSlug(idOrSlug: string): VehicleVariant | null {
    return this.provider.getVariantByIdOrSlug(idOrSlug);
  }

  public getAllVariants(filters?: SearchFilters): { total: number; vehicles: VehicleVariant[] } {
    let filtered = this.getVariants();
    
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
        const m = this.getMakerBySlug(filters.manufacturerId);
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
  public getEngines(): CanonicalEngine[] {
    return this.provider.getCanonicalEngines();
  }

  public getEngineById(id: string): CanonicalEngine | null {
    return this.provider.getCanonicalEngineById(id);
  }

  public getEngineBySlug(slug: string): CanonicalEngine | null {
    return this.provider.getCanonicalEngineBySlug(slug);
  }

  public getPublicEngineBySlug(slug: string): CanonicalEngine | null {
    const engine = this.getEngineBySlug(slug);
    if (!engine) return null;
    const catStatus = (engine as any).catalogue_status || (engine as any).catalogueStatus;
    const datStatus = (engine as any).data_status || (engine as any).dataStatus;
    if (catStatus === 'PUBLISHED' && isPublicCanonicalFact(datStatus)) {
      return engine;
    }
    return null;
  }

  public getCanonicalEngineForVariant(variantId: string): CanonicalEngine | null {
    const variant = this.getVariantById(variantId);
    if (!variant || !variant.canonical_engine_id) {
      return null;
    }
    return this.getEngineById(variant.canonical_engine_id);
  }

  // --- HIERARCHY RESOLUTION ---
  public resolveModelHierarchy(modelIdOrSlug: string): ResolvedModelHierarchy | null {
    if (!modelIdOrSlug) return null;
    const q = modelIdOrSlug.toLowerCase().trim();

    // 1. Resolve canonical Model directly
    let resolvedModel = this.getModelByIdOrSlug(q);

    // 2. Fallback: resolve Model via Generation
    if (!resolvedModel) {
      const gen = this.getGenerationByIdOrSlug(q);
      if (gen) {
        resolvedModel = this.getModelById(gen.model_id);
      }
    }

    // 3. Fallback: resolve Model via Variant
    if (!resolvedModel) {
      const variant = this.getVariantByIdOrSlug(q);
      if (variant) {
        if (variant.generation_id) {
          const gen = this.getGenerationById(variant.generation_id);
          if (gen) {
            resolvedModel = this.getModelById(gen.model_id);
          }
        }
        if (!resolvedModel && variant.model_name) {
          resolvedModel = this.getModels().find(m => m.canonical_name.toLowerCase() === variant.model_name.toLowerCase()) ?? null;
        }
      }
    }

    if (!resolvedModel) {
      return null;
    }

    const maker = this.getMakerById(resolvedModel.maker_id);
    const canonicalGenerations = this.getGenerationsByModel(resolvedModel.id);
    const genIds = new Set(canonicalGenerations.map(g => g.id));

    // Find all variants for this model
    const allVariants = this.getVariants().filter(v => 
      (v.generation_id && genIds.has(v.generation_id)) || 
      (v.model_name && v.model_name.toLowerCase() === resolvedModel!.canonical_name.toLowerCase())
    );

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
          const orphanGen = this.getGenerationById(v.generation_id);
          existing = {
            generation: orphanGen,
            generationId: v.generation_id,
            variants: [],
            _startYear: orphanGen?.production_start ?? null,
            _endYear: orphanGen?.production_end ?? null
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

    // Deterministic sort generations by production start
    generationContexts.sort((a, b) => {
      const yA = a._startYear ?? a.generation?.production_start ?? 9999;
      const yB = b._startYear ?? b.generation?.production_start ?? 9999;
      return yA - yB;
    });

    return {
      maker,
      model: resolvedModel,
      generationContexts,
      allVariants
    };
  }

  public getHierarchy() {
    return {
      makers: this.getMakers(),
      models: this.getModels(),
      generations: this.getGenerations(),
      variants: this.getVariants(),
      engines: this.getEngines()
    };
  }

  // --- CANONICAL ROUTING ---
  public getCanonicalEntityUrl(type: 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT' | 'ENGINE', ids: { makerId?: string, modelId?: string, generationId?: string, variantId?: string, engineId?: string }): string {
    if (type === 'ENGINE' && ids.engineId) {
      const e = this.getEngineById(ids.engineId);
      return e ? `/engines/${e.slug}` : '';
    }
    if (type === 'MAKER' && ids.makerId) {
      const m = this.getMakerById(ids.makerId);
      return m ? `/brands/${m.slug}` : '';
    }
    if (type === 'MODEL' && ids.modelId) {
      const mod = this.getModelById(ids.modelId);
      const mak = mod ? this.getMakerById(mod.maker_id) : undefined;
      if (mak && mod) return `/cars/${mak.slug}/${mod.slug}`;
    }
    if (type === 'GENERATION' && ids.generationId) {
      const gen = this.getGenerationById(ids.generationId);
      const mod = gen ? this.getModelById(gen.model_id) : undefined;
      const mak = mod ? this.getMakerById(mod.maker_id) : undefined;
      if (mak && mod && gen) return `/cars/${mak.slug}/${mod.slug}/${gen.slug}`;
    }
    if (type === 'VARIANT' && ids.variantId) {
      const varnt = this.getVariantById(ids.variantId);
      const gen = varnt ? this.getGenerationById(varnt.generation_id) : undefined;
      const mod = gen ? this.getModelById(gen.model_id) : undefined;
      const mak = mod ? this.getMakerById(mod.maker_id) : undefined;
      if (mak && mod && gen && varnt) return `/cars/${mak.slug}/${mod.slug}/${gen.slug}/${varnt.slug}`;
    }
    return '';
  }

  // --- SEARCH ---
  private buildSearchIndex(): void {
    if (this.searchIndex) return;

    this.searchIndex = [];

    // Maker adapter
    this.getMakers().forEach(m => {
      this.searchIndex!.push({
        id: m.id,
        entityType: 'MAKER',
        searchKeys: [
          { value: m.canonical_name, kind: 'CANONICAL_NAME' }
        ],
        canonicalUrl: this.getCanonicalEntityUrl('MAKER', { makerId: m.id }),
        title: m.canonical_name,
        thumbnail: m.logo_url,
        makerSlug: m.slug
      });
    });

    // Model adapter
    this.getModels().forEach(m => {
      const maker = this.getMakerById(m.maker_id);
      if (maker) {
        this.searchIndex!.push({
          id: m.id,
          entityType: 'MODEL',
          searchKeys: [
            { value: m.canonical_name, kind: 'CANONICAL_NAME' },
            { value: maker.canonical_name, kind: 'RELATIONAL_CONTEXT' }
          ],
          canonicalUrl: this.getCanonicalEntityUrl('MODEL', { modelId: m.id }),
          title: `${maker.canonical_name} ${m.canonical_name}`,
          makerSlug: maker.slug,
          modelSlug: m.slug
        });
      }
    });

    // Generation adapter
    this.getGenerations().forEach(g => {
      const model = this.getModelById(g.model_id);
      if (model) {
        const maker = this.getMakerById(model.maker_id);
        if (maker) {
          this.searchIndex!.push({
            id: g.id,
            entityType: 'GENERATION',
            searchKeys: [
              { value: g.canonical_name, kind: 'CANONICAL_NAME' },
              { value: g.generation_code, kind: 'GENERATION_CODE' },
              { value: maker.canonical_name, kind: 'RELATIONAL_CONTEXT' },
              { value: model.canonical_name, kind: 'RELATIONAL_CONTEXT' }
            ],
            canonicalUrl: this.getCanonicalEntityUrl('GENERATION', { generationId: g.id }),
            title: `${maker.canonical_name} ${model.canonical_name} · ${g.generation_code}`,
            makerSlug: maker.slug,
            modelSlug: model.slug,
            generationSlug: g.slug
          });
        }
      }
    });

    // Person adapter
    Object.values(PERSON_FIXTURES).forEach(person => {
      this.searchIndex!.push({
        id: person.slug,
        entityType: 'PERSON',
        searchKeys: [
          { value: person.canonical_name, kind: 'CANONICAL_NAME' }
        ],
        canonicalUrl: `/people/${person.slug}`,
        title: person.canonical_name,
        thumbnail: person.portrait_url
      });
    });

    // Variant adapter
    this.getVariants().forEach(v => {
      const generation = this.getGenerationById(v.generation_id);
      if (generation) {
        const model = this.getModelById(generation.model_id);
        if (model) {
          const maker = this.getMakerById(model.maker_id);
          if (maker) {
            const keys: SearchKey[] = [
              { value: v.variant_name, kind: 'CANONICAL_NAME' },
              { value: generation.generation_code, kind: 'GENERATION_CODE' },
              { value: maker.canonical_name, kind: 'RELATIONAL_CONTEXT' },
              { value: model.canonical_name, kind: 'RELATIONAL_CONTEXT' }
            ];

            if (v.technical_identifiers) {
              v.technical_identifiers.forEach(id => {
                keys.push({ value: id, kind: 'TECHNICAL_CODE' });
              });
            }

            this.searchIndex!.push({
              id: v.id,
              entityType: 'VARIANT',
              searchKeys: keys,
              canonicalUrl: this.getCanonicalEntityUrl('VARIANT', { variantId: v.id }),
              title: `${maker.canonical_name} ${model.canonical_name} · ${generation.generation_code} · ${v.variant_name}`,
              thumbnail: v.hero_image_url,
              makerSlug: maker.slug,
              modelSlug: model.slug,
              generationSlug: generation.slug,
              variantSlug: v.slug
            });
          }
        }
      }
    });
  }

  public search(query: string): { results: SearchResult[], discovery: { id: string, url: string, title: string }[] } {
    const stdQuery = normalizeQueryStandard(query);
    const techQuery = normalizeQueryTechnical(query);
    if (stdQuery.length < 2) return { results: [], discovery: [] };

    if (!this.searchIndex) {
      this.buildSearchIndex();
    }

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return { results: [], discovery: [] };

    const scoredResults: { entry: SearchIndexEntry; score: number }[] = [];

    for (const entry of this.searchIndex!) {
      let combinedScore = 0;
      let allTokensCovered = true;
      let hasOwnIdentityMatch = false;

      let exactFullMatchScore = 0;
      for (const key of entry.searchKeys) {
        if (!key.value || key.kind === 'RELATIONAL_CONTEXT') continue;
        const isTech = ['TECHNICAL_CODE', 'GENERATION_CODE', 'ENGINE_CODE', 'CHASSIS_CODE', 'PLATFORM_CODE'].includes(key.kind);
        const normalizedKey = isTech ? normalizeQueryTechnical(key.value) : normalizeQueryStandard(key.value);
        const fullQ = isTech ? techQuery : stdQuery;
        if (normalizedKey === fullQ) {
          exactFullMatchScore = Math.max(exactFullMatchScore, 10);
        } else if (normalizedKey.startsWith(fullQ)) {
          exactFullMatchScore = Math.max(exactFullMatchScore, 8);
        }
      }

      for (const token of tokens) {
        const tokenStd = normalizeQueryStandard(token);
        const tokenTech = normalizeQueryTechnical(token);
        
        let bestTokenScore = 0;
        let tokenHasOwnIdentityMatch = false;

        for (const key of entry.searchKeys) {
          if (!key.value) continue;
          const isTech = ['TECHNICAL_CODE', 'GENERATION_CODE', 'ENGINE_CODE', 'CHASSIS_CODE', 'PLATFORM_CODE'].includes(key.kind);
          const normalizedKey = isTech ? normalizeQueryTechnical(key.value) : normalizeQueryStandard(key.value);
          const q = isTech ? tokenTech : tokenStd;

          let score = 0;
          if (normalizedKey === q) {
            score = key.kind === 'RELATIONAL_CONTEXT' ? 1.5 : 3;
          } else if (normalizedKey.startsWith(q)) {
            score = key.kind === 'RELATIONAL_CONTEXT' ? 1 : 2;
          } else if (normalizedKey.includes(q)) {
            score = key.kind === 'RELATIONAL_CONTEXT' ? 0.5 : 1;
          }
          if (score > bestTokenScore) {
            bestTokenScore = score;
            if (key.kind !== 'RELATIONAL_CONTEXT') {
              tokenHasOwnIdentityMatch = true;
            }
          }
        }
        
        if (bestTokenScore === 0) {
          allTokensCovered = false;
          break;
        }

        combinedScore += bestTokenScore;
        if (tokenHasOwnIdentityMatch) {
          hasOwnIdentityMatch = true;
        }
      }

      let finalScore = exactFullMatchScore > 0 ? exactFullMatchScore + combinedScore : combinedScore;

      if (allTokensCovered && hasOwnIdentityMatch && finalScore > 0) {
        scoredResults.push({ entry, score: finalScore });
      }
    }

    scoredResults.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));

    const finalResults: SearchResult[] = [];
    const discovery: { id: string, url: string, title: string }[] = [];
    
    if (scoredResults.length > 0 && scoredResults[0].entry.entityType === 'MAKER') {
      const bestMaker = scoredResults[0].entry;
      finalResults.push({
        id: bestMaker.id,
        type: bestMaker.entityType,
        url: bestMaker.canonicalUrl,
        title: bestMaker.title,
        makerSlug: bestMaker.makerSlug,
        thumbnail: bestMaker.thumbnail
      });
      discovery.push({
        id: 'discover_models_' + bestMaker.id,
        url: '/brands/' + bestMaker.makerSlug + '#models',
        title: 'Models by ' + bestMaker.title,
      });
      
      finalResults.push(...scoredResults.slice(1).map(r => ({
        id: r.entry.id,
        type: r.entry.entityType,
        url: r.entry.canonicalUrl,
        title: r.entry.title,
        thumbnail: r.entry.thumbnail,
        makerSlug: r.entry.makerSlug,
        modelSlug: r.entry.modelSlug,
        generationSlug: r.entry.generationSlug,
        variantSlug: r.entry.variantSlug
      })));
    } else {
      finalResults.push(...scoredResults.map(r => ({
        id: r.entry.id,
        type: r.entry.entityType,
        url: r.entry.canonicalUrl,
        title: r.entry.title,
        thumbnail: r.entry.thumbnail,
        makerSlug: r.entry.makerSlug,
        modelSlug: r.entry.modelSlug,
        generationSlug: r.entry.generationSlug,
        variantSlug: r.entry.variantSlug
      })));
    }

    return { results: finalResults.slice(0, 8), discovery };
  }
}

export function isPublicCanonicalFact(status?: string): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === 'verified' || s === 'licensed' || s === 'approved';
}

export function filterVehicleForPublic(vehicle: VehicleVariant): VehicleVariant {
  if (!isPublicCanonicalFact(vehicle.data_status) && !vehicle.is_ui_fixture) {
    return {
      ...vehicle,
      engine: undefined,
      transmission: undefined,
      specs: undefined,
      scores: { 
        rarity_score: 0, 
        confidence_level: "Insufficient Data", 
        collector_score: undefined as any,
        investment_score: undefined as any
      },
      current_median_price_eur: undefined,
      price_change_1y_pct: undefined,
      production_total: undefined,
      history_en: undefined,
      history_it: undefined,
    };
  }
  return vehicle;
}

export const catalogueRepository = new CatalogueRepository();
