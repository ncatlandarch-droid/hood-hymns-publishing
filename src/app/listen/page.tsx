"use client";

import { useI18n } from "@/context/I18nContext";
import NarrativePlayer from "@/components/ui/NarrativePlayer";
import CinematicTrailer from "@/components/ui/CinematicTrailer";
import BookExcerpt from "@/components/ui/BookExcerpt";
import { narratives, excerpts } from "@/data/content";

export default function ListenPage() {
  const { t } = useI18n();

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
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
            {t.watchListen}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.listenTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)", maxWidth: "600px", margin: "0 auto" }}>
            {t.listenSubtitle}
          </p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Narratives + Trailers + Excerpts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {narratives.map((narrative) => {
            const excerpt = excerpts.find((e) => e.seriesId === narrative.seriesId);
            return (
              <div key={narrative.id} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Series divider */}
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: narrative.accentColor,
                      fontWeight: 700,
                    }}
                  >
                    {narrative.seriesName}
                  </p>
                </div>

                {/* Player */}
                <NarrativePlayer narrative={narrative} />

                {/* Cinematic Trailer */}
                <CinematicTrailer narrative={narrative} />

                {/* Excerpt */}
                {excerpt && <BookExcerpt excerpt={excerpt} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
