import { ICatalogueProvider, CatalogueConfigurationError } from './types.js';
import { FixtureCatalogueProvider } from './providers/FixtureCatalogueProvider.js';
import { PersistentCatalogueProvider } from './providers/PersistentCatalogueProvider.js';

export class CatalogueProviderFactory {
  public static createProvider(customSource?: string): ICatalogueProvider {
    const rawSource = customSource || (typeof process !== 'undefined' ? process.env?.CATALOGUE_SOURCE : undefined);
    const nodeEnv = (typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined) || 'development';
    const allowProdFixtures = (typeof process !== 'undefined' ? process.env?.ALLOW_PRODUCTION_FIXTURES : undefined) === 'true';

    // 1. Explicit CATALOGUE_SOURCE specified
    if (rawSource) {
      const normalized = rawSource.toUpperCase().trim();
      if (normalized === 'FIXTURE') {
        if (nodeEnv === 'production' && !allowProdFixtures) {
          throw new CatalogueConfigurationError(
            'CATALOGUE_SOURCE=FIXTURE is not allowed in production without ALLOW_PRODUCTION_FIXTURES=true.'
          );
        }
        return new FixtureCatalogueProvider();
      }

      if (normalized === 'PERSISTENT') {
        return new PersistentCatalogueProvider();
      }

      // Any unknown value must fail immediately
      throw new CatalogueConfigurationError(
        `Invalid CATALOGUE_SOURCE: "${rawSource}". Supported values are 'FIXTURE' or 'PERSISTENT'.`
      );
    }

    // 2. Unset CATALOGUE_SOURCE
    if (nodeEnv === 'production') {
      if (allowProdFixtures) {
        return new FixtureCatalogueProvider();
      }
      throw new CatalogueConfigurationError(
        'CATALOGUE_SOURCE must be explicitly configured in production (e.g. CATALOGUE_SOURCE=PERSISTENT). Unconfigured production startup aborted.'
      );
    }

    // In development and test environments, default explicitly to Fixture provider
    return new FixtureCatalogueProvider();
  }
}
