import { Maker, Model, Generation, VehicleVariant, SearchFilters } from '../types';
import { TEST_MAKERS, TEST_MODELS, TEST_GENERATIONS, TEST_VARIANTS } from '../data/testCatalogue';

export class CatalogueRepository {
  // --- SEARCH ---
  
  // --- CANONICAL ROUTING ---
  public getCanonicalEntityUrl(type: 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT', ids: { makerId?: string, modelId?: string, generationId?: string, variantId?: string }): string {
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

  public search(query: string): any[] {
    const qLower = query.toLowerCase().trim();
    if (qLower.length < 2) return [];

    const results: any[] = [];
    
    // Makers
    this.makers.filter(m => m.canonical_name.toLowerCase().includes(qLower)).forEach(m => {
      results.push({
        id: m.id,
        title: m.canonical_name,
        type: 'MAKER',
        url: this.getCanonicalEntityUrl('MAKER', { makerId: m.id }),
        makerSlug: m.slug,
        thumbnail: m.logo_url
      });
    });

    // Models
    this.models.filter(m => m.canonical_name.toLowerCase().includes(qLower)).forEach(m => {
      const maker = this.makers.find(mk => mk.id === m.maker_id);
      if (maker) {
        results.push({
          id: m.id,
          title: `${maker.canonical_name} ${m.canonical_name}`,
          type: 'MODEL',
          url: this.getCanonicalEntityUrl('MODEL', { modelId: m.id }),
          makerSlug: maker.slug,
          modelSlug: m.slug
        });
      }
    });

    // Generations
    this.generations.filter(g => g.canonical_name.toLowerCase().includes(qLower) || g.generation_code.toLowerCase().includes(qLower)).forEach(g => {
      const model = this.models.find(m => m.id === g.model_id);
      if (model) {
        const maker = this.makers.find(mk => mk.id === model.maker_id);
        if (maker) {
          results.push({
            id: g.id,
            title: `${maker.canonical_name} ${model.canonical_name} · ${g.generation_code}`,
            type: 'GENERATION',
            url: this.getCanonicalEntityUrl('GENERATION', { generationId: g.id }),
            makerSlug: maker.slug,
            modelSlug: model.slug,
            generationSlug: g.slug
          });
        }
      }
    });

    // Variants
    this.variants.filter(v => v.variant_name.toLowerCase().includes(qLower)).forEach(v => {
      const generation = this.generations.find(g => g.id === v.generation_id);
      if (generation) {
        const model = this.models.find(m => m.id === generation.model_id);
        if (model) {
          const maker = this.makers.find(mk => mk.id === model.maker_id);
          if (maker) {
            results.push({
              id: v.id,
              title: `${maker.canonical_name} ${model.canonical_name} · ${generation.generation_code} · ${v.variant_name}`,
              type: 'VARIANT',
              url: this.getCanonicalEntityUrl('VARIANT', { variantId: v.id }),
              makerSlug: maker.slug,
              modelSlug: model.slug,
              generationSlug: generation.slug,
              variantSlug: v.slug,
              thumbnail: v.hero_image_url
            });
          }
        }
      }
    });

    return results.slice(0, 8);
  }

  private makers: Maker[] = [...TEST_MAKERS];
  private models: Model[] = [...TEST_MODELS];
  private generations: Generation[] = [...TEST_GENERATIONS];
  private variants: VehicleVariant[] = [...TEST_VARIANTS];

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

  public getGenerationsByModel(modelIdOrSlug: string): Generation[] {
    return this.generations.filter(g => g.model_id === modelIdOrSlug || g.model_id.endsWith(modelIdOrSlug));
  }

  public getGenerationBySlug(generationSlug: string): Generation | undefined {
    return this.generations.find(g => g.slug === generationSlug || g.id === generationSlug);
  }

  // --- HIERARCHY ---
  public getHierarchy() {
    return {
      makers: this.getMakers(),
      models: this.getModels(),
      generations: this.getGenerations(),
      variants: this.variants
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
  if (!isPublicCanonicalFact(vehicle.data_status)) {
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
