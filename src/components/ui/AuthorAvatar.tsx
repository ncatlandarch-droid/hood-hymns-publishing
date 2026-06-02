"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "chris";
  content: string;
}

const STARTER_PROMPTS = [
  "What inspired you to write The Harmonies of Hope?",
  "What was it like growing up in Detroit?",
  "How did music change your life?",
  "What do you say to someone who feels lost?",
];

export default function AuthorAvatar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "chris",
      content:
        "Hey — glad you came through. I'm C.D. Howell. Pull up a chair. What's on your heart?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const speakResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: "Kore",
          style:
            "You are a warm, soulful African American male voice from Detroit. Deep, steady, wise — like a pastor sharing testimony with a friend. Speak naturally, with Detroit rhythm and grace.",
        }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        await audioRef.current.play();
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    setInput("");
    const userMsg: Message = { role: "user", content: trimmed };
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
      const reply = data.reply || "Man, give me a second — I'll get back to you on that.";

      const chrisMsg: Message = { role: "chris", content: reply };
      setMessages((prev) => [...prev, chrisMsg]);
      setIsThinking(false);

      // Auto-speak the response
      await speakResponse(reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "chris",
          content:
            "Something went wrong on my end. Try again in a moment, for real.",
        },
      ]);
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <section style={{ marginTop: "80px" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-brand-copper)",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          AI Experience
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Talk to the Author
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-brand-muted)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          An AI inspired by C.D. Howell&apos;s story, faith, and writings.
          Ask him anything — about his books, Detroit, music, or life.
        </p>
      </div>

      {/* Avatar Card */}
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          borderRadius: "16px",
          overflow: "hidden",
          background: "var(--color-brand-surface)",
          border: "1px solid var(--color-brand-border)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Avatar Header */}
        <div
          style={{
            padding: "28px 28px 20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            borderBottom: "1px solid var(--color-brand-border)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          {/* Photo with speaking ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {/* Outer pulse ring when speaking */}
            <div
              style={{
                position: "absolute",
                inset: "-6px",
                borderRadius: "50%",
                border: "2px solid var(--color-brand-copper)",
                opacity: isSpeaking ? 1 : 0,
                transform: isSpeaking ? "scale(1.08)" : "scale(1)",
                transition: "all 0.3s ease",
                animation: isSpeaking ? "avatarPulse 1.4s ease-in-out infinite" : "none",
              }}
            />
            {/* Second pulse ring */}
            <div
              style={{
                position: "absolute",
                inset: "-12px",
                borderRadius: "50%",
                border: "1px solid var(--color-brand-copper)",
                opacity: isSpeaking ? 0.4 : 0,
                animation: isSpeaking ? "avatarPulse 1.4s ease-in-out infinite 0.3s" : "none",
                transition: "opacity 0.3s ease",
              }}
            />
            <img
              src="/author-photo.jpg"
              alt="C.D. Howell"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center 15%",
                border: "3px solid var(--color-brand-copper)",
                display: "block",
              }}
            />
            {/* Live indicator dot */}
            <div
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: isSpeaking ? "#22c55e" : isThinking ? "#f59e0b" : "#22c55e",
                border: "2px solid var(--color-brand-surface)",
                transition: "background 0.3s ease",
              }}
            />
          </div>

          {/* Name + status */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              C.D. Howell
            </h3>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-brand-copper)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {isSpeaking
                ? "🎙️ Speaking..."
                : isThinking
                ? "✍️ Thinking..."
                : "✦ Author & Storyteller"}
            </p>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              background: isOpen ? "rgba(184,115,51,0.15)" : "var(--color-brand-copper)",
              border: `1px solid var(--color-brand-copper)`,
              color: isOpen ? "var(--color-brand-copper)" : "#fff",
              borderRadius: "8px",
              padding: "8px 18px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.05em",
            }}
          >
            {isOpen ? "Close" : "Start Talking"}
          </button>
        </div>

        {/* Chat Area — collapsible */}
        <div
          style={{
            maxHeight: isOpen ? "520px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}
        >
          {/* Messages */}
          <div
            style={{
              height: "340px",
              overflowY: "auto",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: "10px",
                }}
              >
                {/* Avatar icon for Chris */}
                {msg.role === "chris" && (
                  <img
                    src="/author-photo.jpg"
                    alt="Chris"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "center 15%",
                      flexShrink: 0,
                      border: "2px solid var(--color-brand-copper)",
                    }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "72%",
                    padding: "12px 16px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      msg.role === "user"
                        ? "var(--color-brand-copper)"
                        : "rgba(255,255,255,0.06)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid var(--color-brand-border)",
                    color: msg.role === "user" ? "#fff" : "var(--color-brand-text)",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                <img
                  src="/author-photo.jpg"
                  alt="Chris"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "center 15%",
                    flexShrink: 0,
                    border: "2px solid var(--color-brand-copper)",
                  }}
                />
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--color-brand-border)",
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "var(--color-brand-copper)",
                        animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter prompts */}
          {messages.length <= 1 && !isThinking && (
            <div
              style={{
                padding: "0 24px 16px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--color-brand-border)",
                    color: "var(--color-brand-muted)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-brand-copper)";
                    e.currentTarget.style.color = "var(--color-brand-copper)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-brand-border)";
                    e.currentTarget.style.color = "var(--color-brand-muted)";
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div
            style={{
              padding: "16px 24px 20px",
              borderTop: "1px solid var(--color-brand-border)",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Chris anything..."
              disabled={isThinking || isSpeaking}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-brand-border)",
                borderRadius: "10px",
                padding: "10px 16px",
                color: "var(--color-brand-text)",
                fontSize: "0.88rem",
                outline: "none",
                transition: "border-color 0.2s ease",
                opacity: isThinking || isSpeaking ? 0.5 : 1,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-brand-copper)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-brand-border)";
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isThinking || isSpeaking}
              style={{
                background:
                  !input.trim() || isThinking || isSpeaking
                    ? "rgba(184,115,51,0.3)"
                    : "var(--color-brand-copper)",
                border: "none",
                borderRadius: "10px",
                width: "42px",
                height: "42px",
                cursor:
                  !input.trim() || isThinking || isSpeaking
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            padding: "10px 24px 14px",
            borderTop: "1px solid var(--color-brand-border)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              color: "var(--color-brand-muted)",
              opacity: 0.6,
              letterSpacing: "0.05em",
            }}
          >
            ✦ AI inspired by C.D. Howell&apos;s story and writings. Not a real conversation with the author.
          </p>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Keyframe animations */}
      <style>{`
        @keyframes avatarPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.12); opacity: 0.3; }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
