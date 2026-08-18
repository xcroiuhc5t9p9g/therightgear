const fs = require('fs');
let code = fs.readFileSync('src/pages/ExplorePage.tsx', 'utf8');
code = code.replace(/className="flex items-center justify-center p-6 bg-white/g, 'className="flex items-center justify-center p-3 sm:p-6 bg-white');
code = code.replace(/className="font-bold text-lg text-trg-carbon"/g, 'className="font-bold text-base sm:text-lg text-trg-carbon"');
fs.writeFileSync('src/pages/ExplorePage.tsx', code);
