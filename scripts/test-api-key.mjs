import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
const content = fs.readFileSync(envPath, 'utf-8');
const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
const key = match ? match[1].trim().replace(/^["']|["']$/g, '') : '';

console.log('Key loaded:', key.substring(0, 20) + '...');
console.log('Key length:', key.length);

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'Say hello in Spanish. 3 words only.' }] }] })
  }
);
const data = await res.json();
const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
console.log('API response:', text || JSON.stringify(data).substring(0, 400));
