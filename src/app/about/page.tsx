"use client";

import { useI18n } from "@/context/I18nContext";
import { authorBio } from "@/data/content";
import { seriesList } from "@/data/store";

export default function AboutPage() {
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
            The Author
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.aboutTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)" }}>
            {t.aboutSubtitle}
          </p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Photo + Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "48px",
            marginBottom: "60px",
            alignItems: "start",
          }}
          className="about-grid"
        >
          {/* Photo */}
          <div
            className="brutalist-card"
            style={{
              overflow: "hidden",
              aspectRatio: "3/4",
              background: "var(--color-brand-surface)",
              position: "relative",
            }}
          >
            <img
              src={authorBio.photoPlaceholder}
              alt={authorBio.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 25%",
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          {/* Bio + Stats */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              {authorBio.name}
            </h2>
            <p
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-brand-copper)",
                marginBottom: "24px",
                fontWeight: 600,
              }}
            >
              {authorBio.title}
            </p>

            {authorBio.bio.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  color: "var(--color-brand-text)",
                  marginBottom: "16px",
                }}
              >
                {paragraph}
              </p>
            ))}

            {/* Pull quote */}
            <div
              className="brutalist-card"
              style={{
                padding: "24px",
                marginTop: "24px",
                borderLeft: "3px solid var(--color-brand-copper)",
              }}
            >
              <blockquote
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  marginBottom: "8px",
                }}
              >
                {authorBio.pullQuote}
              </blockquote>
              <cite style={{ fontSize: "0.8rem", color: "var(--color-brand-muted)", fontStyle: "normal" }}>
                — {authorBio.pullQuoteSource}
              </cite>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginTop: "32px",
              }}
            >
              {authorBio.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="brutalist-card"
                  style={{ padding: "16px", textAlign: "center" }}
                >
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-brand-copper)" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--color-brand-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Series overview */}
        <section>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            The <span className="text-gradient-copper">Series</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {seriesList.filter((s) => s.synopsis).map((series) => (
              <div key={series.id} className="brutalist-card" style={{ padding: "32px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: series.accentColor,
                  }}
                >
                  {series.name}
                </h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--color-brand-text)", marginBottom: "12px" }}>
                  {series.synopsis}
                </p>
                {series.upcoming && (
                  <p style={{ fontSize: "0.75rem", color: "var(--color-brand-copper)", fontWeight: 600 }}>
                    {series.upcoming}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
