import { SourceProviderAdapter, TargetVehicle, ProviderExecutionResult } from './providerTypes';
import { ProviderStatus, TrustLevel } from '../../types/importLab';

export class EuropeanaProviderAdapter implements SourceProviderAdapter {
  public providerName = 'Europeana Collections API';
  public defaultTrustLevel: TrustLevel = 'LEVEL_2_OFFICIAL_INSTITUTION';

  public async checkStatus(): Promise<ProviderStatus> {
    const key = process.env.EUROPEANA_API_KEY;
    return key ? 'LIVE' : 'NOT_CONFIGURED';
  }

  public async execute(target: TargetVehicle, mode: 'LIVE' | 'MOCK' = 'LIVE'): Promise<ProviderExecutionResult> {
    const logs: string[] = [];
    const status = await this.checkStatus();
    logs.push(`Europeana API status: ${status} (Key requirement: EUROPEANA_API_KEY).`);

    return {
      providerName: this.providerName,
      status,
      trustLevel: this.defaultTrustLevel,
      sources: [],
      assertions: [],
      media: [],
      videos: [],
      graphCandidates: [],
      logs
    };
  }
}
