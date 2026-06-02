import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC  = process.argv[2]; // source image passed as arg
const PUB  = path.join(ROOT, 'public');

if (!SRC) { console.error('Usage: node generate-favicons.mjs <source.png>'); process.exit(1); }

console.log('\n╔══════════════════════════════════════════════╗');
console.log('║  🎨  Hood Hymns — Favicon Generator         ║');
console.log('╚══════════════════════════════════════════════╝\n');

const sizes = [
  { name: 'favicon-96x96.png',            size: 96  },
  { name: 'favicon-32x32.png',            size: 32  },
  { name: 'favicon-16x16.png',            size: 16  },
  { name: 'apple-touch-icon.png',         size: 180 },
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 },
];

for (const { name, size } of sizes) {
  const out = path.join(PUB, name);
  await sharp(SRC).resize(size, size, { fit: 'contain', background: { r: 8, g: 5, b: 15 } }).png().toFile(out);
  console.log(`  ✅ ${name} (${size}×${size})`);
}

// favicon.ico — generate a proper ICO (16+32+48 multi-res) using raw PNG trick
// Most modern browsers accept .ico = renamed 32x32 PNG
const icoSrc = await sharp(SRC).resize(32, 32, { fit: 'contain', background: { r: 8, g: 5, b: 15 } }).png().toBuffer();
const icoPath = path.join(PUB, 'favicon.ico');
// Write as PNG with .ico extension — works in all modern browsers
import { writeFileSync } from 'fs';
writeFileSync(icoPath, icoSrc);
console.log('  ✅ favicon.ico (32×32)');

console.log('\n✅ All favicon files written to public/\n');
