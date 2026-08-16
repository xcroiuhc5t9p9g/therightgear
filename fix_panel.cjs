const fs = require('fs');
let code = fs.readFileSync('src/components/SearchDiscoveryPanel.tsx', 'utf8');

code = code.replace(/suggestion\.canonicalUrl/g, 'suggestion.url');

fs.writeFileSync('src/components/SearchDiscoveryPanel.tsx', code);
