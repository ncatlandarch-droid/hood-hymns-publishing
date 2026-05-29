"use client";

export interface ShortClip {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
}

interface ShortsCardProps {
  clip: ShortClip;
}

export default function ShortsCard({ clip }: ShortsCardProps) {
  return (
    <div
      className="brutalist-card group"
      style={{
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "9/16",
          background: "var(--color-brand-surface)",
          overflow: "hidden",
          maxHeight: "320px",
        }}
      >
        <img
          src={clip.thumbnail}
          alt={clip.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease",
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,12,16,0.9) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        {/* Play icon */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(184, 115, 51, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          ▶
        </div>
        {/* Duration badge */}
        <span
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(0,0,0,0.7)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "0.7rem",
            color: "var(--color-brand-text)",
          }}
        >
          {clip.duration}
        </span>
      </div>
      <div style={{ padding: "16px" }}>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-brand-copper)",
            marginBottom: "6px",
            fontWeight: 600,
          }}
        >
          {clip.category}
        </p>
        <h4
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {clip.title}
        </h4>
      </div>
    </div>
  );
}
