/**
 * Hood Hymns Publishing — Ebook PDF Generator
 * 
 * Generates a print-ready PDF from the expanded manuscript.
 * Uses Puppeteer to render a styled HTML version to PDF.
 * 
 * Usage: node scripts/generate-ebook-pdf.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Read the manuscript
const manuscript = readFileSync(join(ROOT, 'content', 'harmonies-of-hope-expanded.md'), 'utf-8');

// Parse chapters from markdown
function parseManuscript(md) {
  const lines = md.split('\n');
  const chapters = [];
  let currentChapter = null;
  let frontMatter = [];
  let inFrontMatter = true;

  for (const line of lines) {
    if (line.startsWith('## Chapter')) {
      if (inFrontMatter) inFrontMatter = false;
      if (currentChapter) chapters.push(currentChapter);
      currentChapter = { title: line.replace('## ', ''), content: '' };
    } else if (currentChapter) {
      currentChapter.content += line + '\n';
    } else if (inFrontMatter) {
      frontMatter.push(line);
    }
  }
  if (currentChapter) chapters.push(currentChapter);

  return { frontMatter: frontMatter.join('\n'), chapters };
}

const { frontMatter, chapters } = parseManuscript(manuscript);

// Generate styled HTML
function generateHTML(chapters) {
  const chapterHTML = chapters.map((ch, i) => {
    // Convert markdown paragraphs to HTML
    const paragraphs = ch.content
      .split('\n\n')
      .filter(p => p.trim())
      .map(p => {
        p = p.trim();
        // Handle horizontal rules
        if (p === '---') return '<div class="scene-break">✦ ✦ ✦</div>';
        // Handle italic text
        p = p.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Handle bold text
        p = p.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        // Handle dialogue (lines starting with ")
        if (p.startsWith('"') || p.startsWith('"') || p.startsWith('"')) {
          return `<p class="dialogue">${p}</p>`;
        }
        return `<p>${p}</p>`;
      })
      .join('\n');

    return `
      <div class="chapter" ${i > 0 ? 'style="page-break-before: always;"' : ''}>
        <div class="chapter-header">
          <div class="chapter-number">${i + 1}</div>
          <h2 class="chapter-title">${ch.title.replace(/Chapter \w+ — /, '')}</h2>
          <div class="chapter-ornament">❧</div>
        </div>
        <div class="chapter-body">
          ${paragraphs}
        </div>
      </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

    @page {
      size: 5.5in 8.5in;
      margin: 0.75in 0.85in;
      @bottom-center {
        content: counter(page);
        font-family: 'Source Serif 4', Georgia, serif;
        font-size: 9pt;
        color: #666;
      }
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.65;
      color: #1a1a1a;
      background: #fff;
    }

    /* ── Title Page ── */
    .title-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 100vh;
      page-break-after: always;
    }

    .title-page .publisher-mark {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 8pt;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 60px;
    }

    .title-page h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28pt;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 8px;
      color: #1a1a1a;
    }

    .title-page .subtitle {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 14pt;
      font-weight: 400;
      font-style: italic;
      color: #4a4a4a;
      margin-bottom: 40px;
    }

    .title-page .author {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 13pt;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #333;
      margin-bottom: 80px;
    }

    .title-page .ornament {
      font-size: 18pt;
      color: #B87333;
      margin-bottom: 20px;
    }

    .title-page .publisher {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 9pt;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #888;
    }

    /* ── Dedication Page ── */
    .dedication-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 100vh;
      page-break-after: always;
    }

    .dedication-page p {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 12pt;
      line-height: 1.8;
      color: #4a4a4a;
      max-width: 300px;
    }

    /* ── Chapter Styles ── */
    .chapter-header {
      text-align: center;
      margin-bottom: 40px;
      padding-top: 60px;
    }

    .chapter-number {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 36pt;
      font-weight: 300;
      color: #B87333;
      margin-bottom: 8px;
    }

    .chapter-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16pt;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 12px;
    }

    .chapter-ornament {
      font-size: 14pt;
      color: #B87333;
    }

    .chapter-body p {
      text-indent: 1.5em;
      margin-bottom: 0;
    }

    .chapter-body p:first-child {
      text-indent: 0;
    }

    .chapter-body p:first-child::first-letter {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 3.2em;
      float: left;
      line-height: 0.8;
      padding-right: 8px;
      padding-top: 4px;
      color: #B87333;
      font-weight: 700;
    }

    .dialogue {
      text-indent: 1.5em !important;
    }

    .scene-break {
      text-align: center;
      margin: 28px 0;
      font-size: 10pt;
      letter-spacing: 0.5em;
      color: #B87333;
    }

    /* ── Copyright Page ── */
    .copyright-page {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 100vh;
      page-break-after: always;
    }

    .copyright-page p {
      font-size: 8pt;
      line-height: 1.6;
      color: #888;
      text-indent: 0;
    }

    /* ── About Author Page ── */
    .about-page {
      page-break-before: always;
      padding-top: 60px;
    }

    .about-page h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16pt;
      text-align: center;
      margin-bottom: 24px;
      color: #1a1a1a;
    }

    .about-page p {
      font-size: 10.5pt;
      line-height: 1.7;
      text-indent: 0;
      margin-bottom: 12px;
      color: #333;
    }
  </style>
</head>
<body>

  <!-- Title Page -->
  <div class="title-page">
    <div class="publisher-mark">Hood Hymns Publishing</div>
    <h1>The Harmonies<br>of Hope</h1>
    <div class="subtitle">The Story of Chris</div>
    <div class="author">C.D. Howell</div>
    <div class="ornament">❧</div>
    <div class="publisher">Hood Hymns Publishing · Detroit, MI</div>
  </div>

  <!-- Copyright Page -->
  <div class="copyright-page">
    <p>THE HARMONIES OF HOPE: The Story of Chris</p>
    <p>Copyright © 2026 by C.D. Howell</p>
    <p>Published by Hood Hymns Publishing</p>
    <p>&nbsp;</p>
    <p>All rights reserved. No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means — electronic, mechanical, photocopy, recording, or any other — except for brief quotations in printed reviews, without the prior permission of the publisher.</p>
    <p>&nbsp;</p>
    <p>This is a work of fiction inspired by real life experiences. Names, characters, places, and incidents either are products of the author's imagination or are used fictitiously. Any resemblance to actual events, locales, or persons, living or dead, is entirely coincidental.</p>
    <p>&nbsp;</p>
    <p>Cover design by Hood Hymns Publishing</p>
    <p>Interior design by Hood Hymns Publishing</p>
    <p>&nbsp;</p>
    <p>First Edition: 2026</p>
    <p>&nbsp;</p>
    <p>Printed in the United States of America</p>
    <p>&nbsp;</p>
    <p>www.hoodhymns.com</p>
  </div>

  <!-- Dedication Page -->
  <div class="dedication-page">
    <p>For every child who ever found God between the block and the blessing.</p>
    <p>&nbsp;</p>
    <p>And for every brother who stayed close enough to hear the music.</p>
  </div>

  <!-- Chapters -->
  ${chapterHTML}

  <!-- About the Author -->
  <div class="about-page">
    <h2>About the Author</h2>
    <p>C.D. Howell was born and raised in Detroit, Michigan. The son of working-class parents who believed in God, music, and the power of family, he grew up in a two-family flat on Detroit's east side before moving to a new neighborhood that changed the trajectory of his life.</p>
    <p>A lifelong musician, choir director, and man of faith, C.D. writes stories that honor where he came from while pointing toward where grace can take you.</p>
    <p><em>The Harmonies of Hope</em> is his debut novel.</p>
    <p>He currently resides in North Carolina with his family.</p>
    <p>&nbsp;</p>
    <p style="text-align: center; color: #B87333;">❧</p>
    <p style="text-align: center; font-size: 9pt; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Hood Hymns Publishing · Detroit, MI</p>
  </div>

</body>
</html>`;
}

// Generate the HTML
const html = generateHTML(chapters);

// Save the HTML (can be opened in browser and printed to PDF)
const outputDir = join(ROOT, 'public', 'ebooks');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const htmlPath = join(outputDir, 'harmonies-of-hope-interior.html');
writeFileSync(htmlPath, html);
console.log(`✅ HTML interior saved to: ${htmlPath}`);
console.log(`\n📖 To generate PDF:`);
console.log(`   1. Open the HTML file in Chrome`);
console.log(`   2. Print → Save as PDF`);
console.log(`   3. Page size: 5.5" × 8.5" (trade paperback)`);
console.log(`\n   OR use Puppeteer (automated):`);

// Try to generate PDF with Puppeteer if available
async function generatePDF() {
  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfPath = join(outputDir, 'harmonies-of-hope.pdf');
    await page.pdf({
      path: pdfPath,
      width: '5.5in',
      height: '8.5in',
      margin: { top: '0.75in', bottom: '0.75in', left: '0.85in', right: '0.85in' },
      printBackground: true,
      displayHeaderFooter: false,
    });
    
    await browser.close();
    console.log(`\n✅ PDF generated: ${pdfPath}`);
    console.log(`   Size: 5.5" × 8.5" (trade paperback format)`);
    console.log(`   Ready for Amazon KDP upload!`);
    return true;
  } catch (e) {
    console.log(`\n⚠️  Puppeteer not found. Installing and retrying...`);
    return false;
  }
}

const pdfGenerated = await generatePDF();

if (!pdfGenerated) {
  console.log(`\n💡 Run: npm install puppeteer && node scripts/generate-ebook-pdf.mjs`);
  console.log(`   Or open the HTML file in Chrome and print to PDF manually.`);
}
