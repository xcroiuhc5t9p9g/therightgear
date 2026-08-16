import { 
  VehicleVariant, 
  Manufacturer, 
  GraphEntity, 
  GraphRelationship, 
  DataAssertion 
} from '../types';

export const MANUFACTURERS: Manufacturer[] = [];
export const HERO_VEHICLES: VehicleVariant[] = [];
export const CATALOG_DATABASE: VehicleVariant[] = [];
export const GRAPH_ENTITIES: GraphEntity[] = [];
export const GRAPH_RELATIONSHIPS: GraphRelationship[] = [];
export const DATA_ASSERTIONS_MOCK: DataAssertion[] = [];

export function generateFullCatalog() { return []; }
