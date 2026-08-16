const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const regex = /\/\/ Authentication Endpoints[\s\S]*?app\.post\('\/api\/v1\/auth\/register', \(req: Request, res: Response\) => \{[\s\S]*?\}\);\s*app\.post\('\/api\/v1\/auth\/login', \(req: Request, res: Response\) => \{[\s\S]*?\}\);/g;

content = content.replace(regex, '');

fs.writeFileSync('server.ts', content);
