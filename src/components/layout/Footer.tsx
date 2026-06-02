"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-brand-border)",
        background: "var(--color-brand-black)",
        padding: "60px 24px 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              {t.hoodHymns}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-brand-muted)", lineHeight: 1.6 }}>
              {t.footerTagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-brand-copper)",
                marginBottom: "16px",
                fontWeight: 700,
              }}
            >
              {t.footerQuickLinks}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { href: "/store", label: t.store },
                { href: "/listen", label: t.watchListen },
                { href: "/about", label: t.about },
                { href: "/films", label: t.films },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    color: "var(--color-brand-muted)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand-text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-brand-muted)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h4
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-brand-copper)",
                marginBottom: "16px",
                fontWeight: 700,
              }}
            >
              {t.footerCommunity}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href="/free-chapter"
                style={{ textDecoration: "none", fontSize: "0.85rem", color: "var(--color-brand-muted)" }}
              >
                {t.freeChapter}
              </Link>
              <Link
                href="/subscribe"
                style={{ textDecoration: "none", fontSize: "0.85rem", color: "var(--color-brand-muted)" }}
              >
                {t.subscribe}
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="copper-divider" style={{ maxWidth: "100%", marginBottom: "24px" }} />

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "var(--color-brand-muted)",
            }}
          >
            {t.footerRights}
          </p>
          {/* Admin access — for author use */}
          <Link
            href="/admin"
            style={{
              fontSize: "0.7rem",
              color: "var(--color-brand-copper)",
              textDecoration: "none",
              opacity: 0.35,
              transition: "opacity 0.3s ease",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.35")}
            title="Author Admin"
          >
            ✦
          </Link>
        </div>
      </div>
    </footer>
  );
}
