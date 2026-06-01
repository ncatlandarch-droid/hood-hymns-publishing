/**
 * Hood Hymns Publishing — Printful Store Setup & Product Creator (V2)
 * 
 * 1. Lists available stores (user must create "Hood Hymns Publishing" store manually first)
 * 2. Queries the Printful CATALOG to get correct product & variant IDs
 * 3. Creates all 9 products with correct placement types
 * 4. Verifies products appear in the store
 * 
 * Usage: node scripts/setup-printful-store.mjs [--store-id <id>]
 */

const PRINTFUL_KEY = process.env.PRINTFUL_API_KEY;
if (!PRINTFUL_KEY) { console.error('ERROR: Set PRINTFUL_API_KEY'); process.exit(1); }

const SITE_URL = 'https://hood-hymns-publishing.netlify.app';

// Parse --store-id from args
const storeIdArg = process.argv.find((a, i) => process.argv[i - 1] === '--store-id');

async function printfulAPI(endpoint, method = 'GET', body = null, storeId = null) {
  const headers = {
    'Authorization': `Bearer ${PRINTFUL_KEY}`,
    'Content-Type': 'application/json',
  };
  if (storeId) headers['X-PF-Store-Id'] = storeId;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.printful.com${endpoint}`, opts);
  return res.json();
}

async function findVariants(catalogProductId, color = 'Black', sizes = ['S', 'M', 'L', 'XL', '2XL']) {
  const res = await printfulAPI(`/catalog/products/${catalogProductId}`);
  if (res.code !== 200) {
    console.log(`    Could not fetch catalog product ${catalogProductId}: ${JSON.stringify(res).substring(0, 150)}`);
    return [];
  }
  
  const variants = res.result.variants || [];
  const matched = [];
  
  for (const size of sizes) {
    const found = variants.find(v => {
      const name = (v.name || '').toLowerCase();
      const colorMatch = name.includes(color.toLowerCase());
      // Match size precisely — "/ XL" not "/ 2XL"
      const sizePattern = new RegExp(`/ ${size}$|/ ${size} `, 'i');
      const sizeMatch = sizePattern.test(v.name) || v.size === size;
      return colorMatch && sizeMatch;
    });
    if (found) matched.push(found.id);
  }
  
  return matched;
}

// Product definitions using Printful catalog product IDs
// We'll look up the correct variant IDs dynamically
const PRODUCT_DEFS = [
  // T-Shirts — Bella+Canvas 3001 (catalog ID 71) — DTG front print
  {
    name: 'Studio Signature Tee',
    catalogId: 71,
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    placement: 'front',
    designFile: 'hh-logo-print.png',
    retailPrice: '35.00',
    thumbnail: '/merch-tshirt.png',
  },
  {
    name: 'Harmonies Character Tee',
    catalogId: 71,
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    placement: 'front',
    designFile: 'harmonies-character-print.png',
    retailPrice: '40.00',
    thumbnail: '/merch-character.png',
  },
  {
    name: 'B2B Signature Tee',
    catalogId: 71,
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    placement: 'front',
    designFile: 'b2b-badge-print.png',
    retailPrice: '40.00',
    thumbnail: '/b2b-tee.png',
  },
  {
    name: 'Detroit Choir Tee',
    catalogId: 71,
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    placement: 'front',
    designFile: 'detroit-choir-print.png',
    retailPrice: '40.00',
    thumbnail: '/merch-detroit.png',
  },
  // Hoodies — Bella+Canvas 3719 (catalog ID 380) — DTG front print (NOT embroidery!)
  {
    name: 'Hood Hymns Studio Hoodie',
    catalogId: 380,
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    placement: 'front',
    designFile: 'hh-logo-print.png',
    retailPrice: '55.00',
    thumbnail: '/merch-hoodie.png',
  },
  {
    name: 'B2B Logo Hoodie',
    catalogId: 380,
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    placement: 'front',
    designFile: 'b2b-block-to-blessing-print.png',
    retailPrice: '55.00',
    thumbnail: '/b2b-hoodie.png',
  },
  // Crewneck — Comfort Colors 1566 (catalog ID 446) — DTG front
  {
    name: 'B2B Classic Crewneck',
    catalogId: 446,
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    placement: 'front',
    designFile: 'b2b-badge-print.png',
    retailPrice: '50.00',
    thumbnail: '/b2b-crewneck.png',
  },
  // Caps — Yupoong 6245CM (catalog ID 206) — embroidery_front with thread colors
  {
    name: 'Studio Snapback',
    catalogId: 206,
    color: 'Black',
    sizes: ['One size'],
    placement: 'embroidery_front',
    designFile: 'hh-white-logo.png',
    retailPrice: '28.00',
    thumbnail: '/merch-snapback.png',
    threadColors: ['#FFFFFF', '#A67843'],
  },
  {
    name: 'B2B Embroidered Cap',
    catalogId: 206,
    color: 'Black',
    sizes: ['One size'],
    placement: 'embroidery_front',
    designFile: 'b2b-badge-print.png',
    retailPrice: '30.00',
    thumbnail: '/b2b-cap.png',
    threadColors: ['#A67843', '#FFFFFF'],
  },
];

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Hood Hymns — Printful Store Setup V2');
  console.log('═══════════════════════════════════════════\n');

  // Step 1: List stores
  console.log('📡  Step 1: Checking Printful stores...');
  const storesRes = await printfulAPI('/stores');
  
  if (!storesRes.result || storesRes.result.length === 0) {
    console.error('\n❌ No stores found. Create a store at printful.com first:');
    console.error('   Dashboard → Stores → Add Store → Manual Order / API');
    console.error('   Name it "Hood Hymns Publishing"');
    process.exit(1);
  }
  
  console.log(`  Found ${storesRes.result.length} store(s):\n`);
  for (const store of storesRes.result) {
    console.log(`    [${store.id}] ${store.name} (type: ${store.type || 'unknown'})`);
  }
  
  // Select store
  let storeId = storeIdArg;
  if (!storeId) {
    // Look for a Hood Hymns store, or use the first manual/API store
    const hhStore = storesRes.result.find(s => s.name.toLowerCase().includes('hood'));
    if (hhStore) {
      storeId = String(hhStore.id);
      console.log(`\n  ✅ Found "Hood Hymns" store: ${hhStore.name} (${storeId})`);
    } else {
      storeId = String(storesRes.result[0].id);
      console.log(`\n  ⚠️ No "Hood Hymns" store found. Using: ${storesRes.result[0].name} (${storeId})`);
      console.log('     Create a dedicated store at printful.com → Stores → Add Store → API');
    }
  }
  
  // Step 2: Upload designs and create products
  console.log(`\n📤  Step 2: Creating products in store ${storeId}...\n`);
  
  let created = 0;
  let failed = 0;
  
  for (const def of PRODUCT_DEFS) {
    process.stdout.write(`  ${def.name}...`);
    
    try {
      // Upload the design file
      const designUrl = `${SITE_URL}/printful-designs/${def.designFile}`;
      const uploadRes = await printfulAPI('/files', 'POST', {
        type: 'default',
        url: designUrl,
        filename: def.designFile,
      }, storeId);
      
      if (uploadRes.code !== 200) {
        console.log(` ❌ Upload failed: ${uploadRes.error?.message || 'unknown'}`);
        failed++;
        continue;
      }
      
      const fileId = uploadRes.result.id;
      
      // Get correct variant IDs from catalog
      const variantIds = await findVariants(def.catalogId, def.color, def.sizes);
      
      if (variantIds.length === 0) {
        console.log(` ❌ No matching variants found for catalog ${def.catalogId} / ${def.color} / ${def.sizes.join(',')}`);
        failed++;
        continue;
      }
      
      // Build sync variants
      const syncVariants = variantIds.map(vid => {
        const fileSpec = { type: def.placement, id: fileId };
        if (def.threadColors) {
          fileSpec.options = [{ id: 'thread_colors', value: def.threadColors }];
        }
        return {
          variant_id: vid,
          retail_price: def.retailPrice,
          files: [fileSpec],
        };
      });
      
      // Create sync product
      const prodRes = await printfulAPI('/store/products', 'POST', {
        sync_product: {
          name: def.name,
          thumbnail: `${SITE_URL}${def.thumbnail}`,
        },
        sync_variants: syncVariants,
      }, storeId);
      
      if (prodRes.code === 200) {
        const pid = prodRes.result?.id || 'ok';
        console.log(` ✅ Created! (${variantIds.length} variants, product: ${pid})`);
        created++;
      } else {
        console.log(` ❌ ${prodRes.error?.message || JSON.stringify(prodRes).substring(0, 200)}`);
        failed++;
      }
      
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
    }
  }
  
  // Step 3: Verify products
  console.log(`\n📋  Step 3: Verifying products in store...\n`);
  const listRes = await printfulAPI('/store/products', 'GET', null, storeId);
  
  if (listRes.code === 200 && listRes.result) {
    console.log(`  Products in store: ${listRes.result.length}\n`);
    for (const prod of listRes.result) {
      console.log(`    ✓ [${prod.id}] ${prod.name} — ${prod.variants} variant(s)`);
    }
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log(`  ✅ Created: ${created}  ❌ Failed: ${failed}`);
  console.log('═══════════════════════════════════════════\n');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
