import { CatalogueProviderFactory } from '../services/catalogue/CatalogueProviderFactory.js';
import { CatalogueRepository } from '../services/catalogue/CatalogueRepository.js';
import { FixtureCatalogueProvider } from '../services/catalogue/providers/FixtureCatalogueProvider.js';
import { PersistentCatalogueProvider } from '../services/catalogue/providers/PersistentCatalogueProvider.js';
import { 
  CatalogueConfigurationError, 
  CataloguePersistenceError, 
  CatalogueIntegrityError 
} from '../services/catalogue/types.js';
import { CatalogueValidator } from '../services/catalogue/CatalogueValidator.js';

export async function runCatalogueProviderSafetyTestSuite() {
  console.log('====================================================');
  console.log('RUNNING DATA-14R CATALOGUE PROVIDER SAFETY TEST SUITE');
  console.log('====================================================\n');

  const results: { testName: string; passed: boolean; details: string }[] = [];

  const originalNodeEnv = process.env.NODE_ENV;
  const originalCatSource = process.env.CATALOGUE_SOURCE;
  const originalAllowProdFixtures = process.env.ALLOW_PRODUCTION_FIXTURES;

  try {
    // TEST 1: Production Fail-Closed on Unset CATALOGUE_SOURCE
    console.log('Test 1: Testing production fail-closed when CATALOGUE_SOURCE is unset...');
    process.env.NODE_ENV = 'production';
    delete process.env.CATALOGUE_SOURCE;
    delete process.env.ALLOW_PRODUCTION_FIXTURES;

    let test1Passed = false;
    let test1Details = '';
    try {
      CatalogueProviderFactory.createProvider();
      test1Details = 'Expected CatalogueConfigurationError but factory succeeded';
    } catch (e: any) {
      if (e instanceof CatalogueConfigurationError) {
        test1Passed = true;
        test1Details = `Caught expected CatalogueConfigurationError: ${e.message}`;
      } else {
        test1Details = `Caught unexpected error type: ${e.name}`;
      }
    }
    results.push({
      testName: 'Test 1: Production Fail-Closed on Unset CATALOGUE_SOURCE',
      passed: test1Passed,
      details: test1Details
    });

    // TEST 2: Production Fail-Closed on CATALOGUE_SOURCE=FIXTURE (without override)
    console.log('Test 2: Testing production rejection of CATALOGUE_SOURCE=FIXTURE...');
    process.env.NODE_ENV = 'production';
    process.env.CATALOGUE_SOURCE = 'FIXTURE';
    delete process.env.ALLOW_PRODUCTION_FIXTURES;

    let test2Passed = false;
    let test2Details = '';
    try {
      CatalogueProviderFactory.createProvider();
      test2Details = 'Expected CatalogueConfigurationError but factory succeeded';
    } catch (e: any) {
      if (e instanceof CatalogueConfigurationError) {
        test2Passed = true;
        test2Details = `Caught expected CatalogueConfigurationError: ${e.message}`;
      } else {
        test2Details = `Caught unexpected error type: ${e.name}`;
      }
    }
    results.push({
      testName: 'Test 2: Production Rejection of CATALOGUE_SOURCE=FIXTURE',
      passed: test2Passed,
      details: test2Details
    });

    // TEST 3: Production Acceptance of CATALOGUE_SOURCE=PERSISTENT
    console.log('Test 3: Testing production selection of PersistentCatalogueProvider...');
    process.env.NODE_ENV = 'production';
    process.env.CATALOGUE_SOURCE = 'PERSISTENT';

    let test3Passed = false;
    let test3Details = '';
    try {
      const provider = CatalogueProviderFactory.createProvider();
      if (provider instanceof PersistentCatalogueProvider && provider.providerType === 'PERSISTENT') {
        test3Passed = true;
        test3Details = 'Successfully instantiated PersistentCatalogueProvider';
      } else {
        test3Details = `Instantiated wrong provider type: ${provider.providerType}`;
      }
    } catch (e: any) {
      test3Details = `Failed with unexpected error: ${e.message}`;
    }
    results.push({
      testName: 'Test 3: Production Instantiation of PersistentCatalogueProvider',
      passed: test3Passed,
      details: test3Details
    });

    // TEST 4: PersistentCatalogueProvider Fail-Closed Behavior
    console.log('Test 4: Testing PersistentCatalogueProvider fail-closed data access...');
    const persistentProvider = new PersistentCatalogueProvider();
    let test4Passed = false;
    let test4Details = '';
    try {
      const ready = await persistentProvider.isReady();
      if (ready !== false) {
        test4Details = 'isReady() returned true for unconfigured persistent provider';
      } else {
        await persistentProvider.getVariants();
        test4Details = 'getVariants() returned data instead of throwing CataloguePersistenceError';
      }
    } catch (e: any) {
      if (e instanceof CataloguePersistenceError) {
        test4Passed = true;
        test4Details = `Caught expected CataloguePersistenceError: ${e.message}`;
      } else {
        test4Details = `Caught unexpected error type: ${e.name}`;
      }
    }
    results.push({
      testName: 'Test 4: PersistentCatalogueProvider Throws CataloguePersistenceError',
      passed: test4Passed,
      details: test4Details
    });

    // TEST 5: Development Default to Fixture Provider
    console.log('Test 5: Testing development default provider selection...');
    process.env.NODE_ENV = 'development';
    delete process.env.CATALOGUE_SOURCE;

    let test5Passed = false;
    let test5Details = '';
    try {
      const provider = CatalogueProviderFactory.createProvider();
      if (provider instanceof FixtureCatalogueProvider && provider.providerType === 'FIXTURE') {
        const isReady = await provider.isReady();
        const variants = await provider.getVariants();
        if (isReady && variants.length > 0) {
          test5Passed = true;
          test5Details = `Instantiated FixtureCatalogueProvider with ${variants.length} variants in ready state`;
        } else {
          test5Details = `Provider not ready or returned 0 variants`;
        }
      } else {
        test5Details = `Wrong provider type: ${provider.providerType}`;
      }
    } catch (e: any) {
      test5Details = `Unexpected error: ${e.message}`;
    }
    results.push({
      testName: 'Test 5: Development Default to FixtureCatalogueProvider',
      passed: test5Passed,
      details: test5Details
    });

    // TEST 6: CatalogueRepository Async Contract & Non-Blocking Hierarchy
    console.log('Test 6: Testing CatalogueRepository async hierarchy resolution...');
    const repo = new CatalogueRepository(new FixtureCatalogueProvider());
    let test6Passed = false;
    let test6Details = '';
    try {
      const hierarchy = await repo.resolveModelHierarchy('civic');
      if (hierarchy && hierarchy.model && hierarchy.maker && hierarchy.generationContexts.length > 0) {
        const variantsByModel = await repo.getVariantsByModel(hierarchy.model.id);
        if (variantsByModel.length === hierarchy.allVariants.length) {
          test6Passed = true;
          test6Details = `Resolved ${hierarchy.model.canonical_name} (${hierarchy.maker.canonical_name}) with ${hierarchy.generationContexts.length} generation context(s) and ${hierarchy.allVariants.length} variant(s)`;
        } else {
          test6Details = `Mismatch in variants count: ${variantsByModel.length} vs ${hierarchy.allVariants.length}`;
        }
      } else {
        test6Details = 'Hierarchy resolution returned null or missing components';
      }
    } catch (e: any) {
      test6Details = `Hierarchy resolution failed: ${e.message}`;
    }
    results.push({
      testName: 'Test 6: CatalogueRepository Async Model Hierarchy Resolution',
      passed: test6Passed,
      details: test6Details
    });

    // TEST 7: Catalogue Structural Validation
    console.log('Test 7: Testing CatalogueValidator async validation...');
    let test7Passed = false;
    let test7Details = '';
    try {
      const validation = await repo.validate();
      if (validation.valid && validation.errors.length === 0) {
        test7Passed = true;
        test7Details = `Catalogue is valid: ${validation.metrics.makersCount} makers, ${validation.metrics.modelsCount} models, ${validation.metrics.generationsCount} generations, ${validation.metrics.variantsCount} variants, ${validation.metrics.enginesCount} engines`;
      } else {
        test7Details = `Validation errors found (${validation.errors.length}): ${validation.errors.map(e => e.message).join(', ')}`;
      }
    } catch (e: any) {
      test7Details = `Validation failed with error: ${e.message}`;
    }
    results.push({
      testName: 'Test 7: CatalogueValidator Structural Integrity',
      passed: test7Passed,
      details: test7Details
    });

    // TEST 8: Repository Fail-Closed Isolation under Persistent Provider
    console.log('Test 8: Testing CatalogueRepository fail-closed under PersistentCatalogueProvider...');
    const persistentRepo = new CatalogueRepository(new PersistentCatalogueProvider());
    let test8Passed = false;
    let test8Details = '';
    try {
      const isReady = await persistentRepo.isReady();
      if (isReady !== false) {
        test8Details = 'Persistent repo isReady() returned true';
      } else {
        await persistentRepo.getVariants();
        test8Details = 'Persistent repo getVariants() succeeded instead of failing closed';
      }
    } catch (e: any) {
      if (e instanceof CataloguePersistenceError) {
        test8Passed = true;
        test8Details = `Caught expected CataloguePersistenceError: ${e.message}`;
      } else {
        test8Details = `Caught unexpected error: ${e.name} - ${e.message}`;
      }
    }
    results.push({
      testName: 'Test 8: CatalogueRepository Fail-Closed under Persistent Provider',
      passed: test8Passed,
      details: test8Details
    });

  } finally {
    // Restore environment
    process.env.NODE_ENV = originalNodeEnv;
    if (originalCatSource !== undefined) {
      process.env.CATALOGUE_SOURCE = originalCatSource;
    } else {
      delete process.env.CATALOGUE_SOURCE;
    }
    if (originalAllowProdFixtures !== undefined) {
      process.env.ALLOW_PRODUCTION_FIXTURES = originalAllowProdFixtures;
    } else {
      delete process.env.ALLOW_PRODUCTION_FIXTURES;
    }
  }

  console.log('\n====================================================');
  console.log('DATA-14R TEST SUITE RESULTS');
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
  runCatalogueProviderSafetyTestSuite();
}
