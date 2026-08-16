const fs = require('fs');
let code = fs.readFileSync('src/services/catalogueRepository.ts', 'utf8');

const startStr = `// Engine adapter\n    this.engines.forEach(e => {\n      this.searchIndex!.push({\n        id: e.id,\n        entityType: 'ENGINE' as any,\n        searchKeys: [\n          { value: e.engine_code, kind: 'ENGINE_CODE' as any },\n          { value: e.family_name, kind: 'ENGINE_CODE' as any },\n          { value: e.canonical_name, kind: 'CANONICAL_NAME' }\n        ],\n        canonicalUrl: this.getCanonicalEntityUrl('ENGINE' as any, { engineId: e.id }),\n        title: e.canonical_name,\n        subtitle: e.family_name,\n      });\n    });`;
code = code.replace(startStr, '');

// Also remove from Variant
code = code.replace(
  /\{ value: model\.canonical_name, kind: 'CANONICAL_NAME' \},\n\s*\.\.\.\(v\.engine\?\.engine_code \? \[\{ value: v\.engine\.engine_code, kind: 'ENGINE_CODE' as any \}\] : \[\]\)/,
  `{ value: model.canonical_name, kind: 'CANONICAL_NAME' }`
);

fs.writeFileSync('src/services/catalogueRepository.ts', code);
