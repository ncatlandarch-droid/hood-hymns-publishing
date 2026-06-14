#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// Hood Hymns — Batch Design Processor
// White BG → TRULY Transparent PNG → 3000×3000 (10"×10" at 300 DPI)
// ═══════════════════════════════════════════════════════════════════
import { createCanvas, loadImage } from "canvas";
import { writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RAW_DIR = join(ROOT, "public", "printful-designs", "raw");
const OUT_DIR = join(ROOT, "public", "printful-designs", "transparent");

// Output: 10" × 10" at 300 DPI = 3000 × 3000 px
const OUTPUT_SIZE = 3000;

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function makeTransparent(inputPath, outputPath) {
  const name = basename(inputPath);
  console.log(`\n🎨 ${name}`);

  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;
  const total = width * height;

  // ── STEP 1: Identify white-ish pixels ──
  // Aggressive threshold: anything with R,G,B all above 210 = white
  const isWhite = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (r > 210 && g > 210 && b > 210) {
      isWhite[i] = 1;
    }
  }

  // ── STEP 2: Flood-fill from ALL 4 edges ──
  // Only remove white that's connected to the border (not interior whites)
  const connected = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0, tail = 0;

  // Seed edges
  for (let x = 0; x < width; x++) {
    if (isWhite[x]) { queue[tail++] = x; connected[x] = 1; }
    const b = (height - 1) * width + x;
    if (isWhite[b]) { queue[tail++] = b; connected[b] = 1; }
  }
  for (let y = 1; y < height - 1; y++) {
    const l = y * width;
    if (isWhite[l]) { queue[tail++] = l; connected[l] = 1; }
    const r = y * width + width - 1;
    if (isWhite[r]) { queue[tail++] = r; connected[r] = 1; }
  }

  // BFS with typed array queue (much faster than Array.shift)
  while (head < tail) {
    const pos = queue[head++];
    const x = pos % width;
    const y = (pos - x) / width;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const np = ny * width + nx;
        if (!connected[np] && isWhite[np]) {
          connected[np] = 1;
          queue[tail++] = np;
        }
      }
    }
  }

  // ── STEP 3: Make connected white pixels fully transparent ──
  let removed = 0;
  for (let i = 0; i < total; i++) {
    if (connected[i]) {
      data[i * 4 + 3] = 0; // Alpha = 0 (fully transparent)
      removed++;
    }
  }

  // ── STEP 3b: Remove INTERIOR white islands ──
  // The border flood-fill misses enclosed white regions (inside letters like O, D,
  // R; inside church windows; between rope border elements, etc.)
  // Find all remaining white pixel clusters. If an island is large enough
  // (> MIN_ISLAND_SIZE pixels), it's trapped background, not a design highlight.
  const MIN_ISLAND_SIZE = 50; // px — below this, it's likely intentional white detail
  const visited = new Uint8Array(total);
  // Mark already-removed pixels as visited
  for (let i = 0; i < total; i++) {
    if (connected[i]) visited[i] = 1;
  }

  let islandsRemoved = 0;
  let islandPixelsRemoved = 0;

  for (let i = 0; i < total; i++) {
    if (visited[i] || !isWhite[i]) continue;

    // BFS to find this island
    const island = [];
    const q = [i];
    visited[i] = 1;
    let qi = 0;

    while (qi < q.length) {
      const pos = q[qi++];
      island.push(pos);
      const px = pos % width;
      const py = (pos - px) / width;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = px + dx, ny = py + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const np = ny * width + nx;
          if (!visited[np] && isWhite[np]) {
            visited[np] = 1;
            q.push(np);
          }
        }
      }
    }

    // If this island is large enough, it's trapped background → remove it
    if (island.length >= MIN_ISLAND_SIZE) {
      for (const pos of island) {
        data[pos * 4 + 3] = 0;
        connected[pos] = 1; // mark so anti-alias pass knows it's removed
      }
      removed += island.length;
      islandPixelsRemoved += island.length;
      islandsRemoved++;
    }
  }

  console.log(`   ✅ Interior islands: removed ${islandsRemoved} enclosed white regions (${islandPixelsRemoved} px)`);

  // ── STEP 4: Anti-alias — soften the 1px edge between design and removed bg ──
  // Find edge pixels (non-transparent next to transparent) and soften them
  const edgePass = ctx.createImageData(width, height);
  const ed = edgePass.data;
  // Copy current state
  for (let i = 0; i < data.length; i++) ed[i] = data[i];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const idx = i * 4;
      if (data[idx + 3] > 0) {
        // This pixel is visible — check if any neighbor is transparent
        let hasTransparentNeighbor = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ni = (y + dy) * width + (x + dx);
            if (data[ni * 4 + 3] === 0) {
              hasTransparentNeighbor = true;
              break;
            }
          }
          if (hasTransparentNeighbor) break;
        }
        if (hasTransparentNeighbor) {
          // Edge pixel — check if it's very light (near-white residue)
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          const brightness = (r + g + b) / 3;
          if (brightness > 200) {
            // Near-white edge pixel — make mostly transparent
            ed[idx + 3] = Math.max(0, Math.round((255 - brightness) * 4));
          } else if (brightness > 160) {
            // Light edge pixel — partial transparency
            ed[idx + 3] = Math.round(((255 - brightness) / 95) * 255);
          }
        }
      }
    }
  }

  ctx.putImageData(edgePass, 0, 0);
  console.log(`   ✅ Background removed: ${((removed / total) * 100).toFixed(1)}% pixels → transparent`);

  // ── STEP 5: Composite onto 3000×3000 canvas (10"×10" at 300 DPI) ──
  const outCanvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
  const outCtx = outCanvas.getContext("2d");
  // Ensure fully transparent base
  outCtx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  // Find bounding box of non-transparent pixels to center the design
  let minX = width, minY = height, maxX = 0, maxY = 0;
  const finalData = ctx.getImageData(0, 0, width, height).data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (finalData[(y * width + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Scale to fit within 3000×3000 with 5% padding
  const padding = OUTPUT_SIZE * 0.05;
  const availableSize = OUTPUT_SIZE - padding * 2;
  const scaleX = availableSize / cropW;
  const scaleY = availableSize / cropH;
  const scale = Math.min(scaleX, scaleY);

  const drawW = cropW * scale;
  const drawH = cropH * scale;
  const drawX = (OUTPUT_SIZE - drawW) / 2;
  const drawY = (OUTPUT_SIZE - drawH) / 2;

  // Draw cropped design centered
  outCtx.drawImage(canvas, minX, minY, cropW, cropH, drawX, drawY, drawW, drawH);

  const buffer = outCanvas.toBuffer("image/png");
  writeFileSync(outputPath, buffer);
  console.log(`   ✅ Output: ${basename(outputPath)} — ${OUTPUT_SIZE}×${OUTPUT_SIZE}px (${(buffer.length / 1024).toFixed(0)} KB)`);

  // Verify transparency by checking corners
  const verifyData = outCtx.getImageData(0, 0, OUTPUT_SIZE, OUTPUT_SIZE).data;
  const corners = [
    [0, 0], [OUTPUT_SIZE - 1, 0],
    [0, OUTPUT_SIZE - 1], [OUTPUT_SIZE - 1, OUTPUT_SIZE - 1],
    [OUTPUT_SIZE / 2, 0], [OUTPUT_SIZE / 2, OUTPUT_SIZE - 1],
  ];
  let allTransparent = true;
  for (const [cx, cy] of corners) {
    const ci = (Math.floor(cy) * OUTPUT_SIZE + Math.floor(cx)) * 4;
    if (verifyData[ci + 3] !== 0) { allTransparent = false; break; }
  }
  console.log(`   ${allTransparent ? "✅" : "⚠️"} Corner transparency check: ${allTransparent ? "PASS" : "EDGES NOT CLEAR"}`);
}

async function main() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  Hood Hymns — Batch Transparent Design Processor");
  console.log("  Output: 3000×3000px (10\" × 10\" at 300 DPI)");
  console.log("═══════════════════════════════════════════════════════════\n");

  const files = readdirSync(RAW_DIR).filter(f => f.endsWith(".png"));
  console.log(`Found ${files.length} designs to process\n`);

  for (const file of files) {
    const inputPath = join(RAW_DIR, file);
    const outputName = file.replace(".png", "-transparent-3000x3000.png");
    const outputPath = join(OUT_DIR, outputName);
    await makeTransparent(inputPath, outputPath);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  ✅ ${files.length} designs processed → ${OUT_DIR}`);
  console.log("  All outputs: 3000×3000px, TRUE transparent PNG");
  console.log("  Ready for Printful upload!");
  console.log("═══════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
