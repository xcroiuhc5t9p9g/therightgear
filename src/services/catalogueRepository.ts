import { Maker, Model, Generation, VehicleVariant, CanonicalEngine, SearchFilters, CategoryType, SearchResult, SearchIndexEntry, SearchKey, SearchKeyKind } from '../types';
import { TEST_MAKERS, TEST_MODELS, TEST_GENERATIONS, TEST_VARIANTS, TEST_CANONICAL_ENGINES } from '../data/testCatalogue';
import { PERSON_FIXTURES } from '../data/uiPeopleFixtures';








function normalizeQueryTechnical(query: string): string {
  return query.toLowerCase().trim().replace(/[-\s]/g, '');
}

function normalizeQueryStandard(query: string): string {
  return query.toLowerCase().trim();
}

export class CatalogueRepository {
  // --- SEARCH ---
  
  // --- CANONICAL ROUTING ---
  public getCanonicalEntityUrl(type: 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT' | 'ENGINE', ids: { makerId?: string, modelId?: string, generationId?: string, variantId?: string, engineId?: string }): string {
    if (type === 'ENGINE' && ids.engineId) {
      const e = this.engines.find(eng => eng.id === ids.engineId);
      return e ? `/engines/${e.slug}` : '';
    }
    if (type === 'MAKER' && ids.makerId) {
      const m = this.makers.find(mk => mk.id === ids.makerId);
      return m ? `/brands/${m.slug}` : '';
    }
    if (type === 'MODEL' && ids.modelId) {
      const mod = this.models.find(m => m.id === ids.modelId);
      const mak = mod ? this.makers.find(m => m.id === mod.maker_id) : undefined;
      if (mak && mod) return `/cars/${mak.slug}/${mod.slug}`;
    }
    if (type === 'GENERATION' && ids.generationId) {
      const gen = this.generations.find(g => g.id === ids.generationId);
      const mod = gen ? this.models.find(m => m.id === gen.model_id) : undefined;
      const mak = mod ? this.makers.find(m => m.id === mod.maker_id) : undefined;
      if (mak && mod && gen) return `/cars/${mak.slug}/${mod.slug}/${gen.slug}`;
    }
    if (type === 'VARIANT' && ids.variantId) {
      const varnt = this.variants.find(v => v.id === ids.variantId);
      const gen = varnt ? this.generations.find(g => g.id === varnt.generation_id) : undefined;
      const mod = gen ? this.models.find(m => m.id === gen.model_id) : undefined;
      const mak = mod ? this.makers.find(m => m.id === mod.maker_id) : undefined;
      if (mak && mod && gen && varnt) return `/cars/${mak.slug}/${mod.slug}/${gen.slug}/${varnt.slug}`;
    }
    return '';
  }

  private searchIndex: SearchIndexEntry[] | null = null;




  private buildSearchIndex(): void {
    if (this.searchIndex) return;

    this.searchIndex = [];

    // Maker adapter
    this.makers.forEach(m => {
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
    this.models.forEach(m => {
      const maker = this.makers.find(mk => mk.id === m.maker_id);
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
    this.generations.forEach(g => {
      const model = this.models.find(m => m.id === g.model_id);
      if (model) {
        const maker = this.makers.find(mk => mk.id === model.maker_id);
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
    /* 
      UNIVERSAL SEARCHABILITY CONTRACT
      Searchable entity data should be indexed from entity data sources,
      not manually duplicated in page components.
      
      Future searchable entity classes include:
      MAKER, MODEL, GENERATION, VARIANT, ENGINE, PERSON, ORGANIZATION
      
      Future searchable key categories include:
      canonical names, display names, approved aliases, engine codes,
      generation codes, chassis codes, platform codes, market designations,
      alternative designations.
    */
    Object.values(PERSON_FIXTURES).forEach(person => {
      this.searchIndex!.push({
        id: person.slug, // using slug as ID for UI fixtures
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
    

    this.variants.forEach(v => {
      const generation = this.generations.find(g => g.id === v.generation_id);
      if (generation) {
        const model = this.models.find(m => m.id === generation.model_id);
        if (model) {
          const maker = this.makers.find(mk => mk.id === model.maker_id);
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

      // FULL_QUERY_OWN_IDENTITY_PRIORITY & FUZZY_SEARCH
      // Check full query first on own identity
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
    
    // Add models by maker discovery action if a maker is a top match
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
      
      // Add the rest
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

  private makers: Maker[] = [...TEST_MAKERS];
  private models: Model[] = [...TEST_MODELS];
  private generations: Generation[] = [...TEST_GENERATIONS];
  private variants: VehicleVariant[] = [...TEST_VARIANTS];
  private engines: CanonicalEngine[] = [...TEST_CANONICAL_ENGINES];

  // --- MAKERS ---
  public getMakers(): Maker[] {
    return [...this.makers];
  }

  public getMakerBySlug(slug: string): Maker | undefined {
    return this.makers.find(m => m.slug === slug || m.id === slug);
  }

  // --- MODELS ---
  public getModels(): Model[] {
    return [...this.models];
  }

  public getModelsByMaker(makerIdOrSlug: string): Model[] {
    const maker = this.getMakerBySlug(makerIdOrSlug);
    const makerId = maker ? maker.id : makerIdOrSlug;
    return this.models.filter(m => m.maker_id === makerId || m.maker_id === `m-${makerIdOrSlug}`);
  }

  public getModelBySlug(makerSlug: string, modelSlug: string): Model | undefined {
    const makerModels = this.getModelsByMaker(makerSlug);
    return makerModels.find(m => m.slug === modelSlug || m.slug.includes(modelSlug));
  }

  // --- GENERATIONS ---
  public getGenerations(): Generation[] {
    return [...this.generations];
  }

  public getPeopleByMaker(makerSlug: string) {
    return Object.values(PERSON_FIXTURES).filter(person => 
      person.related_organizations?.some(org => org.slug === makerSlug)
    );
  }

  public getGenerationsByModel(modelIdOrSlug: string): Generation[] {
    return this.generations.filter(g => g.model_id === modelIdOrSlug || g.model_id.endsWith(modelIdOrSlug));
  }

  public getGenerationBySlug(generationSlug: string): Generation | undefined {
    return this.generations.find(g => g.slug === generationSlug || g.id === generationSlug);
  }

  // --- ENGINES ---
  public getEngines(): CanonicalEngine[] {
    return [...this.engines];
  }

  public getEngineById(id: string): CanonicalEngine | undefined {
    return this.engines.find(e => e.id === id);
  }

  public getEngineBySlug(slug: string): CanonicalEngine | undefined {
    return this.engines.find(e => e.slug === slug);
  }

  public getPublicEngineBySlug(slug: string): CanonicalEngine | undefined {
    const engine = this.getEngineBySlug(slug);
    if (!engine) return undefined;
    const catStatus = (engine as any).catalogue_status || (engine as any).catalogueStatus;
    const datStatus = (engine as any).data_status || (engine as any).dataStatus;
    if (catStatus === 'PUBLISHED' && isPublicCanonicalFact(datStatus)) {
      return engine;
    }
    return undefined;
  }

  public getCanonicalEngineForVariant(variantId: string): CanonicalEngine | undefined {
    const variant = this.variants.find(v => v.id === variantId);
    if (!variant || !variant.canonical_engine_id) {
      return undefined;
    }
    return this.getEngineById(variant.canonical_engine_id);
  }

  // --- HIERARCHY ---
  public getHierarchy() {
    return {
      makers: this.getMakers(),
      models: this.getModels(),
      generations: this.getGenerations(),
      variants: this.variants,
      engines: this.getEngines()
    };
  }

  // --- VARIANTS ---
  public getVariantsByGeneration(generationIdOrSlug: string): VehicleVariant[] {
    return this.variants.filter(v => v.generation_id === generationIdOrSlug || v.generation_id.endsWith(generationIdOrSlug));
  }

  public getVariantBySlug(variantSlug: string): VehicleVariant | undefined {
    const s = variantSlug.toLowerCase();
    return this.variants.find(v => 
      v.slug === s || 
      v.id === s ||
      v.slug.endsWith(s) ||
      v.id.endsWith(s) ||
      (s === 'evolution-ii' && (v.slug.includes('evolution') || v.id.includes('evolution'))) ||
      (s === 'sport-evolution' && v.slug.includes('sport-evolution')) ||
      (s === 'm3-2-3' && (v.slug.includes('2-3') || v.id.includes('2-3')))
    );
  }

  public getAllVariants(filters?: SearchFilters): { total: number; vehicles: VehicleVariant[] } {
    let filtered = [...this.variants];
    
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
        filtered = filtered.filter(v => v.model_year_from >= filters.yearMin!);
      }
      if (filters.yearMax) {
        filtered = filtered.filter(v => (v.model_year_to || v.model_year_from) <= filters.yearMax!);
      }
    }

    return { total: filtered.length, vehicles: filtered };
  }
}

export function isPublicCanonicalFact(status?: string): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  // Only explicitly approved/public statuses are allowed
  return s === 'verified' || s === 'licensed' || s === 'approved';
}

export function filterVehicleForPublic(vehicle: VehicleVariant): VehicleVariant {
  // If the vehicle's data status is not public canonical, strip factual specs, but keep identity
  if (!isPublicCanonicalFact(vehicle.data_status) && !vehicle.is_ui_fixture) {
    return {
      ...vehicle,
      engine: undefined,
      transmission: undefined,
      specs: undefined,
      scores: { rarity_score: 0, confidence_level: "Insufficient Data", 
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
