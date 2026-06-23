"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/context/I18nContext";
import Link from "next/link";

// ── Audiobook Purchase via /api/checkout ─────────────────────────────────
const AUDIOBOOK_PRODUCT = {
  id: "harmonies-audiobook",
  title: "The Harmonies of Hope — Full Audiobook",
  price: "$9.99",
  image: "/book-harmonies-v1.png",
  type: "digital" as const,
};

type NarratorMode = "author" | "studio";

interface Chapter {
  id: string;
  number: number;
  title: string;
  file: string;
  free: boolean;
}

function getChapterSrc(file: string, narrator: NarratorMode): string {
  if (narrator === "studio") return `/audiobook/gemini-narrator/${file}`;
  return `/audiobook/${file}`;
}

const CHAPTERS: Chapter[] = [
  { id: "intro",      number: 0, title: "Introduction",                          file: "intro.mp3",       free: true  },
  { id: "chapter-01", number: 1, title: "Chapter 1 — The Two-Family Flat",        file: "chapter-01.mp3",  free: true  },
  { id: "chapter-02", number: 2, title: "Chapter 2 — The Brothers",               file: "chapter-02.mp3",  free: false },
  { id: "chapter-03", number: 3, title: "Chapter 3 — Mom and Pop",                file: "chapter-03.mp3",  free: false },
  { id: "chapter-04", number: 4, title: "Chapter 4 — The Move",                   file: "chapter-04.mp3",  free: false },
  { id: "chapter-05", number: 5, title: "Chapter 5 — The Church",                 file: "chapter-05.mp3",  free: false },
  { id: "chapter-06", number: 6, title: "Chapter 6 — The Water",                  file: "chapter-06.mp3",  free: false },
  { id: "chapter-07", number: 7, title: "Chapter 7 — The Choir",                  file: "chapter-07.mp3",  free: false },
  { id: "chapter-08", number: 8, title: "Chapter 8 — Now Direct",                 file: "chapter-08.mp3",  free: false },
  { id: "chapter-09", number: 9, title: "Chapter 9 — The Harmony Unfolds",        file: "chapter-09.mp3",  free: false },
];

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudiobookPage() {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [progress, setProgress]           = useState(0);
  const [currentTime, setCurrentTime]     = useState(0);
  const [duration, setDuration]           = useState(0);
  const [volume, setVolume]               = useState(0.85);
  const [autoAdvance, setAutoAdvance]     = useState(true);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [unlocked, setUnlocked]           = useState(false);
  const [showPaywall, setShowPaywall]     = useState(false);
  const [justPurchased, setJustPurchased] = useState(false);
  const [narrator, setNarrator]           = useState<NarratorMode>("author");
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentChapter = CHAPTERS[currentIndex];
  const currentSrc = getChapterSrc(currentChapter.file, narrator);
  const [isPurchasing, setIsPurchasing]   = useState(false);

  const canPlay = currentChapter.free || unlocked;

  // ── Handle audiobook purchase via Gumroad ─────────────────────────────────
  function handlePurchase() {
    if (isPurchasing) return;
    setIsPurchasing(true);
    window.open("https://hoodhymn.gumroad.com/l/yknrr", "_blank");
    // Reset state after a short delay so the button is usable again
    setTimeout(() => setIsPurchasing(false), 1500);
  }

  // ── Check purchase state on mount ────────────────────────────────────────
  useEffect(() => {
    // Check localStorage
    if (localStorage.getItem("hh-audiobook-unlocked") === "true") {
      setUnlocked(true);
    }
    // Check Stripe redirect param
    const params = new URLSearchParams(window.location.search);
    if (params.get("purchased") === "audiobook") {
      localStorage.setItem("hh-audiobook-unlocked", "true");
      setUnlocked(true);
      setJustPurchased(true);
      // Clean URL
      window.history.replaceState({}, "", "/audiobook");
    }
  }, []);

  const loadChapter = useCallback((index: number) => {
    const ch = CHAPTERS[index];
    if (!ch.free && !unlocked) {
      setShowPaywall(true);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    setIsLoading(true);
    setCurrentIndex(index);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setShowPaywall(false);
    audio.src = getChapterSrc(ch.file, narrator);
    audio.load();
  }, [unlocked, narrator]);

  const togglePlay = () => {
    if (!canPlay) { setShowPaywall(true); return; }
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
    audio.currentTime = (pct / 100) * duration;
    setProgress(pct);
    setCurrentTime(audio.currentTime);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const goToPrev = () => { if (currentIndex > 0) loadChapter(currentIndex - 1); };
  const goToNext = () => {
    const next = currentIndex + 1;
    if (next >= CHAPTERS.length) return;
    loadChapter(next);
  };

  // ── Audio event wiring ────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay           = () => setIsPlaying(true);
    const onPause          = () => setIsPlaying(false);
    const onTimeUpdate     = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoadedMetadata = () => { setDuration(audio.duration); setIsLoading(false); };
    const onCanPlay        = () => setIsLoading(false);
    const onError          = () => {
      setIsLoading(false);
      setError("Audio file not yet generated. Run the audiobook script to generate chapters.");
    };
    const onEnded = () => {
      setIsPlaying(false);
      if (autoAdvance && currentIndex < CHAPTERS.length - 1) {
        const next = currentIndex + 1;
        const nextCh = CHAPTERS[next];
        if (nextCh.free || unlocked) {
          setTimeout(() => {
            setCurrentIndex(next);
            const a = audioRef.current;
            if (a) { a.src = getChapterSrc(nextCh.file, narrator); a.load(); a.play().catch(() => {}); }
          }, 1500);
        }
      }
    };

    audio.addEventListener("play",            onPlay);
    audio.addEventListener("pause",           onPause);
    audio.addEventListener("timeupdate",      onTimeUpdate);
    audio.addEventListener("loadedmetadata",  onLoadedMetadata);
    audio.addEventListener("canplay",         onCanPlay);
    audio.addEventListener("error",           onError);
    audio.addEventListener("ended",           onEnded);
    audio.volume = volume;

    return () => {
      audio.removeEventListener("play",           onPlay);
      audio.removeEventListener("pause",          onPause);
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay",        onCanPlay);
      audio.removeEventListener("error",          onError);
      audio.removeEventListener("ended",          onEnded);
    };
  }, [currentIndex, autoAdvance, volume, unlocked, narrator]);

  // ── Switch narrator: reload current chapter with new path ──────────────
  const switchNarrator = (mode: NarratorMode) => {
    if (mode === narrator) return;
    const audio = audioRef.current;
    const wasPlaying = isPlaying;
    const savedTime = audio?.currentTime ?? 0;
    setNarrator(mode);
    if (audio) {
      audio.src = getChapterSrc(currentChapter.file, mode);
      audio.load();
      audio.addEventListener("loadedmetadata", () => {
        audio.currentTime = savedTime;
        if (wasPlaying) audio.play().catch(() => {});
      }, { once: true });
    }
  };

  return (
    <div style={{ background: "var(--color-brand-black)", minHeight: "100vh", paddingTop: "80px" }}>
      <audio ref={audioRef} src={currentSrc} preload="metadata" />

      {/* ── Purchase Success Banner ── */}
      {justPurchased && (
        <div style={{ background: "rgba(184,115,51,0.15)", borderBottom: "1px solid rgba(184,115,51,0.4)", padding: "16px 24px", textAlign: "center" }}>
          <span style={{ color: "var(--color-brand-copper)", fontWeight: 600, fontSize: "0.95rem" }}>
            🎉 Purchase confirmed! All chapters are now unlocked. Enjoy the full audiobook.
          </span>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ background: "var(--color-brand-surface)", borderBottom: "1px solid var(--color-brand-border)", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(184,115,51,0.15)", border: "1px solid rgba(184,115,51,0.3)", borderRadius: 20, padding: "4px 16px", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-brand-copper)", marginBottom: 16 }}>
            🎧 Audiobook
          </div>
          <h1 className="fade-in-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--color-brand-text)", marginBottom: 12, lineHeight: 1.2 }}>
            The Harmonies of Hope
          </h1>
          <p style={{ color: "var(--color-brand-muted)", fontSize: "1.1rem", marginBottom: 12 }}>
            By C.D. Howell · {narrator === "author" ? "Narrated by the Author" : "Studio Narration"}
          </p>

          {/* ── Narrator Toggle ── */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => switchNarrator("author")}
              style={{
                padding: "8px 20px",
                borderRadius: 24,
                border: narrator === "author" ? "2px solid var(--color-brand-copper)" : "1px solid var(--color-brand-border)",
                background: narrator === "author" ? "rgba(184,115,51,0.15)" : "transparent",
                color: narrator === "author" ? "var(--color-brand-copper)" : "var(--color-brand-muted)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: narrator === "author" ? 600 : 400,
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              🎤 C.D. Howell
            </button>
            <button
              onClick={() => switchNarrator("studio")}
              style={{
                padding: "8px 20px",
                borderRadius: 24,
                border: narrator === "studio" ? "2px solid var(--color-brand-copper)" : "1px solid var(--color-brand-border)",
                background: narrator === "studio" ? "rgba(184,115,51,0.15)" : "transparent",
                color: narrator === "studio" ? "var(--color-brand-copper)" : "var(--color-brand-muted)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: narrator === "studio" ? 600 : 400,
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              👩 Studio Voice
            </button>
          </div>
          {!unlocked && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,115,51,0.1)", border: "1px solid rgba(184,115,51,0.25)", borderRadius: 20, padding: "4px 16px", fontSize: 13, color: "var(--color-brand-muted)" }}>
              ✅ Intro &amp; Chapter 1 Free &nbsp;·&nbsp; 🔒 Chapters 2–9 — <strong style={{ color: "var(--color-brand-copper)" }}>&nbsp;$9.99</strong>
            </div>
          )}
          {unlocked && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,115,51,0.1)", border: "1px solid rgba(184,115,51,0.25)", borderRadius: 20, padding: "4px 16px", fontSize: 13, color: "var(--color-brand-copper)", fontWeight: 600 }}>
              🔓 Full Audiobook Unlocked
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>

        {/* ── Now Playing Card ── */}
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
            {isLoading && <div style={{ fontSize: 12, color: "var(--color-brand-copper)", animation: "flickerNeon 2s infinite" }}>Loading…</div>}
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ background: "rgba(184,115,51,0.1)", border: "1px solid rgba(184,115,51,0.3)", margin: "16px 28px 0", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "var(--color-brand-copper)", display: "flex", gap: 8 }}>
              <span>⚠️</span> <span>{error}</span>
            </div>
          )}

          {/* Controls */}
          <div style={{ padding: "24px 28px" }}>
            <div style={{ marginBottom: 8 }}>
              <input id="audiobook-progress" type="range" min={0} max={100} step={0.1} value={progress} onChange={handleSeek}
                style={{ width: "100%", accentColor: "var(--color-brand-copper)", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--color-brand-muted)", marginTop: 4 }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
              <button id="audiobook-prev" onClick={goToPrev} disabled={currentIndex === 0}
                style={{ background: "transparent", border: "none", color: currentIndex === 0 ? "var(--color-brand-border)" : "var(--color-brand-muted)", fontSize: 22, cursor: currentIndex === 0 ? "not-allowed" : "pointer", padding: 8, transition: "color 0.2s" }}
                aria-label="Previous chapter">⏮</button>
              <button id="audiobook-play-pause" onClick={togglePlay}
                style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-brand-copper)", border: "none", color: "white", fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(184,115,51,0.4)" }}
                aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button id="audiobook-next" onClick={goToNext} disabled={currentIndex === CHAPTERS.length - 1}
                style={{ background: "transparent", border: "none", color: currentIndex === CHAPTERS.length - 1 ? "var(--color-brand-border)" : "var(--color-brand-muted)", fontSize: 22, cursor: currentIndex === CHAPTERS.length - 1 ? "not-allowed" : "pointer", padding: 8, transition: "color 0.2s" }}
                aria-label="Next chapter">⏭</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                <span style={{ fontSize: 16 }}>🔊</span>
                <input id="audiobook-volume" type="range" min={0} max={1} step={0.05} value={volume} onChange={handleVolume}
                  style={{ width: 120, accentColor: "var(--color-brand-copper)", cursor: "pointer" }} aria-label="Volume" />
              </div>
              <label id="audiobook-auto-advance" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--color-brand-muted)", userSelect: "none" }}>
                <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)}
                  style={{ accentColor: "var(--color-brand-copper)", cursor: "pointer" }} />
                Auto-Advance
              </label>
            </div>
          </div>
        </div>

        {/* ── Paywall Card ── */}
        {showPaywall && !unlocked && (
          <div className="fade-in-up" style={{ background: "linear-gradient(135deg, rgba(184,115,51,0.12) 0%, rgba(26,16,64,0.6) 100%)", border: "1px solid rgba(184,115,51,0.4)", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎧</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--color-brand-text)", marginBottom: 12 }}>
              Unlock the Full Audiobook
            </h2>
            <p style={{ color: "var(--color-brand-muted)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 24px" }}>
              You&apos;ve heard the intro. Now hear the whole story. Chapters 2–9 of <em>The Harmonies of Hope</em> — narrated by the author, streaming instantly.
            </p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--color-brand-copper)", fontWeight: 700 }}>$9.99</span>
              <span style={{ color: "var(--color-brand-muted)", fontSize: "0.85rem", marginLeft: 8 }}>one-time · instant access</span>
            </div>
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="btn-brand"
              id="audiobook-buy-btn"
              style={{ display: "inline-block", padding: "16px 40px", fontSize: "1rem", marginBottom: 16, cursor: isPurchasing ? "wait" : "pointer", opacity: isPurchasing ? 0.7 : 1, border: "none" }}
            >
              {isPurchasing ? "Processing..." : "🎧 Get Full Access — $9.99"}
            </button>
            <div>
              <button onClick={() => setShowPaywall(false)}
                style={{ background: "none", border: "none", color: "var(--color-brand-muted)", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}>
                Back to free chapters
              </button>
            </div>
          </div>
        )}

        {/* ── Chapter List ── */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-brand-text)", marginBottom: 16 }}>
            Chapters
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {CHAPTERS.map((ch, idx) => {
              const isActive  = idx === currentIndex;
              const isLocked  = !ch.free && !unlocked;
              return (
                <button
                  key={ch.id}
                  id={`audiobook-chapter-${ch.id}`}
                  onClick={() => {
                    if (isLocked) { setShowPaywall(true); return; }
                    loadChapter(idx);
                    setTimeout(() => { audioRef.current?.play().catch(() => {}); }, 200);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "14px 20px",
                    background: isActive ? "rgba(184,115,51,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(184,115,51,0.35)" : "1px solid transparent",
                    borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.2s", width: "100%",
                    opacity: isLocked ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: isActive ? "var(--color-brand-copper)" : isLocked ? "rgba(255,255,255,0.06)" : "var(--color-brand-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isActive ? 14 : 12, flexShrink: 0, color: isActive ? "white" : "var(--color-brand-muted)", fontWeight: 700 }}>
                    {isLocked ? "🔒" : isActive && isPlaying ? "♪" : ch.number === 0 ? "🎵" : ch.number}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: isActive ? "var(--color-brand-copper)" : isLocked ? "var(--color-brand-muted)" : "var(--color-brand-text)", fontSize: "0.95rem", fontWeight: isActive ? 600 : 400 }}>
                      {ch.title}
                    </div>
                    {ch.number === 1 && !unlocked && (
                      <div style={{ fontSize: 11, color: "var(--color-brand-copper)", marginTop: 2 }}>Free Preview</div>
                    )}
                    {ch.number === 0 && !unlocked && (
                      <div style={{ fontSize: 11, color: "var(--color-brand-copper)", marginTop: 2 }}>Free</div>
                    )}
                    {isLocked && (
                      <div style={{ fontSize: 11, color: "var(--color-brand-muted)", marginTop: 2 }}>Unlock for $9.99</div>
                    )}
                  </div>
                  {isActive && !isLocked && (
                    <div style={{ fontSize: 11, color: "var(--color-brand-copper)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {isPlaying ? "Playing" : "Paused"}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Upsell to Paywall if not unlocked ── */}
        {!unlocked && (
          <div style={{ background: "var(--color-brand-surface)", border: "1px solid var(--color-brand-border)", borderRadius: 12, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--color-brand-text)", marginBottom: 4 }}>
                Ready for the full story?
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-brand-muted)" }}>
                8 more chapters · Narrated by the author · Instant streaming
              </div>
            </div>
            <button onClick={handlePurchase} disabled={isPurchasing} className="btn-brand" id="audiobook-unlock-btn"
              style={{ whiteSpace: "nowrap", flexShrink: 0, border: "none", cursor: isPurchasing ? "wait" : "pointer", opacity: isPurchasing ? 0.7 : 1 }}>
              {isPurchasing ? "Processing..." : "🔓 Unlock for $9.99"}
            </button>
          </div>
        )}

        {/* ── Back Link ── */}
        <div style={{ textAlign: "center", paddingBottom: 32 }}>
          <Link href="/store" style={{ color: "var(--color-brand-muted)", fontSize: 14, textDecoration: "none" }}>
            ← Get the Print Edition at the Store
          </Link>
        </div>
      </div>
    </div>
  );
}
