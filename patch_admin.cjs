const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

code = code.replace(
  /\{setActiveRole && \([\s\S]*?Sign in as Administrator[\s\S]*?<\/button>\n          \)\}/,
  ""
);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
console.log('Patched AdminPage');
