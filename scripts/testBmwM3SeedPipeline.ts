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
  assert(BMW_M3_FOUNDATION_SEED.sources.length >= 3, 'Source provenance manifest contains >= 3 citations');
  const hasTier1 = BMW_M3_FOUNDATION_SEED.sources.some(s => s.tier === 'TIER_1_PRIMARY');
  assert(hasTier1, 'Source provenance contains Tier 1 primary manufacturer / homologation sources');

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

  // --- 2. DRY-RUN PLANNING ON EMPTY DATABASE ---
  console.log('\nTEST GROUP 2: Dry-Run Planning & Safety Enforcements');
  const mockDb = new MockFirestoreDb();
  const seedEngine = new CatalogueSeedEngine(mockDb);

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

  // --- 3. PERSISTENT INGESTION & IDEMPOTENCY ---
  console.log('\nTEST GROUP 3: Ingestion Execution & Idempotency');
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

  // --- 4. CONFLICT DETECTION ---
  console.log('\nTEST GROUP 4: Conflict & Diff Detection');
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

  // --- 5. PERSISTENT PROVIDER & REPOSITORY QUERY VERIFICATION ---
  console.log('\nTEST GROUP 5: Persistent Provider & Repository End-to-End Query');
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
