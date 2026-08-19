import { catalogueRepository } from './src/services/catalogueRepository.js';

async function run() {
  const variants = await catalogueRepository.getVariants();
  const models = new Set(variants.map(v => v.manufacturer_name + '|||' + v.model_name + '|||' + v.slug));
  console.log(Array.from(models).join('\n'));
}

run();
