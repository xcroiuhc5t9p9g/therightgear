import { SourceVerifier } from '../services/importProviders/sourceVerifier';
import { TargetVehicle } from '../services/importProviders/providerTypes';
import { normalizeValueAndUnit } from '../data/importLabSpecs';
import { importLabStore } from '../services/importLabStore';

export async function runSourceIntegrityTestSuite() {
  console.log('====================================================');
  console.log('RUNNING AUTOMATED SOURCE INTEGRITY TEST SUITE');
  console.log('====================================================\n');

  const verifier = new SourceVerifier();

  const targetVehicle: TargetVehicle = {
    id: 'bmw-m3-e30-sport-evolution',
    manufacturerName: 'BMW',
    modelName: 'M3',
    generationCode: 'E30',
    variantName: 'M3 Sport Evolution'
  };

  const results: { testName: string; passed: boolean; details: string }[] = [];

  // TEST 1: Unrelated Entity URL (Ultimatecarpage ID 179 -> Ferrari F1)
  console.log('Test 1: Testing URL with unrelated entity (Ferrari F1 car on car ID 179)...');
  const test1Url = 'https://www.ultimatecarpage.com/car/179/Ferrari-F1.html';
  const res1 = await verifier.verifyHttpUrl(test1Url, targetVehicle);
  const test1Passed = res1.verificationStatus === 'ENTITY_MISMATCH' || res1.verificationStatus === 'NOT_FOUND' || res1.verificationStatus === 'RETRIEVAL_FAILED';
  results.push({
    testName: 'Test 1: Unrelated Entity URL Rejection (Ferrari F1)',
    passed: test1Passed,
    details: `Status: ${res1.verificationStatus}, Reason: ${res1.verificationReason}`
  });

  // TEST 2: 404 URL Rejection
  console.log('Test 2: Testing 404 non-existent URL...');
  const test2Url = 'https://www.bmwgroup-classic.com/en/history/models/non-existent-404-page.html';
  const res2 = await verifier.verifyHttpUrl(test2Url, targetVehicle);
  const test2Passed = res2.verificationStatus === 'NOT_FOUND' || res2.verificationStatus === 'RETRIEVAL_FAILED';
  results.push({
    testName: 'Test 2: 404 URL Rejection',
    passed: test2Passed,
    details: `Status: ${res2.verificationStatus}, Reason: ${res2.verificationReason}`
  });

  // TEST 3: Incorrect Wikidata Q-ID (Q1188048 Riesz representation theorem)
  console.log('Test 3: Testing incorrect Wikidata Q-ID Q1188048...');
  const res3 = await verifier.verifyWikidataEntity('Q1188048', targetVehicle);
  const test3Passed = res3.verificationStatus === 'ENTITY_MISMATCH';
  results.push({
    testName: 'Test 3: Wikidata Flawed Q-ID Rejection (Q1188048 Riesz Theorem)',
    passed: test3Passed,
    details: `Status: ${res3.verificationStatus}, Reason: ${res3.verificationReason}`
  });

  // TEST 4: Non-existent Wikimedia Commons file
  console.log('Test 4: Testing non-existent Wikimedia Commons file...');
  const res4 = await verifier.verifyWikimediaFile('File:BMW_M3_E30_NonExistent_Fake_File_9999.jpg', targetVehicle);
  const test4Passed = res4.verificationStatus === 'NOT_FOUND';
  results.push({
    testName: 'Test 4: Non-Existent Wikimedia File Rejection',
    passed: test4Passed,
    details: `Status: ${res4.verificationStatus}, Reason: ${res4.verificationReason}`
  });

  // TEST 5: Non-existent / Dummy YouTube Video ID
  console.log('Test 5: Testing dummy YouTube video ID E30SportEvoDocu...');
  const res5 = await verifier.verifyYouTubeVideo('E30SportEvoDocu', targetVehicle);
  const test5Passed = res5.verificationStatus === 'NOT_FOUND';
  results.push({
    testName: 'Test 5: Dummy YouTube Video ID Rejection',
    passed: test5Passed,
    details: `Status: ${res5.verificationStatus}, Reason: ${res5.verificationReason}`
  });

  // TEST 6: Scope Mismatch (BMW M3 Evolution II source vs Sport Evolution target)
  console.log('Test 6: Testing scope mismatch (General E30 M3 / Evolution II page)...');
  const test6Url = 'https://www.bmwmregistry.com/model_faq.php?id=7'; // Evolution II page ID 7
  const res6 = await verifier.verifyHttpUrl(test6Url, targetVehicle);
  const test6Passed = res6.verificationStatus === 'SCOPE_MISMATCH' || res6.entityScope !== 'EXACT_VARIANT';
  results.push({
    testName: 'Test 6: Cross-Variant Scope Mismatch Detection',
    passed: test6Passed,
    details: `Status: ${res6.verificationStatus}, Scope: ${res6.entityScope}, Reason: ${res6.verificationReason}`
  });

  // TEST 7: Normalization & False Conflict Prevention
  console.log('Test 7: Testing unit normalization equivalence ("Inline-4 DOHC 16-valve" vs "Inline-4 DOHC 16v")...');
  const norm1 = normalizeValueAndUnit('engineArchitecture', 'Inline-4 DOHC 16-valve');
  const norm2 = normalizeValueAndUnit('engineArchitecture', 'Inline-4 DOHC 16v');
  const test7Passed = norm1.normalizedValue.toLowerCase() === norm2.normalizedValue.toLowerCase();
  results.push({
    testName: 'Test 7: False Conflict Prevention via Unit Normalization',
    passed: test7Passed,
    details: `Normalized 1: "${norm1.normalizedValue}" | Normalized 2: "${norm2.normalizedValue}"`
  });

  // TEST 8: Authoritative Coverage Rules (LEVEL_4 Excluded)
  console.log('Test 8: Testing Authoritative Coverage calculation (Excluding LEVEL_4 Specialist Editorial)...');
  const testJob = importLabStore.createJob('bmw-m3-e30-sport-evolution', 'LIVE');
  const srcOfficial = importLabStore.addDataSource(testJob.id, {
    jobId: testJob.id,
    providerName: 'BMW Group Classic',
    sourceTitle: 'BMW Group Classic',
    domain: 'bmwgroup-classic.com',
    retrievedAt: new Date().toISOString(),
    providerStatus: 'LIVE',
    sourceUrl: 'https://www.bmwgroup-classic.com/en/history/models/bmw-m3-sport-evolution.html',
    sourceType: 'Official Archive',
    trustLevel: 'LEVEL_1_OFFICIAL_MANUFACTURER',
    verificationStatus: 'VERIFIED',
    verificationReason: 'Official website'
  });
  const srcSpecialist = importLabStore.addDataSource(testJob.id, {
    jobId: testJob.id,
    providerName: 'BMW M Registry',
    sourceTitle: 'BMW M Registry',
    domain: 'bmwmregistry.com',
    retrievedAt: new Date().toISOString(),
    providerStatus: 'LIVE',
    sourceUrl: 'https://www.bmwmregistry.com/model_faq.php?id=8',
    sourceType: 'Specialist Registry',
    trustLevel: 'LEVEL_4_SPECIALIST_EDITORIAL',
    verificationStatus: 'VERIFIED',
    verificationReason: 'Specialist forum'
  });

  // Assertion 1: Official source for powerHp
  importLabStore.addAssertion(testJob.id, {
    sourceId: srcOfficial.id,
    sourceTitle: 'BMW Group Classic',
    sourceUrl: srcOfficial.sourceUrl,
    trustLevel: srcOfficial.trustLevel,
    subjectEntityId: 'bmw-m3-e30-sport-evolution',
    fieldName: 'powerHp',
    rawValue: '238 hp',
    normalizedValue: '238 hp',
    unit: 'hp',
    verificationStatus: 'PENDING_REVIEW',
    retrievedAt: new Date().toISOString(),
    confidenceScore: 95
  });

  // Assertion 2: Specialist source for displacementCc
  importLabStore.addAssertion(testJob.id, {
    sourceId: srcSpecialist.id,
    sourceTitle: 'BMW M Registry',
    sourceUrl: srcSpecialist.sourceUrl,
    trustLevel: srcSpecialist.trustLevel,
    subjectEntityId: 'bmw-m3-e30-sport-evolution',
    fieldName: 'displacementCc',
    rawValue: '2467 cc',
    normalizedValue: '2467 cc',
    unit: 'cc',
    verificationStatus: 'PENDING_REVIEW',
    retrievedAt: new Date().toISOString(),
    confidenceScore: 85
  });

  const testMetrics = importLabStore.calculateMetrics(testJob.id);
  // Auto-populated should be 2 fields, but Authoritative Coverage should ONLY count the LEVEL_1 field (1 field = 1/43 = 2.3%)
  const test8Passed = testMetrics.autoPopulatedCount === 2 && testMetrics.authoritativeCoveragePercent === 2.3;
  results.push({
    testName: 'Test 8: Authoritative Coverage Exclusion of LEVEL_4 Sources',
    passed: test8Passed,
    details: `Auto-populated fields: ${testMetrics.autoPopulatedCount}, Authoritative Coverage: ${testMetrics.authoritativeCoveragePercent}% (Expected 2.3% for 1/43 official fields)`
  });

  console.log('\n====================================================');
  console.log('SOURCE INTEGRITY TEST RESULTS');
  console.log('====================================================');
  let passedCount = 0;
  for (const r of results) {
    const mark = r.passed ? '✓ PASS' : '✗ FAIL';
    if (r.passed) passedCount++;
    console.log(`[${mark}] ${r.testName}`);
    console.log(`       Details: ${r.details}`);
  }
  console.log(`\nPassed ${passedCount}/${results.length} tests.`);
  console.log('====================================================\n');

  return { total: results.length, passed: passedCount, results };
}

// Allow direct CLI execution via tsx/node
if (import.meta.url === `file://${process.argv[1]}`) {
  runSourceIntegrityTestSuite();
}
