#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — Print-Ready Design Generator
//
// Generates Printful-compliant design files from source logo assets.
// Outputs transparent PNGs at 300 DPI for DTG printing & embroidery.
//
// Usage:  node scripts/generate-print-designs.mjs
// Deps:   npm install canvas --save-dev
// ─────────────────────────────────────────────────────────────────────────────

import { createCanvas, loadImage, registerFont } from "canvas";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "public", "printful-designs", "print-ready");

// ── Printful Spec Constants ─────────────────────────────────────────────────
const SPECS = {
  // DTG front print: 15" × 18" at 300 DPI
  front: { width: 4500, height: 5400, name: "front" },
  // Left chest: 4" × 4" at 300 DPI
  leftChest: { width: 1200, height: 1200, name: "left-chest" },
  // Embroidery front large (caps): 2.2" × 2.2" at 300 DPI
  embroidery: { width: 660, height: 660, name: "embroidery" },
};

// ── Brand Colors ────────────────────────────────────────────────────────────
const COLORS = {
  copper: "#B87333",
  copperLight: "#D4944A",
  white: "#FFFFFF",
  cream: "#F0EDE8",
  gold: "#C9A448",
};

// ── Design Definitions ──────────────────────────────────────────────────────
const DESIGNS = [
  {
    id: "hh-logo-front",
    label: "Hood Hymns Logo — Front Print",
    spec: SPECS.front,
    render: renderHHLogoFront,
  },
  {
    id: "hh-logo-left-chest",
    label: "Hood Hymns Logo — Left Chest",
    spec: SPECS.leftChest,
    render: renderHHLogoLeftChest,
  },
  {
    id: "b2b-badge-front",
    label: "Block to Blessing Badge — Front Print",
    spec: SPECS.front,
    render: renderB2BBadgeFront,
  },
  {
    id: "b2b-text-front",
    label: "Block to Blessing Text — Front Print",
    spec: SPECS.front,
    render: renderB2BTextFront,
  },
  {
    id: "detroit-choir-front",
    label: "Detroit Choir — Front Print",
    spec: SPECS.front,
    render: renderDetroitChoirFront,
  },
  {
    id: "hh-embroidery",
    label: "Hood Hymns — Embroidery (Caps)",
    spec: SPECS.embroidery,
    render: renderHHEmbroidery,
  },
];

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Hood Hymns Publishing — Print-Ready Design Generator    ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log();

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load source logo
  const logoPath = join(ROOT, "public", "printful-designs", "hh-logo-print.png");
  const whiteLogoPath = join(ROOT, "public", "printful-designs", "hh-white-logo.png");

  let logo, whiteLogo;
  try {
    logo = await loadImage(logoPath);
    console.log(`✅ Loaded source logo: ${logoPath} (${logo.width}×${logo.height})`);
  } catch (e) {
    console.error(`❌ Could not load logo: ${logoPath}`);
    console.error("   Make sure public/printful-designs/hh-logo-print.png exists");
    process.exit(1);
  }

  try {
    whiteLogo = await loadImage(whiteLogoPath);
    console.log(`✅ Loaded white logo:  ${whiteLogoPath} (${whiteLogo.width}×${whiteLogo.height})`);
  } catch (e) {
    console.warn(`⚠️  White logo not found at ${whiteLogoPath}, using main logo`);
    whiteLogo = logo;
  }

  console.log();

  // Generate each design
  for (const design of DESIGNS) {
    console.log(`🎨 Generating: ${design.label}`);
    console.log(`   Spec: ${design.spec.width}×${design.spec.height}px (${design.spec.name})`);

    const canvas = createCanvas(design.spec.width, design.spec.height);
    const ctx = canvas.getContext("2d");

    // Start with fully transparent canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render the design
    await design.render(ctx, canvas, { logo, whiteLogo });

    // Save as PNG
    const filename = `${design.id}-${design.spec.width}x${design.spec.height}.png`;
    const outputPath = join(OUTPUT_DIR, filename);
    const buffer = canvas.toBuffer("image/png");
    writeFileSync(outputPath, buffer);

    const sizeKB = (buffer.length / 1024).toFixed(1);
    const dpi = Math.round(design.spec.width / (design.spec.width / 300));
    console.log(`   ✅ Saved: ${filename} (${sizeKB} KB, ${dpi} DPI)`);
    console.log();
  }

  console.log("═══════════════════════════════════════════════════════════");
  console.log(`✅ All ${DESIGNS.length} designs generated in: ${OUTPUT_DIR}`);
  console.log();
  console.log("Next steps:");
  console.log("  1. Open files in Photoshop/Canva to verify transparency");
  console.log("  2. Upload to Printful via dashboard or API");
  console.log("  3. Run: node scripts/printful-complete-setup.mjs");
  console.log("═══════════════════════════════════════════════════════════");
}

// ── Render Functions ────────────────────────────────────────────────────────

/**
 * HH Logo — Front Print (full chest, large)
 * Centers the logo on a transparent 4500×5400 canvas with safe margins.
 */
async function renderHHLogoFront(ctx, canvas, { logo }) {
  const { width, height } = canvas;

  // Printful safe zone: ~0.5" from edges = 150px at 300 DPI
  const safeMargin = 300;
  const availW = width - safeMargin * 2;
  const availH = height - safeMargin * 2;

  // Scale logo to fit within safe area, maintaining aspect ratio
  const logoAspect = logo.width / logo.height;
  let drawW, drawH;

  if (logoAspect > availW / availH) {
    drawW = availW * 0.7; // 70% of available width for breathing room
    drawH = drawW / logoAspect;
  } else {
    drawH = availH * 0.5; // 50% of available height
    drawW = drawH * logoAspect;
  }

  // Center the logo
  const x = (width - drawW) / 2;
  const y = (height - drawH) / 2 - 200; // Slightly above center (chest placement)

  ctx.drawImage(logo, x, y, drawW, drawH);
}

/**
 * HH Logo — Left Chest (small placement)
 */
async function renderHHLogoLeftChest(ctx, canvas, { logo }) {
  const { width, height } = canvas;
  const margin = 100;
  const availW = width - margin * 2;
  const availH = height - margin * 2;

  const logoAspect = logo.width / logo.height;
  let drawW, drawH;

  if (logoAspect > 1) {
    drawW = availW * 0.8;
    drawH = drawW / logoAspect;
  } else {
    drawH = availH * 0.8;
    drawW = drawH * logoAspect;
  }

  const x = (width - drawW) / 2;
  const y = (height - drawH) / 2;

  ctx.drawImage(logo, x, y, drawW, drawH);
}

/**
 * B2B Badge — Front Print
 * Renders "BLOCK TO BLESSING" circular badge text design
 */
async function renderB2BBadgeFront(ctx, canvas, { logo }) {
  const { width, height } = canvas;
  const cx = width / 2;
  const cy = height / 2 - 200;

  // Main circle
  const radius = 900;
  ctx.strokeStyle = COLORS.copper;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner circle
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 40, 0, Math.PI * 2);
  ctx.stroke();

  // Cross in center
  const crossSize = 200;
  ctx.strokeStyle = COLORS.copper;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(cx, cy - crossSize);
  ctx.lineTo(cx, cy + crossSize);
  ctx.moveTo(cx - crossSize * 0.6, cy - crossSize * 0.3);
  ctx.lineTo(cx + crossSize * 0.6, cy - crossSize * 0.3);
  ctx.stroke();

  // "B2B" text in center
  ctx.fillStyle = COLORS.copper;
  ctx.font = "bold 280px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("B2B", cx, cy + 100);

  // "BLOCK TO" curved text (top)
  drawCurvedText(ctx, "BLOCK TO", cx, cy, radius - 80, -Math.PI * 0.75, Math.PI * 0.15, false);

  // "BLESSING" curved text (bottom)
  drawCurvedText(ctx, "BLESSING", cx, cy, radius - 80, Math.PI * 0.85, Math.PI * 0.35, true);
}

/**
 * B2B Text — Front Print (bold text-only design)
 */
async function renderB2BTextFront(ctx, canvas) {
  const { width, height } = canvas;
  const cx = width / 2;

  // "BLOCK TO" line
  ctx.fillStyle = COLORS.copper;
  ctx.font = "bold 320px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BLOCK TO", cx, height * 0.35);

  // "BLESSING" line (larger)
  ctx.font = "bold 400px sans-serif";
  ctx.fillText("BLESSING", cx, height * 0.55);

  // Decorative line
  ctx.strokeStyle = COLORS.copper;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 600, height * 0.44);
  ctx.lineTo(cx + 600, height * 0.44);
  ctx.stroke();

  // Small cross
  const crossY = height * 0.44;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx, crossY - 40);
  ctx.lineTo(cx, crossY + 40);
  ctx.moveTo(cx - 25, crossY - 15);
  ctx.lineTo(cx + 25, crossY - 15);
  ctx.stroke();
}

/**
 * Detroit Choir — Front Print
 */
async function renderDetroitChoirFront(ctx, canvas) {
  const { width, height } = canvas;
  const cx = width / 2;

  // "DETROIT" text
  ctx.fillStyle = COLORS.copper;
  ctx.font = "bold 300px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DETROIT", cx, height * 0.3);

  // Divider dot
  ctx.font = "bold 120px sans-serif";
  ctx.fillText("•", cx, height * 0.4);

  // "HOOD HYMNS" text
  ctx.font = "bold 240px sans-serif";
  ctx.fillText("HOOD HYMNS", cx, height * 0.5);

  // Subtitle
  ctx.fillStyle = COLORS.copperLight;
  ctx.font = "200px sans-serif";
  ctx.letterSpacing = "20px";
  ctx.fillText("PUBLISHING & APPAREL", cx, height * 0.62);

  // Decorative lines
  ctx.strokeStyle = COLORS.copper;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 800, height * 0.35);
  ctx.lineTo(cx - 200, height * 0.35);
  ctx.moveTo(cx + 200, height * 0.35);
  ctx.lineTo(cx + 800, height * 0.35);
  ctx.stroke();
}

/**
 * HH Embroidery — Caps (small, simple design)
 */
async function renderHHEmbroidery(ctx, canvas, { whiteLogo }) {
  const { width, height } = canvas;
  const margin = 60;
  const availW = width - margin * 2;
  const availH = height - margin * 2;

  const logoAspect = whiteLogo.width / whiteLogo.height;
  let drawW, drawH;

  if (logoAspect > 1) {
    drawW = availW * 0.85;
    drawH = drawW / logoAspect;
  } else {
    drawH = availH * 0.85;
    drawW = drawH * logoAspect;
  }

  const x = (width - drawW) / 2;
  const y = (height - drawH) / 2;

  ctx.drawImage(whiteLogo, x, y, drawW, drawH);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function drawCurvedText(ctx, text, cx, cy, radius, startAngle, endAngle, bottom) {
  ctx.save();
  ctx.fillStyle = COLORS.copper;
  ctx.font = "bold 140px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const chars = text.split("");
  const totalAngle = endAngle - startAngle;
  const anglePerChar = totalAngle / (chars.length + 1);

  chars.forEach((char, i) => {
    const angle = startAngle + anglePerChar * (i + 1);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + (bottom ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });

  ctx.restore();
}

// ── Run ─────────────────────────────────────────────────────────────────────
main().catch(console.error);
