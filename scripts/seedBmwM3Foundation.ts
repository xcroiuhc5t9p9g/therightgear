import { BMW_M3_FOUNDATION_SEED } from '../src/services/catalogue/seeds/bmwM3Foundation.js';
import { CatalogueSeedEngine } from '../src/services/catalogue/seeds/CatalogueSeedEngine.js';
import { PersistentCatalogueProvider } from '../src/services/catalogue/providers/PersistentCatalogueProvider.js';

async function main() {
  const args = process.argv.slice(2);
  const isApply = args.includes('--apply') || args.includes('--write');
  const isConfirmed = args.includes('--confirm');
  const isForce = args.includes('--force');
  const isVerify = args.includes('--verify');

  console.log('================================================================');
  console.log('  THE RIGHT GEAR — CANONICAL SEED PIPELINE: BMW M3 FOUNDATION');
  console.log('================================================================\n');

  console.log(`Bundle ID:      ${BMW_M3_FOUNDATION_SEED.bundleId}`);
  console.log(`Version:        ${BMW_M3_FOUNDATION_SEED.version}`);
  console.log(`Description:    ${BMW_M3_FOUNDATION_SEED.description}\n`);

  console.log('--- SOURCE PROVENANCE MANIFEST ---');
  BMW_M3_FOUNDATION_SEED.sources.forEach(src => {
    console.log(`  [${src.tier}] ${src.title}`);
    console.log(`     Publisher: ${src.publisher} (${src.publishedYear || 'N/A'})`);
    if (src.documentRef) console.log(`     Doc Ref:   ${src.documentRef}`);
    if (src.referenceUrl) console.log(`     URL:       ${src.referenceUrl}`);
    if (src.notes) console.log(`     Notes:     ${src.notes}`);
  });
  console.log('');

  const seedEngine = new CatalogueSeedEngine();

  // 1. Generate Ingestion Plan
  console.log('Generating Ingestion Plan...');
  const plan = await seedEngine.planSeed(BMW_M3_FOUNDATION_SEED);

  console.log('--- INGESTION PLAN SUMMARY ---');
  console.log(`Total Entities:    ${plan.totalEntities}`);
  console.log(`  - CREATE:        ${plan.actionsCount.CREATE}`);
  console.log(`  - NO_OP:         ${plan.actionsCount.NO_OP}`);
  console.log(`  - MERGE:         ${plan.actionsCount.MERGE}`);
  console.log(`  - CONFLICT:      ${plan.actionsCount.CONFLICT}\n`);

  console.log('--- PLANNED ENTITIES ---');
  plan.items.forEach(item => {
    const symbol = item.action === 'CREATE' ? '[+]' : item.action === 'NO_OP' ? '[=]' : item.action === 'MERGE' ? '[~]' : '[!]';
    console.log(`  ${symbol} ${item.action.padEnd(8)} ${item.entityType.padEnd(10)} ${item.id.padEnd(30)} ${item.canonicalName}`);
    if (item.differences && item.differences.length > 0) {
      item.differences.forEach(diff => {
        console.log(`      * Field "${diff.field}": existing=${JSON.stringify(diff.existingValue)} -> incoming=${JSON.stringify(diff.incomingValue)}`);
      });
    }
  });
  console.log('');

  // 2. Execution logic
  if (!isApply) {
    console.log('================================================================');
    console.log('  STATUS: DRY RUN COMPLETED (No datastore mutations performed)');
    console.log('  To apply these changes persistently, run:');
    console.log('    npm run catalogue:seed:bmw-m3 -- --apply --confirm');
    console.log('================================================================\n');
    return;
  }

  if (!isConfirmed) {
    console.error('ERROR: Safety check failed. To write to datastore, you must provide --confirm.');
    console.error('Usage: npm run catalogue:seed:bmw-m3 -- --apply --confirm');
    process.exit(1);
  }

  if (plan.hasConflicts && !isForce) {
    console.error(`ERROR: Seed plan contains ${plan.actionsCount.CONFLICT} conflicting differences.`);
    console.error('Aborting write for safety. Review differences or use --force if intentional.');
    process.exit(1);
  }

  console.log('Applying canonical seed hierarchy to persistent datastore...');
  const result = await seedEngine.executeSeed(BMW_M3_FOUNDATION_SEED, {
    dryRun: false,
    confirmWrite: true,
    forceOnConflict: isForce
  });

  console.log('\n--- PERSISTENCE WRITE RESULTS ---');
  console.log(`Makers Upserted:      ${result.upsertCounts.makers}`);
  console.log(`Models Upserted:      ${result.upsertCounts.models}`);
  console.log(`Generations Upserted: ${result.upsertCounts.generations}`);
  console.log(`Variants Upserted:    ${result.upsertCounts.variants}`);
  console.log(`Engines Upserted:     ${result.upsertCounts.engines}`);

  // 3. Optional Post-Seed Verification
  if (isVerify) {
    console.log('\n--- VERIFYING PERSISTENT DATASTORE READINESS ---');
    const provider = new PersistentCatalogueProvider();
    await provider.assertReady();

    const bmwMaker = await provider.getMakerBySlug('bmw');
    console.log(`  ✓ Maker resolved: ${bmwMaker?.canonical_name} (${bmwMaker?.id})`);

    const m3Model = await provider.getModelBySlug('bmw', 'm3');
    console.log(`  ✓ Model resolved: ${m3Model?.canonical_name} (${m3Model?.id})`);

    const e30Gen = await provider.getGenerationBySlug('e30');
    console.log(`  ✓ Generation resolved: ${e30Gen?.canonical_name} (${e30Gen?.id})`);

    const variants = await provider.getVariantsByGeneration('gen-bmw-m3-e30');
    console.log(`  ✓ Variants found in generation (${variants.length}): ${variants.map(v => v.variant_name).join(', ')}`);

    const engines = await provider.getCanonicalEngines();
    console.log(`  ✓ Canonical engines registered (${engines.length}): ${engines.map(e => e.canonical_name).join(', ')}`);
  }

  console.log('\n================================================================');
  console.log('  CANONICAL SEED COMPLETED SUCCESSFULLY');
  console.log('================================================================\n');
}

main().catch(err => {
  const msg = err?.message || String(err);
  if (msg.includes('PERMISSION_DENIED') || msg.includes('UNAUTHENTICATED')) {
    console.error('\n[THE RIGHT GEAR CATALOGUE] Datastore Authentication / Permission Notice:');
    console.error('  Live Firestore connection requires Google Cloud credentials (GOOGLE_APPLICATION_CREDENTIALS or Firebase Admin service account).');
    console.error(`  Original error details: ${msg}`);
  } else {
    console.error('\n[FATAL] Seed execution failed:', err);
  }
  process.exit(1);
});
