import React, { useState, useEffect } from 'react';
import {
  ImportJob,
  DataAssertion,
  DataConflict,
  DataSource,
  MediaCandidate,
  VideoCandidate,
  KnowledgeGraphCandidate,
  ImportMetrics
} from '../types/importLab';
import { ESSENTIAL_FIELDS } from '../data/importLabSpecs';
import { importLabStore } from '../services/importLabStore';
import {
  Database,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileText,
  Eye,
  Layers,
  Cpu,
  Tv,
  Image as ImageIcon,
  Share2,
  Lock,
  ArrowRight
} from 'lucide-react';

export function ImportLabPage() {
  const [targetVariantId] = useState<string>('bmw-m3-e30-sport-evolution');
  const [currentJob, setCurrentJob] = useState<ImportJob | null>(null);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [assertions, setAssertions] = useState<DataAssertion[]>([]);
  const [conflicts, setConflicts] = useState<DataConflict[]>([]);
  const [media, setMedia] = useState<MediaCandidate[]>([]);
  const [videos, setVideos] = useState<VideoCandidate[]>([]);
  const [graphCandidates, setGraphCandidates] = useState<KnowledgeGraphCandidate[]>([]);
  const [metrics, setMetrics] = useState<ImportMetrics | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'review' | 'sources' | 'media' | 'graph' | 'logs'>('review');

  // Preview Modal
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // Edit Modal State
  const [editingAssertion, setEditingAssertion] = useState<DataAssertion | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Conflict Resolution Modal State
  const [resolvingConflict, setResolvingConflict] = useState<DataConflict | null>(null);

  // Auto-load latest job or create on mount
  useEffect(() => {
    // Add noindex meta tag dynamically for editorial pages
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    loadLatestJob();
  }, []);

  const loadJobData = (jobId: string) => {
    const job = importLabStore.getJob(jobId);
    if (job) {
      setCurrentJob(job);
      setSources(importLabStore.getDataSourcesForJob(jobId));
      setAssertions(importLabStore.getAssertionsForJob(jobId));
      setConflicts(importLabStore.getConflictsForJob(jobId));
      setMedia(importLabStore.getMediaCandidatesForJob(jobId));
      setVideos(importLabStore.getVideoCandidatesForJob(jobId));
      setGraphCandidates(importLabStore.getGraphCandidatesForJob(jobId));
      setMetrics(importLabStore.calculateMetrics(jobId));
    }
  };

  const loadLatestJob = () => {
    const jobs = importLabStore.getAllJobs();
    if (jobs.length > 0) {
      loadJobData(jobs[jobs.length - 1].id);
    }
  };

  const handleRunImport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/import-lab/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVariantId, mode: 'LIVE' })
      });
      const data = await res.json();
      if (data.job) {
        loadJobData(data.job.id);
      }
    } catch (err) {
      console.error('Import execution failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAssertion = (assertionId: string) => {
    if (!currentJob) return;
    importLabStore.updateAssertion(currentJob.id, assertionId, { verificationStatus: 'APPROVED' });
    const ast = assertions.find(a => a.id === assertionId);
    if (ast) {
      importLabStore.setCanonicalSelection({
        entityId: ast.subjectEntityId,
        fieldName: ast.fieldName,
        selectedAssertionId: assertionId,
        selectedBy: 'Editorial Board',
        selectedAt: new Date().toISOString(),
        selectionReason: 'Approved during manual review in Import Lab v0.1'
      });
    }
    loadJobData(currentJob.id);
  };

  const handleRejectAssertion = (assertionId: string) => {
    if (!currentJob) return;
    importLabStore.updateAssertion(currentJob.id, assertionId, { verificationStatus: 'REJECTED' });
    loadJobData(currentJob.id);
  };

  const handleSaveEdit = () => {
    if (!currentJob || !editingAssertion) return;
    importLabStore.updateAssertion(currentJob.id, editingAssertion.id, {
      normalizedValue: editValue,
      editedBy: 'Editorial Board',
      editedAt: new Date().toISOString(),
      previousRawValue: editingAssertion.rawValue
    });
    setEditingAssertion(null);
    loadJobData(currentJob.id);
  };

  const handleResolveConflict = (approvedAssertionId: string) => {
    if (!currentJob || !resolvingConflict) return;
    importLabStore.resolveConflict(currentJob.id, resolvingConflict.id, approvedAssertionId, 'Resolved via Import Lab conflict modal');

    const approvedAst = assertions.find(a => a.id === approvedAssertionId);
    if (approvedAst) {
      importLabStore.setCanonicalSelection({
        entityId: approvedAst.subjectEntityId,
        fieldName: approvedAst.fieldName,
        selectedAssertionId: approvedAssertionId,
        selectedBy: 'Editorial Board',
        selectedAt: new Date().toISOString(),
        selectionReason: `Conflict ${resolvingConflict.id} resolved by editor`
      });
    }

    setResolvingConflict(null);
    loadJobData(currentJob.id);
  };

  // Group assertions by section
  const sections = ['IDENTITY', 'ENGINE', 'TRANSMISSION', 'DIMENSIONS', 'WEIGHT', 'PERFORMANCE', 'PRODUCTION', 'HISTORY', 'CONFIGURATION'] as const;

  const filteredAssertions = assertions.filter(ast => {
    if (activeSectionFilter === 'ALL') return true;
    const spec = ESSENTIAL_FIELDS.find(f => f.key === ast.fieldName);
    return spec?.section === activeSectionFilter;
  });

  const canonicalApprovedData = importLabStore.getApprovedCanonicalData(targetVariantId);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Editorial Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Database size={180} className="text-red-500" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/60">
                Editorial Tool
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 flex items-center gap-1">
                <Lock size={12} /> No SEO Indexing
              </span>
              <span className="text-xs text-slate-500">v0.1 Execution Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              THE RIGHT GEAR — Import Lab
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Empirical automatic automotive data acquisition test for canonical entity records with 100% source provenance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition flex items-center gap-2"
            >
              <Eye size={16} /> Public Preview Mode
            </button>
            <button
              onClick={handleRunImport}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-red-950/50 transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Discovering & Extracting...
                </>
              ) : (
                <>
                  <Play size={16} /> DISCOVER DATA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Target Vehicle Summary Card */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 uppercase tracking-wider font-medium text-[10px]">Maker</div>
            <div className="text-slate-200 font-semibold mt-0.5">BMW</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 uppercase tracking-wider font-medium text-[10px]">Model</div>
            <div className="text-slate-200 font-semibold mt-0.5">M3</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 uppercase tracking-wider font-medium text-[10px]">Generation</div>
            <div className="text-slate-200 font-semibold mt-0.5">E30</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 uppercase tracking-wider font-medium text-[10px]">Variant Scope</div>
            <div className="text-red-400 font-semibold mt-0.5">M3 Sport Evolution</div>
          </div>
        </div>
      </div>

      {/* Pipeline Execution Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers size={16} className="text-red-500" /> Pipeline State Machine Progress
          </h2>
          {currentJob && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              currentJob.status === 'REVIEW' || currentJob.status === 'APPROVED' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
              currentJob.status === 'FAILED' ? 'bg-red-950 text-red-400 border border-red-800' :
              'bg-blue-950 text-blue-400 border border-blue-800 animate-pulse'
            }`}>
              Status: {currentJob.status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { step: '1. Discovering', code: 'DISCOVERING' },
            { step: '2. Fetching', code: 'FETCHING' },
            { step: '3. Extracting', code: 'EXTRACTING' },
            { step: '4. Normalising', code: 'NORMALISING' },
            { step: '5. Resolving', code: 'RESOLVING' },
            { step: '6. Conflicts', code: 'RESOLVING' },
            { step: '7. Review', code: 'REVIEW' }
          ].map((s, idx) => {
            const isCompleted = currentJob && (currentJob.status === 'REVIEW' || currentJob.status === 'APPROVED');
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition ${
                  isCompleted
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="font-semibold text-[11px]">{s.step}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automation Coverage & Quality Metrics Dashboard */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
            <div className="text-slate-400 text-xs uppercase tracking-wider font-medium">Automation Coverage</div>
            <div className="text-3xl font-extrabold text-red-400 mt-2">{metrics.automationCoveragePercent}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.autoPopulatedCount} of {metrics.essentialFieldCount} Essential Fields populated automatically
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
            <div className="text-slate-400 text-xs uppercase tracking-wider font-medium">Authoritative Coverage</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">{metrics.authoritativeCoveragePercent}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.officialSourceCount + metrics.structuredOpenDataSourceCount} Official & Open Data Sources attached
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
            <div className="text-slate-400 text-xs uppercase tracking-wider font-medium">Unresolved Conflicts</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-2">{metrics.conflictCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              Conflict rate: {(metrics.conflictRate * 100).toFixed(1)}% across competing sources
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
            <div className="text-slate-400 text-xs uppercase tracking-wider font-medium">Editorial Approval</div>
            <div className="text-3xl font-extrabold text-blue-400 mt-2">{metrics.approvedCount} / {metrics.autoPopulatedCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.pendingReviewCount} assertions pending editorial review
            </p>
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('review')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'review'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText size={16} /> Fact Assertions ({assertions.length})
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'sources'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck size={16} /> Source Directory ({sources.length})
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'media'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon size={16} /> Media & Video ({media.length + videos.length})
        </button>
        <button
          onClick={() => setActiveTab('graph')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'graph'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 size={16} /> Knowledge Graph DNA ({graphCandidates.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'logs'
              ? 'border-red-500 text-red-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu size={16} /> Pipeline Logs
        </button>
      </div>

      {/* TAB 1: FACT ASSERTIONS REVIEW */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          
          {/* Section Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setActiveSectionFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                activeSectionFilter === 'ALL'
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              All Sections
            </button>
            {sections.map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSectionFilter(sec)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                  activeSectionFilter === sec
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Assertions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Field</th>
                    <th className="py-3 px-4">Extracted Raw</th>
                    <th className="py-3 px-4">Normalized Value</th>
                    <th className="py-3 px-4">Web Source & Trust</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Editorial Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAssertions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No assertions extracted for selected filter. Click [ DISCOVER DATA ] to execute acquisition.
                      </td>
                    </tr>
                  ) : (
                    filteredAssertions.map((ast) => {
                      const hasConflict = conflicts.some(c => c.fieldName === ast.fieldName && c.status === 'UNRESOLVED');
                      return (
                        <tr key={ast.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-semibold text-slate-200">
                            {ast.fieldName}
                          </td>
                          <td className="py-3 px-4 text-slate-400 max-w-[180px] truncate">
                            {ast.rawValue}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                            {ast.normalizedValue} {ast.unit || ''}
                          </td>
                          <td className="py-3 px-4 max-w-[220px]">
                            <a
                              href={ast.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1 truncate font-medium"
                            >
                              {ast.sourceTitle} <ExternalLink size={11} />
                            </a>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {ast.trustLevel.replace('LEVEL_', 'L')}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-300">
                            {ast.confidenceScore}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              ast.verificationStatus === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              ast.verificationStatus === 'REJECTED' ? 'bg-slate-800 text-slate-500 border border-slate-700' :
                              ast.verificationStatus === 'CONFLICT' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-blue-950 text-blue-400 border border-blue-800'
                            }`}>
                              {ast.verificationStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {ast.verificationStatus !== 'APPROVED' && (
                              <button
                                onClick={() => handleApproveAssertion(ast.id)}
                                className="px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-medium text-[11px] transition inline-flex items-center gap-1"
                              >
                                <CheckCircle2 size={12} /> Approve
                              </button>
                            )}

                            {hasConflict && (
                              <button
                                onClick={() => {
                                  const cfl = conflicts.find(c => c.fieldName === ast.fieldName);
                                  if (cfl) setResolvingConflict(cfl);
                                }}
                                className="px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700 font-medium text-[11px] transition inline-flex items-center gap-1"
                              >
                                <AlertTriangle size={12} /> Resolve Conflict
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setEditingAssertion(ast);
                                setEditValue(ast.normalizedValue);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-[11px] transition"
                            >
                              Edit
                            </button>

                            {ast.verificationStatus !== 'REJECTED' && (
                              <button
                                onClick={() => handleRejectAssertion(ast.id)}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-700 font-medium text-[11px] transition"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOURCES DIRECTORY */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map(src => (
              <div key={src.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800">
                      {src.trustLevel}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Provider: {src.providerName}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-100 text-sm mb-1">{src.sourceTitle}</h3>
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 mb-3"
                  >
                    {src.sourceUrl} <ExternalLink size={11} />
                  </a>
                  <div className="text-xs text-slate-400 space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <div><strong>Domain:</strong> {src.domain}</div>
                    <div><strong>Type:</strong> {src.sourceType}</div>
                    <div><strong>Licence:</strong> {src.licenceType || 'Not specified'}</div>
                    <div><strong>Retrieved At:</strong> {new Date(src.retrievedAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Fields obtained: <strong>{src.fieldsObtainedCount || 0}</strong></span>
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium inline-flex items-center gap-1"
                  >
                    Visit Source <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEDIA & VIDEO */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-red-500" /> Open Media Candidates (Wikimedia Commons)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map(m => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="h-44 overflow-hidden relative bg-slate-950">
                      <img src={m.fileUrl} alt={m.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/80 text-slate-200">
                        {m.imageRole || 'candidate'}
                      </span>
                    </div>
                    <div className="p-4 space-y-2 text-xs text-slate-300">
                      <h4 className="font-semibold text-slate-100">{m.title}</h4>
                      <div><strong>Author:</strong> {m.author}</div>
                      <div><strong>Licence:</strong> {m.licence} ({m.copyrightStatus})</div>
                      <div className="text-slate-400 text-[11px]">
                        <strong>Attribution:</strong> {m.attribution}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                    <a
                      href={m.sourcePageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Source Page <ExternalLink size={11} />
                    </a>
                    <button className="px-3 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-medium text-xs">
                      Approve Media
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Tv size={16} className="text-red-500" /> Video Candidates (YouTube)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map(v => (
                <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex gap-4">
                  <div className="w-36 h-24 rounded bg-slate-950 flex-shrink-0 overflow-hidden relative">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-600 text-white">
                      {v.videoType}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-200 line-clamp-2">{v.title}</h4>
                      <div className="text-slate-400 mt-1">Channel: {v.channel}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        Status: {v.editorialStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KNOWLEDGE GRAPH DNA CANDIDATES */}
      {activeTab === 'graph' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Share2 size={16} className="text-red-500" /> Discovered Automotive Knowledge Graph Relationships
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {graphCandidates.map(kg => (
                <div key={kg.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400 font-mono text-[11px]">
                      BMW M3 Sport Evolution <span className="text-red-400 font-bold">[{kg.predicate}]</span>
                    </div>
                    <div className="text-sm font-bold text-slate-100">{kg.objectEntityName} ({kg.objectEntityType})</div>
                    <div className="text-[10px] text-slate-500">Confidence: {kg.confidenceScore}%</div>
                  </div>

                  <button className="px-3 py-1.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-medium text-xs">
                    Approve Relation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-96 overflow-y-auto">
          {(currentJob?.logs || []).map((l, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-slate-600">{new Date(l.timestamp).toLocaleTimeString()}</span>
              <span className={`font-bold ${l.level === 'error' ? 'text-red-400' : l.level === 'warn' ? 'text-amber-400' : 'text-blue-400'}`}>
                [{l.level.toUpperCase()}]
              </span>
              {l.provider && <span className="text-slate-500">({l.provider}):</span>}
              <span className="text-slate-300">{l.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: EDIT ASSERTION */}
      {editingAssertion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Edit Assertion Value</h3>
            <p className="text-xs text-slate-400">
              Field: <strong>{editingAssertion.fieldName}</strong> (Raw: <em>{editingAssertion.rawValue}</em>)
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Normalized Value</label>
              <input
                type="text"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingAssertion(null)}
                className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded bg-red-600 text-white text-xs font-semibold"
              >
                Save & Approve Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESOLVE CONFLICT */}
      {resolvingConflict && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
              <AlertTriangle size={20} /> Resolve Competing Source Values
            </div>
            <p className="text-xs text-slate-300">
              Conflict detected for field <strong>{resolvingConflict.fieldName}</strong> across multiple web sources. Select the canonical assertion value:
            </p>

            <div className="space-y-3">
              {(resolvingConflict?.assertionIds || []).map(astId => {
                const ast = assertions.find(a => a.id === astId);
                if (!ast) return null;
                return (
                  <div key={astId} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono text-emerald-400 font-bold text-sm">
                        {ast.normalizedValue} {ast.unit || ''}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{ast.sourceTitle}</div>
                      <div className="text-[10px] text-slate-500">{ast.trustLevel}</div>
                    </div>
                    <button
                      onClick={() => handleResolveConflict(ast.id)}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                    >
                      Select Canonical
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setResolvingConflict(null)}
                className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PUBLIC PREVIEW MODE */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Public Preview
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  BMW M3 Sport Evolution (E30)
                </h2>
                <p className="text-xs text-slate-400">
                  Renders ONLY editorially approved canonical data. Unapproved fields remain hidden or flagged under research.
                </p>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>

            {/* Public Spec Grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Approved Technical Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {ESSENTIAL_FIELDS.slice(0, 18).map(field => {
                  const approvedItem = canonicalApprovedData[field.key];
                  return (
                    <div key={field.key} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-500 font-medium text-[10px]">{field.label}</div>
                      {approvedItem ? (
                        <div className="text-emerald-400 font-semibold mt-1">
                          {approvedItem.value} {approvedItem.unit || ''}
                        </div>
                      ) : (
                        <div className="text-slate-600 italic text-[11px] mt-1">
                          Data currently under research
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">Data Provenance Guarantee:</div>
              <p>
                Every published specification in The Right Gear is backed by verified manufacturer archives or open research data. Unapproved predictions from AI models are strictly blocked from public view.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
