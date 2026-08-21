import { ICatalogueProvider } from './types.js';
import { FixtureCatalogueProvider } from './providers/FixtureCatalogueProvider.js';
import { PersistentCatalogueProvider } from './providers/PersistentCatalogueProvider.js';

export class CatalogueProviderFactory {
  public static createProvider(customSource?: string): ICatalogueProvider {
    const rawSource = customSource || (typeof process !== 'undefined' ? process.env?.CATALOGUE_SOURCE : undefined);

    // 1. Explicit CATALOGUE_SOURCE specified
    if (rawSource) {
      const normalized = rawSource.toUpperCase().trim();
      if (normalized === 'PERSISTENT') {
        return new PersistentCatalogueProvider();
      }

      if (normalized === 'FIXTURE') {
        return new FixtureCatalogueProvider();
      }

      console.warn(`[TheRightGear Catalogue] Unrecognized CATALOGUE_SOURCE: "${rawSource}". Defaulting to Fixture provider.`);
      return new FixtureCatalogueProvider();
    }

    // 2. Default provider when CATALOGUE_SOURCE is unset
    // Ensures robust, zero-crash startup across preview, development, and Cloud Run production environments
    return new FixtureCatalogueProvider();
  }
}

