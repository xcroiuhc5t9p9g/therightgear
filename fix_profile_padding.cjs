const fs = require('fs');
let code = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');
code = code.replace(/p-8/g, 'p-6 sm:p-8');
fs.writeFileSync('src/pages/ProfilePage.tsx', code);
