import {
  ImportJob,
  ImportJobStatus,
  ImportJobLog,
  DataSource,
  DataAssertion,
  DataConflict,
  CanonicalFieldSelection,
  EntityCandidate,
  MediaCandidate,
  VideoCandidate,
  KnowledgeGraphCandidate,
  ImportMetrics,
  TrustLevel
} from '../types/importLab';
import { ESSENTIAL_FIELDS, ESSENTIAL_FIELD_KEYS } from '../data/importLabSpecs';

export class ImportLabStore {
  // Label persistence state internally as IN_MEMORY
  public readonly persistenceMode = 'IN_MEMORY';

  private jobs: Map<string, ImportJob> = new Map();
  private dataSources: Map<string, DataSource[]> = new Map(); // jobId -> DataSource[]
  private assertions: Map<string, DataAssertion[]> = new Map(); // jobId -> DataAssertion[]
  private conflicts: Map<string, DataConflict[]> = new Map(); // jobId -> DataConflict[]
  private canonicalSelections: Map<string, CanonicalFieldSelection[]> = new Map(); // entityId -> CanonicalFieldSelection[]
  private entityCandidates: Map<string, EntityCandidate[]> = new Map(); // jobId -> EntityCandidate[]
  private mediaCandidates: Map<string, MediaCandidate[]> = new Map(); // jobId -> MediaCandidate[]
  private videoCandidates: Map<string, VideoCandidate[]> = new Map(); // jobId -> VideoCandidate[]
  private graphCandidates: Map<string, KnowledgeGraphCandidate[]> = new Map(); // jobId -> KnowledgeGraphCandidate[]

  // --- IMPORT JOBS ---
  public createJob(targetVariantId: string, mode: 'LIVE' | 'MOCK' = 'LIVE'): ImportJob {
    const id = `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const job: ImportJob = {
      id,
      targetVariantId,
      status: 'DRAFT',
      startedAt: null,
      completedAt: null,
      errorMessage: null,
      sourceCount: 0,
      assertionCount: 0,
      conflictCount: 0,
      createdAt: now,
      updatedAt: now,
      mode,
      logs: [
        {
          timestamp: now,
          level: 'info',
          message: `ImportJob ${id} created for target variant '${targetVariantId}' in mode '${mode}' (Persistence: IN_MEMORY).`
        }
      ]
    };

    this.jobs.set(id, job);
    this.dataSources.set(id, []);
    this.assertions.set(id, []);
    this.conflicts.set(id, []);
    this.entityCandidates.set(id, []);
    this.mediaCandidates.set(id, []);
    this.videoCandidates.set(id, []);
    this.graphCandidates.set(id, []);

    return { ...job };
  }

  public getJob(jobId: string): ImportJob | undefined {
    const job = this.jobs.get(jobId);
    return job ? { ...job } : undefined;
  }

  public getAllJobs(): ImportJob[] {
    return Array.from(this.jobs.values()).map(j => ({ ...j }));
  }

  public updateJob(jobId: string, updates: Partial<ImportJob>): ImportJob | undefined {
    const job = this.jobs.get(jobId);
    if (!job) return undefined;

    const updatedJob: ImportJob = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.jobs.set(jobId, updatedJob);
    return { ...updatedJob };
  }

  public addJobLog(jobId: string, log: Omit<ImportJobLog, 'timestamp'>): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.logs.push({
      timestamp: new Date().toISOString(),
      ...log
    });
    job.updatedAt = new Date().toISOString();
  }

  // --- DATA SOURCES ---
  public addDataSource(jobId: string, sourceInput: Omit<DataSource, 'id'>): DataSource {
    const id = `src-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const source: DataSource = {
      id,
      jobId,
      ...sourceInput
    };

    const sources = this.dataSources.get(jobId) || [];
    sources.push(source);
    this.dataSources.set(jobId, sources);

    // Update job counter
    const job = this.jobs.get(jobId);
    if (job) {
      job.sourceCount = sources.length;
    }

    return { ...source };
  }

  public getDataSourcesForJob(jobId: string): DataSource[] {
    return (this.dataSources.get(jobId) || []).map(s => ({ ...s }));
  }

  // --- DATA ASSERTIONS ---
  public addAssertion(jobId: string, assertionInput: Omit<DataAssertion, 'id'>): DataAssertion {
    const id = `ast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const assertion: DataAssertion = {
      id,
      jobId,
      ...assertionInput
    };

    const assertionsList = this.assertions.get(jobId) || [];
    assertionsList.push(assertion);
    this.assertions.set(jobId, assertionsList);

    // Update job counter
    const job = this.jobs.get(jobId);
    if (job) {
      job.assertionCount = assertionsList.length;
    }

    return { ...assertion };
  }

  public getAssertionsForJob(jobId: string): DataAssertion[] {
    return (this.assertions.get(jobId) || []).map(a => ({ ...a }));
  }

  public updateAssertion(jobId: string, assertionId: string, updates: Partial<DataAssertion>): DataAssertion | undefined {
    const assertionsList = this.assertions.get(jobId) || [];
    const index = assertionsList.findIndex(a => a.id === assertionId);
    if (index === -1) return undefined;

    const existing = assertionsList[index];
    const updated: DataAssertion = {
      ...existing,
      ...updates
    };

    assertionsList[index] = updated;
    this.assertions.set(jobId, assertionsList);

    return { ...updated };
  }

  // --- CONFLICTS ---
  public addConflict(jobId: string, conflictInput: Omit<DataConflict, 'id'>): DataConflict {
    const id = `cfl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const conflict: DataConflict = {
      id,
      jobId,
      ...conflictInput
    };

    const conflictsList = this.conflicts.get(jobId) || [];
    conflictsList.push(conflict);
    this.conflicts.set(jobId, conflictsList);

    const job = this.jobs.get(jobId);
    if (job) {
      job.conflictCount = conflictsList.filter(c => c.status === 'UNRESOLVED').length;
    }

    return { ...conflict };
  }

  public getConflictsForJob(jobId: string): DataConflict[] {
    return (this.conflicts.get(jobId) || []).map(c => ({ ...c }));
  }

  public resolveConflict(
    jobId: string,
    conflictId: string,
    approvedAssertionId: string,
    notes?: string
  ): DataConflict | undefined {
    const conflictsList = this.conflicts.get(jobId) || [];
    const conflict = conflictsList.find(c => c.id === conflictId);
    if (!conflict) return undefined;

    conflict.status = 'RESOLVED_APPROVED';
    conflict.resolvedAssertionId = approvedAssertionId;
    conflict.resolutionNotes = notes;

    // Update assertions
    const assertionsList = this.assertions.get(jobId) || [];
    for (const aId of conflict.assertionIds) {
      const ast = assertionsList.find(a => a.id === aId);
      if (ast) {
        if (aId === approvedAssertionId) {
          ast.verificationStatus = 'APPROVED';
        } else {
          ast.verificationStatus = 'SUPERSEDED';
        }
      }
    }

    // Recalculate conflict count
    const job = this.jobs.get(jobId);
    if (job) {
      job.conflictCount = conflictsList.filter(c => c.status === 'UNRESOLVED').length;
    }

    return { ...conflict };
  }

  // --- CANONICAL SELECTIONS ---
  public setCanonicalSelection(selectionInput: Omit<CanonicalFieldSelection, 'id'>): CanonicalFieldSelection {
    const id = `can-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const selection: CanonicalFieldSelection = {
      id,
      ...selectionInput
    };

    const entitySelections = this.canonicalSelections.get(selectionInput.entityId) || [];
    // Remove previous selection for same field if present
    const filtered = entitySelections.filter(s => s.fieldName !== selectionInput.fieldName);
    filtered.push(selection);
    this.canonicalSelections.set(selectionInput.entityId, filtered);

    return { ...selection };
  }

  public getCanonicalSelections(entityId: string): CanonicalFieldSelection[] {
    return (this.canonicalSelections.get(entityId) || []).map(s => ({ ...s }));
  }

  // --- MEDIA & VIDEO CANDIDATES ---
  public addMediaCandidate(jobId: string, mediaInput: Omit<MediaCandidate, 'id'>): MediaCandidate {
    const id = `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const media: MediaCandidate = { id, jobId, ...mediaInput };
    const list = this.mediaCandidates.get(jobId) || [];
    list.push(media);
    this.mediaCandidates.set(jobId, list);
    return { ...media };
  }

  public getMediaCandidatesForJob(jobId: string): MediaCandidate[] {
    return (this.mediaCandidates.get(jobId) || []).map(m => ({ ...m }));
  }

  public updateMediaStatus(jobId: string, mediaId: string, status: MediaCandidate['editorialStatus']): void {
    const list = this.mediaCandidates.get(jobId) || [];
    const item = list.find(m => m.id === mediaId);
    if (item) item.editorialStatus = status;
  }

  public addVideoCandidate(jobId: string, videoInput: Omit<VideoCandidate, 'id'>): VideoCandidate {
    const id = `vid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const video: VideoCandidate = { id, jobId, ...videoInput };
    const list = this.videoCandidates.get(jobId) || [];
    list.push(video);
    this.videoCandidates.set(jobId, list);
    return { ...video };
  }

  public getVideoCandidatesForJob(jobId: string): VideoCandidate[] {
    return (this.videoCandidates.get(jobId) || []).map(v => ({ ...v }));
  }

  // --- KNOWLEDGE GRAPH CANDIDATES ---
  public addGraphCandidate(jobId: string, graphInput: Omit<KnowledgeGraphCandidate, 'id'>): KnowledgeGraphCandidate {
    const id = `kg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const item: KnowledgeGraphCandidate = { id, jobId, ...graphInput };
    const list = this.graphCandidates.get(jobId) || [];
    list.push(item);
    this.graphCandidates.set(jobId, list);
    return { ...item };
  }

  public getGraphCandidatesForJob(jobId: string): KnowledgeGraphCandidate[] {
    return (this.graphCandidates.get(jobId) || []).map(g => ({ ...g }));
  }

  // --- PUBLIC CANONICAL DATA PREVIEW RETRIEVAL ---
  /**
   * CRITICAL RULE: "Only APPROVED canonical data may appear in public preview."
   * Unapproved values must NOT leak from Import Lab into public preview.
   */
  public getApprovedCanonicalData(variantId: string): Record<string, { value: string; unit?: string; sourceTitle?: string; sourceUrl?: string; trustLevel?: TrustLevel }> {
    const selections = this.getCanonicalSelections(variantId);
    const result: Record<string, { value: string; unit?: string; sourceTitle?: string; sourceUrl?: string; trustLevel?: TrustLevel }> = {};

    // Search all jobs for assertions matching selectedAssertionId
    for (const [_, assertionsList] of this.assertions.entries()) {
      for (const sel of selections) {
        const matchingAst = assertionsList.find(a => a.id === sel.selectedAssertionId && a.verificationStatus === 'APPROVED');
        if (matchingAst) {
          result[sel.fieldName] = {
            value: matchingAst.normalizedValue || matchingAst.rawValue,
            unit: matchingAst.unit,
            sourceTitle: matchingAst.sourceTitle,
            sourceUrl: matchingAst.sourceUrl,
            trustLevel: matchingAst.trustLevel
          };
        }
      }
    }

    return result;
  }

  public clearStore(): void {
    this.jobs.clear();
    this.dataSources.clear();
    this.assertions.clear();
    this.conflicts.clear();
    this.canonicalSelections.clear();
    this.entityCandidates.clear();
    this.mediaCandidates.clear();
    this.videoCandidates.clear();
    this.graphCandidates.clear();
  }

  // --- DYNAMIC METRICS CALCULATION ---
  public calculateMetrics(jobId: string): ImportMetrics {
    const assertions = this.assertions.get(jobId) || [];
    const sources = this.dataSources.get(jobId) || [];
    const conflicts = this.conflicts.get(jobId) || [];
    const media = this.mediaCandidates.get(jobId) || [];
    const videos = this.videoCandidates.get(jobId) || [];

    const essentialFieldCount = ESSENTIAL_FIELD_KEYS.length; // 43

    const sourceCandidateCount = sources.length;
    const verifiedSources = sources.filter(s => s.verificationStatus === 'VERIFIED');
    const verifiedSourceCount = verifiedSources.length;
    const rejectedSourceCount = sources.filter(s => s.verificationStatus !== 'VERIFIED' && s.verificationStatus !== 'DISCOVERED' && s.verificationStatus !== 'VERIFYING').length;
    const sourceVerificationRate = sourceCandidateCount > 0 ? parseFloat((verifiedSourceCount / sourceCandidateCount).toFixed(3)) : 0;

    const verifiedSourceUrls = new Set(verifiedSources.map(s => s.sourceUrl));

    // Find distinct essential fields that have at least one assertion from a VERIFIED source
    const fieldsWithVerifiedAssertion = new Set<string>();
    const fieldsWithAssertion = new Set<string>();
    const fieldsWithAuthAssertion = new Set<string>();

    const authoritativeTrusts: TrustLevel[] = [
      'LEVEL_1_OFFICIAL_MANUFACTURER',
      'LEVEL_2_OFFICIAL_INSTITUTION',
      'LEVEL_3_STRUCTURED_OPEN_DATA'
    ];

    for (const ast of assertions) {
      if (ESSENTIAL_FIELD_KEYS.includes(ast.fieldName)) {
        fieldsWithAssertion.add(ast.fieldName);
        if (verifiedSourceUrls.has(ast.sourceUrl)) {
          fieldsWithVerifiedAssertion.add(ast.fieldName);
        }
        if (
          authoritativeTrusts.includes(ast.trustLevel) &&
          ast.trustLevel !== 'LEVEL_4_SPECIALIST_EDITORIAL' &&
          verifiedSourceUrls.has(ast.sourceUrl)
        ) {
          const src = verifiedSources.find(s => s.sourceUrl === ast.sourceUrl);
          if (!src || (src.sourceType !== 'Open Media Repository' && src.sourceType !== 'Video Streaming Platform')) {
            fieldsWithAuthAssertion.add(ast.fieldName);
          }
        }
      }
    }

    const autoPopulatedCount = fieldsWithAssertion.size;
    const verifiedAutoPopulatedFieldCount = fieldsWithVerifiedAssertion.size;
    const verifiedAutomationCoveragePercent = parseFloat(((verifiedAutoPopulatedFieldCount / essentialFieldCount) * 100).toFixed(1));
    const missingCount = Math.max(0, essentialFieldCount - autoPopulatedCount);
    const pendingReviewCount = assertions.filter(a => a.verificationStatus === 'PENDING_REVIEW').length;
    const approvedCount = assertions.filter(a => a.verificationStatus === 'APPROVED').length;
    const unresolvedConflictsCount = conflicts.filter(c => c.status === 'UNRESOLVED').length;

    const automationCoveragePercent = parseFloat(((autoPopulatedCount / essentialFieldCount) * 100).toFixed(1));
    const authoritativeCoveragePercent = parseFloat(((fieldsWithAuthAssertion.size / essentialFieldCount) * 100).toFixed(1));
    const conflictRate = autoPopulatedCount > 0 ? parseFloat((unresolvedConflictsCount / autoPopulatedCount).toFixed(3)) : 0;
    const editorialApprovalRate = autoPopulatedCount > 0 ? parseFloat((approvedCount / autoPopulatedCount).toFixed(3)) : 0;

    const officialSourceCount = verifiedSources.filter(s => s.trustLevel === 'LEVEL_1_OFFICIAL_MANUFACTURER' || s.trustLevel === 'LEVEL_2_OFFICIAL_INSTITUTION').length;
    const structuredOpenDataSourceCount = verifiedSources.filter(s => s.trustLevel === 'LEVEL_3_STRUCTURED_OPEN_DATA').length;
    const specialistSourceCount = verifiedSources.filter(s => s.trustLevel === 'LEVEL_4_SPECIALIST_EDITORIAL').length;
    const communitySourceCount = verifiedSources.filter(s => s.trustLevel === 'LEVEL_5_COMMUNITY' || s.trustLevel === 'UNKNOWN').length;

    const eligibleImageCount = media.filter(m => m.editorialStatus === 'ELIGIBLE' || m.editorialStatus === 'APPROVED').length;

    return {
      essentialFieldCount,
      autoPopulatedCount,
      missingCount,
      pendingReviewCount,
      approvedCount,
      conflictCount: unresolvedConflictsCount,
      automationCoveragePercent,
      authoritativeCoveragePercent,
      conflictRate,
      editorialApprovalRate,
      sourceCount: sources.length,
      sourceCandidateCount,
      verifiedSourceCount,
      rejectedSourceCount,
      sourceVerificationRate,
      verifiedAutoPopulatedFieldCount,
      verifiedAutomationCoveragePercent,
      officialSourceCount,
      structuredOpenDataSourceCount,
      specialistSourceCount,
      communitySourceCount,
      imageCandidateCount: media.length,
      eligibleImageCount,
      videoCandidateCount: videos.length
    };
  }
}

export const importLabStore = new ImportLabStore();
