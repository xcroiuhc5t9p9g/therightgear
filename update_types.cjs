const fs = require('fs');

let content = fs.readFileSync('src/types/index.ts', 'utf8');

// Replace UserRole definition
content = content.replace(
  /export type UserRole =[\s\S]*?\| 'admin';\s*\/\/[^\n]*/m,
  "export type UserRole = 'visitor' | 'private_user' | 'corporate_user' | 'editor' | 'super_admin';"
);

fs.writeFileSync('src/types/index.ts', content);
