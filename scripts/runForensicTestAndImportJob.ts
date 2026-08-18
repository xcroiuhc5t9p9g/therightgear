import { importEngine } from '../src/services/importProviders/importEngine';
import { importLabStore } from '../src/services/importLabStore';
import { runSourceIntegrityTestSuite } from '../src/tests/sourceIntegrity.test';

async function main() {
  console.log('====================================================');
  console.log('1. CLEARING PREVIOUS IMPORT JOB STATE');
  console.log('====================================================');
  importLabStore.clearStore();
  console.log('Cleared all previous ephemeral import jobs, sources, and assertions.\n');

  console.log('====================================================');
  console.log('2. RUNNING SOURCE INTEGRITY SUITE');
  console.log('====================================================');
  await runSourceIntegrityTestSuite();

  console.log('====================================================');
  console.log('3. EXECUTING LIVE VERIFIED IMPORT JOB FOR BMW M3 E30 SPORT EVOLUTION');
  console.log('====================================================');
  
  const job = await importEngine.executeImportJob('bmw-m3-e30-sport-evolution', { mode: 'LIVE' });
  const metrics = importLabStore.calculateMetrics(job.id);
  const sources = importLabStore.getDataSourcesForJob(job.id);
  const assertions = importLabStore.getAssertionsForJob(job.id);
  const conflicts = importLabStore.getConflictsForJob(job.id);
  const media = importLabStore.getMediaCandidatesForJob(job.id);
  const videos = importLabStore.getVideoCandidatesForJob(job.id);

  console.log('\n====================================================');
  console.log('4. IMPORT JOB VERIFIED SUMMARY');
  console.log('====================================================');
  console.log(`Job ID: ${job.id}`);
  console.log(`Status: ${job.status}`);
  console.log(`Source Candidates: ${metrics.sourceCandidateCount}`);
  console.log(`Verified Sources: ${metrics.verifiedSourceCount}`);
  console.log(`Rejected Sources: ${metrics.rejectedSourceCount}`);
  console.log(`Source Verification Rate: ${(metrics.sourceVerificationRate * 100).toFixed(1)}%`);
  console.log(`Verified Auto-Populated Fields: ${metrics.verifiedAutoPopulatedFieldCount} / ${metrics.essentialFieldCount}`);
  console.log(`Verified Automation Coverage: ${metrics.verifiedAutomationCoveragePercent}%`);
  console.log(`Authoritative Coverage: ${metrics.authoritativeCoveragePercent}%`);
  console.log(`Unresolved Conflicts: ${metrics.conflictCount}`);
  console.log(`Eligible Images: ${metrics.eligibleImageCount}`);
  console.log(`Verified Videos: ${videos.length}`);
  console.log('====================================================\n');

  // Output JSON formatted evidence for reporting
  console.log('### JOB_JSON_DATA ###');
  console.log(JSON.stringify({ job, metrics, sources, assertions, conflicts, media, videos }, null, 2));
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
