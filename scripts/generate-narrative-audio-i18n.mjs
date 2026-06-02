#!/usr/bin/env node
/**
 * Hood Hymns Publishing — Multilingual Narrative Audio Generator
 * Translates and generates TTS audio for the cinematic narrative players
 * in Spanish (es) and Mandarin Chinese (zh).
 *
 * Output:
 *   public/audio/harmonies-narrative-es.wav
 *   public/audio/harmonies-narrative-zh.wav
 *   public/audio/prodigal-narrative-es.wav
 *   public/audio/prodigal-narrative-zh.wav
 *
 * Usage: node scripts/generate-narrative-audio-i18n.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'audio');

const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const TEXT_MODEL = 'gemini-1.5-flash';
const TTS_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent`;
const TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent`;
const SAMPLE_RATE = 24000;

// ── Load API Key ──────────────────────────────────────────────────────────────
function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = path.join(PROJECT_ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
    if (match) return match[1].trim().replace(/^[\"']|[\"']$/g, '');
  }
  return null;
}

const API_KEY = loadApiKey();
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY');
  process.exit(1);
}

// ── Source Narratives (English) ───────────────────────────────────────────────
const narratives = [
  {
    id: 'harmonies-narrative',
    title: 'The Harmonies of Hope',
    text: `The Harmonies of Hope begins in a two-family flat in the heart of Detroit.

Five siblings. One household. Aunties, uncles, and cousins filling every room with laughter, love, and life. Chris was one of those kids — the ones who played Monopoly until someone fell asleep, who wrestled in the bedrooms while the adults talked in the living room, who learned respect and manners before they learned to ride a bike.

But it was music that changed everything.

When elementary school introduced concert band, Chris picked up the trombone. His brother chose the drums. Together they practiced, performed, and dreamed — inseparable, just like always. People called them twins. If you had a problem with one, you had two to deal with.

Then the family moved. New neighborhood. New school. New church. And at that church, surrounded by warm smiles and uplifting music, Chris found something he didn't know he was looking for — purpose.

He joined the junior choir. Then he was asked to direct it. Standing at the front with his arms raised, his brother on drums behind him, Chris discovered that music wasn't just something he enjoyed. It was part of God's plan.

The Harmonies of Hope. By C.D. Howell. Published by Hood Hymns Publishing.`,
  },
  {
    id: 'prodigal-narrative',
    title: 'The Prodigal Block',
    text: `Not everyone heard the choir the first time.

Marcus grew up in the same Detroit blocks. Heard the same sermons. Knew the same God. But when the streets called, he answered.

At seventeen, the world felt like a closing door. School felt pointless. Church felt distant. The only people who seemed to have answers were the ones standing on corners with money in their pockets and silence in their eyes.

Marcus chose the fast lane. And for a while, it felt like freedom.

But freedom built on sand doesn't last. And when the ground finally gave way beneath him — when the phone calls stopped, the money dried up, and the only sound left was the echo of his grandmother's prayers — Marcus found himself standing in front of a church door he hadn't opened in years.

The Prodigal Block is a story about the long road back. About the ones who wandered. The ones who fell. And the ones who discovered that God's GPS doesn't stop recalculating, no matter how far you drive in the wrong direction.

The Prodigal Block. By C.D. Howell. Published by Hood Hymns Publishing.`,
  },
];

// ── Language Configs ──────────────────────────────────────────────────────────
const LANGUAGES = [
  {
    code: 'es',
    name: 'Spanish',
    voice: 'Kore',
    ttsLang: 'es-ES',
    translatePrompt: (title, text) =>
      `Translate the following literary narrative from English to Spanish (Latin American Spanish, warm and literary tone). Preserve the emotional impact, poetic rhythm, and spiritual depth. Return ONLY the translated text with no explanations or notes.\n\nTitle: ${title}\n\nText:\n${text}`,
    stylePrompt: `Eres un narrador masculino de voz cálida y profunda. Habla con un tono literario, espiritual y emotivo. Ritmo pausado y deliberado, como compartiendo un testimonio de fe con tu comunidad.`,
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    voice: 'Kore',
    ttsLang: 'zh-CN',
    translatePrompt: (title, text) =>
      `Translate the following literary narrative from English to Simplified Mandarin Chinese. This is urban faith fiction set in Detroit — translate with literary grace, preserving the spiritual depth, emotional warmth, and rhythmic storytelling quality. Use natural, flowing Mandarin prose. Return ONLY the translated text with no explanations, pinyin, or notes.\n\nTitle: ${title}\n\nText:\n${text}`,
    stylePrompt: `你是一位声音深沉温暖的男性叙述者。用文学性、精神性和情感丰富的语调朗读。节奏舒缓而有意，如同与社区分享信仰见证。`,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWavFile(pcmBuffer) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const wavHeader = Buffer.alloc(44);
  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(44 + dataSize - 8, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(SAMPLE_RATE, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(dataSize, 40);
  return Buffer.concat([wavHeader, pcmBuffer]);
}

// ── Translate Text via Gemini ─────────────────────────────────────────────────
async function translateText(prompt) {
  const response = await fetch(`${TEXT_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Translation API error ${response.status}: ${err}`);
  }
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

// ── Generate TTS Audio ────────────────────────────────────────────────────────
async function generateTTS(text, voice, stylePrompt) {
  const prompt = `${stylePrompt}\n\n${text}`;
  const response = await fetch(`${TTS_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`TTS API error ${response.status}: ${err}`);
  }
  const data = await response.json();
  const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) throw new Error('No audio data in TTS response');
  return Buffer.from(audioData, 'base64');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('==============================================');
  console.log('  Hood Hymns - Multilingual Narrative Audio  ');
  console.log('  Generating ES + ZH narrations              ');
  console.log('==============================================');
  console.log('');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const lang of LANGUAGES) {
    console.log(`\n[${lang.code.toUpperCase()}] Processing ${lang.name}...`);

    for (const narrative of narratives) {
      const outputFile = `${narrative.id}-${lang.code}.wav`;
      const outputPath = path.join(OUTPUT_DIR, outputFile);

      // Skip if already exists
      if (fs.existsSync(outputPath)) {
        console.log(`  [SKIP] ${outputFile} already exists`);
        continue;
      }

      try {
        // Step 1: Translate
        console.log(`  [1/2] Translating "${narrative.title}" to ${lang.name}...`);
        const translatedText = await translateText(
          lang.translatePrompt(narrative.title, narrative.text)
        );
        console.log(`        Translated (${translatedText.length} chars)`);
        await sleep(1000);

        // Step 2: Generate TTS
        console.log(`  [2/2] Generating TTS audio with voice ${lang.voice}...`);
        const pcmBuffer = await generateTTS(translatedText, lang.voice, lang.stylePrompt);
        const wavData = createWavFile(pcmBuffer);
        fs.writeFileSync(outputPath, wavData);

        const sizeKB = (wavData.length / 1024).toFixed(0);
        console.log(`  [OK] Saved: ${outputFile} (${sizeKB} KB)`);
        await sleep(2000);

      } catch (err) {
        console.error(`  [FAIL] ${outputFile}: ${err.message}`);
      }
    }
  }

  console.log('');
  console.log('==============================================');
  console.log('  Done! Check public/audio/ for new files:  ');
  console.log('  harmonies-narrative-es.wav                ');
  console.log('  harmonies-narrative-zh.wav                ');
  console.log('  prodigal-narrative-es.wav                 ');
  console.log('  prodigal-narrative-zh.wav                 ');
  console.log('==============================================');
  console.log('');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
