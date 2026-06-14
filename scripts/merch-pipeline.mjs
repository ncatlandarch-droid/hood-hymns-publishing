#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — Automated Merch Pipeline
//
// END-TO-END: Logo → Background Removal → Print Designs → Printful Upload
//            → Product Creation → Store Sync → Deploy
//
// Usage:
//   node scripts/merch-pipeline.mjs                    # Run full pipeline
//   node scripts/merch-pipeline.mjs --step clean-logo  # Just remove bg
//   node scripts/merch-pipeline.mjs --step designs     # Just make designs
//   node scripts/merch-pipeline.mjs --step upload      # Just upload to Printful
//   node scripts/merch-pipeline.mjs --step sync        # Just sync store data
//
// Requires: PRINTFUL_API_KEY env var, canvas npm package
// ─────────────────────────────────────────────────────────────────────────────

import { createCanvas, loadImage } from "canvas";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// ── CONFIGURATION ───────────────────────────────────────────────────────────
const CONFIG = {
  // Source assets
  logos: {
    main: join(ROOT, "public", "printful-designs", "hh-logo-print.png"),
    white: join(ROOT, "public", "printful-designs", "hh-white-logo.png"),
    b2bBadge: join(ROOT, "public", "printful-designs", "b2b-badge-print.png"),
    detroit: join(ROOT, "public", "printful-designs", "detroit-choir-print.png"),
    character: join(ROOT, "public", "printful-designs", "harmonies-character-print.png"),
  },

  // Output directories
  cleanLogos: join(ROOT, "public", "printful-designs", "clean"),
  printReady: join(ROOT, "public", "printful-designs", "print-ready"),
  mockups: join(ROOT, "public", "merch-real"),

  // Printful API
  printfulApiKey: process.env.PRINTFUL_API_KEY,
  printfulStoreId: "18232014",

  // Background removal settings
  bgRemoval: {
    // Colors to treat as "background" and make transparent
    // Each entry: [R, G, B, tolerance]
    // Tolerance = max distance in RGB space to still count as "this color"
    targets: [
      [0, 0, 0, 60],        // Black (and near-black)
      [5, 5, 15, 50],       // Very dark blue-black (common in JPG artifacts)
      [16, 12, 8, 40],      // Dark brown-black
    ],
    // Edge feathering radius (anti-aliasing)
    featherRadius: 2,
  },

  // Printful print specs (width × height in pixels at 300 DPI)
  printSpecs: {
    front:      { w: 4500, h: 5400 },   // 15" × 18" — DTG front
    leftChest:  { w: 1200, h: 1200 },   // 4" × 4"
    back:       { w: 4500, h: 5400 },   // 15" × 18" — DTG back
    embroidery: { w: 660,  h: 660  },   // 2.2" × 2.2" — cap/chest
    sleeve:     { w: 1200, h: 1800 },   // 4" × 6" — sleeve print
  },

  // Product templates — what to create in Printful
  productTemplates: [
    {
      name: "HH Logo Tee",
      printfulProductId: 71,  // Bella+Canvas 3001
      designKey: "main",
      placement: "front",
      colors: [{ name: "Black", code: "000000" }],
      sizes: ["S", "M", "L", "XL", "2XL"],
      retailPrice: "25.00",
    },
    {
      name: "B2B Badge Tee",
      printfulProductId: 71,
      designKey: "b2bBadge",
      placement: "front",
      colors: [{ name: "Black", code: "000000" }],
      sizes: ["S", "M", "L", "XL", "2XL"],
      retailPrice: "25.00",
    },
    {
      name: "Detroit Choir Tee",
      printfulProductId: 71,
      designKey: "detroit",
      placement: "front",
      colors: [{ name: "Black", code: "000000" }],
      sizes: ["S", "M", "L", "XL", "2XL"],
      retailPrice: "25.00",
    },
    {
      name: "Character Art Tee",
      printfulProductId: 71,
      designKey: "character",
      placement: "front",
      colors: [{ name: "Black", code: "000000" }],
      sizes: ["S", "M", "L", "XL", "2XL"],
      retailPrice: "20.00",
    },
  ],
};

// ── BRAND COLORS (for programmatic design generation) ───────────────────────
const BRAND = {
  copper: "#B87333",
  copperLight: "#D4944A",
  white: "#FFFFFF",
  cream: "#F0EDE8",
  gold: "#C9A448",
  purple: "#2D1B4E",
  darkPurple: "#0E0A1A",
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: BACKGROUND REMOVAL
// ═══════════════════════════════════════════════════════════════════════════

async function removeBackground(inputPath, outputPath, options = {}) {
  const { targets, featherRadius } = { ...CONFIG.bgRemoval, ...options };

  console.log(`   📸 Loading: ${inputPath}`);
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  // Draw original image
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let pixelsRemoved = 0;
  const totalPixels = width * height;

  // Pass 1: Mark background pixels
  const isBackground = new Uint8Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    for (const [tr, tg, tb, tolerance] of targets) {
      const dist = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
      if (dist <= tolerance) {
        isBackground[i] = 1;
        break;
      }
    }
  }

  // Pass 2: Flood fill from edges to find connected background regions
  // This prevents removing dark pixels INSIDE the logo
  const visited = new Uint8Array(totalPixels);
  const queue = [];

  // Seed from all 4 edges
  for (let x = 0; x < width; x++) {
    if (isBackground[x]) queue.push(x);                              // Top
    const bottom = (height - 1) * width + x;
    if (isBackground[bottom]) queue.push(bottom);                    // Bottom
  }
  for (let y = 0; y < height; y++) {
    const left = y * width;
    if (isBackground[left]) queue.push(left);                        // Left
    const right = y * width + (width - 1);
    if (isBackground[right]) queue.push(right);                      // Right
  }

  // BFS flood fill
  const connectedBg = new Uint8Array(totalPixels);
  while (queue.length > 0) {
    const pos = queue.shift();
    if (visited[pos]) continue;
    visited[pos] = 1;
    connectedBg[pos] = 1;

    const x = pos % width;
    const y = Math.floor(pos / width);

    // 8-connected neighbors
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const npos = ny * width + nx;
        if (!visited[npos] && isBackground[npos]) {
          queue.push(npos);
        }
      }
    }
  }

  // Pass 3: Remove connected background pixels with edge feathering
  for (let i = 0; i < totalPixels; i++) {
    if (connectedBg[i]) {
      const idx = i * 4;

      // Check distance to nearest non-background pixel for feathering
      if (featherRadius > 0) {
        const x = i % width;
        const y = Math.floor(i / width);
        let minDist = featherRadius + 1;

        for (let dy = -featherRadius; dy <= featherRadius; dy++) {
          for (let dx = -featherRadius; dx <= featherRadius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            const npos = ny * width + nx;
            if (!connectedBg[npos]) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              minDist = Math.min(minDist, dist);
            }
          }
        }

        if (minDist <= featherRadius) {
          // Feather edge — partial transparency
          data[idx + 3] = Math.round((minDist / featherRadius) * 50);
        } else {
          // Full background — fully transparent
          data[idx + 3] = 0;
        }
      } else {
        data[idx + 3] = 0;
      }
      pixelsRemoved++;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Save
  const buffer = canvas.toBuffer("image/png");
  writeFileSync(outputPath, buffer);

  const percent = ((pixelsRemoved / totalPixels) * 100).toFixed(1);
  const sizeKB = (buffer.length / 1024).toFixed(1);
  console.log(`   ✅ Background removed: ${percent}% pixels cleared (${sizeKB} KB)`);

  return { width: img.width, height: img.height, buffer };
}

async function stepCleanLogos() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  STEP 1: Remove Backgrounds from Source Logos            ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  if (!existsSync(CONFIG.cleanLogos)) {
    mkdirSync(CONFIG.cleanLogos, { recursive: true });
  }

  const logoEntries = Object.entries(CONFIG.logos);
  let processed = 0;

  for (const [key, path] of logoEntries) {
    if (!existsSync(path)) {
      console.log(`   ⏭️  Skipping ${key}: file not found at ${path}`);
      continue;
    }
    const outPath = join(CONFIG.cleanLogos, `${key}-transparent.png`);
    console.log(`\n🎨 Processing: ${key}`);
    await removeBackground(path, outPath);
    processed++;
  }

  console.log(`\n✅ Cleaned ${processed}/${logoEntries.length} logos → ${CONFIG.cleanLogos}\n`);
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: GENERATE PRINT-READY DESIGNS
// ═══════════════════════════════════════════════════════════════════════════

async function compositeOnCanvas(logoPath, spec, options = {}) {
  const {
    scale = 0.65,       // Logo fills 65% of available width by default
    yOffset = -0.05,    // Slight upward offset (chest placement)
    padding = 300,      // Safe margin in pixels (1" at 300 DPI)
  } = options;

  const canvas = createCanvas(spec.w, spec.h);
  const ctx = canvas.getContext("2d");

  // Transparent canvas
  ctx.clearRect(0, 0, spec.w, spec.h);

  // Load and composite the logo
  const logo = await loadImage(logoPath);
  const availW = spec.w - padding * 2;
  const availH = spec.h - padding * 2;

  const logoAspect = logo.width / logo.height;
  let drawW, drawH;

  if (logoAspect > availW / availH) {
    drawW = availW * scale;
    drawH = drawW / logoAspect;
  } else {
    drawH = availH * scale;
    drawW = drawH * logoAspect;
  }

  const x = (spec.w - drawW) / 2;
  const y = (spec.h - drawH) / 2 + (spec.h * yOffset);

  ctx.drawImage(logo, x, y, drawW, drawH);

  return canvas;
}

async function stepGenerateDesigns() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  STEP 2: Generate Print-Ready Designs                    ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  if (!existsSync(CONFIG.printReady)) {
    mkdirSync(CONFIG.printReady, { recursive: true });
  }

  // Use clean logos if available, fall back to originals
  const getLogoPath = (key) => {
    const cleanPath = join(CONFIG.cleanLogos, `${key}-transparent.png`);
    if (existsSync(cleanPath)) return cleanPath;
    return CONFIG.logos[key];
  };

  const designs = [
    { id: "hh-front",        logo: "main",      spec: CONFIG.printSpecs.front,     opts: { scale: 0.55, yOffset: -0.08 } },
    { id: "hh-left-chest",   logo: "main",      spec: CONFIG.printSpecs.leftChest, opts: { scale: 0.85, yOffset: 0, padding: 80 } },
    { id: "hh-embroidery",   logo: "white",     spec: CONFIG.printSpecs.embroidery,opts: { scale: 0.85, yOffset: 0, padding: 50 } },
    { id: "b2b-front",       logo: "b2bBadge",  spec: CONFIG.printSpecs.front,     opts: { scale: 0.55, yOffset: -0.05 } },
    { id: "detroit-front",   logo: "detroit",   spec: CONFIG.printSpecs.front,     opts: { scale: 0.60, yOffset: -0.05 } },
    { id: "character-front", logo: "character", spec: CONFIG.printSpecs.front,     opts: { scale: 0.60, yOffset: -0.08 } },
  ];

  for (const design of designs) {
    const logoPath = getLogoPath(design.logo);
    if (!existsSync(logoPath)) {
      console.log(`   ⏭️  Skipping ${design.id}: logo not found`);
      continue;
    }

    console.log(`🎨 ${design.id} (${design.spec.w}×${design.spec.h})`);
    const canvas = await compositeOnCanvas(logoPath, design.spec, design.opts);
    const filename = `${design.id}-${design.spec.w}x${design.spec.h}.png`;
    const buffer = canvas.toBuffer("image/png");
    writeFileSync(join(CONFIG.printReady, filename), buffer);
    console.log(`   ✅ ${filename} (${(buffer.length / 1024).toFixed(1)} KB)\n`);
  }

  console.log("✅ All print-ready designs generated\n");
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: UPLOAD DESIGNS TO PRINTFUL
// ═══════════════════════════════════════════════════════════════════════════

function printfulRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.printful.com",
      path,
      method,
      headers: {
        "Authorization": `Bearer ${CONFIG.printfulApiKey}`,
        "X-PF-Store-Id": CONFIG.printfulStoreId,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Printful API ${res.statusCode}: ${JSON.stringify(json)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function uploadFileToPrintful(filePath) {
  const filename = filePath.split(/[/\\]/).pop();
  const fileData = readFileSync(filePath).toString("base64");

  console.log(`   📤 Uploading: ${filename}...`);
  const result = await printfulRequest("POST", "/files", {
    type: "default",
    url: `data:image/png;base64,${fileData}`,
    filename,
  });

  console.log(`   ✅ Uploaded: File ID ${result.result.id}`);
  return result.result;
}

async function stepUploadDesigns() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  STEP 3: Upload Designs to Printful                      ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  if (!CONFIG.printfulApiKey) {
    console.error("❌ PRINTFUL_API_KEY not set. Set it and retry.");
    return;
  }

  // Upload each print-ready design
  const designFiles = [
    "hh-front-4500x5400.png",
    "b2b-front-4500x5400.png",
    "detroit-front-4500x5400.png",
    "character-front-4500x5400.png",
    "hh-embroidery-660x660.png",
  ];

  const uploadedFiles = {};

  for (const file of designFiles) {
    const filePath = join(CONFIG.printReady, file);
    if (!existsSync(filePath)) {
      console.log(`   ⏭️  Skipping ${file}: not found`);
      continue;
    }
    try {
      const result = await uploadFileToPrintful(filePath);
      uploadedFiles[file] = result;
      // Rate limit: 1 request per second
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.error(`   ❌ Failed to upload ${file}: ${e.message}`);
    }
  }

  // Save upload results for next step
  const manifestPath = join(CONFIG.printReady, "upload-manifest.json");
  writeFileSync(manifestPath, JSON.stringify(uploadedFiles, null, 2));
  console.log(`\n✅ Upload manifest saved: ${manifestPath}\n`);
}


// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: SYNC STORE DATA
// ═══════════════════════════════════════════════════════════════════════════

async function stepSyncStore() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  STEP 4: Sync Printful → Website Store                   ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  if (!CONFIG.printfulApiKey) {
    console.error("❌ PRINTFUL_API_KEY not set.");
    return;
  }

  // Fetch all products from Printful
  console.log("📡 Fetching products from Printful...");
  const productsRes = await printfulRequest("GET", "/store/products");
  const products = productsRes.result;

  console.log(`   Found ${products.length} products in store\n`);

  // Download mockup images
  if (!existsSync(CONFIG.mockups)) {
    mkdirSync(CONFIG.mockups, { recursive: true });
  }

  for (const product of products) {
    console.log(`📦 ${product.name} (ID: ${product.id})`);

    // Get detailed product with variants and files
    try {
      const detail = await printfulRequest("GET", `/store/products/${product.id}`);
      const variant = detail.result.sync_variants?.[0];

      if (variant?.files) {
        const previewFile = variant.files.find((f) => f.type === "preview");
        if (previewFile?.preview_url) {
          const safeName = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          const mockupPath = join(CONFIG.mockups, `${safeName}.png`);

          console.log(`   📸 Downloading mockup → ${safeName}.png`);
          await downloadFile(previewFile.preview_url, mockupPath);
        }
      }
      await new Promise((r) => setTimeout(r, 1000));
    } catch (e) {
      console.error(`   ❌ Failed: ${e.message}`);
    }
  }

  console.log("\n✅ Store sync complete\n");
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = require("fs").createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(resolve); });
    }).on("error", (e) => { reject(e); });
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const step = process.argv.find((a) => a.startsWith("--step="))?.split("=")[1]
    || process.argv[process.argv.indexOf("--step") + 1]
    || "all";

  console.log("\n");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  HOOD HYMNS PUBLISHING — Automated Merch Pipeline");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log(`  Mode: ${step === "all" ? "Full Pipeline" : step}`);
  console.log(`  Store ID: ${CONFIG.printfulStoreId}`);
  console.log(`  API Key: ${CONFIG.printfulApiKey ? "✅ Set" : "❌ Missing"}`);
  console.log();

  const steps = {
    "clean-logo": stepCleanLogos,
    "designs": stepGenerateDesigns,
    "upload": stepUploadDesigns,
    "sync": stepSyncStore,
  };

  if (step === "all") {
    await stepCleanLogos();
    await stepGenerateDesigns();
    if (CONFIG.printfulApiKey) {
      await stepUploadDesigns();
      await stepSyncStore();
    } else {
      console.log("⏭️  Skipping Printful steps (no API key)\n");
    }
  } else if (steps[step]) {
    await steps[step]();
  } else {
    console.error(`❌ Unknown step: ${step}`);
    console.error("   Valid: clean-logo, designs, upload, sync, all");
    process.exit(1);
  }

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ✅ Pipeline complete!");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("  Next: Review designs in public/printful-designs/print-ready/");
  console.log("  Then: git add -A && git commit && git push");
  console.log();
}

main().catch(console.error);
