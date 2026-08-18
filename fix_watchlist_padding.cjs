const fs = require('fs');
let code = fs.readFileSync('src/pages/WatchlistPage.tsx', 'utf8');
code = code.replace(/p-12/g, 'p-6 sm:p-12');
fs.writeFileSync('src/pages/WatchlistPage.tsx', code);
