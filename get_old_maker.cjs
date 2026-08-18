const fs = require('fs');
let code = fs.readFileSync('src/pages/MakerDetailPage.tsx', 'utf8');
console.log(code.substring(0, 500));
