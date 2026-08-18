const fs = require('fs');
let catalogContent = fs.readFileSync('src/data/catalogData.ts', 'utf8');

// Replace CV with hp
catalogContent = catalogContent.replace(/ CV/g, ' hp');
catalogContent = catalogContent.replace(/CV \//g, 'hp /');

// For any object keys that have _it (e.g. description_it, caption_it, etc), we might not need to remove them if they aren't used in English, but it's safer to remove them or translate.
fs.writeFileSync('src/data/catalogData.ts', catalogContent);

let hierarchyContent = fs.readFileSync('src/data/vehicleHierarchyData.ts', 'utf8');
hierarchyContent = hierarchyContent.replace(/ CV/g, ' hp');
hierarchyContent = hierarchyContent.replace(/CV \//g, 'hp /');
fs.writeFileSync('src/data/vehicleHierarchyData.ts', hierarchyContent);
console.log('Sanitized CV in catalogData.ts and vehicleHierarchyData.ts');
