import { 
  VehicleVariant, 
  Manufacturer, 
  Maker,
  Model,
  Generation,
  CanonicalEngine,
  GraphEntity, 
  GraphRelationship, 
  DataAssertion 
} from '../types/index.js';
import { 
  TEST_MAKERS, 
  TEST_MODELS, 
  TEST_GENERATIONS, 
  TEST_VARIANTS, 
  TEST_CANONICAL_ENGINES 
} from './testCatalogue.js';

export const MAKERS: Maker[] = [...TEST_MAKERS];
export const MODELS: Model[] = [...TEST_MODELS];
export const GENERATIONS: Generation[] = [...TEST_GENERATIONS];
export const CANONICAL_ENGINES: CanonicalEngine[] = [...TEST_CANONICAL_ENGINES];

export const MANUFACTURERS: Manufacturer[] = TEST_MAKERS.map(m => ({
  id: m.id,
  slug: m.slug,
  official_name: m.official_name || m.canonical_name,
  country_code: m.country_code ?? null,
  founded_year: m.founded_year ?? null,
  active: m.active ?? true,
  logo_url: m.logo_url || `/brand/makers/${m.slug}.svg`,
  website_url: m.website_url
}));

export const CATALOG_DATABASE: VehicleVariant[] = [...TEST_VARIANTS];
export const HERO_VEHICLES: VehicleVariant[] = TEST_VARIANTS.filter(v => v.tier === 'Hero' || v.in_primo_piano);
export const GRAPH_ENTITIES: GraphEntity[] = [];
export const GRAPH_RELATIONSHIPS: GraphRelationship[] = [];
export const DATA_ASSERTIONS_MOCK: DataAssertion[] = [];

export function generateFullCatalog() { 
  return CATALOG_DATABASE; 
}

