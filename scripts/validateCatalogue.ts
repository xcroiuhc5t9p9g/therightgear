import { TEST_MAKERS, TEST_MODELS, TEST_GENERATIONS, TEST_VARIANTS } from '../src/data/testCatalogue';
import { catalogueRepository } from '../src/services/catalogueRepository';

function validateCatalogue() {
  console.log('--- RUNNING AUTOMATED CATALOGUE VALIDATION ---');

  const hierarchy = catalogueRepository.getHierarchy();
  const makers = hierarchy.makers;
  const models = hierarchy.models;
  const generations = hierarchy.generations;
  const variants = hierarchy.variants;

  console.log(`Makers count: ${makers.length} (Expected: 4)`);
  console.log(`Models count: ${models.length} (Expected: 4)`);
  console.log(`Generations count: ${generations.length} (Expected: 4)`);
  console.log(`Variants count: ${variants.length} (Expected: 7)`);

  let errors: string[] = [];

  if (makers.length !== 4) errors.push(`Expected 4 Makers, found ${makers.length}`);
  if (models.length !== 4) errors.push(`Expected 4 Models, found ${models.length}`);
  if (generations.length !== 4) errors.push(`Expected 4 Generations, found ${generations.length}`);
  if (variants.length !== 7) errors.push(`Expected 7 Variants, found ${variants.length}`);

  // Check catalogueStatus and dataStatus
  variants.forEach(v => {
    const catStatus = v.catalogue_status || v.catalogueStatus;
    const datStatus = v.data_status || v.dataStatus;

    if (catStatus !== 'IN_RESEARCH') {
      errors.push(`Variant ${v.id} has catalogueStatus='${catStatus}', expected 'IN_RESEARCH'`);
    }
    if (datStatus !== 'DEMO') {
      errors.push(`Variant ${v.id} has dataStatus='${datStatus}', expected 'DEMO'`);
    }

    // Check for forbidden pre-populated data
    if (v.history_en) errors.push(`Variant ${v.id} has pre-populated history_en`);
    if (v.engine?.engine_code) errors.push(`Variant ${v.id} has pre-populated engine.engine_code '${v.engine.engine_code}'`);
    if (v.engine?.power_hp) errors.push(`Variant ${v.id} has pre-populated engine.power_hp '${v.engine.power_hp}'`);
    if (v.specs?.acceleration_0_100) errors.push(`Variant ${v.id} has pre-populated specs.acceleration_0_100`);
    if (v.scores?.collector_score?.overall_score) errors.push(`Variant ${v.id} has pre-populated collector_score`);
  });

  if (errors.length > 0) {
    console.error('Validation FAILED with errors:');
    errors.forEach(e => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('SUCCESS: Test Catalogue matches approved baseline exactly!');
  }
}

validateCatalogue();
