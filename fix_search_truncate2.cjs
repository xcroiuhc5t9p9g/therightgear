const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/<div className="font-medium text-trg-carbon text-sm">/g, '<div className="font-medium text-trg-carbon text-sm truncate">');

fs.writeFileSync('src/components/Header.tsx', code);
