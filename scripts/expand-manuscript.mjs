#!/usr/bin/env node
/**
 * Hood Hymns Publishing — Manuscript Expansion Engine
 * Uses Gemini AI to expand each chapter from ~700 words to ~4,000 words
 * Preserves C.D. Howell's voice, Detroit setting, faith/music/family themes
 *
 * Usage: node scripts/expand-manuscript.mjs
 * Output: content/harmonies-of-hope-expanded.md (overwritten with full novel)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MANUSCRIPT_PATH = path.join(PROJECT_ROOT, 'content', 'harmonies-of-hope-expanded.md');
const BACKUP_PATH     = path.join(PROJECT_ROOT, 'content', 'harmonies-of-hope-original.md');

// ── Load API Key ──────────────────────────────────────────────────────────────
function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = path.join(PROJECT_ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const match = fs.readFileSync(envPath, 'utf-8').match(/^GEMINI_API_KEY=(.+)$/m);
    if (match) return match[1].trim().replace(/^['"']|['"']$/g, '');
  }
  return null;
}

const API_KEY = loadApiKey();
if (!API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY');
  process.exit(1);
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// ── Voice & Style Guide ───────────────────────────────────────────────────────
const STYLE_GUIDE = `You are expanding a chapter from "The Harmonies of Hope" by C.D. Howell, published by Hood Hymns Publishing.

VOICE & STYLE RULES — follow these exactly:
- First-person intimate narration from adult Chris looking back on his childhood
- Setting: Detroit, Michigan, 1990s — east side, two-family flats, Motown radio, block culture
- Themes: faith, family bonds, music as spiritual language, community, hope
- Tone: warm, soulful, literary — like James McBride meets Edward P. Jones
- Language: honest Black vernacular woven naturally into narration, never forced
- Sentences: mix long lyrical sentences with short punchy ones for rhythm
- Dialogue: rich, authentic, characters speak distinctly
- Sensory detail: smells (greens cooking, motor oil, church perfume), sounds (organ, trombone, street noise), textures
- Faith: not preachy — faith is lived, embodied, shown through action and community
- Music: described physically, emotionally — what it FEELS like, not just what it sounds like

STRUCTURE TO MAINTAIN:
- Keep all scene breaks marked with ---
- Keep all existing dialogue and key moments
- ADD new scenes, deeper character moments, more dialogue, more sensory detail
- Do NOT change the fundamental story arc or facts
- End at the same emotional beat as the original chapter

TARGET: Expand to approximately 4,000 words. Write the COMPLETE expanded chapter — title line included.`;

// ── Gemini API Call ───────────────────────────────────────────────────────────
async function expandChapter(chapterTitle, chapterText, chapterNum, totalChapters) {
  const prompt = `${STYLE_GUIDE}

---

ORIGINAL CHAPTER (${chapterNum} of ${totalChapters}):

## ${chapterTitle}

${chapterText}

---

Now write the COMPLETE EXPANDED version of this chapter. Start with:
## ${chapterTitle}

Write approximately 4,000 words. Be specific, be sensory, be true to Chris's story. Go deep into every scene. Add new moments, conversations, and details that bring Detroit, his family, and his faith fully alive. Do not summarize — live inside each moment.`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 8192,
    },
  };

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── Parse Chapters ────────────────────────────────────────────────────────────
function parseChapters(markdown) {
  const lines = markdown.split('\n');
  const chapters = [];
  let frontMatter = [];
  let currentChapter = null;
  let inFrontMatter = true;

  for (const line of lines) {
    const chapterMatch = line.match(/^## (Chapter .+)$/);
    if (chapterMatch) {
      inFrontMatter = false;
      if (currentChapter) chapters.push(currentChapter);
      currentChapter = { title: chapterMatch[1].trim(), lines: [] };
      continue;
    }
    if (inFrontMatter) {
      frontMatter.push(line);
    } else if (currentChapter) {
      // Stop at "About the Author" or end markers
      if (line.match(/^\*\*About the Author\*\*/) || line.match(/^\*End of Volume/)) {
        chapters.push(currentChapter);
        currentChapter = null;
        inFrontMatter = false;
        // Add remaining lines as epilogue
        frontMatter.push('\n---EPILOGUE---\n');
        frontMatter.push(line);
      } else {
        currentChapter.lines.push(line);
      }
    }
  }
  if (currentChapter) chapters.push(currentChapter);

  return { frontMatter: frontMatter.join('\n'), chapters };
}

// ── Extract Epilogue ──────────────────────────────────────────────────────────
function extractEpilogue(markdown) {
  const aboutIdx = markdown.indexOf('*End of Volume');
  const aboutIdx2 = markdown.indexOf('**About the Author**');
  const startIdx = Math.min(
    aboutIdx === -1 ? Infinity : aboutIdx,
    aboutIdx2 === -1 ? Infinity : aboutIdx2
  );
  if (startIdx === Infinity) return '';
  return '\n\n---\n\n' + markdown.slice(startIdx);
}

// ── Sleep Helper ──────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✍️   Hood Hymns — Manuscript Expansion Engine               ║');
  console.log('║  📖  The Harmonies of Hope → Full Novel Length               ║');
  console.log('║  🤖  Powered by Gemini 2.5 Flash                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Backup original
  const original = fs.readFileSync(MANUSCRIPT_PATH, 'utf-8');
  fs.writeFileSync(BACKUP_PATH, original, 'utf-8');
  console.log(`📦 Backed up original to: content/harmonies-of-hope-original.md`);
  console.log('');

  const { frontMatter, chapters } = parseChapters(original);
  const epilogue = extractEpilogue(original);

  console.log(`📖 Found ${chapters.length} chapters to expand`);
  console.log(`🎯 Target: ~4,000 words per chapter (~${chapters.length * 4000} words total)`);
  console.log('');

  const expandedChapters = [];
  let totalWords = 0;

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const originalWords = ch.lines.join(' ').split(/\s+/).length;
    console.log(`📝 Expanding Chapter ${i + 1}/${chapters.length}: ${ch.title}`);
    console.log(`   Original: ~${originalWords} words → Target: ~4,000 words`);

    let expanded = '';
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        expanded = await expandChapter(ch.title, ch.lines.join('\n'), i + 1, chapters.length);
        const expandedWords = expanded.split(/\s+/).length;
        console.log(`   ✅ Expanded to: ~${expandedWords} words`);
        totalWords += expandedWords;
        break;
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error(`   ❌ Failed after ${maxAttempts} attempts: ${err.message}`);
          // Keep original if expansion fails
          expanded = `## ${ch.title}\n\n${ch.lines.join('\n')}`;
        } else {
          console.log(`   ⚠️  Attempt ${attempts} failed, retrying in 10s...`);
          await sleep(10000);
        }
      }
    }

    expandedChapters.push(expanded);

    // Rate limit pause between chapters (except after last)
    if (i < chapters.length - 1) {
      console.log(`   ⏳ Pausing 5s before next chapter...`);
      await sleep(5000);
    }

    console.log('');
  }

  // ── Assemble Final Manuscript ─────────────────────────────────────────────
  const finalManuscript = [
    frontMatter,
    '',
    expandedChapters.join('\n\n---\n\n'),
    epilogue,
  ].join('\n');

  fs.writeFileSync(MANUSCRIPT_PATH, finalManuscript, 'utf-8');

  const finalSize = fs.statSync(MANUSCRIPT_PATH).size;
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📊  Expansion Complete!                                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  ✅ Chapters expanded: ${chapters.length}/${chapters.length}`);
  console.log(`  📝 Total words: ~${totalWords.toLocaleString()}`);
  console.log(`  📄 Est. pages: ~${Math.round(totalWords / 250)}`);
  console.log(`  💾 File size: ${(finalSize / 1024).toFixed(0)} KB`);
  console.log(`  📂 Saved to: content/harmonies-of-hope-expanded.md`);
  console.log(`  📦 Original at: content/harmonies-of-hope-original.md`);
  console.log('');
  console.log('🎉 Next step: node scripts/generate-audiobook.mjs');
  console.log('');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
