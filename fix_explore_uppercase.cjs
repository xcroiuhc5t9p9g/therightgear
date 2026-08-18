const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
code = code.replace(/className="text-sm font-semibold text-trg-carbon hover:text-trg-red tracking-wide uppercase transition-colors"/g, 'className="text-sm font-semibold text-trg-carbon hover:text-trg-red tracking-wide transition-colors"');
fs.writeFileSync('src/components/Header.tsx', code);
