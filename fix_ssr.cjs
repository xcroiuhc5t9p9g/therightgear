const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// Replace the SSR function
const startIdx = content.indexOf('function renderHtmlPage(reqPath: string, host: string, protocol: string): string {');
const endIdx = content.indexOf('const html = renderHtmlPage(req.path, host, protocol);', startIdx);
// Find the closing brace of renderHtmlPage (it's right above the 'app.get('*', ...')
// Actually, in the output earlier:
// 1752-  app.get('*', (req: Request, res: Response, next: NextFunction) => {
// 1753-    if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) return next();
// 1754:    const html = renderHtmlPage(req.path, host, protocol);

const newFunction = `function renderHtmlPage(reqPath: string, host: string, protocol: string): string {
  const baseUrl = \`\${protocol}://\${host}\`;
  const cleanPath = reqPath.split('?')[0];

  let title = "The Right Gear | Iconic Cars and Motorbikes Decoded";
  let description = "Automotive Intelligence platform dedicated to iconic, collectible, and investment-relevant automobiles. Technical specs, production counts, and verified provenance.";
  let robots = "index, follow";
  let jsonLd: any = null;
  let bodyHtml = "";

  const headerHtml = \`
    <header>
      <nav aria-label="Main Navigation">
        <a href="/">The Right Gear</a> | 
        <a href="/explore">Explore</a>
      </nav>
    </header>
  \`;

  const footerHtml = \`
    <footer>
      <nav aria-label="Catalogue">
        <h2>Catalogue</h2>
        <ul>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/market">Market Intelligence</a></li>
        </ul>
      </nav>
      <nav aria-label="About">
        <h2>About</h2>
        <ul>
          <li><a href="/about">About The Right Gear</a></li>
          <li><a href="/methodology">Methodology</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Use</a></li>
        </ul>
      </nav>
    </footer>
  \`;

  if (cleanPath === '/' || cleanPath === '') {
    title = "The Right Gear | Iconic Cars and Motorbikes Decoded";
    description = "The Right Gear is the Automotive Intelligence platform for iconic, collectible and investment-relevant automobiles. Discover verified technical specs, production counts, and car provenance.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "The Right Gear",
      "url": baseUrl,
      "description": description
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>The Right Gear | Iconic Cars and Motorbikes Decoded</h1>
        <p>Automotive Intelligence & Provenance for collectible and investment-relevant automobiles.</p>
        <section>
          <h2>Featured Automotive Entities</h2>
          <ul>
            <li><a href="/cars/bmw/m3/e30/sport-evolution">BMW M3 E30 Sport Evolution</a></li>
            <li><a href="/cars/bmw/m3/e30/evolution-ii">BMW M3 E30 Evolution II</a></li>
            <li><a href="/cars/bmw/m3/e30/m3-2-3">BMW M3 E30 2.3</a></li>
          </ul>
        </section>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/about') {
    title = "About The Right Gear | Automotive Intelligence Platform";
    description = "Learn about The Right Gear — an independent Automotive Intelligence platform dedicated to collectible and investment-relevant automobiles.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About The Right Gear",
      "url": \`\${baseUrl}/about\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>About The Right Gear</h1>
        <p>The Right Gear is an Automotive Intelligence platform dedicated to iconic, collectible and investment-relevant automobiles.</p>
        <h2>Mission & Vision</h2>
        <p>Its objective is to become a trusted reference platform for automotive history, engineering, production, specifications, people, market intelligence and relationships between important automobiles.</p>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/methodology') {
    title = "Data Methodology & Provenance | The Right Gear";
    description = "Discover The Right Gear data architecture, source attribution, conflict resolution, and verification standards for automotive facts.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Data Methodology — The Right Gear",
      "url": \`\${baseUrl}/methodology\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>Data Methodology & Provenance</h1>
        <p>At The Right Gear, data integrity is our absolute highest priority. The Right Gear is designed so that important automotive facts can remain traceable to their underlying sources and evidence.</p>
        <h2>Four-Layer Provenance Architecture</h2>
        <ol>
          <li>Source Documents & Primary Registries</li>
          <li>Structured Assertions</li>
          <li>Editorial Review & Conflict Identification</li>
          <li>Canonical Knowledge Publication</li>
        </ol>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/contact') {
    title = "Contact | The Right Gear";
    description = "Contact The Right Gear for platform inquiries, data partnerships, or editorial corrections.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact — The Right Gear",
      "url": \`\${baseUrl}/contact\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>Contact</h1>
        <p>Contact The Right Gear for platform inquiries, data partnerships, or editorial corrections.</p>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/privacy') {
    title = "Privacy Policy | The Right Gear";
    description = "Privacy Policy for The Right Gear Automotive Intelligence Platform.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy — The Right Gear",
      "url": \`\${baseUrl}/privacy\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>Privacy Policy</h1>
        <p>Information on how The Right Gear collects and uses data.</p>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/terms') {
    title = "Terms of Use | The Right Gear";
    description = "Terms of Use for The Right Gear Automotive Intelligence Platform.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Use — The Right Gear",
      "url": \`\${baseUrl}/terms\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>Terms of Use</h1>
        <p>Terms and conditions for using The Right Gear platform.</p>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/data-partnerships') {
    title = "Data Partnerships & Provider Ecosystem | The Right Gear";
    description = "Information for commercial data providers, enterprise APIs, JATO Dynamics, CLASSIC.COM, and automotive archives integrating with The Right Gear.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Data Partnerships — The Right Gear",
      "url": \`\${baseUrl}/data-partnerships\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>Data Partnerships & Provider Ecosystem</h1>
        <p>The Right Gear provides a partner-ready architecture designed for integration with automotive data providers, auction platforms, and OEM archives.</p>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath.startsWith('/cars/bmw/m3/e30/sport-evolution') || cleanPath.endsWith('/sport-evolution')) {
    title = "BMW M3 E30 Sport Evolution (238 hp) | The Right Gear";
    description = "Official technical specifications, production history, and verified provenance for the BMW M3 E30 Sport Evolution (Evo III). 2.5L S14B25 238 hp engine, 600 units produced from Dec 1989 to Mar 1990.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Car",
      "name": "BMW M3 E30 Sport Evolution",
      "manufacturer": { "@type": "Organization", "name": "BMW" },
      "model": "M3",
      "vehicleModelDate": "1990",
      "productionDate": "1989-12 to 1990-03",
      "description": description,
      "url": \`\${baseUrl}/cars/bmw/m3/e30/sport-evolution\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/brands/bmw">BMW</a></li>
            <li><a href="/cars/bmw/m3">M3</a></li>
            <li><a href="/cars/bmw/m3/e30">E30 Generation</a></li>
            <li>BMW M3 E30 Sport Evolution</li>
          </ol>
        </nav>
        <h1>BMW M3 E30 Sport Evolution</h1>
        <p class="subtitle">2.5L S14B25 Inline-4 | 238 hp / 175 kW | 600 Units Produced</p>
        <section>
          <h2>Overview & Historical Significance</h2>
          <p>Produced in exactly 600 units between December 1989 and March 1990 to homologate the 2.5-liter engine upgrade for Group A DTM racing. Features adjustable 3-position front splitter, adjustable rear wing, thinner glass, and lightweight bodywork.</p>
        </section>
        <section>
          <h2>Technical Specifications</h2>
          <dl>
            <dt>Engine Code</dt><dd>S14B25</dd>
            <dt>Displacement</dt><dd>2,467 cc (2.5L)</dd>
            <dt>Power Output</dt><dd>238 hp (175 kW) @ 7,000 rpm</dd>
            <dt>Max Torque</dt><dd>240 Nm @ 4,750 rpm</dd>
            <dt>Transmission</dt><dd>Getrag 265/5 5-Speed Manual Dog-Leg</dd>
            <dt>Top Speed</dt><dd>248 km/h</dd>
            <dt>Acceleration 0–100 km/h</dt><dd>6.1 seconds</dd>
            <dt>Kerb Weight</dt><dd>1,200 kg</dd>
            <dt>Original German Price</dt><dd>DM 85,000</dd>
            <dt>Production Total</dt><dd>600 units (12/1989 – 03/1990)</dd>
            <dt>Official Colours</dt><dd>Jet Black (Glanzschwarz) & Brilliant Red (Brillantrot)</dd>
            <dt>FIA Homologation</dt><dd>Group A Homologation 5327 (02/03/1987)</dd>
          </dl>
        </section>
        <section>
          <h2>Source Provenance</h2>
          <p>Primary Data Source: BMW Group Classic Archives & FIA Historic Database Homologation A-5327.</p>
        </section>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath.startsWith('/cars/bmw/m3/e30/evolution-ii') || cleanPath.endsWith('/evolution-ii')) {
    title = "BMW M3 E30 Evolution II (220 hp) | The Right Gear";
    description = "Official technical specifications, production history, and verified provenance for the BMW M3 E30 Evolution II (Evo 2). 2.3L S14B23 Evo II 220 hp engine, 500 units produced from Apr 1988 to Jun 1988.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Car",
      "name": "BMW M3 E30 Evolution II",
      "manufacturer": { "@type": "Organization", "name": "BMW" },
      "model": "M3",
      "vehicleModelDate": "1988",
      "description": description,
      "url": \`\${baseUrl}/cars/bmw/m3/e30/evolution-ii\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/brands/bmw">BMW</a></li>
            <li><a href="/cars/bmw/m3">M3</a></li>
            <li><a href="/cars/bmw/m3/e30">E30 Generation</a></li>
            <li>BMW M3 E30 Evolution II</li>
          </ol>
        </nav>
        <h1>BMW M3 E30 Evolution II</h1>
        <p class="subtitle">2.3L S14B23 Evo II Inline-4 | 220 hp / 162 kW | 500 Units Produced</p>
        <section>
          <h2>Overview & Historical Significance</h2>
          <p>Produced in 500 units between April and June 1988. Upgraded with higher compression pistons, revised camshafts, deeper front spoiler, rear spoiler lip, and lighter trunk lid.</p>
        </section>
        <section>
          <h2>Technical Specifications</h2>
          <dl>
            <dt>Engine Code</dt><dd>S14B23 Evo II</dd>
            <dt>Displacement</dt><dd>2,302 cc (2.3L)</dd>
            <dt>Power Output</dt><dd>220 hp (162 kW) @ 6,750 rpm</dd>
            <dt>Max Torque</dt><dd>245 Nm @ 4,750 rpm</dd>
            <dt>Transmission</dt><dd>Getrag 265 5-Speed Manual Dog-Leg</dd>
            <dt>Top Speed</dt><dd>243 km/h</dd>
            <dt>Acceleration 0–100 km/h</dt><dd>6.5 seconds</dd>
            <dt>Kerb Weight</dt><dd>1,200 kg</dd>
            <dt>Original German Price</dt><dd>DM 69,900</dd>
            <dt>Production Total</dt><dd>500 units (04/1988 – 06/1988)</dd>
            <dt>Official Colours</dt><dd>Macao Blue, Misano Red, Nogaro Silver</dd>
          </dl>
        </section>
        <section>
          <h2>Source Provenance</h2>
          <p>Primary Data Source: BMW Group Classic Archives & FIA Historic Database Homologation A-5327.</p>
        </section>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath.startsWith('/cars/bmw/m3/e30/m3-2-3') || cleanPath.endsWith('/m3-2-3')) {
    title = "BMW M3 E30 2.3 (195/200 hp) | The Right Gear";
    description = "Technical specifications and history for the original BMW M3 E30 2.3. 2.3L S14B23 engine producing 195 to 200 hp, 17,970 units produced from 1986 to 1991.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Car",
      "name": "BMW M3 E30 2.3",
      "manufacturer": { "@type": "Organization", "name": "BMW" },
      "model": "M3",
      "description": description,
      "url": \`\${baseUrl}/cars/bmw/m3/e30/m3-2-3\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/brands/bmw">BMW</a></li>
            <li><a href="/cars/bmw/m3">M3</a></li>
            <li><a href="/cars/bmw/m3/e30">E30 Generation</a></li>
            <li>BMW M3 E30 2.3</li>
          </ol>
        </nav>
        <h1>BMW M3 E30 2.3</h1>
        <p class="subtitle">2.3L S14B23 Inline-4 | 195 - 200 hp | 17,970 Units Produced</p>
        <section>
          <h2>Overview & Specifications</h2>
          <p>The legendary original BMW M3 E30 road car built to meet FIA Group A homologation regulations. Produced from 1986 to 1991 in a total of 17,970 units across coupe and convertible body styles.</p>
        </section>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/cars/bmw/m3/e30' || cleanPath === '/cars/bmw/m3/e30/') {
    title = "BMW M3 E30 Generation (1986–1991) | The Right Gear";
    description = "Complete generation overview for the BMW M3 E30 (1986–1991). Variants: M3 2.3, Evolution I, Evolution II, and Sport Evolution.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "BMW M3 E30 Generation",
      "url": \`\${baseUrl}/cars/bmw/m3/e30\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>BMW M3 E30 Generation (1986–1991)</h1>
        <p>The first-generation BMW M3, engineered by BMW Motorsport GmbH to dominate international touring car competition.</p>
        <h2>E30 Variants</h2>
        <ul>
          <li><a href="/cars/bmw/m3/e30/m3-2-3">BMW M3 E30 2.3 (195/200 hp)</a></li>
          <li><a href="/cars/bmw/m3/e30/evolution-ii">BMW M3 E30 Evolution II (220 hp)</a></li>
          <li><a href="/cars/bmw/m3/e30/sport-evolution">BMW M3 E30 Sport Evolution (238 hp)</a></li>
        </ul>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/cars/bmw/m3' || cleanPath === '/cars/bmw/m3/') {
    title = "BMW M3 Model Overview | The Right Gear";
    description = "Explore all generations of the BMW M3 model family — E30, E36, E46, E90/E92, F80, and G80.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "BMW M3 Model Family",
      "url": \`\${baseUrl}/cars/bmw/m3\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>BMW M3 Model Family</h1>
        <p>BMW M3 model history across generations.</p>
        <h2>Generations</h2>
        <ul>
          <li><a href="/cars/bmw/m3/e30">BMW M3 E30 (1986–1991)</a></li>
        </ul>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/brands/bmw' || cleanPath === '/manufacturer/bmw') {
    title = "BMW Automotive Intelligence & Catalogue | The Right Gear";
    description = "BMW manufacturer profile, iconic models, M division engineering, and verified vehicle specifications.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Brand",
      "name": "BMW",
      "url": \`\${baseUrl}/brands/bmw\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>BMW</h1>
        <p>Bayerische Motoren Werke AG — Engineering excellence and iconic performance models.</p>
        <h2>Featured Models</h2>
        <ul>
          <li><a href="/cars/bmw/m3">BMW M3</a></li>
        </ul>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/explore') {
    title = "Explore The Right Gear Catalogue";
    description = "Discover the world's most iconic and historically significant automobiles.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Explore",
      "url": \`\${baseUrl}/explore\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>Explore The Catalogue</h1>
        <p>Discover the world's most iconic and historically significant automobiles.</p>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath === '/market') {
    title = "Market Intelligence | The Right Gear";
    description = "Market Intelligence observations and transactions for iconic and collectible cars.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Market Intelligence",
      "url": \`\${baseUrl}/market\`
    };
    bodyHtml = \`
      \${headerHtml}
      <main>
        <h1>Market Intelligence</h1>
        <p>Market Intelligence observations and transactions for iconic and collectible cars.</p>
      </main>
      \${footerHtml}
    \`;
  } else if (cleanPath.startsWith('/entity/')) {
    robots = "noindex, nofollow";
    const entitySlug = cleanPath.split('/entity/')[1];
    title = \`\${entitySlug.replace(/-/g, ' ').toUpperCase()} | Internal Research Entity | The Right Gear\`;
    description = "Internal research entity profile.";
    bodyHtml = \`
      <main>
        <h1>\${entitySlug.replace(/-/g, ' ').toUpperCase()}</h1>
        <p>Internal research entity record.</p>
      </main>
    \`;
  } else {
    // Dynamic entity resolution would go here in a real SSR context
    // For now, fallback to generic
  }

  // Determine production index HTML path
  const indexPath = require('path').join(process.cwd(), 'dist', 'index.html');
  let template = "";
  try {
    template = require('fs').readFileSync(indexPath, 'utf-8');
  } catch (e) {
    // Fallback if index.html is missing (e.g. dev mode without dist)
    template = \`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><!--ssr-title--></title>
    <!--ssr-head-->
  </head>
  <body>
    <div id="root"><!--ssr-body--></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>\`;
  }

  const jsonLdScript = jsonLd ? \`\\n    <script type="application/ld+json">\\n\${JSON.stringify(jsonLd, null, 2)}\\n    </script>\` : '';
  const headHtml = \`<meta name="description" content="\${description}" />
    <meta name="robots" content="\${robots}" />
    <meta property="og:title" content="\${title}" />
    <meta property="og:description" content="\${description}" />
    <meta property="og:url" content="\${baseUrl}\${cleanPath}" />\${jsonLdScript}\`;

  let rendered = template;
  
  if (rendered.includes('<title>')) {
    rendered = rendered.replace(/<title>.*?<\\/title>/, \`<title>\${title}</title>\`);
  } else {
    rendered = rendered.replace('</head>', \`<title>\${title}</title>\\n</head>\`);
  }
  
  if (rendered.includes('<!--ssr-head-->')) {
    rendered = rendered.replace('<!--ssr-head-->', headHtml);
  } else {
    rendered = rendered.replace('</head>', \`\${headHtml}\\n</head>\`);
  }
  
  if (rendered.includes('<!--ssr-body-->')) {
    rendered = rendered.replace('<!--ssr-body-->', bodyHtml);
  } else {
    rendered = rendered.replace('<div id="root"></div>', \`<div id="root">\${bodyHtml}</div>\`);
  }

  return rendered;
}
`

// Find closing brace
let braceCount = 0;
let endOfFunc = -1;
for (let i = startIdx; i < content.length; i++) {
  if (content[i] === '{') braceCount++;
  if (content[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endOfFunc = i + 1;
      break;
    }
  }
}

if (endOfFunc === -1) {
    console.error("Could not find end of function");
    process.exit(1);
}

const finalContent = content.substring(0, startIdx) + newFunction + content.substring(endOfFunc);
fs.writeFileSync('server.ts', finalContent);
console.log("Updated server.ts successfully");
