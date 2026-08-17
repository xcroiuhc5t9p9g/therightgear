const fs = require('fs');
let content = fs.readFileSync('src/types/index.ts', 'utf8');

// Replace Manufacturer properties
content = content.replace(/country_code: string;/g, 'country_code?: string;');
content = content.replace(/founded_year: number;/g, 'founded_year?: number;');
content = content.replace(/active: boolean;/g, 'active?: boolean;');

fs.writeFileSync('src/types/index.ts', content);
