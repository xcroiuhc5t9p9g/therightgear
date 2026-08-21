export const CATALOGUE_COLLECTIONS = {
  makers: 'catalogue_makers',
  models: 'catalogue_models',
  generations: 'catalogue_generations',
  variants: 'catalogue_variants',
  engines: 'catalogue_engines',
} as const;

export type CatalogueCollectionName = typeof CATALOGUE_COLLECTIONS[keyof typeof CATALOGUE_COLLECTIONS];
