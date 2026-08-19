import { catalogueRepository } from '../src/services/catalogueRepository.js';

async function validateUiFixture() {
  console.log('--- RUNNING AUTOMATED UI FIXTURE VALIDATION ---');
  
  const [makersList, modelsList, generationsList, variantsList, enginesList] = await Promise.all([
    catalogueRepository.getMakers(),
    catalogueRepository.getModels(),
    catalogueRepository.getGenerations(),
    catalogueRepository.getVariants(),
    catalogueRepository.getEngines()
  ]);
  
  const makers = makersList.filter(m => (m as any).is_ui_fixture);
  const models = modelsList.filter(m => (m as any).is_ui_fixture);
  const generations = generationsList.filter(m => (m as any).is_ui_fixture);
  const variants = variantsList.filter(m => m.is_ui_fixture);
  const engines = enginesList.filter(m => (m as any).is_ui_fixture);

  console.log(`Honda Fixture Makers count: ${makers.length} (Expected: 1)`);
  console.log(`Honda Fixture Models count: ${models.length} (Expected: 1)`);
  console.log(`Honda Fixture Generations count: ${generations.length} (Expected: 11)`);
  console.log(`Honda Fixture Variants count: ${variants.length} (Expected: 12)`);
  console.log(`Honda Fixture Engines count: ${engines.length} (Expected: 10)`);

  let errors: string[] = [];
  
  if (makers.length !== 1) errors.push(`Expected 1 Maker, found ${makers.length}`);
  if (models.length !== 1) errors.push(`Expected 1 Model, found ${models.length}`);
  if (generations.length !== 11) errors.push(`Expected 11 Generations, found ${generations.length}`);
  if (variants.length !== 12) errors.push(`Expected 12 Variants, found ${variants.length}`);
  if (engines.length !== 10) errors.push(`Expected 10 Engines, found ${engines.length}`);

  // Check data_status
  variants.forEach(v => {
    const datStatus = v.data_status || (v as any).dataStatus;
    if (datStatus !== 'demo') {
      errors.push(`Variant ${v.id} has data_status='${datStatus}', expected 'demo'`);
    }
  });

  if (errors.length > 0) {
    console.error('Validation FAILED with errors:');
    errors.forEach(e => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('SUCCESS: UI Fixture matches expectations!');
  }
}

validateUiFixture();
