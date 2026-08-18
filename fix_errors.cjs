const fs = require('fs');

// Fix server.ts
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  /v\.engine\.family_name\.toLowerCase\(\)\.includes\(q\) \|\|/g,
  ''
);
fs.writeFileSync('server.ts', serverCode);

// Fix scripts/validateCatalogue.ts
let valCode = fs.readFileSync('scripts/validateCatalogue.ts', 'utf8');
valCode = valCode.replace(
  /if \(v\.engine\?\.engine_code\) errors\.push\(`Variant \$\{v\.id\} has pre-populated engine\.engine_code '\$\{v\.engine\.engine_code\}'\`\);\n/g,
  ''
);
fs.writeFileSync('scripts/validateCatalogue.ts', valCode);

// Fix VehicleDetailPage.tsx
let vdpCode = fs.readFileSync('src/pages/VehicleDetailPage.tsx', 'utf8');
vdpCode = vdpCode.replace(
  /<span className="font-mono font-bold text-\[\#D71920\]">\{vehicle\.engine\.engine_code \|\| 'Under Research'\}<\/span>/g,
  '<span className="font-mono font-bold text-[#D71920]">Under Research</span>'
);
fs.writeFileSync('src/pages/VehicleDetailPage.tsx', vdpCode);

// Fix AeoDirectAnswerCard.tsx
let aeoCode = fs.readFileSync('src/components/AeoDirectAnswerCard.tsx', 'utf8');
aeoCode = aeoCode.replace(
  /\( \$\{variant\.engine\?\.engine_code \|\| ''\} \)/g,
  ''
).replace(
  /\(\$\{variant\.engine\?\.engine_code \|\| ''\}\)/g,
  ''
);
fs.writeFileSync('src/components/AeoDirectAnswerCard.tsx', aeoCode);

console.log('Fixed');
