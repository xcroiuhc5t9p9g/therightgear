import { VehicleVariant, Manufacturer, GraphEntity, GraphRelationship, DataAssertion, SearchFilters } from '../types';
import { MANUFACTURERS, GRAPH_ENTITIES, GRAPH_RELATIONSHIPS, DATA_ASSERTIONS_MOCK } from '../data/catalogData';
import { unifiedVehicleStore } from './unifiedVehicleStore';

const API_BASE = '/api/v1';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (e) {
    return { status: 'offline', version: '0.2', catalog_count: unifiedVehicleStore.getAll().length };
  }
}

export async function fetchManufacturers(): Promise<Manufacturer[]> {
  try {
    const res = await fetch(`${API_BASE}/manufacturers`);
    if (!res.ok) throw new Error('Failed to fetch manufacturers');
    return await res.json();
  } catch (e) {
    return MANUFACTURERS;
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
    // Client-side fallback filter using unifiedVehicleStore
    let filtered = unifiedVehicleStore.getAll();
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(v => 
        v.manufacturer_name.toLowerCase().includes(q) ||
        v.model_name.toLowerCase().includes(q) ||
        v.variant_name.toLowerCase().includes(q)
      );
    }
    if (filters?.category && filters.category !== 'All') {
      filtered = filtered.filter(v => v.category === filters.category);
    }
    if (filters?.tier && filters.tier !== 'All') {
      filtered = filtered.filter(v => v.tier === filters.tier);
    }
    return { total: filtered.length, vehicles: filtered };
  }
}

export async function fetchVehicleBySlug(slug: string): Promise<VehicleVariant | null> {
  try {
    const res = await fetch(`${API_BASE}/vehicles/${slug}`);
    if (!res.ok) throw new Error('Vehicle not found');
    return await res.json();
  } catch (e) {
    return unifiedVehicleStore.getByIdOrSlug(slug) || null;
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
    return { entities: GRAPH_ENTITIES, relationships: GRAPH_RELATIONSHIPS };
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
    return DATA_ASSERTIONS_MOCK;
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
      throw new Error(errData.error || errData.details || 'Errore durante l\'estrazione');
    }
    return await res.json();
  } catch (e: any) {
    return {
      success: false,
      provider,
      records: [],
      error: e.message || 'Connessione al server di estrazione fallita'
    };
  }
}


