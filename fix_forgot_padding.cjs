const fs = require('fs');
let code = fs.readFileSync('src/pages/ForgotPasswordPage.tsx', 'utf8');
code = code.replace(/className="bg-white p-8 rounded-2xl/g, 'className="bg-white p-6 sm:p-8 rounded-2xl');
fs.writeFileSync('src/pages/ForgotPasswordPage.tsx', code);
