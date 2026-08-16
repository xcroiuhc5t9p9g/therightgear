const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/      <\/main>\n        } else if \(cleanPath === '\/faq'\) \{\n    title = "FAQ & How it Works \| The Right Gear";\n    description = "Frequently asked questions about The Right Gear, our automotive catalogue, data methodology, and market intelligence.";\n    jsonLd = \{\n      "@context": "https:\/\/schema\.org",\n      "@type": "FAQPage",\n      "mainEntity": \[\]\n    \};\n    bodyHtml = `<main><h1>FAQ & How it Works<\/h1><\/main>`;\n    `;\n  } else if \(cleanPath === '\/about'\) \{/g, 
`      </main>
    \`;
  } else if (cleanPath === '/faq') {
    title = "FAQ & How it Works | The Right Gear";
    description = "Frequently asked questions about The Right Gear, our automotive catalogue, data methodology, and market intelligence.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": []
    };
    bodyHtml = \`<main><h1>FAQ & How it Works</h1></main>\`;
  } else if (cleanPath === '/about') {`);
fs.writeFileSync('server.ts', code);
