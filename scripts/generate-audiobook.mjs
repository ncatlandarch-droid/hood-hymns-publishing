#!/usr/bin/env node
/**
 * Hood Hymns Publishing — Audiobook Generator
 * Generates full audiobook WAV files from the expanded manuscript using Gemini TTS
 *
 * Usage:  GEMINI_API_KEY=xxx node scripts/generate-audiobook.mjs
 *         (or set GEMINI_API_KEY in a .env file in the project root)
 *
 * Output: public/audiobook/intro.wav, chapter-01.wav … chapter-09.wav
 *
 * Voice: Kore (deep, warm, male — perfect for Chris's story)
 * Model: gemini-2.5-flash-preview-tts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Paths ────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MANUSCRIPT_PATH = path.join(PROJECT_ROOT, 'content', 'harmonies-of-hope-expanded.md');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'audiobook');

// ── Config ───────────────────────────────────────────────────────────────────
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const TTS_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent`;
const VOICE_NAME = 'Kore';
const SAMPLE_RATE = 24000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const INTER_CHAPTER_PAUSE_SECONDS = 2;

// ── Load API Key ─────────────────────────────────────────────────────────────
function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  // Try loading from .env
  const envPath = path.join(PROJECT_ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }

  return null;
}

const API_KEY = loadApiKey();
if (!API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY. Set it as an environment variable or in a .env file.');
  process.exit(1);
}

// ── TTS Style Prompt ─────────────────────────────────────────────────────────
const NARRATION_STYLE = `You are a deep-voiced African American male narrator from Detroit, Michigan. Speak with the distinctive Detroit accent: use the Inland North nasal 'a' sound, blend syllables naturally at a steady pace, and employ the wide-ranging melodic intonation pattern of African-American Vernacular English. Your cadence should be warm, rhythmic, and soulful — like a loving father sharing his testimony with his community. Deliberate pauses for emphasis. Let the words breathe. This is a story of faith, family, and music — tell it like you lived it.`;

// ── Parse Manuscript ─────────────────────────────────────────────────────────
function parseManuscript(markdownContent) {
  const lines = markdownContent.split('\n');
  const chapters = [];
  let currentChapter = null;

  for (const line of lines) {
    // Match chapter headings: "## Chapter One — ..." or "## Chapter ..."
    const chapterMatch = line.match(/^## (Chapter .+)$/);
    if (chapterMatch) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      currentChapter = {
        title: chapterMatch[1].trim(),
        lines: [],
      };
      continue;
    }

    if (currentChapter) {
      currentChapter.lines.push(line);
    }
  }

  // Push the last chapter
  if (currentChapter) {
    chapters.push(currentChapter);
  }

  // Clean up: join lines and trim trailing whitespace / dividers
  return chapters.map((ch) => {
    let text = ch.lines.join('\n').trim();
    // Remove trailing "---" dividers
    text = text.replace(/\n---\s*$/, '').trim();
    // Remove lines that are just "---"
    text = text.replace(/^---\s*$/gm, '').trim();
    return { title: ch.title, text };
  });
}

// ── Extract Book Metadata ────────────────────────────────────────────────────
function extractMetadata(markdownContent) {
  const titleMatch = markdownContent.match(/^# (.+)$/m);
  const authorMatch = markdownContent.match(/^### By (.+)$/m);
  const publisherMatch = markdownContent.match(/\*\*Published by (.+)\*\*/);

  return {
    title: titleMatch ? titleMatch[1].trim() : 'The Harmonies of Hope',
    author: authorMatch ? authorMatch[1].trim() : 'C.D. Howell',
    publisher: publisherMatch ? publisherMatch[1].trim() : 'Hood Hymns Publishing',
  };
}

// ── Generate Intro Text ──────────────────────────────────────────────────────
function buildIntroText(metadata) {
  return `${metadata.title}. Written by ${metadata.author}. Published by ${metadata.publisher}.\n\nFor every child who ever found God between the block and the blessing. And for every brother who stayed close enough to hear the music.`;
}

// ── Gemini TTS API Call ──────────────────────────────────────────────────────
async function callTTS(text, style) {
  const prompt = style ? `${style}\n\n${text}` : text;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: VOICE_NAME },
        },
      },
    },
  };

  const url = `${TTS_URL}?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`TTS API error ${response.status}: ${errText}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const mimeType = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType;

  if (!audioData) {
    throw new Error('No audio data in TTS response');
  }

  return { audioBuffer: Buffer.from(audioData, 'base64'), mimeType };
}

// ── Retry Wrapper ────────────────────────────────────────────────────────────
async function callTTSWithRetry(text, style, label) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callTTS(text, style);
    } catch (err) {
      const isRateLimit = err.status === 429;
      const isServerError = err.status >= 500;
      const isRetryable = isRateLimit || isServerError;

      if (!isRetryable || attempt === MAX_RETRIES) {
        throw err;
      }

      const delay = isRateLimit
        ? RETRY_DELAY_MS * attempt * 2  // Longer backoff for rate limits
        : RETRY_DELAY_MS * attempt;

      console.log(`   ⚠️  ${label}: Attempt ${attempt} failed (${err.status}). Retrying in ${delay / 1000}s...`);
      await sleep(delay);
    }
  }
}

// ── WAV File Creator ─────────────────────────────────────────────────────────
function createWavFile(pcmBuffer) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const headerSize = 44;

  const wavHeader = Buffer.alloc(headerSize);
  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(headerSize + dataSize - 8, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);         // Subchunk1Size
  wavHeader.writeUInt16LE(1, 20);          // AudioFormat (PCM)
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(SAMPLE_RATE, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(dataSize, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

// ── Generate Silence (for pauses between chapters) ───────────────────────────
function generateSilence(seconds) {
  const numSamples = SAMPLE_RATE * seconds;
  // 16-bit PCM silence = all zeros
  return Buffer.alloc(numSamples * 2); // 2 bytes per sample
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function estimateDuration(pcmBytes) {
  // 16-bit mono = 2 bytes per sample
  return (pcmBytes / (SAMPLE_RATE * 2)).toFixed(1);
}

// ── Chunk Long Text ──────────────────────────────────────────────────────────
// The TTS API may have text length limits. Split into manageable chunks
// and concatenate the audio.
const MAX_CHARS_PER_CHUNK = 4000;

function chunkText(text) {
  if (text.length <= MAX_CHARS_PER_CHUNK) return [text];

  const chunks = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';

  for (const para of paragraphs) {
    if (currentChunk.length + para.length + 2 > MAX_CHARS_PER_CHUNK && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += (currentChunk ? '\n\n' : '') + para;
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   🎙️  Hood Hymns Publishing — Audiobook Generator        ║');
  console.log('║   📖  The Harmonies of Hope                              ║');
  console.log('║   🎤  Voice: Kore (Deep, Warm, Male)                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  // Read manuscript
  if (!fs.existsSync(MANUSCRIPT_PATH)) {
    console.error(`❌ Manuscript not found: ${MANUSCRIPT_PATH}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(MANUSCRIPT_PATH, 'utf-8');
  const metadata = extractMetadata(markdown);
  const chapters = parseManuscript(markdown);

  console.log(`📚 Book: ${metadata.title}`);
  console.log(`✍️  Author: ${metadata.author}`);
  console.log(`🏢 Publisher: ${metadata.publisher}`);
  console.log(`📖 Chapters found: ${chapters.length}`);
  console.log(`🎤 Voice: ${VOICE_NAME}`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);
  console.log('');

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  const totalItems = chapters.length + 1; // +1 for intro

  // ── Generate Intro ──────────────────────────────────────────────────────
  console.log(`🎬 Generating Intro (1/${totalItems})...`);
  try {
    const introText = buildIntroText(metadata);
    console.log(`   Text length: ${introText.length} chars`);

    const { audioBuffer } = await callTTSWithRetry(introText, NARRATION_STYLE, 'Intro');
    const wavData = createWavFile(audioBuffer);
    const outPath = path.join(OUTPUT_DIR, 'intro.wav');
    fs.writeFileSync(outPath, wavData);

    const result = {
      name: 'Intro',
      file: 'intro.wav',
      size: wavData.length,
      duration: estimateDuration(audioBuffer.length),
    };
    results.push(result);
    console.log(`   ✅ Saved: intro.wav (${formatFileSize(wavData.length)}, ~${result.duration}s)`);
  } catch (err) {
    console.error(`   ❌ Failed: ${err.message}`);
    results.push({ name: 'Intro', file: 'intro.wav', size: 0, duration: '0', error: err.message });
  }

  // Delay between API calls
  await sleep(3000);

  // ── Generate Each Chapter ───────────────────────────────────────────────
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const chapterNum = String(i + 1).padStart(2, '0');
    const filename = `chapter-${chapterNum}.wav`;
    const label = `Chapter ${i + 1}/${chapters.length}`;

    console.log(`\n📖 Generating ${label}: ${chapter.title} (${i + 2}/${totalItems})...`);
    console.log(`   Text length: ${chapter.text.length} chars`);

    try {
      const chunks = chunkText(chapter.text);
      const audioBuffers = [];

      if (chunks.length > 1) {
        console.log(`   📝 Split into ${chunks.length} chunks`);
      }

      for (let c = 0; c < chunks.length; c++) {
        if (chunks.length > 1) {
          console.log(`   📡 Generating chunk ${c + 1}/${chunks.length}...`);
        } else {
          console.log(`   📡 Calling Gemini TTS API...`);
        }

        const { audioBuffer } = await callTTSWithRetry(chunks[c], NARRATION_STYLE, `${label} chunk ${c + 1}`);
        audioBuffers.push(audioBuffer);

        // Small delay between chunks
        if (c < chunks.length - 1) {
          await sleep(2000);
        }
      }

      // Concatenate all audio chunks
      const fullAudioBuffer = Buffer.concat(audioBuffers);
      const wavData = createWavFile(fullAudioBuffer);
      const outPath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(outPath, wavData);

      const result = {
        name: chapter.title,
        file: filename,
        size: wavData.length,
        duration: estimateDuration(fullAudioBuffer.length),
      };
      results.push(result);
      console.log(`   ✅ Saved: ${filename} (${formatFileSize(wavData.length)}, ~${result.duration}s)`);
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      results.push({ name: chapter.title, file: filename, size: 0, duration: '0', error: err.message });
    }

    // Delay between chapters to avoid rate limiting
    if (i < chapters.length - 1) {
      console.log(`   ⏳ Waiting 3s before next chapter...`);
      await sleep(3000);
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   📊  Audiobook Generation Summary                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  const successful = results.filter((r) => !r.error);
  const failed = results.filter((r) => r.error);
  let totalSize = 0;
  let totalDuration = 0;

  console.log('  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │ Track                        │ File           │ Size     │');
  console.log('  ├──────────────────────────────────────────────────────────┤');

  for (const r of results) {
    if (r.error) {
      const name = r.name.substring(0, 28).padEnd(28);
      console.log(`  │ ${name} │ ❌ FAILED       │          │`);
    } else {
      const name = r.name.substring(0, 28).padEnd(28);
      const file = r.file.padEnd(14);
      const size = formatFileSize(r.size).padEnd(8);
      console.log(`  │ ${name} │ ${file} │ ${size} │`);
      totalSize += r.size;
      totalDuration += parseFloat(r.duration);
    }
  }

  console.log('  └──────────────────────────────────────────────────────────┘');
  console.log('');
  console.log(`  ✅ Successful: ${successful.length}/${results.length}`);
  if (failed.length > 0) {
    console.log(`  ❌ Failed: ${failed.length}/${results.length}`);
  }
  console.log(`  💾 Total size: ${formatFileSize(totalSize)}`);
  console.log(`  ⏱️  Total duration: ~${Math.round(totalDuration / 60)} min ${Math.round(totalDuration % 60)}s`);
  console.log(`  📂 Output: ${OUTPUT_DIR}`);
  console.log('');
  console.log('🎉 Done! Audiobook files saved to public/audiobook/');
  console.log('');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
