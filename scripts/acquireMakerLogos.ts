import fs from 'fs';
import path from 'path';
import https from 'https';

const USER_AGENT = 'TheRightGearBot/1.0 (riccardo.monaco@gmail.com)';

function httpsGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Follow redirects manually or just hope upload.wikimedia.org doesn't redirect
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode !== 200) {
        resolve(false);
        return;
      }
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
      
      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function run() {
  // Read testCatalogue.ts
  const cataloguePath = path.join(process.cwd(), 'src', 'data', 'testCatalogue.ts');
  let catalogueContent = fs.readFileSync(cataloguePath, 'utf8');
  
  // Extract makers manually to avoid TS compilation issues with imports
  const makersMatch = catalogueContent.match(/export const TEST_MAKERS: Maker\[\] = (\[[\s\S]*?\]);/);
  if (!makersMatch) {
    console.error("Could not find TEST_MAKERS in testCatalogue.ts");
    return;
  }
  
  const makers = eval(makersMatch[1]);
  
  const outputDir = path.join(process.cwd(), 'public', 'brand', 'makers');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const maker of makers) {
    console.log(`\nProcessing Maker: ${maker.canonical_name}`);
    
    try {
      // 1. Entity Resolution
      const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(maker.canonical_name)}&language=en&format=json`;
      const searchRes = await httpsGet(searchUrl);
      
      let entityId = null;
      if (searchRes.search && searchRes.search.length > 0) {
        // Find best match (automobile manufacturer etc.)
        for (const result of searchRes.search) {
          const desc = (result.description || '').toLowerCase();
          if (desc.includes('automobile') || desc.includes('manufacturer') || desc.includes('car') || desc.includes('motor')) {
            entityId = result.id;
            break;
          }
        }
        if (!entityId) entityId = searchRes.search[0].id; // Fallback to first if descriptions are vague
      }
      
      if (!entityId) {
        console.log(`MAKER = ${maker.canonical_name}\nASSET_STATUS = AMBIGUOUS`);
        continue;
      }
      
      // 2. Retrieve P154
      const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&format=json&props=claims`;
      const entityRes = await httpsGet(entityUrl);
      
      const claims = entityRes.entities[entityId].claims;
      const p154Claims = claims.P154;
      
      if (!p154Claims || p154Claims.length === 0) {
        console.log(`MAKER = ${maker.canonical_name}\nWIKIDATA_ENTITY_ID = ${entityId}\nASSET_STATUS = UNAVAILABLE (No P154)`);
        continue;
      }
      
      let p154File = p154Claims[0].mainsnak.datavalue.value;
      // Prefer SVG
      for (const claim of p154Claims) {
        const val = claim.mainsnak.datavalue.value;
        if (val.toLowerCase().endsWith('.svg')) {
          p154File = val;
          break;
        }
      }
      
      // 3. Resolve Commons media asset
      const commonsUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(p154File)}&prop=imageinfo&iiprop=url|mime&format=json`;
      const commonsRes = await httpsGet(commonsUrl);
      
      const pages = commonsRes.query.pages;
      const pageId = Object.keys(pages)[0];
      const imageInfo = pages[pageId].imageinfo?.[0];
      
      if (!imageInfo) {
         console.log(`MAKER = ${maker.canonical_name}\nWIKIDATA_ENTITY_ID = ${entityId}\nP154_FILE = ${p154File}\nASSET_STATUS = INVALID (Not found in Commons)`);
         continue;
      }
      
      const sourceUrl = imageInfo.url;
      const mimeType = imageInfo.mime;
      const cleanUrl = sourceUrl.split('?')[0]; const ext = cleanUrl.split('.').pop().toLowerCase() || 'png';
      const filename = `${maker.slug}.${ext}`;
      const localFilePath = path.join(outputDir, filename);
      const internalAssetUrl = `/brand/makers/${filename}`;
      
      // 4. Download and validate
      const success = await downloadFile(sourceUrl, localFilePath);
      
      if (!success) {
         console.log(`MAKER = ${maker.canonical_name}\nWIKIDATA_ENTITY_ID = ${entityId}\nP154_FILE = ${p154File}\nCOMMONS_SOURCE_URL = ${sourceUrl}\nASSET_STATUS = INVALID (Download failed)`);
         continue;
      }
      
      const stats = fs.statSync(localFilePath);
      if (stats.size === 0) {
        fs.unlinkSync(localFilePath);
        console.log(`MAKER = ${maker.canonical_name}\nWIKIDATA_ENTITY_ID = ${entityId}\nP154_FILE = ${p154File}\nCOMMONS_SOURCE_URL = ${sourceUrl}\nASSET_STATUS = INVALID (Zero bytes)`);
        continue;
      }
      
      // Output Trace
      console.log(`MAKER = ${maker.canonical_name}`);
      console.log(`WIKIDATA_ENTITY_ID = ${entityId}`);
      console.log(`P154_FILE = ${p154File}`);
      console.log(`COMMONS_SOURCE_URL = ${sourceUrl}`);
      console.log(`MIME_TYPE = ${mimeType}`);
      console.log(`LOCAL_FILE = ${localFilePath}`);
      console.log(`INTERNAL_ASSET_URL = ${internalAssetUrl}`);
      console.log(`ASSET_STATUS = RESOLVED`);
      
      // Update fixture
      // We will replace the logo_url field in the file for this maker
      const makerRegex = new RegExp(`"slug": "${maker.slug}"[\\s\\S]*?"logo_url": "[^"]*"`);
      if (makerRegex.test(catalogueContent)) {
         catalogueContent = catalogueContent.replace(makerRegex, (match) => {
           return match.replace(/"logo_url": "[^"]*"/, `"logo_url": "${internalAssetUrl}"`);
         });
      } else {
         // If logo_url wasn't there, we'll try to just inject it before the end of the maker block
         // This is a bit brittle, but handles the current fixture format.
         const blockRegex = new RegExp(`"slug": "${maker.slug}"([\\s\\S]*?)(  })`, 'g');
         catalogueContent = catalogueContent.replace(blockRegex, (match, p1, p2) => {
            if (p1.includes('"logo_url"')) {
               return match.replace(/"logo_url":\s*"[^"]*"/, `"logo_url": "${internalAssetUrl}"`);
            }
            // Add a comma to the last line before closing bracket if needed, but the fixture format usually has no comma on the last item.
            // Let's just do a generic replace
            return `"slug": "${maker.slug}"${p1},\n    "logo_url": "${internalAssetUrl}"\n${p2}`;
         });
      }
      
    } catch (err: any) {
      console.error(`Error processing maker ${maker.canonical_name}: ${err.message}`);
    }
  }
  
  fs.writeFileSync(cataloguePath, catalogueContent);
  console.log('\nFinished acquiring Maker Logos.');
}

run();
