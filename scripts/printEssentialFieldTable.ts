import { importEngine } from '../src/services/importProviders/importEngine';
import { importLabStore } from '../src/services/importLabStore';
import { ESSENTIAL_FIELDS } from '../src/data/importLabSpecs';

async function printTable() {
  const job = await importEngine.executeImportJob('bmw-m3-e30-sport-evolution', { mode: 'LIVE' });
  const assertions = importLabStore.getAssertionsForJob(job.id);
  const sources = importLabStore.getDataSourcesForJob(job.id);

  console.log('FIELD-BY-FIELD TABLE FOR 43 ESSENTIAL FIELDS:\n');
  console.log('Key | Field Label | Category | Live Discovered Value | Normalized | Source Domain | Trust Level | Confidence | Status');
  console.log('-------------------------------------------------------------------------------------------------------------------------');

  for (const field of ESSENTIAL_FIELDS) {
    const fieldAssertions = assertions.filter(a => a.fieldName === field.key);
    if (fieldAssertions.length === 0) {
      console.log(`${field.key} | ${field.label} | ${field.section} | NULL | MISSING | N/A | N/A | N/A | MISSING`);
    } else {
      for (const ast of fieldAssertions) {
        const src = sources.find(s => s.sourceUrl === ast.sourceUrl || s.sourceTitle === ast.sourceTitle);
        const domain = src ? src.domain : (ast.sourceUrl ? new URL(ast.sourceUrl).hostname : 'N/A');
        console.log(`${field.key} | ${field.label} | ${field.section} | "${ast.rawValue}" | "${ast.normalizedValue}${ast.unit ? ' ' + ast.unit : ''}" | ${domain} | ${ast.trustLevel} | ${ast.confidenceScore}% | ${ast.verificationStatus}`);
      }
    }
  }
}

printTable().catch(console.error);
