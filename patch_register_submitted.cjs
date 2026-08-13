const fs = require('fs');
let code = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf8');

code = code.replace(
  /\{submitted \? \(/,
  "{ false ? ("
);

fs.writeFileSync('src/pages/RegisterPage.tsx', code);
console.log('Patched submitted in RegisterPage');
