import { importLabStore } from '../src/services/importLabStore';
import { importEngine } from '../src/services/importProviders/importEngine';
import { ESSENTIAL_FIELD_KEYS } from '../src/data/importLabSpecs';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ TEST PASSED: ${message}`);
}

async function runImportLabTests() {
  console.log('==================================================');
  console.log('RUNNING THE RIGHT GEAR — IMPORT LAB v0.1 UNIT TESTS');
  console.log('==================================================\n');

  // TEST 1: ImportJob State Transitions & Pipeline Creation
  console.log('--- TEST 1: ImportJob State Transitions ---');
  const job = importLabStore.createJob('bmw-m3-e30-sport-evolution', 'MOCK');
  assert(job.status === 'DRAFT', 'New job initialized in DRAFT state');
  assert(job.targetVariantId === 'bmw-m3-e30-sport-evolution', 'Target variant ID matched');

  importLabStore.updateJob(job.id, { status: 'DISCOVERING' });
  assert(importLabStore.getJob(job.id)?.status === 'DISCOVERING', 'Job transitioned to DISCOVERING state');

  importLabStore.updateJob(job.id, { status: 'REVIEW' });
  assert(importLabStore.getJob(job.id)?.status === 'REVIEW', 'Job transitioned to REVIEW state');

  // TEST 2: DataSource Requirement
  console.log('\n--- TEST 2: DataSource Requirement ---');
  const source = importLabStore.addDataSource(job.id, {
    providerName: 'Test Provider',
    sourceTitle: 'BMW Group Classic Test Archive',
    sourceUrl: 'https://www.bmwgroup-classic.com/test',
    domain: 'bmwgroup-classic.com',
    sourceType: 'Official Archive',
    trustLevel: 'LEVEL_1_OFFICIAL_MANUFACTURER',
    retrievedAt: new Date().toISOString(),
    providerStatus: 'LIVE',
    verificationStatus: 'VERIFIED',
    entityScope: 'EXACT_VARIANT'
  });
  assert(!!source.id, 'DataSource created with unique ID');
  const jobSources = importLabStore.getDataSourcesForJob(job.id);
  assert(jobSources.length === 1, 'Job source list updated correctly');

  // TEST 3: DataAssertion Creation & Provenance Attachment
  console.log('\n--- TEST 3: DataAssertion Creation & Provenance ---');
  const assertion1 = importLabStore.addAssertion(job.id, {
    subjectEntityId: 'bmw-m3-e30-sport-evolution',
    fieldName: 'powerHp',
    rawValue: '238 hp',
    normalizedValue: '238',
    unit: 'hp',
    sourceId: source.sourceUrl,
    sourceUrl: source.sourceUrl,
    sourceTitle: source.sourceTitle,
    retrievedAt: new Date().toISOString(),
    confidenceScore: 98,
    verificationStatus: 'PENDING_REVIEW',
    trustLevel: 'LEVEL_1_OFFICIAL_MANUFACTURER',
    isDerived: false
  });

  assert(!!assertion1.id, 'DataAssertion created with unique ID');
  assert(assertion1.sourceUrl === 'https://www.bmwgroup-classic.com/test', 'Source URL attached to DataAssertion');
  assert(assertion1.trustLevel === 'LEVEL_1_OFFICIAL_MANUFACTURER', 'Trust level preserved on DataAssertion');

  // TEST 4: Conflict Preservation
  console.log('\n--- TEST 4: Conflict Preservation ---');
  const assertion2 = importLabStore.addAssertion(job.id, {
    subjectEntityId: 'bmw-m3-e30-sport-evolution',
    fieldName: 'powerHp',
    rawValue: '240 hp (un-governed)',
    normalizedValue: '240',
    unit: 'hp',
    sourceId: 'https://www.competing-source.com',
    sourceUrl: 'https://www.competing-source.com',
    sourceTitle: 'Competing Spec Sheet',
    retrievedAt: new Date().toISOString(),
    confidenceScore: 80,
    verificationStatus: 'PENDING_REVIEW',
    trustLevel: 'LEVEL_4_SPECIALIST_EDITORIAL',
    isDerived: false
  });

  const conflict = importLabStore.addConflict(job.id, {
    subjectEntityId: 'bmw-m3-e30-sport-evolution',
    fieldName: 'powerHp',
    assertionIds: [assertion1.id, assertion2.id],
    status: 'UNRESOLVED'
  });

  assert(conflict.status === 'UNRESOLVED', 'Conflict preserved as UNRESOLVED without auto-overwriting values');

  // TEST 5: Canonical Selection & Conflict Resolution
  console.log('\n--- TEST 5: Canonical Selection & Conflict Resolution ---');
  importLabStore.resolveConflict(job.id, conflict.id, assertion1.id, 'Resolved in favor of Official Manufacturer source');
  const resolvedConflict = importLabStore.getConflictsForJob(job.id).find(c => c.id === conflict.id);
  assert(resolvedConflict?.status === 'RESOLVED_APPROVED', 'Conflict status updated to RESOLVED_APPROVED');

  const canonicalSelection = importLabStore.setCanonicalSelection({
    entityId: 'bmw-m3-e30-sport-evolution',
    fieldName: 'powerHp',
    selectedAssertionId: assertion1.id,
    selectedBy: 'Editorial Board',
    selectedAt: new Date().toISOString(),
    selectionReason: 'Approved during test'
  });
  assert(canonicalSelection.selectedAssertionId === assertion1.id, 'CanonicalFieldSelection registered correctly');

  // TEST 6: Public Preview Isolation
  console.log('\n--- TEST 6: Public Preview Data Isolation ---');
  // Mark assertion1 as APPROVED
  importLabStore.updateAssertion(job.id, assertion1.id, { verificationStatus: 'APPROVED' });

  const canonicalData = importLabStore.getApprovedCanonicalData('bmw-m3-e30-sport-evolution');
  assert(canonicalData['powerHp'].value === '238', 'Approved canonical value accessible in public preview');
  assert(canonicalData['powerHp'].unit === 'hp', 'Unit preserved in public preview');
  assert(!canonicalData['torqueNm'], 'Unapproved fields do NOT leak into public preview');

  // TEST 7: Full Engine Integration Pipeline Run
  console.log('\n--- TEST 7: Full Engine Integration Pipeline Execution ---');
  const executedJob = await importEngine.executeImportJob('bmw-m3-e30-sport-evolution', { mode: 'MOCK' });
  assert(executedJob.status === 'REVIEW', 'Pipeline completed and reached REVIEW state');
  assert(executedJob.sourceCount > 0, 'Sources discovered and registered');
  assert(executedJob.assertionCount > 0, 'Assertions extracted and registered');

  const metrics = importLabStore.calculateMetrics(executedJob.id);
  assert(metrics.essentialFieldCount === 43, 'Metrics computed for 43 Essential Fields');
  assert(metrics.automationCoveragePercent > 50, 'Automation coverage > 50% for BMW M3 Sport Evolution');

  console.log('\n==================================================');
  console.log('ALL IMPORT LAB v0.1 UNIT TESTS PASSED SUCCESSFULLY!');
  console.log('==================================================\n');
}

runImportLabTests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
