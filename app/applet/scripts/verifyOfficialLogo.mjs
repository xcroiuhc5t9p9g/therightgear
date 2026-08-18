import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const TARGET = path.resolve('public/brand/the-right-gear-logo-master.png');
const EXPECTED_SIZE = 171632;
const EXPECTED_SHA256 = 'b044d4ba77c03e503fbb2545411ba4fe8157f0d082ec63191560f98e1e5d65af';

// PNG signature: 89 50 4E 47 0D 0A 1A 0A
const EXPECTED_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
const EXPECTED_WIDTH = 1184;
const EXPECTED_HEIGHT = 159;

function verify() {
  if (!fs.existsSync(TARGET)) {
    console.error('OFFICIAL_LOGO_INTEGRITY_FAILED: File not found.');
    process.exit(1);
  }

  const stats = fs.statSync(TARGET);
  if (stats.size !== EXPECTED_SIZE) {
    console.error(`OFFICIAL_LOGO_INTEGRITY_FAILED: Expected size ${EXPECTED_SIZE}, got ${stats.size}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(TARGET);
  
  // Verify PNG signature
  if (!buffer.subarray(0, 8).equals(EXPECTED_SIGNATURE)) {
    console.error('OFFICIAL_LOGO_INTEGRITY_FAILED: Invalid PNG signature.');
    process.exit(1);
  }

  // Very basic verification of width and height from IHDR chunk (starts at offset 8)
  // IHDR chunk format: Length (4 bytes), Chunk Type 'IHDR' (4 bytes), Width (4 bytes), Height (4 bytes)...
  // IHDR starts at offset 8. Length is at 8. Type at 12. Width at 16, Height at 20.
  const chunkType = buffer.toString('ascii', 12, 16);
  if (chunkType !== 'IHDR') {
    console.error('OFFICIAL_LOGO_INTEGRITY_FAILED: Missing IHDR chunk.');
    process.exit(1);
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    console.error(`OFFICIAL_LOGO_INTEGRITY_FAILED: Expected dimensions ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}, got ${width}x${height}`);
    process.exit(1);
  }

  // Verify SHA256
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  if (hash !== EXPECTED_SHA256) {
    console.error(`OFFICIAL_LOGO_INTEGRITY_FAILED: Expected SHA256 ${EXPECTED_SHA256}, got ${hash}`);
    process.exit(1);
  }

  console.log('OFFICIAL_LOGO_INTEGRITY_OK');
}

verify();
