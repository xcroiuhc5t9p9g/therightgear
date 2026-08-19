import { catalogueRepository } from '../src/services/catalogueRepository.js';

async function validateCatalogue() {
  console.log('--- RUNNING AUTOMATED CATALOGUE VALIDATION ---');
  
  const [makersList, modelsList, generationsList, variantsList, enginesList] = await Promise.all([
    catalogueRepository.getMakers(),
    catalogueRepository.getModels(),
    catalogueRepository.getGenerations(),
    catalogueRepository.getVariants(),
    catalogueRepository.getEngines()
  ]);

  // Filter out UI fixtures to check true canonical data
  const makers = makersList.filter(m => !(m as any).is_ui_fixture);
  const models = modelsList.filter(m => !(m as any).is_ui_fixture);
  const generations = generationsList.filter(m => !(m as any).is_ui_fixture);
  const variants = variantsList.filter(m => !m.is_ui_fixture);
  const engines = enginesList.filter(m => !(m as any).is_ui_fixture);

  console.log(`Makers count: ${makers.length} (Expected: 0)`);
  console.log(`Models count: ${models.length} (Expected: 0)`);
  console.log(`Generations count: ${generations.length} (Expected: 0)`);
  console.log(`Variants count: ${variants.length} (Expected: 0)`);
  console.log(`Engines count: ${engines.length} (Expected: 0)`);

  let errors: string[] = [];
  
  if (makers.length !== 0) errors.push(`Expected 0 Maker, found ${makers.length}`);
  if (models.length !== 0) errors.push(`Expected 0 Model, found ${models.length}`);
  if (generations.length !== 0) errors.push(`Expected 0 Generations, found ${generations.length}`);
  if (variants.length !== 0) errors.push(`Expected 0 Variants, found ${variants.length}`);
  if (engines.length !== 0) errors.push(`Expected 0 Engines, found ${engines.length}`);

  if (errors.length > 0) {
    console.error('Validation FAILED with errors:');
    errors.forEach(e => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('SUCCESS: Canonical Catalogue matches approved baseline exactly!');
  }
}

validateCatalogue();
