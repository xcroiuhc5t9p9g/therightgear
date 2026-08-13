const fs = require('fs');
const glob = require('glob');

const files = [
  'src/pages/AdminPage.tsx',
  'src/pages/MarketPage.tsx',
  'src/pages/VehicleDetailPage.tsx',
  'src/components/SlideshowBlock.tsx',
  'src/components/VehicleCard.tsx',
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/'public'/g, "'visitor'");
    fs.writeFileSync(file, content);
  }
});
