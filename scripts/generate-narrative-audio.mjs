#!/usr/bin/env node
/**
 * Hood Hymns Publishing — Pre-Record Narrative Audio
 * Generates WAV files using Gemini TTS (Zephyr voice — deep male, authoritative)
 * 
 * Usage: node scripts/generate-narrative-audio.mjs
 * Requires: GEMINI_API_KEY environment variable
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const VOICE_NAME = 'Zephyr';
const SAMPLE_RATE = 24000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY environment variable');
  process.exit(1);
}

// ── Narrative texts ──────────────────────────────────────────────────────────

const NARRATIVES = [
  {
    id: 'harmonies-narrative',
    filename: 'harmonies-narrative.wav',
    style: 'You are a deep-voiced African American male narrator from Detroit, Michigan. Speak with the distinctive Detroit accent: use the Inland North nasal a sound, blend syllables naturally at a swift pace, and employ the wide-ranging melodic intonation of AAVE. Your cadence should be warm, rhythmic, and soulful — like a loving father telling his son a bedtime story rooted in faith and Detroit. Deliberate pauses for emphasis. Let the words breathe. This is a story of family, music, and purpose — tell it like you lived it.',
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
    filename: 'prodigal-narrative.wav',
    style: 'You are a deep-voiced African American male narrator from Detroit, Michigan. Speak with the distinctive Detroit accent: use the Inland North nasal a sound, blend syllables at a swift pace, and employ the wide-ranging melodic intonation of AAVE. Your cadence should be gravelly, intense, and deliberate — like a street preacher who has seen both sides. Dramatic pauses. Weight on every word. This is a redemption story from the block — tell it like a testimony.',
    text: `Not everyone heard the choir the first time.

Marcus grew up in the same Detroit blocks. Heard the same sermons. Knew the same God. But when the streets called, he answered.

At seventeen, the world felt like a closing door. School felt pointless. Church felt distant. The only people who seemed to have answers were the ones standing on corners with money in their pockets and silence in their eyes.

Marcus chose the fast lane. And for a while, it felt like freedom.

But freedom built on sand doesn't last. And when the ground finally gave way beneath him — when the phone calls stopped, the money dried up, and the only sound left was the echo of his grandmother's prayers — Marcus found himself standing in front of a church door he hadn't opened in years.

The Prodigal Block is a story about the long road back. About the ones who wandered. The ones who fell. And the ones who discovered that God's GPS doesn't stop recalculating, no matter how far you drive in the wrong direction.

The Prodigal Block. By C.D. Howell. Published by Hood Hymns Publishing.`,
  },
];

// ── TTS Generation ───────────────────────────────────────────────────────────

async function generateTTS(text, style) {
  const prompt = style ? `${style}\n\n${text}` : text;
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${API_KEY}`;
  
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

  console.log(`  📡 Calling Gemini TTS API...`);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`TTS API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  
  if (!audioData) {
    throw new Error('No audio data in TTS response');
  }

  return Buffer.from(audioData, 'base64');
}

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

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const audioDir = path.join(PROJECT_ROOT, 'public', 'audio');
  fs.mkdirSync(audioDir, { recursive: true });

  console.log('🎙️  Hood Hymns Publishing — Narrative Audio Generator');
  console.log(`   Voice: ${VOICE_NAME} (Deep Male)`);
  console.log(`   Output: ${audioDir}\n`);

  for (const narrative of NARRATIVES) {
    console.log(`📖 Generating: ${narrative.id}`);
    console.log(`   Text length: ${narrative.text.length} chars`);

    try {
      const pcmData = await generateTTS(narrative.text, narrative.style);
      const wavData = createWavFile(pcmData);

      const outPath = path.join(audioDir, narrative.filename);
      fs.writeFileSync(outPath, wavData);

      const sizeKB = (wavData.length / 1024).toFixed(1);
      const durationSec = (pcmData.length / (SAMPLE_RATE * 2)).toFixed(1);
      console.log(`   ✅ Saved: ${narrative.filename} (${sizeKB} KB, ~${durationSec}s)\n`);
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}\n`);
    }

    // Small delay between API calls
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('🎉 Done! Audio files saved to public/audio/');
}

main().catch(console.error);
