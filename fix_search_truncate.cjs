const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// For desktop
code = code.replace(/<div className="flex items-center gap-3">\s*\{suggestion\.thumbnail && \(\s*<img src=\{suggestion\.thumbnail\} alt="" className="w-10 h-10 object-contain bg-white rounded border border-trg-gray-100" \/>\s*\)\}\s*<div>/g, '<div className="flex items-center gap-3 flex-1 min-w-0">\n                      {suggestion.thumbnail && (\n                        <img src={suggestion.thumbnail} alt="" className="w-10 h-10 object-contain bg-white rounded border border-trg-gray-100 flex-shrink-0" />\n                      )}\n                      <div className="flex-1 min-w-0">');

// Add truncate to text-trg-carbon (desktop)
code = code.replace(/<div className="font-medium text-trg-carbon">/g, '<div className="font-medium text-trg-carbon truncate">');

// Add truncate to subtitle (desktop)
code = code.replace(/<div className="text-xs text-trg-gray-500 mt-0\.5">\{suggestion\.subtitle\}<\/div>/g, '<div className="text-xs text-trg-gray-500 mt-0.5 truncate">{suggestion.subtitle}</div>');


fs.writeFileSync('src/components/Header.tsx', code);
