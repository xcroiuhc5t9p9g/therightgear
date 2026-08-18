const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const startStr = "} else if (cleanPath.startsWith('/cars/bmw/m3/e30/sport-evolution') || cleanPath.endsWith('/sport-evolution')) {";
const endStr = "} else if (cleanPath === '/cars/bmw/m3/e30' || cleanPath === '/cars/bmw/m3/e30/') {";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newLogic = `} else if (cleanPath.startsWith('/cars/') && cleanPath.split('/').length >= 5 || cleanPath.startsWith('/vehicle/')) {
    const slugParts = cleanPath.split('/');
    const targetSlug = slugParts[slugParts.length - 1];
    const vehicle = CATALOG_DATABASE.find(v => v.slug === targetSlug || v.id === targetSlug);
    if (vehicle) {
      const s = vehicle.data_status?.toLowerCase();
      const isPublic = s === 'verified' || s === 'licensed' || s === 'approved';
      
      title = \`\${vehicle.manufacturer_name} \${vehicle.model_name} \${vehicle.variant_name} | The Right Gear\`;
      description = \`Automotive details for \${vehicle.manufacturer_name} \${vehicle.model_name} \${vehicle.variant_name}.\`;
      
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Car",
        "name": \`\${vehicle.manufacturer_name} \${vehicle.model_name} \${vehicle.variant_name}\`,
        "manufacturer": { "@type": "Organization", "name": vehicle.manufacturer_name },
        "model": vehicle.model_name,
        "url": \`\${baseUrl}\${cleanPath}\`
      };

      bodyHtml = \`
        \${headerHtml}
        <main>
          <h1>\${vehicle.manufacturer_name} \${vehicle.model_name} \${vehicle.variant_name}</h1>
          \${!isPublic ? '<p>Data currently under research.</p>' : \`<p>Engine: \${vehicle.engine?.type_code || 'N/A'}, \${vehicle.engine?.power_hp ? vehicle.engine.power_hp + ' HP' : 'N/A'}</p>\`}
        </main>
        \${footerHtml}
      \`;
    }
  `;
  content = content.substring(0, startIndex) + newLogic + content.substring(endIndex);
  fs.writeFileSync('server.ts', content);
  console.log('Replaced successfully');
} else {
  console.log('Strings not found');
}
