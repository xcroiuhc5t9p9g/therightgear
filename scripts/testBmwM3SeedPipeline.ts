import { BMW_M3_FOUNDATION_SEED } from '../src/services/catalogue/seeds/bmwM3Foundation.js';
import { CatalogueSeedEngine } from '../src/services/catalogue/seeds/CatalogueSeedEngine.js';
import { PersistentCatalogueProvider } from '../src/services/catalogue/providers/PersistentCatalogueProvider.js';
import { CatalogueRepository } from '../src/services/catalogue/CatalogueRepository.js';
import { CatalogueIntegrityError } from '../src/services/catalogue/types.js';
import { 
  validateAndNormalizeMaker, 
  validateAndNormalizeModel, 
  validateAndNormalizeGeneration, 
  validateAndNormalizeVariant, 
  validateAndNormalizeEngine 
} from '../src/services/catalogue/persistence/documentValidators.js';

// In-memory mock Firestore database for pipeline unit-testing
class MockFirestoreCollection {
  private docs = new Map<string, any>();

  constructor(private name: string) {}

  public doc(id: string) {
    return {
      id,
      get: async () => {
        const data = this.docs.get(id);
        return {
          id,
          exists: data !== undefined,
          data: () => data ? JSON.parse(JSON.stringify(data)) : undefined
        };
      },
      set: async (data: any, options?: { merge?: boolean }) => {
        if (options?.merge && this.docs.has(id)) {
          this.docs.set(id, { ...this.docs.get(id), ...JSON.parse(JSON.stringify(data)) });
        } else {
          this.docs.set(id, JSON.parse(JSON.stringify(data)));
        }
      },
      delete: async () => {
        this.docs.delete(id);
      }
    };
  }

  public where(field: string, op: string, val: any) {
    return {
      get: async () => {
        const matched: any[] = [];
        for (const [id, data] of this.docs.entries()) {
          if (op === '==' && data[field] === val) {
            matched.push({
              id,
              exists: true,
              data: () => JSON.parse(JSON.stringify(data))
            });
          } else if (op === 'in' && Array.isArray(val) && val.includes(data[field])) {
            matched.push({
              id,
              exists: true,
              data: () => JSON.parse(JSON.stringify(data))
            });
          }
        }
        return {
          docs: matched,
          empty: matched.length === 0,
          size: matched.length
        };
      },
      where: (f2: string, op2: string, v2: any) => {
        return {
          get: async () => {
            const matched: any[] = [];
            for (const [id, data] of this.docs.entries()) {
              if (
                (op === '==' ? data[field] === val : Array.isArray(val) && val.includes(data[field])) &&
                (op2 === '==' ? data[f2] === v2 : Array.isArray(v2) && v2.includes(data[f2]))
              ) {
                matched.push({
                  id,
                  exists: true,
                  data: () => JSON.parse(JSON.stringify(data))
                });
              }
            }
            return {
              docs: matched,
              empty: matched.length === 0,
              size: matched.length
            };
          }
        };
      }
    };
  }

  public limit(num: number) {
    return {
      get: async () => {
        const items = Array.from(this.docs.entries()).slice(0, num).map(([id, data]) => ({
          id,
          exists: true,
          data: () => JSON.parse(JSON.stringify(data))
        }));
        return {
          docs: items,
          empty: items.length === 0,
          size: items.length
        };
      }
    };
  }

  public async get() {
    const items = Array.from(this.docs.entries()).map(([id, data]) => ({
      id,
      exists: true,
      data: () => JSON.parse(JSON.stringify(data))
    }));
    return {
      docs: items,
      empty: items.length === 0,
      size: items.length
    };
  }
}

class MockFirestoreDb {
  private collections = new Map<string, MockFirestoreCollection>();

  public collection(name: string): MockFirestoreCollection {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockFirestoreCollection(name));
    }
    return this.collections.get(name)!;
  }

  public batch() {
    const ops: Array<() => Promise<void>> = [];
    return {
      set: (docRef: any, data: any, options?: any) => {
        ops.push(async () => {
          await docRef.set(data, options);
        });
      },
      commit: async () => {
        for (const op of ops) {
          await op();
        }
      }
    };
  }
}

async function runBmwM3SeedPipelineTestSuite() {
  console.log('================================================================');
  console.log('  DATA-16 BMW M3 FOUNDATION CANONICAL SEED PIPELINE TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // --- 1. PROVENANCE MANIFEST AND SCHEMA VALIDATION ---
  console.log('TEST GROUP 1: Source Provenance & Document Schema Validation');
  assert(BMW_M3_FOUNDATION_SEED.sources.length >= 4, 'Source provenance manifest contains >= 4 specific citations');
  const hasTier1 = BMW_M3_FOUNDATION_SEED.sources.some(s => s.tier === 'TIER_1_PRIMARY');
  assert(hasTier1, 'Source provenance contains Tier 1 primary manufacturer / homologation sources');

  // Verify all sources specify entityIds and supported fields
  const allSourcesLinkEntities = BMW_M3_FOUNDATION_SEED.sources.every(s => Array.isArray(s.entityIds) && s.entityIds.length > 0);
  assert(allSourcesLinkEntities, 'All source provenance records declare explicit entityIds linkage');

  // Strict DATA-16R Score Check: NO scores allowed without approved methodology
  const scoreFree = BMW_M3_FOUNDATION_SEED.variants.every(v => v.scores === null || v.scores === undefined);
  assert(scoreFree, 'Zero unapproved scores in foundation seed (all variant scores are null/omitted)');

  // Strict Asset Check: No fake local asset paths
  const noFakeAssets = BMW_M3_FOUNDATION_SEED.variants.every(v => !v.hero_image_url || v.hero_image_url.startsWith('https://'));
  assert(noFakeAssets, 'No invalid or non-existent local image paths in seed variants');

  // DATA-16R3R Regression Test: Evolution II production_total is 500 based on official BMW primary source
  const evo2Variant = BMW_M3_FOUNDATION_SEED.variants.find(v => v.id === 'var-bmw-m3-e30-evo-2');
  assert(evo2Variant?.production_total === 500, 'DATA-16R3R: Evolution II production_total is 500 based on official BMW primary source');

  // DATA-16R3R Regression Test: No BMW seed sources contain /en/vehicle-archive/
  const hasVehicleArchiveUrl = BMW_M3_FOUNDATION_SEED.sources.some(s => s.referenceUrl?.includes('/en/vehicle-archive/'));
  assert(!hasVehicleArchiveUrl, 'DATA-16R3R: No BMW seed sources contain invalid /en/vehicle-archive/ URLs');

  // DATA-16R3R Regression Test: BMW Classic sources use specific product-description-page URLs
  const bmwClassicSources = BMW_M3_FOUNDATION_SEED.sources.filter(s => s.referenceUrl?.includes('bmwgroup-classic.com'));
  const allClassicUseProductPage = bmwClassicSources.length > 0 && bmwClassicSources.every(s => s.referenceUrl?.includes('/en/models/bmw-classics/product-description-page.'));
  assert(allClassicUseProductPage, 'DATA-16R3R: BMW Classic provenance sources use specific product-description-page URLs');

  try {
    BMW_M3_FOUNDATION_SEED.makers.forEach(m => validateAndNormalizeMaker(m, m.id));
    assert(true, 'All Maker entities conform to strict schema');
  } catch (err: any) {
    assert(false, 'Maker schema validation failed', err.message);
  }

  try {
    BMW_M3_FOUNDATION_SEED.models.forEach(m => validateAndNormalizeModel(m, m.id));
    assert(true, 'All Model entities conform to strict schema');
  } catch (err: any) {
    assert(false, 'Model schema validation failed', err.message);
  }

  try {
    BMW_M3_FOUNDATION_SEED.generations.forEach(g => validateAndNormalizeGeneration(g, g.id));
    assert(true, 'All Generation entities conform to strict schema');
  } catch (err: any) {
    assert(false, 'Generation schema validation failed', err.message);
  }

  try {
    BMW_M3_FOUNDATION_SEED.variants.forEach(v => validateAndNormalizeVariant(v, v.id));
    assert(true, 'All VehicleVariant entities conform to strict schema');
  } catch (err: any) {
    assert(false, 'Variant schema validation failed', err.message);
  }

  try {
    BMW_M3_FOUNDATION_SEED.engines.forEach(e => validateAndNormalizeEngine(e, e.id));
    assert(true, 'All CanonicalEngine entities conform to strict schema');
  } catch (err: any) {
    assert(false, 'Engine schema validation failed', err.message);
  }

  // --- 2. DATA INTEGRITY AUDIT & PROVENANCE COVERAGE ENFORCEMENT (DATA-16R2) ---
  console.log('\nTEST GROUP 2: Provenance Coverage & Data Integrity Auditing');
  const mockDb = new MockFirestoreDb();
  const seedEngine = new CatalogueSeedEngine(mockDb);

  const integrityAudit = seedEngine.auditBundleIntegrity(BMW_M3_FOUNDATION_SEED);
  assert(integrityAudit.scoresDetectedCount === 0, 'Data integrity audit confirms 0 unapproved scores');
  assert(integrityAudit.unsupportedCriticalFacts.length === 0, 'Zero unsupported critical facts in foundation seed');
  assert(integrityAudit.provenanceStructureErrors.length === 0, 'Zero provenance structure errors in source manifest');
  assert(integrityAudit.isAuditClean === true, 'Data integrity audit passes clean (100% provenance coverage)');
  assert(integrityAudit.supportedFactsCount > 50, `Audit verified ${integrityAudit.supportedFactsCount} supported critical facts`);
  assert(integrityAudit.derivedFactsCount === 4, `Audit verified 4 derived facts (power_to_weight_hp_ton across 4 variants)`);
  assert(integrityAudit.unresolvedFactsCount === 1, `Audit tracks ongoing model lineage (discontinued_year: null) as 1 unresolved fact`);

  // Section 25 Test: Unsupported Fact Injection must fail with CatalogueIntegrityError
  const bundleWithUnsupportedFact: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  // Remove field support from all sources for 'specs.top_speed_kph' on base coupe
  bundleWithUnsupportedFact.sources.forEach((s: any) => {
    if (s.supports) {
      s.supports = s.supports.filter((f: string) => f !== 'specs.top_speed_kph');
    }
  });
  const unsupportedAudit = seedEngine.auditBundleIntegrity(bundleWithUnsupportedFact);
  assert(unsupportedAudit.isAuditClean === false, 'Audit fails when populated critical fact lacks source coverage');
  assert(
    unsupportedAudit.unsupportedCriticalFacts.some((f: any) => f.fieldPath === 'specs.top_speed_kph'),
    'Audit specifically flags unsupported critical fact (specs.top_speed_kph)'
  );
  try {
    await seedEngine.planSeed(bundleWithUnsupportedFact);
    assert(false, 'planSeed should reject bundle with unsupported critical facts');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'planSeed rejected unsupported critical fact with CatalogueIntegrityError');
  }

  // Section 26 Test: Wrong Entity in Source Provenance must fail
  const bundleWithWrongEntity: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  // Remove cabriolet from all sources
  bundleWithWrongEntity.sources.forEach((s: any) => {
    if (s.entityIds) {
      s.entityIds = s.entityIds.filter((id: string) => id !== 'var-bmw-m3-e30-cabriolet');
    }
  });
  const wrongEntityAudit = seedEngine.auditBundleIntegrity(bundleWithWrongEntity);
  assert(wrongEntityAudit.isAuditClean === false, 'Audit fails when source entityIds does not match entity');
  assert(
    wrongEntityAudit.unsupportedCriticalFacts.some((f: any) => f.entityId === 'var-bmw-m3-e30-cabriolet'),
    'Audit flags facts on entity lacking source citation'
  );

  // Section 27 Test: Wrong Field Path in Source Provenance must fail
  const bundleWithWrongField: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  // Replace 'specs.displacement_cc' with invalid field in all sources
  bundleWithWrongField.sources.forEach((s: any) => {
    if (s.supports) {
      s.supports = s.supports.map((f: string) => f === 'specs.displacement_cc' ? 'specs.wrong_unsupported_field' : f);
    }
  });
  const wrongFieldAudit = seedEngine.auditBundleIntegrity(bundleWithWrongField);
  assert(wrongFieldAudit.isAuditClean === false, 'Audit fails when source does not support exact field path');
  assert(
    wrongFieldAudit.unsupportedCriticalFacts.some((f: any) => f.fieldPath === 'specs.displacement_cc'),
    'Audit flags missing exact field path specs.displacement_cc'
  );

  // Section 29 Test: Derived Field Evaluation (power_to_weight_hp_ton requires supported inputs)
  const bundleWithUnsupportedDerivationInput: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  // Strip 'specs.kerb_weight_kg' from sources for base coupe
  bundleWithUnsupportedDerivationInput.sources.forEach((s: any) => {
    if (s.supports) {
      s.supports = s.supports.filter((f: string) => f !== 'specs.kerb_weight_kg');
    }
  });
  const derivationAudit = seedEngine.auditBundleIntegrity(bundleWithUnsupportedDerivationInput);
  assert(
    derivationAudit.unsupportedCriticalFacts.some((f: any) => f.fieldPath === 'specs.power_to_weight_hp_ton'),
    'Derived fact fails audit when underlying calculation input lacks provenance'
  );

  // Section 30 Test: Verify that an injected unapproved score throws CatalogueIntegrityError
  const bundleWithInjectedScore: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  bundleWithInjectedScore.variants[0].scores = {
    collector_score: { overall_score: 95, rarity_weight: 80, historical_relevance: 90, desirability: 90, originality_typical: 85, technical_relevance: 85, brand_recognizability: 90, community_culture: 90 },
    investment_score: { overall_score: 90, market_trend: 90, liquidity: 85, supply_scarcity: 90, international_demand: 90, inverse_volatility: 85, inverse_maintenance_cost: 80, comparable_stability: 85 },
    rarity_score: 85,
    confidence_level: 'High'
  };
  try {
    await seedEngine.planSeed(bundleWithInjectedScore);
    assert(false, 'Seed bundle with unapproved scores should have been rejected');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'Unapproved score injection rejected with CatalogueIntegrityError');
  }

  // Section 31 Test: DATA-16R3 Source Quality Validation
  // 31a. Generic Homepage used for technical fields must be flagged
  const bundleWithGenericHomepage: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  const technicalSource = bundleWithGenericHomepage.sources.find((s: any) => s.sourceId === 'src-bmw-classic-e30-m3');
  technicalSource.referenceUrl = 'https://www.bmwgroup-classic.com';
  const genericHomeAudit = seedEngine.auditBundleIntegrity(bundleWithGenericHomepage);
  assert(genericHomeAudit.isAuditClean === false, 'Generic homepage used for technical specifications fails audit');
  assert(
    genericHomeAudit.provenanceStructureErrors.some((e: string) => e.includes('generic root homepage')),
    'Audit flags generic root homepage as technical document substitute'
  );

  // 31b. Malformed URL must be flagged
  const bundleWithMalformedUrl: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  bundleWithMalformedUrl.sources[0].referenceUrl = 'not-a-valid-url';
  const malformedUrlAudit = seedEngine.auditBundleIntegrity(bundleWithMalformedUrl);
  assert(malformedUrlAudit.isAuditClean === false, 'Malformed URL fails audit');
  assert(
    malformedUrlAudit.provenanceStructureErrors.some((e: string) => e.includes('malformed referenceUrl')),
    'Audit flags malformed URL'
  );

  // 31c. Unverified document reference must be flagged
  const bundleWithUnverifiedDocRef: any = JSON.parse(JSON.stringify(BMW_M3_FOUNDATION_SEED));
  bundleWithUnverifiedDocRef.sources[0].documentRef = 'BMW AG Order Spec Ref BMW E30-M3-TECH-8691';
  const unverifiedDocAudit = seedEngine.auditBundleIntegrity(bundleWithUnverifiedDocRef);
  assert(unverifiedDocAudit.isAuditClean === false, 'Unverified document reference fails audit');
  assert(
    unverifiedDocAudit.provenanceStructureErrors.some((e: string) => e.includes('unverifiable document reference')),
    'Audit flags unverified document reference'
  );

  // --- 3. DRY-RUN PLANNING ON EMPTY DATABASE ---
  console.log('\nTEST GROUP 3: Dry-Run Planning & Safety Enforcements');
  const initialPlan = await seedEngine.planSeed(BMW_M3_FOUNDATION_SEED);
  assert(initialPlan.totalEntities === 9, 'Initial plan accurately counts 9 total canonical entities (1 Maker, 1 Model, 1 Gen, 4 Variants, 2 Engines)');
  assert(initialPlan.actionsCount.CREATE === 9, 'All 9 entities planned as CREATE on empty datastore');
  assert(initialPlan.actionsCount.CONFLICT === 0, 'No conflicts on empty datastore');

  // Dry run execution should not write documents
  const dryRunResult = await seedEngine.executeSeed(BMW_M3_FOUNDATION_SEED, { dryRun: true });
  assert(dryRunResult.dryRun === true && dryRunResult.executed === false, 'Dry run execution flags set correctly');
  assert(dryRunResult.upsertCounts.makers === 0, 'Dry run did not write to datastore');

  // Verify that live write without confirmWrite flag fails
  try {
    await seedEngine.executeSeed(BMW_M3_FOUNDATION_SEED, { dryRun: false, confirmWrite: false });
    assert(false, 'Write without confirmWrite should have thrown error');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'Missing confirmWrite flag rejected with CatalogueIntegrityError');
  }

  // --- 4. PERSISTENT INGESTION & IDEMPOTENCY ---
  console.log('\nTEST GROUP 4: Ingestion Execution & Idempotency');
  const liveResult = await seedEngine.executeSeed(BMW_M3_FOUNDATION_SEED, {
    dryRun: false,
    confirmWrite: true
  });

  assert(liveResult.executed === true, 'Seed executed successfully');
  assert(
    liveResult.upsertCounts.makers === 1 &&
    liveResult.upsertCounts.models === 1 &&
    liveResult.upsertCounts.generations === 1 &&
    liveResult.upsertCounts.variants === 4 &&
    liveResult.upsertCounts.engines === 2,
    'All 9 entities committed atomically to datastore'
  );

  // 2nd planning run should detect 100% NO_OP
  const secondPlan = await seedEngine.planSeed(BMW_M3_FOUNDATION_SEED);
  assert(secondPlan.actionsCount.NO_OP === 9, 'Second plan detects 100% NO_OP for unchanged entities');
  assert(secondPlan.actionsCount.CREATE === 0 && secondPlan.actionsCount.CONFLICT === 0, 'Zero CREATE or CONFLICT on idempotent re-run');

  // --- 5. CONFLICT DETECTION ---
  console.log('\nTEST GROUP 5: Conflict & Diff Detection');
  // Alter power_hp of S14B25 engine in datastore
  const engineDoc = await mockDb.collection('catalogue_engines').doc('eng-bmw-s14b25').get();
  const engineData = engineDoc.data();
  engineData.specs.power_hp = 999; // Corrupt/Conflicting value
  await mockDb.collection('catalogue_engines').doc('eng-bmw-s14b25').set(engineData);

  const conflictPlan = await seedEngine.planSeed(BMW_M3_FOUNDATION_SEED);
  assert(conflictPlan.hasConflicts === true, 'Conflict plan detected substantive divergence');
  assert(conflictPlan.actionsCount.CONFLICT === 1, 'Exactly 1 CONFLICT action recorded for altered engine');

  // Ingestion with conflict without force must fail
  try {
    await seedEngine.executeSeed(BMW_M3_FOUNDATION_SEED, { dryRun: false, confirmWrite: true, forceOnConflict: false });
    assert(false, 'Execution with unresolved conflict should fail');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'Unforced conflict blocked with CatalogueIntegrityError');
  }

  // Restore engine to clean state
  await mockDb.collection('catalogue_engines').doc('eng-bmw-s14b25').set(
    validateAndNormalizeEngine(BMW_M3_FOUNDATION_SEED.engines.find(e => e.id === 'eng-bmw-s14b25')!, 'eng-bmw-s14b25')
  );

  // --- 6. PERSISTENT PROVIDER & REPOSITORY QUERY VERIFICATION ---
  console.log('\nTEST GROUP 6: Persistent Provider & Repository End-to-End Query');
  const persistentProvider = new PersistentCatalogueProvider(mockDb as any);
  const repository = new CatalogueRepository(persistentProvider);

  const bmwMaker = await repository.getMakerBySlug('bmw');
  assert(bmwMaker?.canonical_name === 'BMW' && bmwMaker?.country_code === 'DE', 'Repository resolves Maker "BMW"');

  const m3Model = await repository.getModelBySlug('bmw', 'm3');
  assert(m3Model?.canonical_name === 'M3' && m3Model?.maker_id === 'maker-bmw', 'Repository resolves Model "M3" under BMW');

  const e30Gen = await repository.getGenerationBySlug('e30');
  assert(e30Gen?.canonical_name === 'M3 E30' && e30Gen?.production_total === 17970, 'Repository resolves Generation "M3 E30" with 17,970 total');

  const variants = await repository.getVariantsByGeneration('gen-bmw-m3-e30');
  assert(variants.length === 4, `Repository retrieves 4 E30 variants (found ${variants.length})`);
  assert(variants.some(v => v.slug === 'bmw-m3-e30-sport-evolution'), 'Sport Evolution variant present');

  const engines = await repository.getEngines();
  assert(engines.length === 2, `Repository retrieves 2 Canonical Engines (found ${engines.length})`);

  const resolvedHierarchy = await repository.resolveModelHierarchy('m3');
  assert(resolvedHierarchy !== null, 'Hierarchy resolution for "m3" succeeds');
  assert(resolvedHierarchy?.maker?.slug === 'bmw', 'Resolved hierarchy correctly links Maker BMW');
  assert(resolvedHierarchy?.generationContexts.length === 1, 'Resolved hierarchy contains 1 canonical generation context');
  assert(resolvedHierarchy?.generationContexts[0].variants.length === 4, 'Resolved generation context contains all 4 variants');

  console.log('\n================================================================');
  console.log(`  SUITE SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBmwM3SeedPipelineTestSuite().catch(err => {
  console.error('[FATAL] Pipeline test suite crashed:', err);
  process.exit(1);
});
