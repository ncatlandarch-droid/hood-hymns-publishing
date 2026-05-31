/**
 * Hood Hymns Publishing — Printful Product Creator
 * 
 * Uploads designs to Printful and creates sync products.
 * Then creates Stripe products with payment links.
 * 
 * Usage:
 *   Requires: PRINTFUL_API_KEY and STRIPE_SECRET_KEY env vars
 *   Run: node scripts/upload-to-printful.mjs
 */
import Stripe from 'stripe';

const PRINTFUL_KEY = process.env.PRINTFUL_API_KEY;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!PRINTFUL_KEY) { console.error('ERROR: Set PRINTFUL_API_KEY'); process.exit(1); }
if (!STRIPE_KEY) { console.error('ERROR: Set STRIPE_SECRET_KEY'); process.exit(1); }

const stripe = new Stripe(STRIPE_KEY);

const SITE_URL = 'https://hood-hymns-publishing.netlify.app';

async function printfulAPI(endpoint, method = 'GET', body = null, storeId = null) {
  const headers = {
    'Authorization': `Bearer ${PRINTFUL_KEY}`,
    'Content-Type': 'application/json',
  };
  if (storeId) headers['X-PF-Store-Id'] = storeId;
  
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  
  const res = await fetch(`https://api.printful.com${endpoint}`, opts);
  const data = await res.json();
  return data;
}

// ─── Hood Hymns Product Definitions ───
// Printful product IDs: 71 = Bella+Canvas 3001 Tee, 146 = Gildan 18500 Hoodie, 
// 380 = Bella+Canvas 3727 Joggers, 206 = Yupoong 6245CM Cap, 
// 487 = Comfort Colors 1566 Crewneck
const PRODUCTS = [
  // --- Studio Merch ---
  {
    id: 'core-hoodie',
    name: 'Hood Hymns Studio Hoodie',
    description: 'Heavyweight 400g deep purple hoodie. Embroidered Hood Hymns Publishing logo in copper on chest. Reinforced cuffs and hem.',
    printfulProductId: 146,
    variantIds: [7854, 7855, 7856, 7857, 7858],
    price: 5500,
    designFile: 'hh-logo-print.png',
    placement: 'front',
    image: '/merch-hoodie.png',
  },
  {
    id: 'core-tshirt',
    name: 'Studio Signature Tee',
    description: 'Premium 100% cotton heavyweight black tee. Official Hood Hymns Publishing studio mark in white & copper.',
    printfulProductId: 71,
    variantIds: [4011, 4012, 4013, 4014, 4015],
    price: 3500,
    designFile: 'hh-logo-print.png',
    placement: 'front',
    image: '/merch-tshirt.png',
  },
  {
    id: 'core-snapback',
    name: 'Studio Snapback',
    description: 'Structured 6-panel snapback. Embroidered HH monogram in copper. Adjustable snap closure.',
    printfulProductId: 206,
    variantIds: [7853],
    price: 2800,
    designFile: 'hh-white-logo.png',
    placement: 'embroidery_front',
    image: '/merch-snapback.png',
  },
  // --- Harmonies Character ---
  {
    id: 'harmonies-character-tee',
    name: 'Harmonies Character Tee',
    description: 'Premium vintage-wash black tee. Original trombonist character graphic from the novel — screen-printed in copper & royal purple.',
    printfulProductId: 71,
    variantIds: [4011, 4012, 4013, 4014, 4015],
    price: 4000,
    designFile: 'harmonies-character-print.png',
    placement: 'front',
    image: '/merch-character.png',
  },
  // --- Block to Blessing ---
  {
    id: 'b2b-hoodie',
    name: 'B2B Logo Hoodie',
    description: 'Heavyweight 400g black hoodie with bold copper BLOCK TO BLESSING across the chest. Cross emblem. Oversized streetwear fit.',
    printfulProductId: 146,
    variantIds: [7854, 7855, 7856, 7857, 7858],
    price: 5500,
    designFile: 'b2b-block-to-blessing-print.png',
    placement: 'front',
    image: '/b2b-hoodie.png',
  },
  {
    id: 'b2b-tee',
    name: 'B2B Signature Tee',
    description: 'Premium heavyweight black tee featuring the B2B circular badge — copper logo with cross detail. 100% cotton.',
    printfulProductId: 71,
    variantIds: [4011, 4012, 4013, 4014, 4015],
    price: 4000,
    designFile: 'b2b-badge-print.png',
    placement: 'front',
    image: '/b2b-tee.png',
  },
  {
    id: 'b2b-cap',
    name: 'B2B Embroidered Cap',
    description: 'Structured 6-panel snapback in deep purple. Copper embroidered B2B interlock monogram on front panel.',
    printfulProductId: 206,
    variantIds: [7853],
    price: 3000,
    designFile: 'b2b-badge-print.png',
    placement: 'embroidery_front',
    image: '/b2b-cap.png',
  },
  {
    id: 'b2b-crewneck',
    name: 'B2B Classic Crewneck',
    description: 'Premium 380g black crewneck sweatshirt with subtle embroidered copper B2B interlock on the left chest.',
    printfulProductId: 487,
    variantIds: [14567, 14568, 14569, 14570, 14571],
    price: 5000,
    designFile: 'b2b-badge-print.png',
    placement: 'front',
    image: '/b2b-crewneck.png',
  },
  {
    id: 'detroit-choir-tee',
    name: 'Detroit Choir Tee',
    description: 'Premium black tee with artistic Detroit skyline and choir silhouette design in purple & copper. Urban faith meets streetwear.',
    printfulProductId: 71,
    variantIds: [4011, 4012, 4013, 4014, 4015],
    price: 4000,
    designFile: 'detroit-choir-print.png',
    placement: 'front',
    image: '/merch-detroit.png',
  },
];

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Hood Hymns Publishing — Merch Pipeline');
  console.log('═══════════════════════════════════════════\n');

  // ─── Step 1: Check Printful connection ───
  console.log('📡  Step 1: Testing Printful API...');
  const storesRes = await printfulAPI('/stores');
  
  if (!storesRes.result || storesRes.result.length === 0) {
    console.error('ERROR: No Printful stores found. Create one at printful.com first.');
    process.exit(1);
  }
  
  // List available stores
  console.log(`  Found ${storesRes.result.length} store(s):`);
  for (const store of storesRes.result) {
    console.log(`    • [${store.id}] ${store.name}`);
  }
  
  // Use the first store (or the manual-order / API store)
  const storeId = String(storesRes.result[0].id);
  console.log(`  Using store: ${storesRes.result[0].name} (ID: ${storeId})\n`);

  // ─── Step 2: Upload designs to Printful ───
  console.log('📤  Step 2: Uploading designs & creating products in Printful...\n');
  
  const printfulResults = {};
  
  for (const product of PRODUCTS) {
    process.stdout.write(`  ${product.name}...`);
    
    try {
      // Upload the design file using the live URL
      const designUrl = `${SITE_URL}/printful-designs/${product.designFile}`;
      
      const uploadRes = await printfulAPI('/files', 'POST', {
        type: 'default',
        url: designUrl,
        filename: product.designFile,
      }, storeId);
      
      if (uploadRes.code !== 200) {
        console.log(` ❌ Upload failed: ${uploadRes.error?.message || JSON.stringify(uploadRes).substring(0, 100)}`);
        continue;
      }
      
      const fileId = uploadRes.result.id;
      console.log(` uploaded (file: ${fileId})...`);
      
      // Create sync product
      const syncVariants = product.variantIds.map(vid => ({
        variant_id: vid,
        retail_price: (product.price / 100).toFixed(2),
        files: [{ type: product.placement, id: fileId }],
      }));
      
      const prodRes = await printfulAPI('/store/products', 'POST', {
        sync_product: { name: product.name, thumbnail: `${SITE_URL}${product.image}` },
        sync_variants: syncVariants,
      }, storeId);
      
      if (prodRes.code === 200) {
        printfulResults[product.id] = prodRes.result?.id;
        console.log(` ✅ Created!`);
      } else {
        console.log(` ⚠️ ${prodRes.error?.message || JSON.stringify(prodRes).substring(0, 150)}`);
      }
      
    } catch (err) {
      console.log(` ❌ Error: ${err.message}`);
    }
  }

  // ─── Step 3: Create Stripe products + payment links ───
  console.log('\n💳  Step 3: Creating Stripe products & payment links...\n');
  
  const mode = STRIPE_KEY.startsWith('sk_test_') ? 'TEST' : 'LIVE';
  console.log(`  Stripe mode: ${mode}\n`);
  
  const paymentLinks = {};
  
  for (const product of PRODUCTS) {
    process.stdout.write(`  ${product.name}...`);
    
    try {
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        images: [`${SITE_URL}${product.image}`],
        metadata: {
          brand: 'Hood Hymns Publishing',
          category: 'merch',
          product_id: product.id,
        },
      });
      
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
      });
      
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: 'redirect',
          redirect: { url: `${SITE_URL}/success` },
        },
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        metadata: { product_id: product.id },
      });
      
      paymentLinks[product.id] = paymentLink.url;
      console.log(` ✅ ${paymentLink.url}`);
      
    } catch (err) {
      console.log(` ❌ ${err.message}`);
    }
  }

  // ─── Summary ───
  console.log('\n═══════════════════════════════════════════');
  console.log('  ✅ Pipeline complete!\n');
  console.log('  Printful Products:', Object.keys(printfulResults).length);
  console.log('  Stripe Payment Links:', Object.keys(paymentLinks).length);
  console.log('\n  Payment Links:');
  for (const [id, url] of Object.entries(paymentLinks)) {
    console.log(`    ${id}: ${url}`);
  }
  console.log('\n═══════════════════════════════════════════');
  
  return paymentLinks;
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
