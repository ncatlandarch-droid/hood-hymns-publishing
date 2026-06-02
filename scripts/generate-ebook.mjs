#!/usr/bin/env node
/**
 * Hood Hymns Publishing — Ebook PDF Generator
 * Generates a beautiful 6x9 trade paperback-style PDF ebook
 *
 * Output: public/ebook.pdf
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MANUSCRIPT_PATH = path.join(PROJECT_ROOT, 'content', 'harmonies-of-hope-expanded.md');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'public', 'ebook.pdf');

// ── Design Tokens ─────────────────────────────────────────────────────────────
const PAGE_WIDTH  = 6 * 72;   // 432pt  (6 inches)
const PAGE_HEIGHT = 9 * 72;   // 648pt  (9 inches)
const MARGIN      = 54;       // 0.75 inch margins
const TEXT_WIDTH  = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  brand:   '#8B1A1A',  // deep burgundy / hood hymns red
  black:   '#1A1A1A',
  muted:   '#555555',
  light:   '#888888',
  bg:      '#FFFEF8',  // warm cream
};

// ── Parse Manuscript ──────────────────────────────────────────────────────────
function parseManuscript(md) {
  const lines = md.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (current) sections.push(current);
      current = { type: 'title', title: line.slice(2).trim(), lines: [] };
    } else if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { type: 'chapter', title: line.slice(3).trim(), lines: [] };
    } else if (line.startsWith('### ')) {
      if (current) sections.push(current);
      current = { type: 'subtitle', title: line.slice(4).trim(), lines: [] };
    } else if (line.startsWith('**') && line.includes('Published by')) {
      if (current) current.publisher = line.replace(/\*\*/g, '').trim();
    } else {
      if (current) current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function addPageNumber(doc, num) {
  doc.font('Times-Roman')
     .fontSize(9)
     .fillColor(COLORS.light)
     .text(String(num), MARGIN, PAGE_HEIGHT - 36, { width: TEXT_WIDTH, align: 'center' });
}

function addRunningHeader(doc, title) {
  doc.font('Times-Roman')
     .fontSize(8)
     .fillColor(COLORS.light)
     .text(title.toUpperCase(), MARGIN, 28, { width: TEXT_WIDTH, align: 'center' });
  // thin rule under header
  doc.moveTo(MARGIN, 40).lineTo(PAGE_WIDTH - MARGIN, 40)
     .lineWidth(0.5).strokeColor(COLORS.light).stroke();
}

function drawOrnament(doc, x, y) {
  // Simple fleuron / separator ornament
  doc.font('Times-Roman').fontSize(14).fillColor(COLORS.brand)
     .text('✦', x, y, { width: TEXT_WIDTH, align: 'center' });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  📖  Hood Hymns — Ebook PDF Generator           ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const md = fs.readFileSync(MANUSCRIPT_PATH, 'utf-8');
  const sections = parseManuscript(md);

  const doc = new PDFDocument({
    size: [PAGE_WIDTH, PAGE_HEIGHT],
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: {
      Title:    'The Harmonies of Hope',
      Author:   'C.D. Howell',
      Subject:  'Urban Literary Fiction',
      Keywords: 'Detroit, faith, music, family, memoir, urban fiction',
      Creator:  'Hood Hymns Publishing',
    },
    autoFirstPage: false,
  });

  const stream = fs.createWriteStream(OUTPUT_PATH);
  doc.pipe(stream);

  let pageNum = 0;

  // ── TITLE PAGE ────────────────────────────────────────────────────────────
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
  pageNum++;

  // Cream background
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);

  // Decorative top bar
  doc.rect(0, 0, PAGE_WIDTH, 8).fill(COLORS.brand);

  // Publisher mark - top
  doc.font('Helvetica').fontSize(8).fillColor(COLORS.brand)
     .text('HOOD HYMNS PUBLISHING', MARGIN, 28, { width: TEXT_WIDTH, align: 'center', characterSpacing: 2 });

  // Title
  doc.font('Times-Roman').fontSize(36).fillColor(COLORS.black)
     .text('The Harmonies', MARGIN, 160, { width: TEXT_WIDTH, align: 'center' });
  doc.font('Times-Roman').fontSize(36).fillColor(COLORS.black)
     .text('of Hope', MARGIN, 205, { width: TEXT_WIDTH, align: 'center' });

  // Thin rule
  const ruleY = 265;
  doc.moveTo(MARGIN + 60, ruleY).lineTo(PAGE_WIDTH - MARGIN - 60, ruleY)
     .lineWidth(1).strokeColor(COLORS.brand).stroke();

  // Subtitle
  doc.font('Times-Roman').fontSize(13).fillColor(COLORS.muted)
     .text('Volume One', MARGIN, 282, { width: TEXT_WIDTH, align: 'center' });

  // Ornament
  drawOrnament(doc, MARGIN, 330);

  // Author
  doc.font('Times-Roman').fontSize(16).fillColor(COLORS.black)
     .text('C.D. Howell', MARGIN, 370, { width: TEXT_WIDTH, align: 'center' });

  // Dedication (bottom area)
  doc.font('Times-Roman').fontSize(10).fillColor(COLORS.muted)
     .text(
       'For every child who ever found God between the block and the blessing.\nAnd for every brother who stayed close enough to hear the music.',
       MARGIN + 20, PAGE_HEIGHT - 160, { width: TEXT_WIDTH - 40, align: 'center', lineGap: 6 }
     );

  // Publisher bottom
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.brand)
     .text('Hood Hymns Publishing · Detroit, MI', MARGIN, PAGE_HEIGHT - 60, { width: TEXT_WIDTH, align: 'center' });

  // Decorative bottom bar
  doc.rect(0, PAGE_HEIGHT - 8, PAGE_WIDTH, 8).fill(COLORS.brand);

  console.log('✅ Title page');

  // ── COPYRIGHT PAGE ────────────────────────────────────────────────────────
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
  pageNum++;
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);

  doc.font('Times-Roman').fontSize(10).fillColor(COLORS.muted)
     .text(
       [
         '',
         '',
         '',
         'The Harmonies of Hope, Volume One',
         '',
         'Copyright © 2026 by C.D. Howell',
         'All rights reserved.',
         '',
         'Published by Hood Hymns Publishing',
         'Detroit, Michigan',
         '',
         'No part of this publication may be reproduced, distributed,',
         'or transmitted in any form or by any means, including photocopying,',
         'recording, or other electronic or mechanical methods, without the',
         'prior written permission of the publisher, except in the case of',
         'brief quotations embodied in critical reviews.',
         '',
         'This is a work of creative nonfiction.',
         'Names and identifying details of some individuals have been',
         'changed to protect their privacy.',
         '',
         'ISBN: 978-0-000000-00-0',
         '',
         'First Edition, 2026',
         '',
         'Printed in the United States of America',
         '',
         'hoodhymns.com',
       ].join('\n'),
       MARGIN, 80, { width: TEXT_WIDTH, align: 'left', lineGap: 2 }
     );

  console.log('✅ Copyright page');

  // ── TABLE OF CONTENTS ─────────────────────────────────────────────────────
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
  pageNum++;
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);

  doc.font('Times-Roman').fontSize(22).fillColor(COLORS.brand)
     .text('Contents', MARGIN, 60, { width: TEXT_WIDTH, align: 'left' });
  doc.moveTo(MARGIN, 92).lineTo(PAGE_WIDTH - MARGIN, 92)
     .lineWidth(0.5).strokeColor(COLORS.brand).stroke();

  const chapters = [
    'Chapter One — The Two-Family Flat',
    'Chapter Two — The Brothers',
    'Chapter Three — Mom and Pop',
    'Chapter Four — The Move',
    'Chapter Five — The Church',
    'Chapter Six — The Water',
    'Chapter Seven — The Choir',
    'Chapter Eight — Now Direct',
    'Chapter Nine — The Harmony Unfolds',
    'About the Author',
  ];

  let tocY = 110;
  chapters.forEach((ch, i) => {
    doc.font('Times-Roman').fontSize(11).fillColor(COLORS.black)
       .text(ch, MARGIN, tocY, { continued: false });
    tocY += 24;
  });

  console.log('✅ Table of contents');

  // ── CHAPTERS ──────────────────────────────────────────────────────────────
  const chapterSections = sections.filter(s => s.type === 'chapter');

  for (let i = 0; i < chapterSections.length; i++) {
    const ch = chapterSections[i];
    doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
    pageNum++;
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);
    addRunningHeader(doc, 'The Harmonies of Hope');
    addPageNumber(doc, pageNum);

    // Chapter number label
    doc.font('Helvetica').fontSize(9).fillColor(COLORS.brand)
       .text(`CHAPTER ${['ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'][i] || i+1}`,
              MARGIN, 60, { width: TEXT_WIDTH, align: 'center', characterSpacing: 2 });

    // Thin rule
    doc.moveTo(MARGIN + 80, 78).lineTo(PAGE_WIDTH - MARGIN - 80, 78)
       .lineWidth(0.5).strokeColor(COLORS.brand).stroke();

    // Chapter title (handle "Chapter X — Title" format)
    const titleParts = ch.title.split('—');
    const chTitle = titleParts.length > 1 ? titleParts.slice(1).join('—').trim() : ch.title;

    doc.font('Times-Roman').fontSize(22).fillColor(COLORS.black)
       .text(chTitle, MARGIN, 92, { width: TEXT_WIDTH, align: 'center' });

    let y = 148;
    let firstPara = true;

    // Parse and render chapter content
    const rawText = ch.lines.join('\n');
    const paragraphs = rawText.split(/\n\n+/);

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      // Scene break
      if (trimmed === '---') {
        // Check page space
        if (y > PAGE_HEIGHT - 120) {
          doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
          pageNum++;
          doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);
          addRunningHeader(doc, 'The Harmonies of Hope');
          addPageNumber(doc, pageNum);
          y = 65;
        }
        drawOrnament(doc, MARGIN, y);
        y += 28;
        firstPara = true;
        continue;
      }

      // Italic/quote line (starts with *)
      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
        const italicText = trimmed.slice(1, -1);
        if (y > PAGE_HEIGHT - 120) {
          doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
          pageNum++;
          doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);
          addRunningHeader(doc, 'The Harmonies of Hope');
          addPageNumber(doc, pageNum);
          y = 65;
        }
        const italicHeight = doc.heightOfString(italicText, { width: TEXT_WIDTH - 40 });
        doc.font('Times-Italic').fontSize(11).fillColor(COLORS.muted)
           .text(`"${italicText}"`, MARGIN + 20, y, { width: TEXT_WIDTH - 40, align: 'center', lineGap: 3 });
        y += italicHeight + 16;
        firstPara = false;
        continue;
      }

      // Dialogue / regular paragraph
      // Clean markdown bold within dialogue
      const cleanPara = trimmed
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1');

      const textHeight = doc.heightOfString(cleanPara, { width: TEXT_WIDTH, lineGap: 3 });

      // Page break if not enough room
      if (y + textHeight > PAGE_HEIGHT - 60) {
        doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
        pageNum++;
        doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);
        addRunningHeader(doc, 'The Harmonies of Hope');
        addPageNumber(doc, pageNum);
        y = 65;
        firstPara = true;
      }

      // First paragraph after heading/ornament: no indent
      const indent = firstPara ? 0 : 20;
      doc.font('Times-Roman').fontSize(11.5).fillColor(COLORS.black)
         .text(cleanPara, MARGIN + indent, y, { width: TEXT_WIDTH - indent, align: 'justify', lineGap: 3 });

      y += textHeight + 10;
      firstPara = false;
    }

    console.log(`✅ ${ch.title}`);
  }

  // ── ABOUT THE AUTHOR ──────────────────────────────────────────────────────
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
  pageNum++;
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);
  addPageNumber(doc, pageNum);

  doc.font('Times-Roman').fontSize(22).fillColor(COLORS.brand)
     .text('About the Author', MARGIN, 80, { width: TEXT_WIDTH, align: 'center' });
  doc.moveTo(MARGIN + 60, 112).lineTo(PAGE_WIDTH - MARGIN - 60, 112)
     .lineWidth(0.5).strokeColor(COLORS.brand).stroke();

  const authorBio = `C.D. Howell was born and raised in Detroit, Michigan. The son of working-class parents who believed in God, music, and the power of family, he grew up in a two-family flat on Detroit's east side before moving to a new neighborhood that changed the trajectory of his life.\n\nA lifelong musician, choir director, and man of faith, C.D. writes stories that honor where he came from while pointing toward where grace can take you.\n\nThe Harmonies of Hope is his debut novel.\n\nHe currently resides in North Carolina with his family.`;

  doc.font('Times-Roman').fontSize(12).fillColor(COLORS.black)
     .text(authorBio, MARGIN + 20, 134, { width: TEXT_WIDTH - 40, align: 'left', lineGap: 5 });

  drawOrnament(doc, MARGIN, 360);

  doc.font('Times-Roman').fontSize(10).fillColor(COLORS.muted)
     .text('Hood Hymns Publishing · hoodhymns.com', MARGIN, 400, { width: TEXT_WIDTH, align: 'center' });

  console.log('✅ About the Author');

  // ── COMING SOON PAGE ──────────────────────────────────────────────────────
  doc.addPage({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.bg);
  doc.rect(0, 0, PAGE_WIDTH, 8).fill(COLORS.brand);
  doc.rect(0, PAGE_HEIGHT - 8, PAGE_WIDTH, 8).fill(COLORS.brand);

  doc.font('Helvetica').fontSize(9).fillColor(COLORS.brand)
     .text('COMING SOON FROM HOOD HYMNS PUBLISHING', MARGIN, 50, { width: TEXT_WIDTH, align: 'center', characterSpacing: 1 });

  doc.font('Times-Roman').fontSize(28).fillColor(COLORS.black)
     .text('The Harmonies\nof Hope', MARGIN, 140, { width: TEXT_WIDTH, align: 'center', lineGap: 8 });

  doc.font('Times-Roman').fontSize(16).fillColor(COLORS.brand)
     .text('Volume II — The Choir Stand', MARGIN, 230, { width: TEXT_WIDTH, align: 'center' });

  doc.moveTo(MARGIN + 60, 265).lineTo(PAGE_WIDTH - MARGIN - 60, 265)
     .lineWidth(0.5).strokeColor(COLORS.brand).stroke();

  doc.font('Times-Roman').fontSize(11).fillColor(COLORS.muted)
     .text('Coming 2026', MARGIN, 280, { width: TEXT_WIDTH, align: 'center' });

  doc.font('Times-Roman').fontSize(11).fillColor(COLORS.black)
     .text(
       'Continue Chris\'s journey as he steps into middle school, faces the streets that were always patient, discovers the full weight of the gift that was placed inside him, and learns what it means to lead when the music doesn\'t always come easy.',
       MARGIN + 20, 340, { width: TEXT_WIDTH - 40, align: 'center', lineGap: 4 }
     );

  doc.font('Helvetica').fontSize(10).fillColor(COLORS.brand)
     .text('Visit hoodhymns.com to join the mailing list\nand be first to know when Volume II arrives.',
       MARGIN, PAGE_HEIGHT - 100, { width: TEXT_WIDTH, align: 'center', lineGap: 4 });

  console.log('✅ Coming Soon page');

  // ── Finalize ──────────────────────────────────────────────────────────────
  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  const size = fs.statSync(OUTPUT_PATH).size;
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  ✅  Ebook PDF Generated Successfully!          ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`\n  📄 File: public/ebook.pdf`);
  console.log(`  💾 Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  📖 Pages: ~${pageNum}`);
  console.log(`  📂 Path: ${OUTPUT_PATH}\n`);
}

main().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
