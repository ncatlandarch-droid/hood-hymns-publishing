/**
 * Hood Hymns Publishing — FINAL Printful Setup
 * All variant IDs confirmed from V2 catalog API.
 * All placements confirmed from mockup-generator/printfiles.
 */
const PRINTFUL_KEY = process.env.PRINTFUL_API_KEY;
if (!PRINTFUL_KEY) { console.error('ERROR: Set PRINTFUL_API_KEY'); process.exit(1); }

const SITE_URL = 'https://hood-hymns-publishing.netlify.app';
const STORE_ID = '18232014'; // Think! Apparel store

async function pf(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${PRINTFUL_KEY}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': STORE_ID,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.printful.com${endpoint}`, opts);
  return res.json();
}

async function uploadDesign(file) {
  const r = await pf('/files', 'POST', {
    type: 'default',
    url: `${SITE_URL}/printful-designs/${file}`,
    filename: file,
  });
  return r.code === 200 ? r.result.id : null;
}

// CONFIRMED variant IDs from V2 catalog API
const TEE_BLACK = [4016, 4017, 4018, 4019, 4020];     // S, M, L, XL, 2XL
const HOODIE_BLACK = [5530, 5531, 5532, 5533, 5534];  // S, M, L, XL, 2XL
const CREW_BLACK = [5434, 5435, 5436, 5437, 5438];    // S, M, L, XL, 2XL — need to verify
const CAP_BLACK = [7854];                               // One size

const PRODUCTS = [
  // T-SHIRTS — DTG front
  { name: 'Studio Signature Tee', variants: TEE_BLACK, placement: 'front', design: 'hh-logo-print.png', price: '35.00', thumb: '/merch-tshirt.png' },
  { name: 'Harmonies Character Tee', variants: TEE_BLACK, placement: 'front', design: 'harmonies-character-print.png', price: '40.00', thumb: '/merch-character.png' },
  { name: 'B2B Signature Tee', variants: TEE_BLACK, placement: 'front', design: 'b2b-badge-print.png', price: '40.00', thumb: '/b2b-tee.png' },
  { name: 'Detroit Choir Tee', variants: TEE_BLACK, placement: 'front', design: 'detroit-choir-print.png', price: '40.00', thumb: '/merch-detroit.png' },
  // HOODIES — DTG front (Gildan 18500 supports DTG as default technique!)
  { name: 'Hood Hymns Studio Hoodie', variants: HOODIE_BLACK, placement: 'front', design: 'hh-logo-print.png', price: '55.00', thumb: '/merch-hoodie.png' },
  { name: 'B2B Logo Hoodie', variants: HOODIE_BLACK, placement: 'front', design: 'b2b-block-to-blessing-print.png', price: '55.00', thumb: '/b2b-hoodie.png' },
  // CREWNECK — DTG front (Gildan 18000)
  { name: 'B2B Classic Crewneck', variants: CREW_BLACK, placement: 'front', design: 'b2b-badge-print.png', price: '50.00', thumb: '/b2b-crewneck.png' },
  // CAPS — embroidery_front_large (confirmed from printfiles endpoint)
  { name: 'Studio Snapback', variants: CAP_BLACK, placement: 'embroidery_front_large', design: 'hh-white-logo.png', price: '28.00', thumb: '/merch-snapback.png', threadColors: ['#FFFFFF', '#A67843'] },
  { name: 'B2B Embroidered Cap', variants: CAP_BLACK, placement: 'embroidery_front_large', design: 'b2b-badge-print.png', price: '30.00', thumb: '/b2b-cap.png', threadColors: ['#A67843', '#FFFFFF'] },
];

async function main() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║  Hood Hymns — Final Printful Setup    ║');
  console.log('╚═══════════════════════════════════════╝\n');

  // Verify store
  console.log('▸ Verifying store connection...');
  const stores = await pf('/stores');
  const store = (stores.result || []).find(s => String(s.id) === STORE_ID);
  console.log(`  Store: ${store ? store.name : 'NOT FOUND'} (${STORE_ID})\n`);

  // Verify crewneck variant IDs (we assumed S=5434, need to confirm)
  console.log('▸ Verifying crewneck variant IDs...');
  let crewVars = [];
  let crewUrl = `https://api.printful.com/v2/catalog-products/145/catalog-variants?limit=100`;
  let page = 0;
  while (crewUrl && page < 10) {
    const r = await fetch(crewUrl, { headers: { 'Authorization': `Bearer ${PRINTFUL_KEY}` } });
    const d = await r.json();
    crewVars = crewVars.concat(d.data || []);
    crewUrl = d._links?.next?.href || null;
    page++;
  }
  const crewBlack = crewVars.filter(v => v.color === 'Black');
  console.log(`  Found ${crewBlack.length} Black crewneck variants:`);
  const crewMap = {};
  crewBlack.forEach(v => { crewMap[v.size] = v.id; console.log(`    ${v.id} | ${v.size}`); });
  
  // Update crewneck variants with confirmed IDs
  const confirmedCrew = ['S', 'M', 'L', 'XL', '2XL'].map(s => crewMap[s]).filter(Boolean);
  PRODUCTS.find(p => p.name === 'B2B Classic Crewneck').variants = confirmedCrew;
  console.log(`  Using: [${confirmedCrew.join(', ')}]\n`);

  // Skip cleanup on re-run — keep existing products
  console.log('▸ Checking existing products...');
  const existing = await pf('/store/products');
  console.log(`  ${existing.result?.length || 0} products already in store (keeping them)\n`);

  // Create missing products only
  console.log('▸ Creating missing products...\n');
  let created = 0, failed = 0, skipped = 0;
  const existingNames = (existing.result || []).map(p => p.name);

  for (const prod of PRODUCTS) {
    process.stdout.write(`  ${prod.name}...`);
    
    if (existingNames.includes(prod.name)) {
      console.log(' ⏭️ already exists');
      skipped++;
      continue;
    }
    
    try {
      const fileId = await uploadDesign(prod.design);
      if (!fileId) { console.log(' ❌ upload failed'); failed++; continue; }

      const syncVariants = prod.variants.map(vid => {
        const file = { type: prod.placement, id: fileId };
        const variant = { variant_id: vid, retail_price: prod.price, files: [file] };
        if (prod.threadColors) {
          variant.options = [{ id: 'thread_colors_front_large', value: prod.threadColors }];
        }
        return variant;
      });

      const res = await pf('/store/products', 'POST', {
        sync_product: { name: prod.name, thumbnail: `${SITE_URL}${prod.thumb}` },
        sync_variants: syncVariants,
      });

      if (res.code === 200) {
        console.log(` ✅ (${prod.variants.length} variants)`);
        created++;
      } else {
        console.log(` ❌ ${res.error?.message || JSON.stringify(res).substring(0, 150)}`);
        failed++;
      }
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
    }
  }

  // Verify
  console.log('\n▸ Verifying...');
  await new Promise(r => setTimeout(r, 2000));
  const verify = await pf('/store/products');
  if (verify.result) {
    console.log(`\n  ✅ ${verify.result.length} products in store:\n`);
    verify.result.forEach(p => console.log(`    [${p.id}] ${p.name} — ${p.variants} variant(s)`));
  }

  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║  Created: ${created}  |  Failed: ${failed}              ║`);
  console.log(`║  Store ID: ${STORE_ID}                  ║`);
  console.log(`╚═══════════════════════════════════════╝\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
