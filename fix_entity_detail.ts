import fs from 'fs';

let content = fs.readFileSync('src/pages/EntityDetailPage.tsx', 'utf8');

content = content.replace(
  /role: entity\.type === 'Engineer' \? 'Engineer' : 'Designer',/,
  "role: entity.entityClass === 'PERSON' ? entity.roles[0] : entity.organizationType,"
);

content = content.replace(
  /keywords: \[entity\.name, entity\.type, 'Automotive Designer', 'Supercar Engineer', 'Automotive Intelligence'\]/,
  "keywords: [entity.name, entity.entityClass === 'PERSON' ? entity.roles[0] : entity.organizationType, 'Automotive Designer', 'Supercar Engineer', 'Automotive Intelligence']"
);

content = content.replace(
  /\{entity\.type\}/g,
  "{entity.entityClass === 'PERSON' ? entity.roles.join(', ') : entity.organizationType.replace('_', ' ')}"
);

fs.writeFileSync('src/pages/EntityDetailPage.tsx', content);
