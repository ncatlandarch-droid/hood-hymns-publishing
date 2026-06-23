/**
 * Generate multilingual audiobook chapters using Gemini AI.
 * 
 * Pipeline: English manuscript → Gemini Translation → Gemini TTS → MP3
 * 
 * Usage:
 *   node scripts/generate-audiobook-multilingual.mjs es    # Spanish
 *   node scripts/generate-audiobook-multilingual.mjs zh    # Mandarin Chinese
 *   node scripts/generate-audiobook-multilingual.mjs sw    # Swahili
 * 
 * Outputs:
 *   content/harmonies-of-hope-{lang}.md       (translated manuscript)
 *   public/audiobook/{lang}/chapter-XX.mp3    (audio files)
 * 
 * Environment: GEMINI_API_KEY in .env or .env.local
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// ── Load env ────────────────────────────────────────────────────────────────
function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, 'utf-8').split('\n');
      for (const line of lines) {
        const match = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
        if (match) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('❌ Missing GEMINI_API_KEY'); process.exit(1); }

// ── Language config ─────────────────────────────────────────────────────────
const LANG_CONFIG = {
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    voice: 'Kore',
    ttsStyle: 'You are a warm, deep-voiced male narrator reading a literary novel in Spanish. Speak clearly with natural rhythm and emotional depth. Use a rich, resonant tone appropriate for dramatic fiction. Pace yourself — do not rush.',
    translationPrompt: 'You are a professional literary translator. Translate the following chapter of a novel from English to Spanish. Maintain the literary style, emotional tone, dialogue formatting, and narrative voice. Keep character names unchanged. Do NOT add any translator notes, commentary, or explanations — output ONLY the translated text.',
  },
  zh: {
    name: 'Mandarin Chinese',
    nativeName: '中文',
    voice: 'Kore',
    ttsStyle: 'You are a warm, deep-voiced male narrator reading a literary novel in Mandarin Chinese. Speak clearly with natural rhythm and emotional depth. Use a rich, resonant tone appropriate for dramatic fiction. Pace yourself — do not rush.',
    translationPrompt: 'You are a professional literary translator. Translate the following chapter of a novel from English to Mandarin Chinese (Simplified). Maintain the literary style, emotional tone, dialogue formatting, and narrative voice. Keep character names unchanged (transliterate to Chinese phonetics). Do NOT add any translator notes, commentary, or explanations — output ONLY the translated text.',
  },
  sw: {
    name: 'Swahili',
    nativeName: 'Kiswahili',
    voice: 'Kore',
    ttsStyle: 'You are a warm, deep-voiced male narrator reading a literary novel in Swahili. Speak clearly with natural rhythm and emotional depth. Use a rich, resonant tone appropriate for dramatic fiction. Pace yourself — do not rush.',
    translationPrompt: 'You are a professional literary translator. Translate the following chapter of a novel from English to Swahili (Kiswahili). Maintain the literary style, emotional tone, dialogue formatting, and narrative voice. Keep character names unchanged. Do NOT add any translator notes, commentary, or explanations — output ONLY the translated text.',
  },
};

// ── Parse CLI args ──────────────────────────────────────────────────────────
const lang = process.argv[2];
if (!lang || !LANG_CONFIG[lang]) {
  console.error(`Usage: node ${path.basename(__filename)} <es|zh|sw>`);
  console.error('  es = Spanish, zh = Mandarin Chinese, sw = Swahili');
  process.exit(1);
}

const config = LANG_CONFIG[lang];
const MANUSCRIPT = path.join(ROOT, 'content', 'harmonies-of-hope-expanded.md');
const TRANSLATED_OUTPUT = path.join(ROOT, 'content', `harmonies-of-hope-${lang}.md`);
const AUDIO_DIR = path.join(ROOT, 'public', 'audiobook', lang);
const TTS_CHUNK_SIZE = 3500; // slightly smaller for translated text (may expand)

console.log(`\n📖 The Harmonies of Hope — Multilingual Audiobook Generator`);
console.log(`🌍 Language: ${config.name} (${config.nativeName})`);
console.log(`🎤 Voice: ${config.voice}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

// ── Helpers ─────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function parseChapters(mdContent) {
  const lines = mdContent.split('\n');
  const chapters = [];
  let currentChapter = null;
  let buffer = [];

  for (const line of lines) {
    const chapterMatch = line.match(/^## (Chapter \w+ — .+)$/);
    if (chapterMatch) {
      if (currentChapter) {
        currentChapter.text = buffer.join('\n').trim();
        chapters.push(currentChapter);
      }
      currentChapter = { title: chapterMatch[1], text: '' };
      buffer = [];
    } else if (currentChapter) {
      // Skip markdown headings within chapters but keep content
      if (!line.startsWith('# ')) buffer.push(line);
    }
  }
  if (currentChapter) {
    currentChapter.text = buffer.join('\n').trim();
    chapters.push(currentChapter);
  }
  return chapters;
}

function chunkText(text, maxLength = TTS_CHUNK_SIZE) {
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    if ((current + '\n\n' + trimmed).length > maxLength && current.length > 0) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current += (current ? '\n\n' : '') + trimmed;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ── Gemini Text API (for translation) ───────────────────────────────────────
async function translateText(text, chapterTitle, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${config.translationPrompt}\n\nChapter title: "${chapterTitle}"\n\n---\n\n${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,  // Low temp for faithful translation
            maxOutputTokens: 65536,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const wait = attempt * 30;
          console.log(`   ⏳ Rate limited, waiting ${wait}s...`);
          await sleep(wait * 1000);
          continue;
        }
        throw new Error(`Translation API error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const translated = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!translated) throw new Error('No translation returned');
      return translated.trim();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`   ⚠️ Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(5000 * attempt);
    }
  }
}

// ── Gemini TTS API ──────────────────────────────────────────────────────────
async function generateTTS(text, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${config.ttsStyle}\n\n${text}` }]
          }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: config.voice }
              }
            }
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const wait = attempt * 30;
          console.log(`   ⏳ Rate limited, waiting ${wait}s...`);
          await sleep(wait * 1000);
          continue;
        }
        throw new Error(`TTS API error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioData) throw new Error('No audio data returned');

      // Decode base64 PCM → WAV buffer
      const pcmBuffer = Buffer.from(audioData, 'base64');
      return createWavBuffer(pcmBuffer);
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`   ⚠️ TTS attempt ${attempt} failed: ${err.message}. Retrying...`);
      await sleep(5000 * attempt);
    }
  }
}

// ── WAV header creation (24kHz, 16-bit, mono) ──────────────────────────────
function createWavBuffer(pcmData) {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;

  const header = Buffer.alloc(headerSize);
  header.write('RIFF', 0);
  header.writeUInt32LE(dataSize + headerSize - 8, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);           // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmData]);
}

// ── WAV → MP3 conversion ───────────────────────────────────────────────────
function wavToMp3(wavPath, mp3Path) {
  try {
    execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -b:a 192k -ar 24000 "${mp3Path}" 2>/dev/null`, { stdio: 'pipe' });
    return true;
  } catch {
    // If ffmpeg not available, try with powershell/alternative or keep as WAV
    console.log(`   ⚠️ FFmpeg not found — saving as WAV instead of MP3`);
    return false;
  }
}

// ── Main pipeline ───────────────────────────────────────────────────────────
async function main() {
  // Ensure output dirs exist
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'content'), { recursive: true });

  // Read and parse English manuscript
  console.log(`📖 Reading English manuscript...`);
  const manuscript = fs.readFileSync(MANUSCRIPT, 'utf-8');
  const chapters = parseChapters(manuscript);
  console.log(`   Found ${chapters.length} chapters\n`);

  // ── PHASE 1: Translation ────────────────────────────────────────────────
  console.log(`🌍 PHASE 1: Translating to ${config.name}...`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  const translatedChapters = [];

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    console.log(`📝 Translating ${ch.title} (${ch.text.length.toLocaleString()} chars)...`);

    // Translate in chunks if chapter is very long (>15K chars)
    let translatedText;
    if (ch.text.length > 15000) {
      // Split into ~2-3 translation chunks for long chapters
      const chunks = chunkText(ch.text, 12000);
      console.log(`   Splitting into ${chunks.length} translation chunks...`);
      const translatedChunks = [];
      for (let j = 0; j < chunks.length; j++) {
        console.log(`   ▸ Translating chunk ${j + 1}/${chunks.length}...`);
        const translated = await translateText(chunks[j], ch.title);
        translatedChunks.push(translated);
        if (j < chunks.length - 1) await sleep(2000);
      }
      translatedText = translatedChunks.join('\n\n');
    } else {
      translatedText = await translateText(ch.text, ch.title);
    }

    translatedChapters.push({ title: ch.title, text: translatedText });
    console.log(`   ✅ Done (${translatedText.length.toLocaleString()} chars translated)\n`);
    await sleep(3000); // Pause between chapters
  }

  // Save translated manuscript
  let mdOutput = `# The Harmonies of Hope — ${config.name} Translation\n\n`;
  mdOutput += `> Translated by Gemini AI | ${new Date().toISOString().split('T')[0]}\n\n`;
  for (const ch of translatedChapters) {
    mdOutput += `## ${ch.title}\n\n${ch.text}\n\n---\n\n`;
  }
  fs.writeFileSync(TRANSLATED_OUTPUT, mdOutput, 'utf-8');
  console.log(`📄 Saved translated manuscript: ${path.relative(ROOT, TRANSLATED_OUTPUT)}\n`);

  // ── PHASE 2: TTS Audio Generation ───────────────────────────────────────
  console.log(`🎙️ PHASE 2: Generating ${config.name} audiobook...`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Generate intro
  const introTitle = lang === 'es' ? 'Las Armonías de la Esperanza'
                   : lang === 'zh' ? '希望的和声'
                   : lang === 'sw' ? 'Nyimbo za Matumaini'
                   : 'The Harmonies of Hope';
  const introAuthor = lang === 'es' ? 'Por C.D. Howell. Publicado por Hood Hymns Publishing.'
                    : lang === 'zh' ? '作者：C.D. Howell。由Hood Hymns Publishing出版。'
                    : lang === 'sw' ? 'Na C.D. Howell. Kuchapishwa na Hood Hymns Publishing.'
                    : 'By C.D. Howell. Published by Hood Hymns Publishing.';

  console.log(`🎙️ Generating Intro...`);
  const introWav = await generateTTS(`${introTitle}. ${introAuthor}`);
  const introWavPath = path.join(AUDIO_DIR, 'intro.wav');
  const introMp3Path = path.join(AUDIO_DIR, 'intro.mp3');
  fs.writeFileSync(introWavPath, introWav);

  if (wavToMp3(introWavPath, introMp3Path)) {
    fs.unlinkSync(introWavPath);
    console.log(`   ✅ Saved: intro.mp3 (${(fs.statSync(introMp3Path).size / 1024).toFixed(0)} KB)\n`);
  } else {
    console.log(`   ✅ Saved: intro.wav (${(fs.statSync(introWavPath).size / 1024).toFixed(0)} KB)\n`);
  }

  // Generate each chapter
  for (let i = 0; i < translatedChapters.length; i++) {
    const ch = translatedChapters[i];
    const chNum = String(i + 1).padStart(2, '0');
    console.log(`🎙️ Generating Chapter ${i + 1}: ${ch.title}`);
    console.log(`   ${ch.text.length.toLocaleString()} characters`);

    const chunks = chunkText(ch.text, TTS_CHUNK_SIZE);
    console.log(`   ${chunks.length} chunks to process`);

    const wavBuffers = [];

    for (let j = 0; j < chunks.length; j++) {
      process.stdout.write(`   ▸ Chunk ${j + 1}/${chunks.length}...`);
      const wavBuffer = await generateTTS(chunks[j]);
      wavBuffers.push(wavBuffer);
      console.log(` ✅ ${(wavBuffer.length / 1024).toFixed(0)} KB`);
      if (j < chunks.length - 1) await sleep(2000);
    }

    // Concatenate WAV chunks (strip headers from chunks after first)
    const combinedPcm = [];
    for (let j = 0; j < wavBuffers.length; j++) {
      if (j === 0) {
        combinedPcm.push(wavBuffers[j]); // Keep full WAV with header
      } else {
        combinedPcm.push(wavBuffers[j].subarray(44)); // Skip 44-byte header
      }
    }
    const combinedWav = Buffer.concat(combinedPcm);

    // Fix the WAV header sizes
    const dataSize = combinedWav.length - 44;
    combinedWav.writeUInt32LE(dataSize + 36, 4);  // RIFF chunk size
    combinedWav.writeUInt32LE(dataSize, 40);       // data chunk size

    const wavPath = path.join(AUDIO_DIR, `chapter-${chNum}.wav`);
    const mp3Path = path.join(AUDIO_DIR, `chapter-${chNum}.mp3`);
    fs.writeFileSync(wavPath, combinedWav);

    if (wavToMp3(wavPath, mp3Path)) {
      fs.unlinkSync(wavPath);
      const size = (fs.statSync(mp3Path).size / (1024 * 1024)).toFixed(1);
      console.log(`   💾 Saved: chapter-${chNum}.mp3 (${size} MB)\n`);
    } else {
      const size = (fs.statSync(wavPath).size / (1024 * 1024)).toFixed(1);
      console.log(`   💾 Saved: chapter-${chNum}.wav (${size} MB)\n`);
    }

    await sleep(3000); // Pause between chapters
  }

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 ${config.name} audiobook generation complete!`);
  console.log(`📂 Audio files: ${path.relative(ROOT, AUDIO_DIR)}/`);
  console.log(`📄 Manuscript: ${path.relative(ROOT, TRANSLATED_OUTPUT)}`);
}

main().catch(err => { console.error('❌ Fatal error:', err.message); process.exit(1); });
