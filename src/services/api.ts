import { VehicleVariant, Manufacturer, GraphEntity, GraphRelationship, DataAssertion, SearchFilters, Maker, Model, Generation } from '../types';
import { catalogueRepository } from './catalogueRepository';
import { unifiedVehicleStore } from './unifiedVehicleStore';

const API_BASE = '/api/v1';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (e) {
    return { status: 'offline', version: '0.2', catalog_count: catalogueRepository.getAllVariants().total };
  }
}

export async function fetchMakers(): Promise<Maker[]> {
  try {
    const res = await fetch(`${API_BASE}/brands`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return await res.json();
  } catch (e) {
    return catalogueRepository.getMakers();
  }
}

export async function fetchManufacturers(): Promise<Manufacturer[]> {
  try {
    const res = await fetch(`${API_BASE}/manufacturers`);
    if (!res.ok) throw new Error('Failed to fetch manufacturers');
    return await res.json();
  } catch (e) {
    return catalogueRepository.getMakers().map(m => ({
      id: m.id,
      slug: m.slug,
      official_name: m.canonical_name || m.official_name || m.slug,
      country_code: m.country_code || 'IT',
      founded_year: m.founded_year || 1900,
      active: m.active ?? true,
      logo_url: m.logo_url || ''
    }));
  }
}

export async function fetchVehicles(filters?: SearchFilters): Promise<{ total: number; vehicles: VehicleVariant[] }> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.query) params.append('query', filters.query);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.manufacturerId) params.append('manufacturerId', filters.manufacturerId);
      if (filters.yearMin) params.append('yearMin', String(filters.yearMin));
      if (filters.yearMax) params.append('yearMax', String(filters.yearMax));
      if (filters.priceMin) params.append('priceMin', String(filters.priceMin));
      if (filters.priceMax) params.append('priceMax', String(filters.priceMax));
      if (filters.collectorScoreMin) params.append('collectorScoreMin', String(filters.collectorScoreMin));
      if (filters.investmentScoreMin) params.append('investmentScoreMin', String(filters.investmentScoreMin));
      if (filters.drivetrain && filters.drivetrain !== 'All') params.append('drivetrain', filters.drivetrain);
      if (filters.tier && filters.tier !== 'All') params.append('tier', filters.tier);
      if (filters.limitedEditionOnly) params.append('limitedOnly', 'true');
    }

    const res = await fetch(`${API_BASE}/vehicles?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  } catch (e) {
    return catalogueRepository.getAllVariants(filters);
  }
}

export async function fetchVehicleBySlug(slug: string): Promise<VehicleVariant | null> {
  try {
    const res = await fetch(`${API_BASE}/vehicles/${slug}`);
    if (!res.ok) throw new Error('Vehicle not found');
    return await res.json();
  } catch (e) {
    return catalogueRepository.getVariantBySlug(slug) || unifiedVehicleStore.getByIdOrSlug(slug) || null;
  }
}

export async function fetchCompareVehicles(slugsOrIds: string[]): Promise<VehicleVariant[]> {
  try {
    const res = await fetch(`${API_BASE}/compare?ids=${slugsOrIds.join(',')}`);
    if (!res.ok) throw new Error('Failed to compare');
    return await res.json();
  } catch (e) {
    const all = unifiedVehicleStore.getAll();
    return all.filter(v => slugsOrIds.includes(v.id) || slugsOrIds.includes(v.slug));
  }
}

export async function fetchKnowledgeGraph(): Promise<{ entities: GraphEntity[]; relationships: GraphRelationship[] }> {
  try {
    const res = await fetch(`${API_BASE}/graph/full`);
    if (!res.ok) throw new Error('Failed to fetch graph');
    return await res.json();
  } catch (e) {
    const entities: GraphEntity[] = [];
    const relationships: GraphRelationship[] = [];
    const hierarchy = catalogueRepository.getHierarchy();
    hierarchy.makers.forEach(maker => {
      entities.push({ id: maker.id, name: maker.canonical_name || maker.official_name || maker.slug, type: 'MANUFACTURER', slug: maker.slug, attributes: { Country: maker.country_code || '' } });
    });
    hierarchy.models.forEach(model => {
      entities.push({ id: model.id, name: model.canonical_name || (model as any).model_name || model.slug, type: 'MODEL', slug: model.slug, attributes: { Maker: model.maker_id } });
      relationships.push({ id: `rel-${model.id}-${model.maker_id}`, subject_entity_id: model.id, predicate: 'MANUFACTURED_BY', object_entity_id: model.maker_id, confidence_score: 1.0 });
    });
    hierarchy.generations.forEach(gen => {
      entities.push({ id: gen.id, name: gen.canonical_name || (gen as any).generation_name || gen.slug, type: 'GENERATION', slug: gen.slug, attributes: { Model: gen.model_id } });
      relationships.push({ id: `rel-${gen.id}-${gen.model_id}`, subject_entity_id: gen.id, predicate: 'PART_OF_MODEL', object_entity_id: gen.model_id, confidence_score: 1.0 });
    });
    hierarchy.variants.forEach(v => {
      entities.push({ id: v.id, name: `${v.manufacturer_name} ${v.variant_name}`, type: 'VARIANT', slug: v.slug, attributes: { Year: String(v.model_year_from || '') } });
      relationships.push({ id: `rel-${v.id}-${v.generation_id}`, subject_entity_id: v.id, predicate: 'PART_OF_GENERATION', object_entity_id: v.generation_id, confidence_score: 1.0 });
    });
    return { entities, relationships };
  }
}

export async function askAiAdvisor(prompt: string, locale: 'it' | 'en'): Promise<{ answer: string; referenced_slugs?: string[]; confidence?: string }> {
  try {
    const res = await fetch(`${API_BASE}/ai/advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, locale })
    });
    if (!res.ok) throw new Error('AI Advisor failed');
    return await res.json();
  } catch (e: any) {
    return {
      answer: locale === 'it' 
        ? 'Impossibile connettersi al servizio AI Advisor. Sulla base del catalogo interno, la Ferrari F40 ed il McLaren F1 rappresentano i riferimenti di maggior valore e stabilità finanziaria.'
        : 'Unable to reach AI Advisor service. Based on internal catalog benchmarks, the Ferrari F40 and McLaren F1 represent the highest value and financial stability reference points.',
      referenced_slugs: ['ferrari-f40', 'mclaren-f1']
    };
  }
}

export async function fetchAssertions(): Promise<DataAssertion[]> {
  try {
    const res = await fetch(`${API_BASE}/editor/assertions`);
    if (!res.ok) throw new Error('Failed to fetch assertions');
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function fetchModelNavigation(modelId: string) {
  try {
    const res = await fetch(`${API_BASE}/models/${modelId}/navigation`);
    if (!res.ok) throw new Error('Failed to fetch navigation');
    return await res.json();
  } catch (e) {
    const { getVehicleFamilyNavigation } = await import('../data/vehicleHierarchyData');
    return getVehicleFamilyNavigation(modelId);
  }
}

export async function fetchModelDetails(modelId: string) {
  try {
    const res = await fetch(`${API_BASE}/models/${modelId}`);
    if (!res.ok) throw new Error('Failed to fetch model details');
    return await res.json();
  } catch (e) {
    const { BMW_M3_MODEL_HIERARCHY } = await import('../data/vehicleHierarchyData');
    return BMW_M3_MODEL_HIERARCHY;
  }
}

export async function fetchGenerationDetails(generationId: string) {
  try {
    const res = await fetch(`${API_BASE}/generations/${generationId}`);
    if (!res.ok) throw new Error('Failed to fetch generation details');
    return await res.json();
  } catch (e) {
    const { BMW_M3_GENERATIONS_HIERARCHY } = await import('../data/vehicleHierarchyData');
    return BMW_M3_GENERATIONS_HIERARCHY.find(g => g.generationId === generationId || g.generationSlug === generationId) || BMW_M3_GENERATIONS_HIERARCHY[0];
  }
}

export async function extractVehicleDataFromWeb(query: string, provider: string = 'gemini_google_search'): Promise<{
  success: boolean;
  provider: string;
  message?: string;
  architecture_notice?: string;
  records: VehicleVariant[];
  groundingSources?: { title: string; uri: string }[];
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/import/extract-vehicle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, provider })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || errData.details || 'Error during extraction');
    }
    return await res.json();
  } catch (e: any) {
    return {
      success: false,
      provider,
      records: [],
      error: e.message || 'Connection to extraction server failed'
    };
  }
}


