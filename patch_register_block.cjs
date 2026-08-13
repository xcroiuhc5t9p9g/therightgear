const fs = require('fs');
let code = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf8');

// Replace the block { false ? ( ... ) : (
const regex = /\{\s*false\s*\?\s*\([\s\S]*?\)\s*:\s*\(/;
code = code.replace(regex, '{ (');

fs.writeFileSync('src/pages/RegisterPage.tsx', code);
console.log('Patched block in RegisterPage');
