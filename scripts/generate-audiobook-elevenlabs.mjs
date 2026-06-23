/**
 * Generate audiobook chapters using ElevenLabs TTS with C.D. Howell's cloned voice.
 * 
 * Reads from: content/harmonies-of-hope-expanded.md
 * Outputs to: public/audiobook/chapter-XX.mp3
 * 
 * Usage: node scripts/generate-audiobook-elevenlabs.mjs
 * 
 * Environment variables (from .env.local):
 *   ELEVENLABS_API_KEY  — your ElevenLabs API key
 *   ELEVENLABS_VOICE_ID — the cloned voice ID
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audiobook');
const MANUSCRIPT = path.join(__dirname, '..', 'content', 'harmonies-of-hope-expanded.md');

// ElevenLabs has a ~5000 char limit per request for standard TTS
const CHUNK_SIZE = 4500;

if (!API_KEY || !VOICE_ID) {
  console.error('❌ Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local');
  process.exit(1);
}

// ── Parse manuscript into chapters ──────────────────────────────────────────

function parseChapters(mdContent) {
  const lines = mdContent.split('\n');
  const chapters = [];
  let currentChapter = null;
  let buffer = [];

  for (const line of lines) {
    const chapterMatch = line.match(/^## (Chapter \w+ — .+)$/);

    if (chapterMatch) {
      // Save previous chapter
      if (currentChapter) {
        currentChapter.text = cleanText(buffer.join('\n'));
        chapters.push(currentChapter);
      }
      currentChapter = { title: chapterMatch[1], text: '' };
      buffer = [];
    } else if (currentChapter) {
      buffer.push(line);
    }
  }

  // Save last chapter
  if (currentChapter) {
    currentChapter.text = cleanText(buffer.join('\n'));
    chapters.push(currentChapter);
  }

  return chapters;
}

function cleanText(text) {
  return text
    // Remove markdown formatting
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^---+$/gm, '')
    .replace(/^---[A-Z]+---$/gm, '')
    // Remove em dashes that confuse TTS
    .replace(/—/g, ', ')
    .replace(/–/g, ', ')
    // Remove stray markdown artifacts
    .replace(/\*+/g, '')
    .replace(/#+/g, '')
    .replace(/`/g, '')
    // Clean up ellipsis
    .replace(/\.{3,}/g, '...')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Split text into chunks for API ──────────────────────────────────────────

function splitIntoChunks(text, maxLength = CHUNK_SIZE) {
  const chunks = [];
  // Split on paragraph breaks first (double newlines), then fall back to sentences
  const paragraphs = text.split(/\n\n+/);
  let current = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // If adding this paragraph exceeds limit, save current and start new chunk
    if ((current + '\n\n' + trimmed).length > maxLength && current.length > 0) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current += (current ? '\n\n' : '') + trimmed;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

// ── Call ElevenLabs TTS API ─────────────────────────────────────────────────

async function textToSpeech(text, retries = 3) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.82,
            similarity_boost: 0.82,
            style: 0.10,
            use_speaker_boost: true,
            speed: 0.85,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        if (response.status === 429) {
          // Rate limited — wait and retry
          const waitTime = attempt * 30;
          console.log(`   ⏳ Rate limited, waiting ${waitTime}s before retry ${attempt}/${retries}...`);
          await sleep(waitTime * 1000);
          continue;
        }
        throw new Error(`API error ${response.status}: ${error}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`   ⚠️ Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(5000);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Concatenate MP3 buffers ─────────────────────────────────────────────────

function concatBuffers(buffers) {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
  const result = Buffer.alloc(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    buf.copy(result, offset);
    offset += buf.length;
  }
  return result;
}

// ── Generate intro ──────────────────────────────────────────────────────────

async function generateIntro() {
  const introText = `The Harmonies of Hope. By C.D. Howell. Published by Hood Hymns Publishing. For every child who ever found God between the block and the blessing. And for every brother who stayed close enough to hear the music.`;

  console.log('\n🎙️  Generating Intro...');
  console.log(`   Text: ${introText.length} characters`);

  const audioBuffer = await textToSpeech(introText);
  const outPath = path.join(OUTPUT_DIR, 'intro.mp3');
  fs.writeFileSync(outPath, audioBuffer);
  console.log(`   ✅ Saved: intro.mp3 (${(audioBuffer.length / 1024).toFixed(0)} KB)`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📖 The Harmonies of Hope — Audiobook Generator');
  console.log('🎤 Voice: C.D. Howell (ElevenLabs Clone)');
  console.log('━'.repeat(50));

  // Parse args — allow generating specific chapters
  const args = process.argv.slice(2);
  const specificChapter = args.length > 0 ? parseInt(args[0]) : null;

  // Read and parse manuscript
  const md = fs.readFileSync(MANUSCRIPT, 'utf-8');
  const chapters = parseChapters(md);
  console.log(`\n📚 Found ${chapters.length} chapters\n`);

  // Show chapter sizes
  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const chars = ch.text.length;
    const chunks = splitIntoChunks(ch.text).length;
    const marker = specificChapter === null || specificChapter === i + 1 ? '→' : ' ';
    console.log(`  ${marker} Ch ${i + 1}: ${ch.title} (${chars.toLocaleString()} chars, ${chunks} API calls)`);
  }

  const totalChars = chapters.reduce((sum, ch) => sum + ch.text.length, 0);
  console.log(`\n  Total: ${totalChars.toLocaleString()} characters`);
  console.log(`  Estimated ElevenLabs credits: ~${totalChars.toLocaleString()} characters\n`);

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate intro
  if (specificChapter === null || specificChapter === 0) {
    await generateIntro();
  }

  // Generate each chapter
  const chaptersToGenerate = specificChapter
    ? [{ index: specificChapter - 1, chapter: chapters[specificChapter - 1] }]
    : chapters.map((chapter, index) => ({ index, chapter }));

  for (const { index, chapter } of chaptersToGenerate) {
    const chapterNum = String(index + 1).padStart(2, '0');
    const outPath = path.join(OUTPUT_DIR, `chapter-${chapterNum}.mp3`);

    console.log(`\n🎙️  Generating Chapter ${index + 1}: ${chapter.title}`);
    console.log(`   ${chapter.text.length.toLocaleString()} characters`);

    // Split into chunks
    const chunks = splitIntoChunks(chapter.text);
    console.log(`   ${chunks.length} chunks to process`);

    const audioBuffers = [];

    for (let c = 0; c < chunks.length; c++) {
      process.stdout.write(`   ▸ Chunk ${c + 1}/${chunks.length} (${chunks[c].length} chars)...`);

      const audio = await textToSpeech(chunks[c]);
      audioBuffers.push(audio);

      console.log(` ✅ ${(audio.length / 1024).toFixed(0)} KB`);

      // Small delay between chunks to avoid rate limiting
      if (c < chunks.length - 1) {
        await sleep(1000);
      }
    }

    // Concatenate all chunks
    const fullAudio = concatBuffers(audioBuffers);
    fs.writeFileSync(outPath, fullAudio);

    const sizeMB = (fullAudio.length / (1024 * 1024)).toFixed(1);
    console.log(`   💾 Saved: chapter-${chapterNum}.mp3 (${sizeMB} MB)`);
  }

  console.log('\n' + '━'.repeat(50));
  console.log('🎉 Audiobook generation complete!');
  console.log(`📂 Files saved to: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
