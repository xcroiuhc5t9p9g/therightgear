const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetBlock = `  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }`;

code = code.replace(targetBlock, '');

fs.writeFileSync('src/App.tsx', code);
console.log('Removed top-level loading block');
