"use client";

import { useI18n } from "@/context/I18nContext";
import CinematicNarrative from "@/components/ui/CinematicNarrative";
import BookExcerpt from "@/components/ui/BookExcerpt";
import { narratives, excerpts } from "@/data/content";

export default function ListenPage() {
  const { t } = useI18n();

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
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
            Cinematic Narratives
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Experience the <span className="text-gradient-copper">Stories</span>
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)", maxWidth: "600px", margin: "0 auto" }}>
            Press play and immerse yourself. Each story comes alive through narration and cinematic imagery.
          </p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Combined cinematic narratives */}
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {narratives.map((narrative) => {
            const excerpt = excerpts.find((e) => e.seriesId === narrative.seriesId);
            return (
              <div key={narrative.id} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Unified cinematic player */}
                <CinematicNarrative
                  title={narrative.title}
                  subtitle={`By C.D. Howell · ${narrative.seriesName}`}
                  audioSrc={narrative.audioSrc || ""}
                  scenes={narrative.trailerScenes || []}
                  accentColor={narrative.accentColor}
                />

                {/* Excerpt teaser below */}
                {excerpt && <BookExcerpt excerpt={excerpt} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
