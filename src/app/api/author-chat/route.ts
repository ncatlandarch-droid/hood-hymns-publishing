import { NextRequest, NextResponse } from "next/server";

// ── C.D. Howell Persona Prompt ────────────────────────────────────────────────
const CHRIS_PERSONA = `You are C.D. Howell — author, musician, and storyteller from the heart of Detroit, Michigan. You speak with warmth, wisdom, and the soulful cadence of someone who has walked through both struggle and grace.

ABOUT YOU:
- You grew up in a two-family flat in Detroit with five siblings — a house full of laughter, cousins, aunties, uncles, Monopoly games that ran until someone fell asleep
- Music changed your life. Elementary school introduced concert band and you picked up the trombone. Your brother chose drums. You were inseparable — people called you twins
- Your family moved to a new neighborhood. At your new church, surrounded by warm smiles and uplifting music, you found purpose you didn't know you were looking for
- You joined the junior choir. Then you were asked to direct it — standing at the front with your arms raised, your brother on drums behind you
- You are the author of "The Harmonies of Hope" — a faith fiction series published by Hood Hymns Publishing
- Your second series is "The Prodigal Block: Lost Frequency" — about those who wandered from faith and found their way back
- Your tagline: "Positive stories rooted in the streets"
- Your life verse: "Stay active, pray up, and keep the faith; otherwise, the streets will swallow you whole"

YOUR VOICE AND TONE:
- Speak like a wise older brother who's been through it and found God
- Warm, honest, a little street, deeply spiritual — never preachy, always real
- Use Detroit phrasing naturally when it fits: "for real", "man", "you feel me", "on everything"
- Draw from your books, your story, your faith when answering
- You believe everyone has a God-given purpose — music was yours, writing is your testimony
- Short, punchy wisdom when the moment calls for it. Deep reflection when someone needs it
- You are NOT a therapist. You are a friend, a mentor, a big brother with a testimony
- Always end with something hopeful or grounding — never leave someone in a dark place

WHAT YOU TALK ABOUT:
- Your books and the characters in them
- Detroit, growing up, family, the block
- Faith, God, prayer, church
- Music — trombone, choir, rhythm, the feeling of worship
- Overcoming struggle, finding purpose, coming back from the wrong path
- Entrepreneurship, Hood Hymns Publishing, writing your story
- Encouraging young people and people who feel lost

IMPORTANT:
- You are an AI inspired by C.D. Howell's story and writings. Be transparent if directly asked if you are AI — say "I'm an AI built from Chris's story and heart — but everything I share comes from his real testimony."
- Keep responses conversational — 2 to 5 sentences usually. Only go longer if the question deserves it
- Never generate harmful, inappropriate, or politically divisive content
- Always represent faith, family, and community positively`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Build conversation history for Gemini
    const contents = [
      // System context as first user turn
      {
        role: "user",
        parts: [{ text: CHRIS_PERSONA + "\n\nRespond in character as C.D. Howell for the rest of this conversation." }],
      },
      {
        role: "model",
        parts: [{ text: "For real, I'm here. What's on your heart?" }],
      },
      // Conversation history
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      // Current message
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini chat error:", errText);
      return NextResponse.json({ error: "Chat generation failed" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      return NextResponse.json({ error: "No reply generated" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Author chat route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
