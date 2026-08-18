import { importEngine } from '../src/services/importProviders/importEngine';
import { importLabStore } from '../src/services/importLabStore';

async function runRealImport() {
  console.log('--- EXECUTING REAL IMPORT JOB FOR BMW M3 E30 SPORT EVOLUTION ---');
  const startedAt = new Date().toISOString();
  
  const job = await importEngine.executeImportJob('bmw-m3-e30-sport-evolution', { mode: 'LIVE' });
  const completedAt = new Date().toISOString();

  console.log(`Job ID: ${job.id}`);
  console.log(`Started At: ${startedAt}`);
  console.log(`Completed At: ${completedAt}`);
  console.log(`Final Status: ${job.status}`);
  console.log(`Sources Count: ${job.sourceCount}`);
  console.log(`Assertions Count: ${job.assertionCount}`);

  const sources = importLabStore.getDataSourcesForJob(job.id);
  const assertions = importLabStore.getAssertionsForJob(job.id);
  const conflicts = importLabStore.getConflictsForJob(job.id);
  const media = importLabStore.getMediaCandidatesForJob(job.id);
  const videos = importLabStore.getVideoCandidatesForJob(job.id);
  const graphCandidates = importLabStore.getGraphCandidatesForJob(job.id);
  const metrics = importLabStore.calculateMetrics(job.id);

  console.log('\n--- METRICS ---');
  console.log(JSON.stringify(metrics, null, 2));

  console.log('\n--- SOURCES ---');
  console.log(JSON.stringify(sources, null, 2));

  console.log('\n--- ASSERTIONS SUMMARY ---');
  console.log(`Total Assertions: ${assertions.length}`);
  const assertionsWithoutSource = assertions.filter(a => !a.sourceUrl && !a.sourceId);
  console.log(`Assertions without Source: ${assertionsWithoutSource.length}`);

  console.log('\n--- CONFLICTS ---');
  console.log(JSON.stringify(conflicts, null, 2));

  console.log('\n--- MEDIA CANDIDATES ---');
  console.log(JSON.stringify(media, null, 2));

  console.log('\n--- VIDEO CANDIDATES ---');
  console.log(JSON.stringify(videos, null, 2));

  console.log('\n--- GRAPH CANDIDATES ---');
  console.log(JSON.stringify(graphCandidates, null, 2));

  console.log('\n--- CANONICAL SELECTIONS ---');
  const selections = importLabStore.getCanonicalSelections('bmw-m3-e30-sport-evolution');
  console.log(`Canonical selections count: ${selections.length}`);

  console.log('\n--- PUBLIC PREVIEW CHECK ---');
  const publicData = importLabStore.getApprovedCanonicalData('bmw-m3-e30-sport-evolution');
  console.log(`Public approved canonical fields count: ${Object.keys(publicData).length}`);
}

runRealImport().catch(err => {
  console.error('Real import failed:', err);
  process.exit(1);
});
