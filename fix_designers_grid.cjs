const fs = require('fs');
let code = fs.readFileSync('src/pages/ExplorePage.tsx', 'utf8');
code = code.replace(/className="flex flex-col items-center justify-center p-6 bg-white border border-trg-gray-200 rounded-xl min-h-\[44px\]"/g, 'className="flex flex-col items-center justify-center p-3 sm:p-6 bg-white border border-trg-gray-200 rounded-xl min-h-[44px]"');
fs.writeFileSync('src/pages/ExplorePage.tsx', code);
