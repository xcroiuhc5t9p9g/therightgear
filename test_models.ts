import { generateFullCatalog } from './src/data/catalogData.js';
const catalog = generateFullCatalog();
const models = new Set(catalog.map(v => v.manufacturer_name + '|||' + v.model_name + '|||' + v.slug));
console.log(Array.from(models).join('\n'));
