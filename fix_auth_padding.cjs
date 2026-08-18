const fs = require('fs');
let code = fs.readFileSync('src/pages/AuthPage.tsx', 'utf8');
code = code.replace(/className="w-full max-w-md bg-white p-8 md:p-10/g, 'className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10');
fs.writeFileSync('src/pages/AuthPage.tsx', code);
