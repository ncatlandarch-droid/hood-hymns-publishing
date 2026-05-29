"use client";

import { useState, useRef, useCallback } from "react";
import { useI18n } from "@/context/I18nContext";
import { NarrativeEntry } from "@/data/content";
import { narrativeTranslations, LANGUAGES } from "@/data/i18n";

interface NarrativePlayerProps {
  narrative: NarrativeEntry;
}

type PlaybackState = "idle" | "loading" | "playing" | "paused";

export default function NarrativePlayer({ narrative }: NarrativePlayerProps) {
  const { locale, t } = useI18n();
  const [state, setState] = useState<PlaybackState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getText = useCallback(() => {
    const translations = narrativeTranslations[narrative.id];
    if (translations && translations[locale]) return translations[locale];
    return narrative.narrativeText;
  }, [locale, narrative]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.cancel();
    }
    synthRef.current = null;
    setState("idle");
  }, []);

  const playStaticAudio = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      const suffix = locale === "en" ? "" : `-${locale}`;
      const src = `/audio/${narrative.id}${suffix}.wav`;
      const audio = new Audio(src);
      audio.oncanplaythrough = () => {
        audioRef.current = audio;
        audio.play();
        setState("playing");
        audio.onended = () => setState("idle");
        resolve(true);
      };
      audio.onerror = () => resolve(false);
    });
  }, [locale, narrative.id]);

  const playGeminiTTS = useCallback(async (): Promise<boolean> => {
    try {
      const langMeta = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: getText(),
          voice: langMeta.ttsVoice,
          lang: langMeta.ttsLang,
          style: langMeta.ttsStyle,
        }),
      });
      if (!res.ok) return false;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      setState("playing");
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      return true;
    } catch {
      return false;
    }
  }, [getText, locale]);

  const playBrowserTTS = useCallback(() => {
    if (typeof speechSynthesis === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(getText());
    const langMeta = LANGUAGES.find((l) => l.code === locale);
    utterance.lang = langMeta?.ttsLang || "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setState("idle");
    synthRef.current = utterance;
    speechSynthesis.speak(utterance);
    setState("playing");
  }, [getText, locale]);

  const handlePlay = useCallback(async () => {
    if (state === "playing") {
      stop();
      return;
    }
    setState("loading");

    // Priority: static WAV → Gemini TTS → Browser Speech
    const staticOk = await playStaticAudio();
    if (staticOk) return;

    const geminiOk = await playGeminiTTS();
    if (geminiOk) return;

    playBrowserTTS();
  }, [state, stop, playStaticAudio, playGeminiTTS, playBrowserTTS]);

  const buttonLabel =
    state === "loading"
      ? t.generatingVoice
      : state === "playing"
        ? t.pauseNarrative
        : t.playNarrative;

  return (
    <div
      className="brutalist-card"
      style={{
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div
          style={{
            width: "80px",
            height: "107px",
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: "4px",
            background: "var(--color-brand-surface)",
          }}
        >
          <img
            src={narrative.coverImage}
            alt={narrative.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: narrative.accentColor,
              marginBottom: "6px",
              fontWeight: 700,
            }}
          >
            {narrative.seriesName}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: "4px",
            }}
          >
            {narrative.title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-brand-muted)" }}>
            {narrative.subtitle}
          </p>
        </div>
      </div>

      {/* Narrative text preview */}
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.8,
          color: "var(--color-brand-muted)",
          maxHeight: "120px",
          overflow: "hidden",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      >
        {getText()}
      </p>

      {/* Play button */}
      <button
        className="btn-brand"
        onClick={handlePlay}
        disabled={state === "loading"}
        style={{
          alignSelf: "flex-start",
          padding: "12px 28px",
          fontSize: "0.85rem",
          opacity: state === "loading" ? 0.6 : 1,
          animation: state === "playing" ? "pulseGlow 2s ease-in-out infinite" : "none",
        }}
      >
        {state === "playing" && (
          <span style={{ display: "inline-block", width: "14px", height: "14px", marginRight: "6px" }}>
            ⏸
          </span>
        )}
        {state === "idle" && (
          <span style={{ display: "inline-block", width: "14px", height: "14px", marginRight: "6px" }}>
            ▶
          </span>
        )}
        {buttonLabel}
      </button>
    </div>
  );
}
