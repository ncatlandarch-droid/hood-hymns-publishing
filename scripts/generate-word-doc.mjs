/**
 * Generate a Word document from the Harmonies of Hope manuscript
 * Usage: node scripts/generate-word-doc.mjs
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
  HeadingLevel,
  PageBreak,
  BorderStyle,
  TabStopPosition,
  TabStopType,
  SectionType,
  Footer,
  Header,
  PageNumber,
  NumberFormat,
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the markdown file
const mdPath = path.join(__dirname, '..', 'content', 'harmonies-of-hope-expanded.md');
const markdown = fs.readFileSync(mdPath, 'utf-8');

// Parse markdown into structured content
function parseMarkdown(md) {
  const lines = md.split('\n');
  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines but track them
    if (trimmed === '') {
      elements.push({ type: 'blank' });
      continue;
    }

    // Horizontal rules / section breaks
    if (trimmed === '---') {
      elements.push({ type: 'separator' });
      continue;
    }

    // H1 — Book title
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      elements.push({ type: 'h1', text: trimmed.replace(/^# /, '') });
      continue;
    }

    // H2 — Chapter titles
    if (trimmed.startsWith('## ')) {
      elements.push({ type: 'h2', text: trimmed.replace(/^## /, '') });
      continue;
    }

    // H3 — Subtitles
    if (trimmed.startsWith('### ')) {
      elements.push({ type: 'h3', text: trimmed.replace(/^### /, '') });
      continue;
    }

    // Epilogue/End markers
    if (trimmed.startsWith('---') && trimmed.endsWith('---') && trimmed.length > 6) {
      const inner = trimmed.replace(/^---/, '').replace(/---$/, '').trim();
      elements.push({ type: 'centered-text', text: inner });
      continue;
    }

    // Regular paragraph (may contain bold, italic, etc.)
    elements.push({ type: 'paragraph', text: trimmed });
  }

  return elements;
}

// Convert inline markdown (bold, italic) to TextRun objects
function parseInlineFormatting(text) {
  const runs = [];
  // Regex to find bold+italic (***), bold (**), italic (*), and plain text
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|([^*]+))/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      // Bold + Italic
      runs.push(new TextRun({ text: match[2], bold: true, italics: true, font: 'Garamond', size: 24 }));
    } else if (match[3]) {
      // Bold
      runs.push(new TextRun({ text: match[3], bold: true, font: 'Garamond', size: 24 }));
    } else if (match[4]) {
      // Italic
      runs.push(new TextRun({ text: match[4], italics: true, font: 'Garamond', size: 24 }));
    } else if (match[5]) {
      // Plain text
      runs.push(new TextRun({ text: match[5], font: 'Garamond', size: 24 }));
    }
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text, font: 'Garamond', size: 24 }));
  }

  return runs;
}

// Build the Word document
function buildDocument(elements) {
  const children = [];
  let isFirstChapter = true;

  // ===== TITLE PAGE =====
  children.push(
    new Paragraph({ spacing: { before: 4000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'The Harmonies of Hope',
          bold: true,
          font: 'Garamond',
          size: 56,
          color: '2D2D2D',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: '━━━━━━━━━━━━━━━━━━━━',
          font: 'Garamond',
          size: 24,
          color: '888888',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'A Novel',
          italics: true,
          font: 'Garamond',
          size: 28,
          color: '555555',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'By C.D. Howell',
          font: 'Garamond',
          size: 32,
        }),
      ],
    }),
    new Paragraph({ spacing: { before: 3000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'Hood Hymns Publishing',
          font: 'Garamond',
          size: 22,
          color: '666666',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Detroit, MI',
          font: 'Garamond',
          size: 22,
          color: '666666',
        }),
      ],
    }),
    // Page break after title
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // ===== DEDICATION PAGE =====
  children.push(
    new Paragraph({ spacing: { before: 3000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'For every child who ever found God between the block and the blessing.',
          italics: true,
          font: 'Garamond',
          size: 26,
          color: '333333',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'And for every brother who stayed close enough to hear the music.',
          italics: true,
          font: 'Garamond',
          size: 26,
          color: '333333',
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // ===== BODY CONTENT =====
  let skipTitleBlock = true; // Skip the first few lines (title/author/dedication already done)
  let skipCount = 0;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    // Skip the title block we already rendered (first h1, h3, bold, dedication lines, separators)
    if (skipTitleBlock) {
      if (el.type === 'h2') {
        skipTitleBlock = false; // First chapter heading — start rendering
      } else {
        continue;
      }
    }

    switch (el.type) {
      case 'h2': {
        // Chapter heading — add page break before (except first)
        if (!isFirstChapter) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
        isFirstChapter = false;

        children.push(
          new Paragraph({ spacing: { before: 2000 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: el.text,
                bold: true,
                font: 'Garamond',
                size: 36,
                color: '2D2D2D',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: '⁂',
                font: 'Garamond',
                size: 28,
                color: '999999',
              }),
            ],
          })
        );
        break;
      }

      case 'h3': {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: el.text,
                italics: true,
                font: 'Garamond',
                size: 28,
                color: '444444',
              }),
            ],
          })
        );
        break;
      }

      case 'separator': {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: '• • •',
                font: 'Garamond',
                size: 24,
                color: '999999',
              }),
            ],
          })
        );
        break;
      }

      case 'centered-text': {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: el.text,
                italics: true,
                font: 'Garamond',
                size: 24,
                color: '555555',
              }),
            ],
          })
        );
        break;
      }

      case 'paragraph': {
        const runs = parseInlineFormatting(el.text);
        children.push(
          new Paragraph({
            spacing: { after: 200, line: 360 },
            indent: { firstLine: 720 },
            children: runs,
          })
        );
        break;
      }

      case 'blank': {
        // Skip consecutive blanks
        break;
      }
    }
  }

  // Create the document
  const doc = new Document({
    creator: 'C.D. Howell',
    title: 'The Harmonies of Hope',
    description: 'A novel by C.D. Howell, published by Hood Hymns Publishing',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'The Harmonies of Hope',
                    italics: true,
                    font: 'Garamond',
                    size: 18,
                    color: '999999',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    font: 'Garamond',
                    size: 18,
                    color: '999999',
                    children: [PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return doc;
}

// Main
async function main() {
  console.log('📖 Parsing manuscript...');
  const elements = parseMarkdown(markdown);
  console.log(`   Found ${elements.length} elements`);

  console.log('📝 Building Word document...');
  const doc = buildDocument(elements);

  console.log('💾 Saving...');
  const outputPath = path.join(__dirname, '..', 'content', 'Harmonies-of-Hope-by-CD-Howell.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Word document saved to: ${outputPath}`);
  console.log(`   File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
