const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldHomeHtml = `      \\$\{headerHtml\}
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
      \\$\{footerHtml\}`;

const newHomeHtml = `      \\$\{headerHtml\}
      <main>
        <section>
          <h1>The Right Gear | Iconic Cars and Motorbikes Decoded</h1>
          <p>Automotive intelligence for the cars that matter.</p>
        </section>
        <section>
          <h2>Market Intelligence</h2>
          <p>Understand the market, not just the asking price.</p>
          <a href="/market">Explore Market Intelligence</a>
        </section>
        <section>
          <h2>Car DNA</h2>
          <p>Every important car is part of a bigger story.</p>
          <a href="/explore">Explore its DNA</a>
        </section>
        <section>
          <h2>Automotive Events</h2>
          <p>Where automotive history comes alive. Event intelligence is currently being integrated.</p>
        </section>
        <section>
          <h2>Data Integrity</h2>
          <p>Every fact should know where it came from. We maintain rigorous data provenance from primary OEM documentation to canonical database records.</p>
          <a href="/methodology">Our methodology</a>
        </section>
        <section>
          <h2>About The Right Gear</h2>
          <p>Building a trusted reference layer for the cars that matter.</p>
          <a href="/about">About The Right Gear</a>
        </section>
      </main>
      \\$\{footerHtml\}`;

content = content.replace(oldHomeHtml, newHomeHtml);
fs.writeFileSync('server.ts', content);
console.log('Fixed Home SSR');
