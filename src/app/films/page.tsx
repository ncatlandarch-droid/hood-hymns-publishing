"use client";

import { useI18n } from "@/context/I18nContext";
import { filmsI18n } from "@/data/i18n";

export default function FilmsPage() {
  const { locale, t } = useI18n();
  const fi = filmsI18n[locale];

  const films = [
    {
      id: "harmonies-film",
      title: fi.mainTitle,
      description: fi.mainDesc,
      image: "/harmonies-scene1.jpg",
      status: t.comingSoon,
      accent: "var(--color-brand-copper)",
    },
    {
      id: "prodigal-film",
      title: "The Prodigal Block — The Film",
      description: "A raw, cinematic journey through the streets of Detroit. The story of Marcus — and the long road back to grace.",
      image: "/prodigal-scene1.jpg",
      status: t.comingSoon,
      accent: "var(--color-brand-primary)",
    },
  ];

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
            Hood Hymns Studios
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.filmsTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)", maxWidth: "600px", margin: "0 auto" }}>
            {t.filmsSubtitle}
          </p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Films grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {films.map((film) => (
            <div
              key={film.id}
              className="brutalist-card"
              style={{ overflow: "hidden" }}
            >
              <div className="film-poster" style={{ aspectRatio: "21/9", borderRadius: 0 }}>
                <img
                  src={film.image}
                  alt={film.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* Overlay content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "40px",
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      border: `1px solid ${film.accent}`,
                      color: film.accent,
                      marginBottom: "12px",
                    }}
                  >
                    {film.status}
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    {film.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-brand-muted)",
                      maxWidth: "500px",
                      lineHeight: 1.6,
                    }}
                  >
                    {film.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Short Films section */}
        <section style={{ marginTop: "80px", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {fi.shortFilmsTitle}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--color-brand-muted)", marginBottom: "32px" }}>
            Original short films and trailers from the Hood Hymns universe — {t.comingSoon.toLowerCase()}.
          </p>
          <div
            className="brutalist-card"
            style={{
              padding: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderStyle: "dashed",
            }}
          >
            <p style={{ color: "var(--color-brand-muted)", fontSize: "0.85rem" }}>
              🎬 Short films and trailers coming soon
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
