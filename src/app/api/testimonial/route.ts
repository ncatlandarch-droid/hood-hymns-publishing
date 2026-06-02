import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

// ─────────────────────────────────────────────────────────────────────────────
// Testimonial API — Hood Hymns Publishing
//
// Uses Netlify Blobs for persistent storage (survives serverless restarts).
// POST: Accept audio/text → transcribe → translate → store
// GET:  Return latest testimonial JSON
// ─────────────────────────────────────────────────────────────────────────────

async function callGemini(apiKey: string, contents: object[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: contents }] }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} — ${errText}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const formData    = await req.formData();
    const audioFile   = formData.get("audio") as File | null;
    const textMessage = (formData.get("text") as string) || "";

    if (!audioFile && !textMessage) {
      return NextResponse.json({ error: "No audio or text provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    let audioBase64  = "";
    let englishText  = textMessage;

    // ── Transcribe audio if provided ─────────────────────────────────────────
    if (audioFile) {
      const arrayBuffer = await audioFile.arrayBuffer();
      audioBase64       = Buffer.from(arrayBuffer).toString("base64");
      const mimeType    = audioFile.type || "audio/webm";

      const transcription = await callGemini(apiKey, [
        { inline_data: { mime_type: mimeType, data: audioBase64 } },
        { text: "Transcribe this audio recording exactly as spoken. Return only the transcription text." },
      ]);
      englishText = transcription + (textMessage ? `\n\n${textMessage}` : "");
    }

    if (!englishText) {
      return NextResponse.json({ error: "No content to process" }, { status: 400 });
    }

    // ── Translate to Spanish + Chinese via Gemini ─────────────────────────────
    const [spanishText, chineseText] = await Promise.all([
      callGemini(apiKey, [{ text: `Translate the following English text to Spanish. Return only the translation.\n\n${englishText}` }]),
      callGemini(apiKey, [{ text: `Translate the following English text to Chinese (Simplified). Return only the translation.\n\n${englishText}` }]),
    ]);

    // ── Build testimonial object ──────────────────────────────────────────────
    const testimonial = {
      date:          new Date().toISOString().split("T")[0],
      audioBase64:   audioBase64 || null,
      audioMimeType: audioFile?.type || null,
      text: { en: englishText, es: spanishText, zh: chineseText },
      createdAt:     new Date().toISOString(),
    };

    // ── Persist to Netlify Blobs (survives serverless restarts) ──────────────
    const store = getStore("testimonials");
    await store.setJSON("latest", testimonial);

    return NextResponse.json({ success: true, testimonial });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Testimonial POST error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const store       = getStore("testimonials");
    const testimonial = await store.get("latest", { type: "json" });

    if (!testimonial) {
      return NextResponse.json({ error: "No testimonial found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Testimonial GET error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
