"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/context/I18nContext";
import { authorBio } from "@/data/content";
import { seriesList } from "@/data/store";
import { seriesTranslations } from "@/data/i18n";

const STARTER_PROMPTS = [
  "What inspired you to write The Harmonies of Hope?",
  "What was it like growing up in Detroit?",
  "How did music change your life?",
  "What do you say to someone who feels lost?",
];

type Message = { role: "chris" | "user"; content: string };

const INITIAL_MESSAGE: Message = {
  role: "chris",
  content: "Hey — glad you came through. Pull up a chair. What's on your heart?",
};

export default function AboutPage() {
  const { t, locale } = useI18n();

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll ONLY the chat box — not the whole page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [chatOpen]);

  const speakResponse = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: "Charon",
          style: "You are a warm, soulful African American male voice from Detroit. Deep, steady, wise — like a pastor sharing testimony with a friend.",
        }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
        await audioRef.current.play();
      }
    } catch { setIsSpeaking(false); }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    setInput("");
    const userMsg = { role: "user" as const, content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsThinking(true);
    try {
      const history = updatedMessages.slice(1).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));
      const res = await fetch("/api/author-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: history.slice(0, -1) }),
      });
      const data = await res.json();
      const reply = data.reply || "Give me a second — I'll get back to you on that.";
      setMessages((prev) => [...prev, { role: "chris", content: reply }]);
      setIsThinking(false);
      await speakResponse(reply);
    } catch {
      setMessages((prev) => [...prev, { role: "chris", content: "Something went wrong on my end. Try again in a moment." }]);
      setIsThinking(false);
    }
  }, [messages, isThinking, speakResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-brand-copper)", marginBottom: "12px", fontWeight: 700 }}>
            {t.theAuthor}
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginBottom: "16px" }}>
            {t.aboutTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)" }}>{t.aboutSubtitle}</p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Photo + Bio Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "48px", marginBottom: "48px", alignItems: "start" }}
          className="about-grid"
        >
          {/* Photo — the talking avatar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <div style={{ position: "relative" }}>

              {/* Outer pulse rings when speaking */}
              <div style={{
                position: "absolute", inset: "-8px", borderRadius: "12px",
                border: "2px solid var(--color-brand-copper)",
                opacity: isSpeaking ? 1 : 0,
                animation: isSpeaking ? "photoPulse 1.6s ease-in-out infinite" : "none",
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
                zIndex: 2,
              }} />
              <div style={{
                position: "absolute", inset: "-18px", borderRadius: "14px",
                border: "1px solid var(--color-brand-copper)",
                opacity: isSpeaking ? 0.35 : 0,
                animation: isSpeaking ? "photoPulse 1.6s ease-in-out infinite 0.4s" : "none",
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
                zIndex: 2,
              }} />

              {/* Photo card */}
              <div
                className="brutalist-card"
                style={{
                  overflow: "hidden", aspectRatio: "4/5",
                  background: "var(--color-brand-surface)", position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => {
                  if (isSpeaking) {
                    stopAudio();
                  } else {
                    setChatOpen(true);
                  }
                }}
              >
                <img
                  src={authorBio.photoPlaceholder}
                  alt={authorBio.name}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    objectPosition: "center 12%", transform: "scale(1.08)",
                    transformOrigin: "center top", transition: "transform 0.4s ease",
                    filter: isSpeaking ? "brightness(1.05)" : "brightness(1)",
                  }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />

                {/* Hover/status overlay */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(to top, rgba(10,12,16,0.92) 0%, rgba(10,12,16,0.4) 60%, transparent 100%)",
                  padding: "28px 20px 20px",
                  transition: "opacity 0.3s ease",
                }}>
                  <p style={{
                    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isSpeaking ? "#22c55e" : isThinking ? "#f59e0b" : "var(--color-brand-copper)",
                    marginBottom: "6px",
                    transition: "color 0.3s ease",
                  }}>
                    {isSpeaking ? "⏹ Tap to Stop" : isThinking ? "✍️ Thinking..." : chatOpen ? "💬 Chat Open" : "✦ Click to Talk"}
                  </p>
                  {!chatOpen && (
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                      Ask C.D. Howell anything
                    </p>
                  )}
                </div>

                {/* Live dot */}
                <div style={{
                  position: "absolute", top: "14px", right: "14px",
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: isSpeaking ? "#22c55e" : "#B87333",
                  boxShadow: isSpeaking ? "0 0 0 4px rgba(34,197,94,0.25)" : "0 0 0 4px rgba(184,115,51,0.25)",
                  animation: "liveDot 2s ease-in-out infinite",
                  transition: "background 0.3s ease",
                }} />
              </div>
            </div>

            {/* Chat panel — slides open below the photo */}
            <div style={{
              maxHeight: chatOpen ? "420px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.45s ease",
              borderRadius: "0 0 12px 12px",
            }}>
              <div style={{
                background: "var(--color-brand-surface)",
                border: "1px solid var(--color-brand-border)",
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
              }}>
                {/* Messages */}
                <div ref={messagesContainerRef} style={{ height: "240px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {messages.map((msg, i) => (
                    <div key={i} style={{
                      maxWidth: "90%",
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.role === "user" ? "var(--color-brand-copper)" : "rgba(255,255,255,0.06)",
                      border: msg.role === "user" ? "none" : "1px solid var(--color-brand-border)",
                      color: "var(--color-brand-text)",
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                    }}>
                      {msg.content}
                    </div>
                  ))}
                  {isThinking && (
                    <div style={{
                      alignSelf: "flex-start", padding: "10px 16px",
                      borderRadius: "16px 16px 16px 4px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--color-brand-border)",
                      display: "flex", gap: "5px", alignItems: "center",
                    }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{
                          width: "6px", height: "6px", borderRadius: "50%",
                          background: "var(--color-brand-copper)",
                          animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Starter prompts */}
                {messages.length <= 1 && !isThinking && (
                  <div style={{ padding: "0 12px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {STARTER_PROMPTS.map((p) => (
                      <button key={p} onClick={() => sendMessage(p)} style={{
                        background: "transparent", border: "1px solid var(--color-brand-border)",
                        color: "var(--color-brand-muted)", borderRadius: "20px",
                        padding: "4px 10px", fontSize: "0.68rem", cursor: "pointer",
                        lineHeight: 1.4, transition: "all 0.2s ease",
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-copper)"; e.currentTarget.style.color = "var(--color-brand-copper)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-border)"; e.currentTarget.style.color = "var(--color-brand-muted)"; }}
                      >{p}</button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div style={{ padding: "10px 12px 14px", borderTop: "1px solid var(--color-brand-border)", display: "flex", gap: "8px" }}>
                  <input
                    ref={inputRef}
                    type="text" value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Chris anything..."
                    disabled={isThinking || isSpeaking}
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--color-brand-border)", borderRadius: "8px",
                      padding: "8px 12px", color: "var(--color-brand-text)", fontSize: "0.82rem",
                      outline: "none", opacity: isThinking || isSpeaking ? 0.5 : 1,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-copper)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-border)"; }}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isThinking || isSpeaking}
                    style={{
                      background: !input.trim() || isThinking || isSpeaking ? "rgba(184,115,51,0.3)" : "var(--color-brand-copper)",
                      border: "none", borderRadius: "8px", width: "36px", height: "36px",
                      cursor: !input.trim() || isThinking || isSpeaking ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.95rem", flexShrink: 0,
                    }}
                  >➤</button>
                </div>

                {/* Disclaimer */}
                <p style={{ textAlign: "center", fontSize: "0.6rem", color: "var(--color-brand-muted)", opacity: 0.5, padding: "0 12px 10px" }}>
                  ✦ AI inspired by C.D. Howell&apos;s story. Not a real conversation with the author.
                </p>
              </div>
            </div>
          </div>

          {/* Bio + Stats */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
              {authorBio.name}
            </h2>
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-brand-copper)", marginBottom: "24px", fontWeight: 600 }}>
              {authorBio.title}
            </p>
            {authorBio.bio.map((paragraph, i) => (
              <p key={i} style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--color-brand-text)", marginBottom: "16px" }}>
                {paragraph}
              </p>
            ))}
            <div className="brutalist-card" style={{ padding: "24px", marginTop: "24px", borderLeft: "3px solid var(--color-brand-copper)" }}>
              <blockquote style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontStyle: "italic", lineHeight: 1.6, marginBottom: "8px" }}>
                {authorBio.pullQuote}
              </blockquote>
              <cite style={{ fontSize: "0.8rem", color: "var(--color-brand-muted)", fontStyle: "normal" }}>
                — {authorBio.pullQuoteSource}
              </cite>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "32px" }}>
              {authorBio.stats.map((stat) => (
                <div key={stat.label} className="brutalist-card" style={{ padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-brand-copper)" }}>{stat.value}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--color-brand-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Series overview */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, textAlign: "center", marginBottom: "40px" }}>
            <span className="text-gradient-copper">{t.theSeries}</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {seriesList.filter((s) => s.synopsis).map((series) => {
              const st = seriesTranslations[series.id]?.[locale];
              return (
                <div key={series.id} className="brutalist-card" style={{ padding: "32px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: series.accentColor }}>
                    {st?.name || series.name}
                  </h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--color-brand-text)", marginBottom: "12px" }}>
                    {st?.synopsis || series.synopsis}
                  </p>
                  {series.upcoming && (
                    <p style={{ fontSize: "0.75rem", color: "var(--color-brand-copper)", fontWeight: 600 }}>
                      {st?.upcoming || series.upcoming}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Hidden audio */}
      <audio ref={audioRef} style={{ display: "none" }} />

      <style jsx global>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes photoPulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.03); }
        }
        @keyframes liveDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
