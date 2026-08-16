import { Maker, MakerLogoAsset, AssetStatus, SourceProvider } from '../types';

export interface MakerLogoProvider {
  resolveLogo(maker: Maker): Promise<MakerLogoAsset>;
}

export class WikimediaMakerLogoProvider implements MakerLogoProvider {
  async resolveLogo(maker: Maker): Promise<MakerLogoAsset> {
    // TODO: Implement actual Wikidata entity resolution (no simple string matches)
    // TODO: Retrieve Wikidata property P154 (logo image)
    // TODO: Resolve corresponding Wikimedia Commons media asset (preserving SVG when available)
    // TODO: Validate asset and acquire/cache in TRG controlled asset layer
    // TODO: Return the newly cached internal TRG asset URL
    
    // UI Fixture fallback for current rendering compatibility
    if (maker.logo_url) {
      return {
        maker_id: maker.id,
        source_provider: 'WIKIMEDIA',
        asset_status: 'RESOLVED',
        internal_asset_url: maker.logo_url, // Temporary alias for existing fixture URL
        retrieved_at: new Date().toISOString()
      };
    }

    return {
      maker_id: maker.id,
      source_provider: 'WIKIMEDIA',
      asset_status: 'UNAVAILABLE',
      retrieved_at: new Date().toISOString()
    };
  }
}

export class OfficialMakerLogoProvider implements MakerLogoProvider {
  async resolveLogo(maker: Maker): Promise<MakerLogoAsset> {
    // TODO: Implement Official Maker source acquisition when Wikimedia fails
    
    return {
      maker_id: maker.id,
      source_provider: 'OFFICIAL',
      asset_status: 'UNAVAILABLE',
      retrieved_at: new Date().toISOString()
    };
  }
}

export class MakerLogoResolver {
  // PRIORITY 1: Wikimedia, PRIORITY 2: Official
  private providers: MakerLogoProvider[] = [
    new WikimediaMakerLogoProvider(),
    new OfficialMakerLogoProvider()
  ];

  /**
   * Resolves a Maker logo through the automated provider pipeline.
   * This is the single shared entry point for Maker logos across all UI consumers.
   */
  async resolve(maker: Maker): Promise<MakerLogoAsset> {
    for (const provider of this.providers) {
      try {
        const asset = await provider.resolveLogo(maker);
        if (asset.asset_status === 'RESOLVED' && asset.internal_asset_url) {
          return asset;
        }
      } catch (error) {
        // Safe failure: suppress and move to next provider
        console.warn(`Provider resolution failed safely for maker ${maker.slug}:`, error);
      }
    }

    // Final safe failure: UNAVAILABLE status, UI must render clean text fallback.
    return {
      maker_id: maker.id,
      source_provider: 'WIKIMEDIA', 
      asset_status: 'UNAVAILABLE',
      retrieved_at: new Date().toISOString()
    };
  }
}

export const makerLogoResolver = new MakerLogoResolver();
