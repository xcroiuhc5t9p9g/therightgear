import { 
  validateAndNormalizeMaker, 
  validateAndNormalizeModel, 
  validateAndNormalizeGeneration, 
  validateAndNormalizeVariant, 
  validateAndNormalizeEngine 
} from '../src/services/catalogue/persistence/documentValidators.js';
import { CatalogueFirestoreWriter } from '../src/services/catalogue/persistence/CatalogueFirestoreWriter.js';
import { PersistentCatalogueProvider } from '../src/services/catalogue/providers/PersistentCatalogueProvider.js';
import { CatalogueIntegrityError } from '../src/services/catalogue/types.js';

// In-memory mock Firestore database implementation to unit-test PersistentCatalogueProvider & CatalogueFirestoreWriter
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
          data: () => data ? { ...data } : undefined
        };
      },
      set: async (data: any, options?: { merge?: boolean }) => {
        if (options?.merge && this.docs.has(id)) {
          this.docs.set(id, { ...this.docs.get(id), ...data });
        } else {
          this.docs.set(id, { ...data });
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
              data: () => ({ ...data })
            });
          } else if (op === 'in' && Array.isArray(val) && val.includes(data[field])) {
            matched.push({
              id,
              exists: true,
              data: () => ({ ...data })
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
                  data: () => ({ ...data })
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
          data: () => ({ ...data })
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
      data: () => ({ ...data })
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

async function runPersistentCatalogueTestSuite() {
  console.log('====================================================');
  console.log('  DATA-15 PERSISTENT CATALOGUE PROVIDER & STORE SUITE');
  console.log('====================================================\n');

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      testsPassed++;
    } else {
      console.error(`  [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
      testsFailed++;
    }
  }

  const mockDb = new MockFirestoreDb();
  const writer = new CatalogueFirestoreWriter(mockDb);
  const provider = new PersistentCatalogueProvider(mockDb as any);

  // --- TEST 1: Schema Validator Enforcement ---
  console.log('TEST GROUP 1: Document Validator Boundary Checks');
  try {
    const validMaker = validateAndNormalizeMaker({
      id: 'maker-porsche',
      canonical_name: 'Porsche',
      slug: 'porsche',
      country: 'Germany'
    }, 'maker-porsche');
    assert(validMaker.canonical_name === 'Porsche' && validMaker.slug === 'porsche', 'Valid Maker normalized correctly');
  } catch (err: any) {
    assert(false, 'Valid Maker normalization failed', err.message);
  }

  try {
    validateAndNormalizeMaker({ id: 'maker-invalid' }, 'maker-invalid');
    assert(false, 'Invalid Maker without name should be rejected');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'Invalid Maker correctly rejected with CatalogueIntegrityError');
  }

  try {
    validateAndNormalizeModel({
      id: 'model-911',
      maker_id: 'maker-porsche',
      canonical_name: '911',
      slug: '911'
    }, 'model-911');
    assert(true, 'Valid Model normalized correctly');
  } catch (err: any) {
    assert(false, 'Valid Model normalization failed', err.message);
  }

  try {
    validateAndNormalizeModel({ id: 'model-911', canonical_name: '911' }, 'model-911');
    assert(false, 'Model missing maker_id should be rejected');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'Model missing maker_id correctly rejected with CatalogueIntegrityError');
  }

  // --- TEST 2: Hierarchy Upsert and Foreign-Key Parent Validation ---
  console.log('\nTEST GROUP 2: Hierarchy Upsert & Relational Integrity');

  // Attempt upserting Model before Maker exists
  try {
    await writer.upsertModel({
      id: 'model-911',
      maker_id: 'maker-porsche',
      canonical_name: '911',
      slug: '911',
      catalogue_status: 'PUBLISHED'
    });
    assert(false, 'Upserting Model without parent Maker must fail');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'Foreign key constraint blocked orphan Model insertion');
  }

  // Perform full atomic hierarchy ingestion
  try {
    const result = await writer.upsertHierarchy({
      makers: [
        {
          id: 'maker-porsche',
          canonical_name: 'Porsche',
          slug: 'porsche',
          active: true,
          catalogue_status: 'PUBLISHED'
        }
      ],
      models: [
        {
          id: 'model-911',
          maker_id: 'maker-porsche',
          canonical_name: '911',
          slug: '911',
          catalogue_status: 'PUBLISHED'
        }
      ],
      generations: [
        {
          id: 'gen-992',
          model_id: 'model-911',
          generation_code: '992',
          canonical_name: '992',
          slug: '992',
          production_start: 2019,
          catalogue_status: 'PUBLISHED'
        }
      ],
      variants: [
        {
          id: 'var-992-gt3',
          generation_id: 'gen-992',
          manufacturer_id: 'maker-porsche',
          manufacturer_name: 'Porsche',
          model_name: '911',
          variant_name: '911 GT3',
          slug: '911-gt3',
          production_start_year: 2021,
          data_status: 'verified',
          catalogue_status: 'PUBLISHED'
        }
      ],
      engines: [
        {
          id: 'eng-40-flat6',
          engine_code: 'MA2.75',
          canonical_name: '4.0L Naturally Aspirated Flat-6',
          slug: '4-0l-flat-6',
          specs: {
            displacement_cc: 3996,
            power_hp: 510,
            torque_nm: 470
          },
          data_status: 'verified',
          catalogue_status: 'PUBLISHED'
        }
      ]
    });

    assert(
      result.makersUpserted === 1 &&
      result.modelsUpserted === 1 &&
      result.generationsUpserted === 1 &&
      result.variantsUpserted === 1 &&
      result.enginesUpserted === 1,
      'Atomic hierarchy write committed 5 canonical entities successfully'
    );
  } catch (err: any) {
    assert(false, 'Hierarchy upsert failed', err.message);
  }

  // --- TEST 3: Persistent Provider Query Methods ---
  console.log('\nTEST GROUP 3: PersistentCatalogueProvider Read Operations');

  const ready = await provider.isReady();
  assert(ready === true, 'Provider isReady() returns true on reachable datastore');

  const makers = await provider.getMakers();
  assert(makers.length === 1 && makers[0].id === 'maker-porsche', 'getMakers() retrieves persisted Maker');

  const makerBySlug = await provider.getMakerBySlug('porsche');
  assert(makerBySlug?.canonical_name === 'Porsche', 'getMakerBySlug("porsche") resolved correct entity');

  const modelsByMaker = await provider.getModelsByMaker('porsche');
  assert(modelsByMaker.length === 1 && modelsByMaker[0].id === 'model-911', 'getModelsByMaker("porsche") resolved 911');

  const genByIdOrSlug = await provider.getGenerationByIdOrSlug('992');
  assert(genByIdOrSlug?.id === 'gen-992', 'getGenerationByIdOrSlug("992") resolved gen-992');

  const variants = await provider.getVariantsByGeneration('gen-992');
  assert(variants.length === 1 && variants[0].slug === '911-gt3', 'getVariantsByGeneration("gen-992") resolved 911 GT3');

  const variantsByModel = await provider.getVariantsByModel('model-911');
  assert(variantsByModel.length === 1 && variantsByModel[0].id === 'var-992-gt3', 'getVariantsByModel("model-911") resolved transitive variants');

  const engines = await provider.getCanonicalEngines();
  assert(engines.length === 1 && engines[0].id === 'eng-40-flat6', 'getCanonicalEngines() retrieved persisted engine');

  // --- TEST 4: Slug Ambiguity / Duplicate Collision Guard ---
  console.log('\nTEST GROUP 4: Slug Ambiguity / Duplicate Collision Guard');
  // Inject duplicate maker slug directly to verify fail-fast integrity check
  await mockDb.collection('catalogue_makers').doc('maker-porsche-dup').set({
    id: 'maker-porsche-dup',
    canonical_name: 'Porsche Duplicate',
    slug: 'porsche'
  });

  try {
    await provider.getMakerBySlug('porsche');
    assert(false, 'Querying duplicate maker slug must throw CatalogueIntegrityError');
  } catch (err) {
    assert(err instanceof CatalogueIntegrityError, 'Duplicate slug query rejected with CatalogueIntegrityError');
  }

  console.log('\n====================================================');
  console.log(`  SUITE COMPLETE: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('====================================================');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runPersistentCatalogueTestSuite().catch(err => {
  console.error('Test suite crashed:', err);
  process.exit(1);
});
