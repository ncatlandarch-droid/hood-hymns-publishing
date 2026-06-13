"use client";

import { useI18n } from "@/context/I18nContext";

export default function ComingSoonBanner() {
  const { t } = useI18n();

  return (
    <section
      style={{
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(ellipse, rgba(184, 115, 51, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Section label */}
        <p
          className="fade-in-up"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-brand-copper)",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          {t.comingSoonLabel}
        </p>

        {/* Section heading */}
        <h2
          className="fade-in-up fade-in-up-delay-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 700,
            color: "var(--color-brand-text)",
            marginBottom: "48px",
            lineHeight: 1.2,
          }}
        >
          {t.comingSoonHeading}
        </h2>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Vol 2 Card */}
          <div
            className="fade-in-up fade-in-up-delay-2 coming-soon-card"
            style={{
              background:
                "linear-gradient(135deg, rgba(14, 10, 26, 0.9) 0%, rgba(45, 27, 105, 0.2) 100%)",
              border: "1px solid rgba(184, 115, 51, 0.25)",
              borderRadius: "16px",
              padding: "40px 32px",
              backdropFilter: "blur(12px)",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background:
                  "linear-gradient(90deg, var(--color-brand-copper), rgba(45, 27, 105, 0.8))",
              }}
            />

            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-brand-copper)",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            >
              {t.vol2Label}
            </p>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--color-brand-text)",
                marginBottom: "8px",
                lineHeight: 1.25,
              }}
            >
              {t.vol2Title}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "var(--color-brand-copper)",
                marginBottom: "16px",
                lineHeight: 1.4,
              }}
            >
              {t.vol2Subtitle}
            </p>

            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--color-brand-muted)",
                lineHeight: 1.7,
              }}
            >
              {t.vol2Body}
            </p>

            {/* Badge */}
            <div
              style={{
                marginTop: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "99px",
                background: "rgba(184, 115, 51, 0.12)",
                border: "1px solid rgba(184, 115, 51, 0.3)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--color-brand-copper)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-brand-copper)",
                }}
              >
                {t.comingSoon}
              </span>
            </div>
          </div>

          {/* Vol 3 Card */}
          <div
            className="fade-in-up fade-in-up-delay-3 coming-soon-card"
            style={{
              background:
                "linear-gradient(135deg, rgba(14, 10, 26, 0.9) 0%, rgba(45, 27, 105, 0.15) 100%)",
              border: "1px solid rgba(144, 136, 168, 0.2)",
              borderRadius: "16px",
              padding: "40px 32px",
              backdropFilter: "blur(12px)",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background:
                  "linear-gradient(90deg, rgba(144, 136, 168, 0.5), rgba(45, 27, 105, 0.6))",
              }}
            />

            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-brand-muted)",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            >
              {t.vol3Label}
            </p>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--color-brand-text)",
                marginBottom: "8px",
                lineHeight: 1.25,
              }}
            >
              {t.vol3Title}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "var(--color-brand-muted)",
                marginBottom: "16px",
                lineHeight: 1.4,
              }}
            >
              {t.vol3Subtitle}
            </p>

            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--color-brand-muted)",
                lineHeight: 1.7,
              }}
            >
              {t.vol3Body}
            </p>

            {/* Badge */}
            <div
              style={{
                marginTop: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "99px",
                background: "rgba(144, 136, 168, 0.1)",
                border: "1px solid rgba(144, 136, 168, 0.25)",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-brand-muted)",
                }}
              >
                {t.beOnTheLookout}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
