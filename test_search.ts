import { CatalogueRepository } from './src/services/catalogueRepository';

const repo = new CatalogueRepository();
const queries = ['B', 'BM', 'BMW', 'M3', 'E30', 'Sport'];

queries.forEach(q => {
  const results = repo.search(q);
  console.log(`Query: "${q}" -> Results: ${results.length}`);
  results.forEach(r => {
    console.log(`  - [${r.type}] ${r.title} => ${r.url}`);
  });
});
