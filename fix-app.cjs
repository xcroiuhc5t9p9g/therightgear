const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
code = code.replace(
  "import { RegisterPage } from './pages/RegisterPage';",
  "import { RegisterPage } from './pages/RegisterPage';\nimport { VerifyEmailPage } from './pages/VerifyEmailPage';"
);

// Add route
code = code.replace(
  "{currentPage === 'register' && (",
  "{currentPage === 'verify-email' && (\n            <VerifyEmailPage onNavigate={handleNavigate} />\n          )}\n          {currentPage === 'register' && ("
);

fs.writeFileSync('src/App.tsx', code);
