"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/context/I18nContext";
import Link from "next/link";

interface Chapter {
  id: string;
  number: number;
  title: string;
  src: string;
  duration?: number;
}

const CHAPTERS: Chapter[] = [
  { id: "intro", number: 0, title: "Introduction", src: "/audiobook/intro.wav" },
  { id: "chapter-01", number: 1, title: "Chapter 1 — The Block", src: "/audiobook/chapter-01.wav" },
  { id: "chapter-02", number: 2, title: "Chapter 2 — Sunday Morning", src: "/audiobook/chapter-02.wav" },
  { id: "chapter-03", number: 3, title: "Chapter 3 — The Hustle", src: "/audiobook/chapter-03.wav" },
  { id: "chapter-04", number: 4, title: "Chapter 4 — Crossroads", src: "/audiobook/chapter-04.wav" },
  { id: "chapter-05", number: 5, title: "Chapter 5 — Family Ties", src: "/audiobook/chapter-05.wav" },
  { id: "chapter-06", number: 6, title: "Chapter 6 — The Hymn", src: "/audiobook/chapter-06.wav" },
  { id: "chapter-07", number: 7, title: "Chapter 7 — Redemption Road", src: "/audiobook/chapter-07.wav" },
  { id: "chapter-08", number: 8, title: "Chapter 8 — Coming Home", src: "/audiobook/chapter-08.wav" },
  { id: "chapter-09", number: 9, title: "Chapter 9 — Harmonies of Hope", src: "/audiobook/chapter-09.wav" },
];

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudiobookPage() {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentChapter = CHAPTERS[currentIndex];

  const loadChapter = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    setIsLoading(true);
    setCurrentIndex(index);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    audio.src = CHAPTERS[index].src;
    audio.load();
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setError("Audio file not yet available."));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const pct = Number(e.target.value);
    const time = (pct / 100) * duration;
    audio.currentTime = time;
    setProgress(pct);
    setCurrentTime(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const goToPrev = () => {
    if (currentIndex > 0) loadChapter(currentIndex - 1);
  };

  const goToNext = () => {
    if (currentIndex < CHAPTERS.length - 1) loadChapter(currentIndex + 1);
  };

  // Audio event wiring
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onCanPlay = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setError("Audio file not yet generated. Run the audiobook script to generate chapters.");
    };
    const onEnded = () => {
      setIsPlaying(false);
      if (autoAdvance && currentIndex < CHAPTERS.length - 1) {
        setTimeout(() => {
          const next = currentIndex + 1;
          setCurrentIndex(next);
          const a = audioRef.current;
          if (a) {
            a.src = CHAPTERS[next].src;
            a.load();
            a.play().catch(() => {});
          }
        }, 1500);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);
    audio.volume = volume;

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, autoAdvance, volume]);

  return (
    <div style={{ background: "var(--color-brand-black)", minHeight: "100vh", paddingTop: "80px" }}>
      <audio ref={audioRef} src={currentChapter.src} preload="metadata" />

      {/* Header */}
      <div style={{ background: "var(--color-brand-surface)", borderBottom: "1px solid var(--color-brand-border)", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(184,115,51,0.15)", border: "1px solid rgba(184,115,51,0.3)", borderRadius: 20, padding: "4px 16px", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-brand-copper)", marginBottom: 16 }}>
            🎧 Audiobook
          </div>
          <h1 className="fade-in-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--color-brand-text)", marginBottom: 12, lineHeight: 1.2 }}>
            The Harmonies of Hope
          </h1>
          <p style={{ color: "var(--color-brand-muted)", fontSize: "1.1rem" }}>
            By C.D. Howell · Narrated by the Author
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>

        {/* Now Playing Player Card */}
        <div style={{ background: "var(--color-brand-surface)", border: "1px solid var(--color-brand-border)", borderRadius: 16, overflow: "hidden" }}>

          {/* Now Playing Header */}
          <div style={{ background: "linear-gradient(135deg, var(--color-brand-primary) 0%, #1A1040 100%)", padding: "24px 28px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "rgba(184,115,51,0.2)", border: "1px solid rgba(184,115,51,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              🎵
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
                {t.nowPlaying ?? "Now Playing"}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--color-brand-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentChapter.number === 0 ? "Introduction" : `Chapter ${currentChapter.number}`} — {currentChapter.title.split("—")[1]?.trim() ?? currentChapter.title}
              </div>
            </div>
            {isLoading && (
              <div style={{ fontSize: 12, color: "var(--color-brand-copper)", animation: "flickerNeon 2s infinite" }}>Loading…</div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ background: "rgba(184,115,51,0.1)", border: "1px solid rgba(184,115,51,0.3)", margin: "16px 28px 0", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "var(--color-brand-copper)", display: "flex", gap: 8 }}>
              <span>⚠️</span> <span>{error}</span>
            </div>
          )}

          {/* Controls */}
          <div style={{ padding: "24px 28px" }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: 8 }}>
              <input
                id="audiobook-progress"
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={handleSeek}
                style={{ width: "100%", accentColor: "var(--color-brand-copper)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--color-brand-muted)", marginTop: 4 }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
              <button
                id="audiobook-prev"
                onClick={goToPrev}
                disabled={currentIndex === 0}
                style={{ background: "transparent", border: "none", color: currentIndex === 0 ? "var(--color-brand-border)" : "var(--color-brand-muted)", fontSize: 22, cursor: currentIndex === 0 ? "not-allowed" : "pointer", padding: 8, transition: "color 0.2s" }}
                aria-label="Previous chapter"
              >
                ⏮
              </button>
              <button
                id="audiobook-play-pause"
                onClick={togglePlay}
                style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-brand-copper)", border: "none", color: "white", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(184,115,51,0.4)" }}
                aria-label={isPlaying ? t.pauseNarrative : t.playNarrative}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                id="audiobook-next"
                onClick={goToNext}
                disabled={currentIndex === CHAPTERS.length - 1}
                style={{ background: "transparent", border: "none", color: currentIndex === CHAPTERS.length - 1 ? "var(--color-brand-border)" : "var(--color-brand-muted)", fontSize: 22, cursor: currentIndex === CHAPTERS.length - 1 ? "not-allowed" : "pointer", padding: 8, transition: "color 0.2s" }}
                aria-label="Next chapter"
              >
                ⏭
              </button>
            </div>

            {/* Volume + Auto-Advance */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                <span style={{ fontSize: 16 }}>🔊</span>
                <input
                  id="audiobook-volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolume}
                  style={{ width: 120, accentColor: "var(--color-brand-copper)", cursor: "pointer" }}
                  aria-label="Volume"
                />
              </div>
              <label id="audiobook-auto-advance" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--color-brand-muted)", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  style={{ accentColor: "var(--color-brand-copper)", cursor: "pointer" }}
                />
                Auto-Advance
              </label>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-brand-text)", marginBottom: 16 }}>
            Chapters
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={ch.id}
                  id={`audiobook-chapter-${ch.id}`}
                  onClick={() => {
                    loadChapter(idx);
                    setTimeout(() => {
                      audioRef.current?.play().catch(() => {});
                    }, 200);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 20px",
                    background: isActive ? "rgba(184,115,51,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(184,115,51,0.35)" : "1px solid transparent",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: isActive ? "var(--color-brand-copper)" : "var(--color-brand-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isActive ? 14 : 12, flexShrink: 0, color: isActive ? "white" : "var(--color-brand-muted)", fontWeight: 700 }}>
                    {isActive && isPlaying ? "♪" : ch.number === 0 ? "🎵" : ch.number}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: isActive ? "var(--color-brand-copper)" : "var(--color-brand-text)", fontSize: "0.95rem", fontWeight: isActive ? 600 : 400 }}>
                      {ch.title}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ fontSize: 11, color: "var(--color-brand-copper)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {isPlaying ? "Playing" : "Paused"}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: "center", paddingBottom: 32 }}>
          <Link href="/store" style={{ color: "var(--color-brand-muted)", fontSize: 14, textDecoration: "none" }}>
            ← Get the Print Edition at the Store
          </Link>
        </div>
      </div>
    </div>
  );
}
