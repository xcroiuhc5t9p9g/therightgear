const fs = require('fs');
let code = fs.readFileSync('src/components/RequireAuth.tsx', 'utf8');

code = code.replace(
  "  if (!isAuthenticated) {\n    return null; // Will redirect in useEffect\n  }",
  "  if (!isAuthenticated) {\n    return null; // Will redirect in useEffect\n  }\n  if (!emailVerified) {\n    return null; // Will redirect in useEffect\n  }"
);

fs.writeFileSync('src/components/RequireAuth.tsx', code);
