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
      country_code: m.country_code,
      founded_year: m.founded_year,
      active: m.active,
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
    return { entities: [], relationships: [] };
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
        ? 'Il servizio AI Advisor non è momentaneamente disponibile.'
        : 'The AI Advisor service is currently unavailable.',
      referenced_slugs: []
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
    return null;
  }
}

export async function fetchModelDetails(modelId: string) {
  try {
    const res = await fetch(`${API_BASE}/models/${modelId}`);
    if (!res.ok) throw new Error('Failed to fetch model details');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchGenerationDetails(generationId: string) {
  try {
    const res = await fetch(`${API_BASE}/generations/${generationId}`);
    if (!res.ok) throw new Error('Failed to fetch generation details');
    return await res.json();
  } catch (e) {
    return null;
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


