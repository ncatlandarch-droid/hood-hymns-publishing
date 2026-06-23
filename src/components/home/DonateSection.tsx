"use client";

import { useI18n } from "@/context/I18nContext";

export default function DonateSection() {
  const { t } = useI18n();

  return (
    <section
      style={{
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient copper glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(ellipse, rgba(184, 115, 51, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "680px",
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
          Hood Hymns Publishing
        </p>

        {/* Card */}
        <div
          className="brutalist-card fade-in-up fade-in-up-delay-1"
          style={{
            padding: "56px 40px",
            borderRadius: "16px",
            background: "var(--color-brand-surface)",
            border: "1px solid rgba(184, 115, 51, 0.15)",
          }}
        >
          {/* Praying hands emoji */}
          <div
            style={{
              fontSize: "2.4rem",
              marginBottom: "20px",
              lineHeight: 1,
            }}
          >
            🙏🏾
          </div>

          {/* Headline */}
          <h2
            className="text-gradient-copper"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 700,
              marginBottom: "20px",
              lineHeight: 1.2,
            }}
          >
            {t.donateTitle}
          </h2>

          {/* Copper divider */}
          <div
            className="copper-divider"
            style={{
              width: "60px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, var(--color-brand-copper), transparent)",
              margin: "0 auto 28px",
            }}
          />

          {/* Subtitle / description */}
          <p
            className="fade-in-up fade-in-up-delay-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--color-brand-muted)",
              maxWidth: "520px",
              margin: "0 auto 36px",
            }}
          >
            {t.donateSubtitle}
          </p>

          {/* Cash App CTA Button */}
          <a
            href="https://hwlldmn.gumroad.com/l/nqcgg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand fade-in-up fade-in-up-delay-3"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "18px 48px",
              fontSize: "1.1rem",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              letterSpacing: "0.04em",
              color: "#08050F",
              background:
                "linear-gradient(135deg, #B87333 0%, #D4945A 50%, #B87333 100%)",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.3s ease",
              boxShadow:
                "0 4px 24px rgba(184, 115, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(184, 115, 51, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(184, 115, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>💚</span>
            {t.donateCTA}
          </a>

          {/* Note */}
          <p
            className="fade-in-up fade-in-up-delay-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-brand-muted)",
              marginTop: "24px",
              letterSpacing: "0.02em",
              opacity: 0.8,
            }}
          >
            {t.donateNote}
          </p>
        </div>
      </div>
    </section>
  );
}
