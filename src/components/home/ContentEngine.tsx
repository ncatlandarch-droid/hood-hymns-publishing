"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function ContentEngine() {
  const { t } = useI18n();

  return (
    <section className="section-gap" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header */}
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
            {t.content}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.contentTitle}
          </h2>
          <div className="copper-divider" />
        </div>

        {/* Community callout */}
        <div
          className="brutalist-card"
          style={{
            padding: "48px",
            textAlign: "center",
            borderColor: "var(--color-brand-copper)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            {t.joinCommunityHeading}
          </h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--color-brand-muted)",
              marginBottom: "24px",
              maxWidth: "500px",
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            {t.joinCommunityBody}
          </p>
          <Link
            href="/subscribe"
            className="btn-brand"
            style={{ textDecoration: "none" }}
          >
            {t.subscribeCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
