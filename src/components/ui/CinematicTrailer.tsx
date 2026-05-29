"use client";

import { useState, useEffect, useCallback } from "react";
import { NarrativeEntry } from "@/data/content";

interface CinematicTrailerProps {
  narrative: NarrativeEntry;
}

const KB_CLASSES = ["kb-pan-right", "kb-pan-left", "kb-zoom-in", "kb-pan-up"];

export default function CinematicTrailer({ narrative }: CinematicTrailerProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes = narrative.trailerScenes;

  const startTrailer = useCallback(() => {
    setIsPlaying(true);
    setCurrentScene(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentScene >= scenes.length) {
      setIsPlaying(false);
      setCurrentScene(0);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentScene((s) => s + 1);
    }, 5200);
    return () => clearTimeout(timer);
  }, [isPlaying, currentScene, scenes.length]);

  // If we have a real video, embed it
  if (narrative.videoSrc) {
    return (
      <div
        className="brutalist-card"
        style={{ overflow: "hidden", aspectRatio: "16/9", position: "relative" }}
      >
        <iframe
          src={narrative.videoSrc}
          title={narrative.title}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            position: "absolute",
            inset: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Ken Burns cinematic scene player
  return (
    <div
      className="brutalist-card"
      style={{
        overflow: "hidden",
        position: "relative",
        aspectRatio: "16/9",
        background: "var(--color-brand-black)",
        cursor: "pointer",
      }}
      onClick={!isPlaying ? startTrailer : undefined}
    >
      {isPlaying && currentScene < scenes.length ? (
        <>
          <img
            key={currentScene}
            src={scenes[currentScene]}
            alt={`Scene ${currentScene + 1}`}
            className={KB_CLASSES[currentScene % KB_CLASSES.length]}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <div
              key={`progress-${currentScene}`}
              style={{
                height: "100%",
                background: narrative.accentColor,
                animation: "trailerProgress 5200ms linear forwards",
              }}
            />
          </div>
          {/* Overlay gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10,12,16,0.6) 0%, transparent 40%)",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: narrative.accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              transition: "transform 0.3s ease",
            }}
          >
            ▶
          </div>
          <p
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-brand-muted)",
            }}
          >
            Watch Cinematic Trailer
          </p>
        </div>
      )}
    </div>
  );
}
