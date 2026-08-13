export type ImportJobStatus = 
  | 'DRAFT' 
  | 'DISCOVERING' 
  | 'FETCHING' 
  | 'EXTRACTING' 
  | 'NORMALISING' 
  | 'RESOLVING' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'FAILED';

export type TrustLevel = 
  | 'LEVEL_1_OFFICIAL_MANUFACTURER'
  | 'LEVEL_2_OFFICIAL_INSTITUTION'
  | 'LEVEL_3_STRUCTURED_OPEN_DATA'
  | 'LEVEL_4_SPECIALIST_EDITORIAL'
  | 'LEVEL_5_COMMUNITY'
  | 'UNKNOWN';

export type ProviderStatus = 'LIVE' | 'MOCK' | 'NOT_CONFIGURED' | 'FAILED';

export type SourceVerificationStatus = 
  | 'DISCOVERED'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'INVALID_URL'
  | 'NOT_FOUND'
  | 'REDIRECT_MISMATCH'
  | 'ENTITY_MISMATCH'
  | 'SCOPE_MISMATCH'
  | 'RETRIEVAL_FAILED'
  | 'REJECTED';

export type EntityScope = 
  | 'EXACT_VARIANT'
  | 'GENERATION'
  | 'MODEL'
  | 'MAKER'
  | 'UNRELATED'
  | 'AMBIGUOUS';

export type AssertionVerificationStatus = 
  | 'DISCOVERED' 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CONFLICT' 
  | 'SUPERSEDED';

export type MediaEditorialStatus = 'ELIGIBLE' | 'NEEDS_REVIEW' | 'REJECTED' | 'APPROVED';

export type VideoType = 
  | 'OVERVIEW' 
  | 'ROAD_TEST' 
  | 'TECHNICAL' 
  | 'HISTORICAL' 
  | 'BUYING_GUIDE' 
  | 'AUCTION' 
  | 'RESTORATION' 
  | 'DRIVING';

export interface ImportJobLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  provider?: string;
  message: string;
}

export interface ImportJob {
  id: string;
  targetVariantId: string;
  status: ImportJobStatus;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  sourceCount: number;
  assertionCount: number;
  conflictCount: number;
  createdAt: string;
  updatedAt: string;
  mode?: 'LIVE' | 'MOCK';
  logs: ImportJobLog[];
}

export interface DataSource {
  id: string;
  jobId?: string;
  providerName: string;
  sourceTitle: string;
  sourceUrl: string;
  originalUrl?: string;
  finalUrl?: string;
  domain: string;
  sourceType: string;
  trustLevel: TrustLevel;
  licenceType?: string;
  commercialUseAllowed?: boolean;
  derivedDataAllowed?: boolean;
  attributionRequired?: boolean;
  retrievedAt: string;
  providerStatus: ProviderStatus;
  verificationStatus: SourceVerificationStatus;
  verificationReason?: string;
  entityScope?: EntityScope;
  httpStatus?: number;
  contentType?: string;
  pageTitle?: string;
  responseHash?: string;
  providerNativeId?: string;
  providerEvidence?: Record<string, any>;
  fieldsObtainedCount?: number;
}

export interface DataAssertion {
  id: string;
  jobId?: string;
  subjectEntityId: string;
  fieldName: string;
  rawValue: string;
  normalizedValue: string;
  unit?: string;
  sourceId: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceLocator?: string;
  citationTextRange?: string;
  evidenceExcerpt?: string;
  retrievedAt: string;
  confidenceScore: number; // 0 - 100
  verificationStatus: AssertionVerificationStatus;
  notes?: string;
  trustLevel: TrustLevel;
  isDerived?: boolean;
  editedBy?: string;
  editedAt?: string;
  previousRawValue?: string;
}

export interface DataConflict {
  id: string;
  jobId?: string;
  subjectEntityId: string;
  fieldName: string;
  assertionIds: string[];
  status: 'UNRESOLVED' | 'RESOLVED_APPROVED' | 'RESOLVED_REJECTED' | 'DIFFERENT_SCOPE';
  resolutionNotes?: string;
  resolvedAssertionId?: string;
}

export interface CanonicalFieldSelection {
  id: string;
  entityId: string;
  fieldName: string;
  selectedAssertionId: string;
  selectedBy: string;
  selectedAt: string;
  selectionReason?: string;
}

export interface EntityCandidate {
  id: string;
  jobId?: string;
  discoveredName: string;
  matchedVariantId?: string;
  confidenceScore: number;
  resolutionAction: 'LINK_EXISTING' | 'CREATE_CANDIDATE' | 'FLAG_AMBIGUOUS';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface MediaCandidate {
  id: string;
  jobId?: string;
  entityId: string;
  provider: string;
  fileUrl: string;
  sourcePageUrl: string;
  author?: string;
  licence?: string;
  licenceUrl?: string;
  attribution?: string;
  commercialUseAllowed?: boolean;
  derivativeUseAllowed?: boolean;
  shareAlike?: boolean;
  copyrightStatus?: string;
  editorialStatus: MediaEditorialStatus;
  imageRole?: 'hero' | 'front' | 'rear' | 'interior' | 'engine' | 'detail' | 'historic';
  title?: string;
}

export interface VideoCandidate {
  id: string;
  jobId?: string;
  entityId: string;
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  language?: string;
  videoType: VideoType;
  editorialStatus: 'NEEDS_REVIEW' | 'REJECTED' | 'APPROVED';
}

export interface KnowledgeGraphCandidate {
  id: string;
  jobId?: string;
  subjectEntityId: string;
  predicate: 'POWERED_BY' | 'DESIGNED_BY' | 'ENGINEERED_BY' | 'PRODUCED_AT';
  objectEntityName: string;
  objectEntityType: 'Engine' | 'Person' | 'Factory';
  confidenceScore: number;
  sourceId: string;
  editorialStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ImportMetrics {
  essentialFieldCount: number;
  autoPopulatedCount: number;
  missingCount: number;
  pendingReviewCount: number;
  approvedCount: number;
  conflictCount: number;
  automationCoveragePercent: number;
  authoritativeCoveragePercent: number;
  conflictRate: number;
  editorialApprovalRate: number;
  sourceCount: number;
  sourceCandidateCount: number;
  verifiedSourceCount: number;
  rejectedSourceCount: number;
  sourceVerificationRate: number;
  verifiedAutoPopulatedFieldCount: number;
  verifiedAutomationCoveragePercent: number;
  officialSourceCount: number;
  structuredOpenDataSourceCount: number;
  specialistSourceCount: number;
  communitySourceCount: number;
  imageCandidateCount: number;
  eligibleImageCount: number;
  videoCandidateCount: number;
}

export interface ProviderStatusInfo {
  providerName: string;
  status: ProviderStatus;
  trustLevel: TrustLevel;
  details?: string;
}
