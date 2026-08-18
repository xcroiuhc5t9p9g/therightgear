import { DataSource, DataAssertion, MediaCandidate, VideoCandidate, KnowledgeGraphCandidate, ProviderStatus, TrustLevel } from '../../types/importLab';

export interface TargetVehicle {
  id: string;
  manufacturerName: string; // e.g. 'BMW'
  modelName: string; // e.g. 'M3'
  generationCode: string; // e.g. 'E30'
  variantName: string; // e.g. 'M3 Sport Evolution'
}

export interface ProviderExecutionResult {
  providerName: string;
  status: ProviderStatus;
  trustLevel: TrustLevel;
  sources: Omit<DataSource, 'id'>[];
  assertions: Omit<DataAssertion, 'id'>[];
  media: Omit<MediaCandidate, 'id'>[];
  videos: Omit<VideoCandidate, 'id'>[];
  graphCandidates: Omit<KnowledgeGraphCandidate, 'id'>[];
  logs: string[];
}

export interface SourceProviderAdapter {
  providerName: string;
  defaultTrustLevel: TrustLevel;
  checkStatus(): Promise<ProviderStatus>;
  execute(target: TargetVehicle, mode?: 'LIVE' | 'MOCK'): Promise<ProviderExecutionResult>;
}
