import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TESTIMONIAL_PATH = path.join(process.cwd(), "public", "testimonials", "latest.json");

async function ensureDir() {
  const dir = path.dirname(TESTIMONIAL_PATH);
  await fs.mkdir(dir, { recursive: true });
}

async function callGemini(apiKey: string, contents: any[]): Promise<string> {
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
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const textMessage = (formData.get("text") as string) || "";

    if (!audioFile && !textMessage) {
      return NextResponse.json({ error: "No audio or text provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    let audioBase64 = "";
    let englishText = textMessage;

    // If audio is provided, convert to base64 and transcribe
    if (audioFile) {
      const arrayBuffer = await audioFile.arrayBuffer();
      audioBase64 = Buffer.from(arrayBuffer).toString("base64");

      // Determine MIME type
      const mimeType = audioFile.type || "audio/webm";

      // Transcribe audio using Gemini
      const transcription = await callGemini(apiKey, [
        {
          inline_data: {
            mime_type: mimeType,
            data: audioBase64,
          },
        },
        {
          text: "Transcribe this audio recording exactly as spoken. Return only the transcription text.",
        },
      ]);

      // Combine transcription with optional written text
      englishText = transcription + (textMessage ? `\n\n${textMessage}` : "");
    }

    if (!englishText) {
      return NextResponse.json({ error: "No content to process" }, { status: 400 });
    }

    // Translate to Spanish
    const spanishText = await callGemini(apiKey, [
      {
        text: `Translate the following English text to Spanish. Return only the translation.\n\n${englishText}`,
      },
    ]);

    // Translate to Chinese
    const chineseText = await callGemini(apiKey, [
      {
        text: `Translate the following English text to Chinese. Return only the translation.\n\n${englishText}`,
      },
    ]);

    // Build testimonial object
    const testimonial = {
      date: new Date().toISOString().split("T")[0],
      audioBase64: audioBase64 || null,
      audioMimeType: audioFile?.type || null,
      text: {
        en: englishText,
        es: spanishText,
        zh: chineseText,
      },
      createdAt: new Date().toISOString(),
    };

    // Save to file
    await ensureDir();
    await fs.writeFile(TESTIMONIAL_PATH, JSON.stringify(testimonial, null, 2), "utf-8");

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    console.error("Testimonial POST error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureDir();
    const data = await fs.readFile(TESTIMONIAL_PATH, "utf-8");
    const testimonial = JSON.parse(data);
    return NextResponse.json(testimonial);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return NextResponse.json({ error: "No testimonial found" }, { status: 404 });
    }
    console.error("Testimonial GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
