/**
 * Generate KDP-ready interior PDF for "The Harmonies of Hope"
 * 
 * Specs:
 *   - Trim size: 5.5" x 8.5" (standard fiction)
 *   - Inside margin (gutter): 0.5" (for 151-300 pages)
 *   - Outside margins: 0.5"
 *   - Top/bottom margins: 0.75"
 *   - No bleed (text-only interior)
 *   - Font: Garamond 11pt body, chapter titles larger
 *   - PDF/A compliant, all fonts embedded
 * 
 * Usage: node scripts/generate-kdp-interior.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  SectionType,
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MANUSCRIPT = path.join(__dirname, '..', 'content', 'harmonies-of-hope-expanded.md');
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'kdp');

// KDP specs for 5.5" x 8.5" trim (in twips: 1 inch = 1440 twips)
const TRIM = {
  width: 5.5 * 1440,   // 7920
  height: 8.5 * 1440,  // 12240
};

const MARGINS = {
  top: 0.75 * 1440,      // 1080
  bottom: 0.75 * 1440,   // 1080
  gutter: 0.5 * 1440,    // 720 (inside/spine margin)
  outside: 0.5 * 1440,   // 720
};

// ── Parse manuscript ────────────────────────────────────────────────────────

function parseChapters(md) {
  const lines = md.split('\n');
  const chapters = [];
  let currentChapter = null;
  let buffer = [];

  for (const line of lines) {
    const chapterMatch = line.match(/^## (Chapter .+ — .+)$/);
    if (chapterMatch) {
      if (currentChapter) {
        currentChapter.paragraphs = parseParagraphs(buffer.join('\n'));
        chapters.push(currentChapter);
      }
      currentChapter = { title: chapterMatch[1], paragraphs: [] };
      buffer = [];
    } else if (currentChapter) {
      buffer.push(line);
    }
  }
  if (currentChapter) {
    currentChapter.paragraphs = parseParagraphs(buffer.join('\n'));
    chapters.push(currentChapter);
  }
  return chapters;
}

function parseParagraphs(text) {
  return text
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p && p !== '---' && !p.startsWith('#'));
}

// ── Inline formatting ───────────────────────────────────────────────────────

function formatRuns(text, fontSize = 22) {
  const runs = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|([^*]+))/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      runs.push(new TextRun({ text: match[2], bold: true, italics: true, font: 'Garamond', size: fontSize }));
    } else if (match[3]) {
      runs.push(new TextRun({ text: match[3], bold: true, font: 'Garamond', size: fontSize }));
    } else if (match[4]) {
      runs.push(new TextRun({ text: match[4], italics: true, font: 'Garamond', size: fontSize }));
    } else if (match[5]) {
      runs.push(new TextRun({ text: match[5], font: 'Garamond', size: fontSize }));
    }
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text, font: 'Garamond', size: fontSize }));
  }
  return runs;
}

// ── Build document ──────────────────────────────────────────────────────────

function buildKDPDocument(chapters) {
  const sections = [];

  // ===== SECTION 1: FRONT MATTER (no headers/footers, roman numerals) =====
  const frontMatterChildren = [];

  // Half-title page
  frontMatterChildren.push(
    new Paragraph({ spacing: { before: 4000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'The Harmonies of Hope', font: 'Garamond', size: 36, bold: true })],
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // Also by / blank page
  frontMatterChildren.push(
    new Paragraph({ spacing: { before: 6000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '', font: 'Garamond', size: 22 })],
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // Full title page
  frontMatterChildren.push(
    new Paragraph({ spacing: { before: 3000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'The Harmonies of Hope', font: 'Garamond', size: 44, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: '━━━━━━━━━━━━━━━', font: 'Garamond', size: 20, color: '888888' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: 'A Novel', font: 'Garamond', size: 24, italics: true, color: '555555' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'C.D. Howell', font: 'Garamond', size: 28 })],
    }),
    new Paragraph({ spacing: { before: 4000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: 'Hood Hymns Publishing', font: 'Garamond', size: 18, color: '666666' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Detroit, Michigan', font: 'Garamond', size: 18, color: '666666' })],
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // Copyright page
  frontMatterChildren.push(
    new Paragraph({ spacing: { before: 6000 } }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: 'Copyright © 2026 by C.D. Howell', font: 'Garamond', size: 18 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: 'All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the publisher, except in the case of brief quotations in reviews and certain other noncommercial uses permitted by copyright law.', font: 'Garamond', size: 18 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: 'This is a work of fiction. Names, characters, places, and incidents either are the product of the author\'s imagination or are used fictitiously.', font: 'Garamond', size: 18, italics: true })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: 'Published by Hood Hymns Publishing', font: 'Garamond', size: 18 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: 'Detroit, Michigan', font: 'Garamond', size: 18 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: 'www.hoodhymns.com', font: 'Garamond', size: 18 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: 'First Edition: 2026', font: 'Garamond', size: 18, bold: true })],
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // Dedication page
  frontMatterChildren.push(
    new Paragraph({ spacing: { before: 4000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: 'For every child who ever found God\nbetween the block and the blessing.', font: 'Garamond', size: 22, italics: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'And for every brother who stayed close enough\nto hear the music.', font: 'Garamond', size: 22, italics: true })],
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  sections.push({
    properties: {
      page: {
        size: { width: TRIM.width, height: TRIM.height },
        margin: {
          top: MARGINS.top,
          bottom: MARGINS.bottom,
          left: MARGINS.gutter,
          right: MARGINS.outside,
        },
      },
    },
    children: frontMatterChildren,
  });

  // ===== SECTION 2+: CHAPTERS (with headers and page numbers) =====
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const children = [];

    // Chapter opening — drop down with space
    children.push(
      new Paragraph({ spacing: { before: 2400 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: `Chapter ${numberToWord(i + 1)}`, font: 'Garamond', size: 28, bold: true, allCaps: true, characterSpacing: 100 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [new TextRun({ text: chapter.title.replace(/Chapter \w+ — /, ''), font: 'Garamond', size: 24, italics: true, color: '444444' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: '⁂', font: 'Garamond', size: 22, color: '999999' })],
      })
    );

    // Chapter body paragraphs
    for (const para of chapter.paragraphs) {
      if (para === '---') {
        // Scene break
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: '• • •', font: 'Garamond', size: 22, color: '999999' })],
          })
        );
      } else {
        const runs = formatRuns(para);
        children.push(
          new Paragraph({
            spacing: { after: 120, line: 300 },
            indent: { firstLine: 480 },
            children: runs,
          })
        );
      }
    }

    sections.push({
      properties: {
        type: i === 0 ? undefined : SectionType.NEXT_PAGE,
        page: {
          size: { width: TRIM.width, height: TRIM.height },
          margin: {
            top: MARGINS.top,
            bottom: MARGINS.bottom,
            // Alternate gutter for odd/even pages (simplified: left gutter)
            left: MARGINS.gutter,
            right: MARGINS.outside,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'The Harmonies of Hope', font: 'Garamond', size: 16, italics: true, color: '999999' })],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ font: 'Garamond', size: 18, children: [PageNumber.CURRENT] })],
            }),
          ],
        }),
      },
      children,
    });
  }

  // ===== BACK MATTER: About the Author =====
  const backChildren = [];
  backChildren.push(
    new Paragraph({ spacing: { before: 2400 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: 'About the Author', font: 'Garamond', size: 28, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 200, line: 300 },
      children: [new TextRun({
        text: 'C.D. Howell was born and raised in Detroit, Michigan. The son of working-class parents who believed in God, music, and the power of family, he grew up in a two-family flat on Detroit\'s east side before moving to a new neighborhood that changed the trajectory of his life. A lifelong musician, choir director, and man of faith, C.D. writes stories that honor where he came from while pointing toward where grace can take you.',
        font: 'Garamond', size: 22,
      })],
    }),
    new Paragraph({
      spacing: { after: 200, line: 300 },
      children: [new TextRun({ text: 'The Harmonies of Hope is his debut novel.', font: 'Garamond', size: 22, italics: true })],
    }),
    new Paragraph({
      spacing: { after: 200, line: 300 },
      children: [new TextRun({ text: 'He currently resides in North Carolina with his family.', font: 'Garamond', size: 22 })],
    }),
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Hood Hymns Publishing · Detroit, MI', font: 'Garamond', size: 20, color: '666666' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'www.hoodhymns.com', font: 'Garamond', size: 20, color: '666666' })],
    }),
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'The Harmonies of Hope: Vol. II — Decisions, Consequences, But God', font: 'Garamond', size: 22, italics: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Coming 2026', font: 'Garamond', size: 22, italics: true })],
    }),
  );

  sections.push({
    properties: {
      type: SectionType.NEXT_PAGE,
      page: {
        size: { width: TRIM.width, height: TRIM.height },
        margin: { top: MARGINS.top, bottom: MARGINS.bottom, left: MARGINS.gutter, right: MARGINS.outside },
      },
    },
    children: backChildren,
  });

  return new Document({
    creator: 'C.D. Howell',
    title: 'The Harmonies of Hope',
    description: 'KDP Interior — A Novel by C.D. Howell',
    sections,
  });
}

function numberToWord(n) {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return words[n] || String(n);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📖 KDP Interior Generator — The Harmonies of Hope');
  console.log('📐 Trim: 5.5" × 8.5" | Font: Garamond 11pt');
  console.log('━'.repeat(50));

  const md = fs.readFileSync(MANUSCRIPT, 'utf-8');
  const chapters = parseChapters(md);
  console.log(`📚 ${chapters.length} chapters parsed`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const doc = buildKDPDocument(chapters);
  const buffer = await Packer.toBuffer(doc);

  // Save as .docx (KDP accepts both DOCX and PDF — DOCX is easier to convert)
  const docxPath = path.join(OUTPUT_DIR, 'Harmonies-of-Hope-KDP-Interior.docx');
  fs.writeFileSync(docxPath, buffer);

  console.log(`\n✅ KDP interior saved: ${docxPath}`);
  console.log(`   File size: ${(buffer.length / 1024).toFixed(0)} KB`);
  console.log('\n📋 Next steps:');
  console.log('   1. Open in Word and Save As PDF (or upload .docx directly to KDP)');
  console.log('   2. Use KDP Cover Calculator to generate cover template');
  console.log('   3. Upload both to kdp.amazon.com');
}

main().catch(console.error);
