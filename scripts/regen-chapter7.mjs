#!/usr/bin/env node
/**
 * Regenerate only Chapter 7 of the audiobook (retry after network failure)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, "..");
const MANUSCRIPT = path.join(ROOT, "content", "harmonies-of-hope-expanded.md");
const OUTPUT_DIR = path.join(ROOT, "public", "audiobook");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("❌ Missing GEMINI_API_KEY"); process.exit(1); }

const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const TTS_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${API_KEY}`;

function splitText(text, maxLen = 4500) {
  const chunks = []; let cur = "";
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if ((cur + sentence).length > maxLen && cur) { chunks.push(cur.trim()); cur = ""; }
    cur += sentence + " ";
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

async function genChunk(text) {
  const payload = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
    },
  };
  const resp = await fetch(TTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const b64 = data.candidates[0].content.parts[0].inlineData.data;
  return Buffer.from(b64, "base64");
}

async function main() {
  const md = fs.readFileSync(MANUSCRIPT, "utf-8");
  // Extract Chapter Seven text
  const match = md.match(/## Chapter Seven[^\0]*?(?=\n## Chapter Eight)/);
  if (!match) { console.error("Could not find Chapter Seven in manuscript"); process.exit(1); }

  const raw = match[0]
    .replace(/^##[^\n]+\n/, "")
    .replace(/---+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .trim();

  const chunks = splitText(raw);
  console.log(`\n📖 Chapter Seven — The Choir`);
  console.log(`   ${chunks.length} chunks, ${raw.length} chars\n`);

  const bufs = [];
  for (let i = 0; i < chunks.length; i++) {
    let attempts = 0;
    while (attempts < 4) {
      try {
        process.stdout.write(`   chunk ${i + 1}/${chunks.length}...`);
        bufs.push(await genChunk(chunks[i]));
        console.log(" ✅");
        break;
      } catch (e) {
        attempts++;
        console.log(` ⚠️ retry ${attempts}`);
        if (attempts >= 4) throw e;
        await new Promise(r => setTimeout(r, 10000 * attempts));
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  // Write WAV with header
  const pcmTotal = bufs.reduce((s, b) => s + b.length, 0);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(pcmTotal + 36, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(24000, 24);
  header.writeUInt32LE(48000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(pcmTotal, 40);

  const outPath = path.join(OUTPUT_DIR, "chapter-07.wav");
  fs.writeFileSync(outPath, Buffer.concat([header, ...bufs]));

  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  const durationMin = Math.round((pcmTotal / 2 / 24000) / 60);
  console.log(`\n✅ chapter-07.wav saved — ${sizeMB} MB (~${durationMin} min)`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
