"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/context/I18nContext";

interface TestimonialData {
  date: string;
  audioBase64: string | null;
  audioMimeType: string | null;
  text: {
    en: string;
    es: string;
    zh: string;
  };
  createdAt: string;
}

export default function TestimonialCard() {
  const { locale } = useI18n();
  const [data, setData] = useState<TestimonialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/testimonial")
      .then((res) => {
        if (!res.ok) throw new Error("No testimonial");
        return res.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [data]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function formatDate(dateStr: string) {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString(locale === "zh" ? "zh-CN" : locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  if (loading) {
    return (
      <div style={styles.skeleton}>
        <div style={styles.skeletonPulse} />
      </div>
    );
  }

  if (!data) return null;

  const displayText = data.text[locale] || data.text.en;
  const audioSrc = data.audioBase64
    ? `data:${data.audioMimeType || "audio/webm"};base64,${data.audioBase64}`
    : null;

  return (
    <div style={styles.card}>
      {/* Decorative glow */}
      <div style={styles.glowOrb} />

      {/* Top accent line */}
      <div style={styles.accentLine} />

      {/* Author section with play button */}
      <div style={styles.authorRow}>
        {/* Play button with speaking ring */}
        {audioSrc && (
          <button
            onClick={togglePlay}
            style={{
              ...styles.playBtn,
              ...(isPlaying ? styles.playBtnActive : {}),
            }}
            aria-label={isPlaying ? "Pause testimonial" : "Play testimonial"}
          >
            <span style={styles.playIcon}>{isPlaying ? "❚❚" : "▶"}</span>
            {/* Speaking ring */}
            {isPlaying && (
              <>
                <span style={{ ...styles.speakingRing, ...styles.ring1 }} />
                <span style={{ ...styles.speakingRing, ...styles.ring2 }} />
                <span style={{ ...styles.speakingRing, ...styles.ring3 }} />
              </>
            )}
          </button>
        )}

        <div>
          <p style={styles.authorName}>C.D. Howell</p>
          <p style={styles.authorTitle}>Author &amp; Publisher</p>
        </div>
      </div>

      {/* Hidden audio element */}
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
      )}

      {/* Quote icon */}
      <div style={styles.quoteIcon}>&ldquo;</div>

      {/* Testimonial text */}
      <blockquote style={styles.quote}>
        {displayText}
      </blockquote>

      {/* Date */}
      <div style={styles.dateRow}>
        <div style={styles.dateDivider} />
        <p style={styles.dateText}>{formatDate(data.date)}</p>
        <div style={styles.dateDivider} />
      </div>

      {/* Inline keyframes via style tag */}
      <style>{`
        @keyframes speakingPulse1 {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes speakingPulse2 {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes speakingPulse3 {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes testimonialGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes pulseRecord {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  skeleton: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "48px",
    background: "rgba(20, 14, 36, 0.4)",
    borderRadius: "16px",
    border: "1px solid rgba(38, 24, 64, 0.5)",
  },
  skeletonPulse: {
    height: "120px",
    borderRadius: "8px",
    background: "linear-gradient(90deg, rgba(38,24,64,0.3) 25%, rgba(45,27,105,0.2) 50%, rgba(38,24,64,0.3) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  card: {
    position: "relative" as const,
    maxWidth: "640px",
    margin: "0 auto",
    padding: "40px 36px 32px",
    background: "linear-gradient(145deg, rgba(20, 14, 36, 0.7), rgba(14, 10, 26, 0.8))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "16px",
    border: "1px solid rgba(184, 115, 51, 0.2)",
    overflow: "hidden",
  },
  glowOrb: {
    position: "absolute" as const,
    top: "-60px",
    right: "-60px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(184,115,51,0.15) 0%, transparent 70%)",
    pointerEvents: "none" as const,
    animation: "testimonialGlow 4s ease-in-out infinite",
  },
  accentLine: {
    position: "absolute" as const,
    top: 0,
    left: "36px",
    right: "36px",
    height: "2px",
    background: "linear-gradient(to right, transparent, #B87333, transparent)",
  },
  authorRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  playBtn: {
    position: "relative" as const,
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2D1B69, #1A1040)",
    border: "2px solid #B87333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flexShrink: 0,
  },
  playBtnActive: {
    boxShadow: "0 0 20px rgba(184, 115, 51, 0.4)",
    borderColor: "#D4944A",
  },
  playIcon: {
    fontSize: "0.9rem",
    color: "#B87333",
    marginLeft: "2px",
    position: "relative" as const,
    zIndex: 2,
  },
  speakingRing: {
    position: "absolute" as const,
    top: "-4px",
    left: "-4px",
    right: "-4px",
    bottom: "-4px",
    borderRadius: "50%",
    border: "2px solid #B87333",
    pointerEvents: "none" as const,
  },
  ring1: {
    animation: "speakingPulse1 1.2s ease-out infinite",
  },
  ring2: {
    animation: "speakingPulse2 1.2s ease-out infinite 0.2s",
  },
  ring3: {
    animation: "speakingPulse3 1.2s ease-out infinite 0.4s",
  },
  authorName: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#F0EDE8",
    marginBottom: "2px",
    background: "linear-gradient(135deg, #D4944A, #B87333)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  authorTitle: {
    fontSize: "0.75rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#9088A8",
  },
  quoteIcon: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "3.5rem",
    lineHeight: 1,
    color: "rgba(184, 115, 51, 0.25)",
    marginBottom: "-8px",
  },
  quote: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.05rem",
    fontStyle: "italic" as const,
    lineHeight: 1.75,
    color: "#F0EDE8",
    marginBottom: "24px",
    whiteSpace: "pre-line" as const,
  },
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  dateDivider: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(to right, transparent, rgba(184,115,51,0.3), transparent)",
  },
  dateText: {
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    color: "#9088A8",
    whiteSpace: "nowrap" as const,
  },
};
