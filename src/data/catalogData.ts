/**
 * @deprecated
 * LEGACY COMPATIBILITY FACADE ONLY.
 * 
 * All production application code and API handlers MUST consume data via 
 * `catalogueRepository` from `src/services/catalogueRepository.ts`.
 * Direct access to global arrays is deprecated and restricted to legacy test shims.
 */
import { 
  GraphEntity, 
  GraphRelationship, 
  DataAssertion 
} from '../types/index.js';
import { catalogueRepository } from '../services/catalogueRepository.js';

// Re-export repository singleton for consumers migrating away from static files
export { catalogueRepository };

// Legacy read-only delegates for backward compatibility
export const MAKERS = catalogueRepository.getMakers();
export const MODELS = catalogueRepository.getModels();
export const GENERATIONS = catalogueRepository.getGenerations();
export const CANONICAL_ENGINES = catalogueRepository.getEngines();
export const MANUFACTURERS = catalogueRepository.getManufacturers();
export const CATALOG_DATABASE = catalogueRepository.getVariants();
export const HERO_VEHICLES = catalogueRepository.getVariants().filter(v => v.tier === 'Hero' || v.in_primo_piano);

// Static graph assets (retained for Knowledge Graph schema)
export const GRAPH_ENTITIES: GraphEntity[] = [];
export const GRAPH_RELATIONSHIPS: GraphRelationship[] = [];
export const DATA_ASSERTIONS_MOCK: DataAssertion[] = [];

/**
 * @deprecated Use catalogueRepository.getVariants() directly.
 */
export function generateFullCatalog() { 
  return catalogueRepository.getVariants(); 
}


