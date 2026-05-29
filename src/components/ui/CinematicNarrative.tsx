"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface CinematicNarrativeProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  scenes: string[];
  accentColor: string;
}

export default function CinematicNarrative({
  title,
  subtitle,
  audioSrc,
  scenes,
  accentColor,
}: CinematicNarrativeProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate scene duration based on audio length
  const sceneDuration = duration > 0 ? duration / scenes.length : 30;

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    setProgress(pct);
    setCurrentTime(audio.currentTime);

    // Determine which scene to show based on audio position
    const sceneIndex = Math.min(
      Math.floor(audio.currentTime / sceneDuration),
      scenes.length - 1
    );
    setCurrentScene(sceneIndex);
  }, [sceneDuration, scenes.length]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateProgress, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, updateProgress]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentScene(0);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
    updateProgress();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Ken Burns animation key based on scene index
  const kenBurnsStyles: React.CSSProperties[] = [
    { transform: "scale(1.15) translate(-2%, -1%)" },
    { transform: "scale(1.2) translate(2%, -2%)" },
    { transform: "scale(1.1) translate(-1%, 2%)" },
    { transform: "scale(1.25) translate(1%, -1%)" },
    { transform: "scale(1.15) translate(-2%, 1%)" },
    { transform: "scale(1.2) translate(2%, 2%)" },
  ];

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        background: "var(--color-brand-surface)",
        border: "1px solid var(--color-brand-border)",
        marginBottom: "48px",
      }}
    >
      {/* Cinematic viewport */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          cursor: "pointer",
          background: "#000",
        }}
        onClick={togglePlay}
      >
        {/* Scene images with Ken Burns */}
        {scenes.map((scene, i) => (
          <div
            key={scene}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === currentScene ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
            }}
          >
            <img
              src={scene}
              alt={`Scene ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 8s ease-in-out",
                ...(i === currentScene && isPlaying
                  ? kenBurnsStyles[i % kenBurnsStyles.length]
                  : { transform: "scale(1)" }),
              }}
            />
          </div>
        ))}

        {/* Dark gradient overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%)",
            zIndex: 1,
          }}
        />

        {/* Play/Pause overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            opacity: isPlaying ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: `2px solid ${accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = `0 0 30px ${accentColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "2rem", marginLeft: isPlaying ? 0 : "4px" }}>
              {isPlaying ? "⏸" : "▶"}
            </span>
          </div>
        </div>

        {/* Title overlay (bottom-left) */}
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "24px",
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: "6px",
              fontWeight: 700,
            }}
          >
            {subtitle}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </h3>
        </div>

        {/* Scene indicator dots */}
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            right: "24px",
            zIndex: 2,
            display: "flex",
            gap: "8px",
          }}
        >
          {scenes.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentScene ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === currentScene ? accentColor : "rgba(255,255,255,0.3)",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "rgba(255,255,255,0.1)",
            zIndex: 3,
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSeek(e);
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`,
              transition: "width 0.1s linear",
              boxShadow: `0 0 8px ${accentColor}60`,
            }}
          />
        </div>
      </div>

      {/* Controls bar */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={togglePlay}
            style={{
              background: "none",
              border: "none",
              color: accentColor,
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-brand-muted)",
              fontFamily: "monospace",
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-brand-muted)",
          }}
        >
          Scene {currentScene + 1} of {scenes.length}
        </span>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}
