"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function HeroLeadMagnet() {
  const { t } = useI18n();

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "160px 24px 80px",
        overflow: "hidden",
      }}
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.3,
        }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay + gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(8, 5, 15, 0.6) 0%, rgba(8, 5, 15, 0.4) 40%, rgba(8, 5, 15, 0.85) 100%),
                        radial-gradient(ellipse at 30% 20%, rgba(45, 27, 105, 0.3) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, rgba(184, 115, 51, 0.15) 0%, transparent 50%)`,
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
        {/* Publisher tag */}
        <p
          className="fade-in-up"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-brand-copper)",
            marginBottom: "24px",
            fontWeight: 700,
          }}
        >
          Hood Hymns Publishing · Detroit, MI
        </p>

        {/* Main headline */}
        <h1
          className="fade-in-up fade-in-up-delay-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          <span className="text-gradient-copper">Hood Hymns</span>
          <br />
          <span style={{ color: "var(--color-brand-text)" }}>
            Positive stories rooted in the streets
          </span>
        </h1>

        {/* Subhead */}
        <p
          className="fade-in-up fade-in-up-delay-2"
          style={{
            fontSize: "1.1rem",
            color: "var(--color-brand-muted)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          {t.heroSubhead}
        </p>

        {/* CTAs */}
        <div
          className="fade-in-up fade-in-up-delay-3"
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/free-chapter"
            className="btn-brand"
            style={{ textDecoration: "none" }}
          >
            {t.heroCtaPrimary}
          </Link>
          <Link
            href="/store"
            className="btn-ghost"
            style={{ textDecoration: "none" }}
          >
            {t.heroCtaSecondary}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className="fade-in-up fade-in-up-delay-4"
          style={{
            marginTop: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, var(--color-brand-copper), transparent)",
            }}
          />
          <p style={{ fontSize: "0.65rem", color: "var(--color-brand-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}
