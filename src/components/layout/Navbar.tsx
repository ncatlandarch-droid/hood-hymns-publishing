"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Navbar() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/listen", label: "Experience" },
    { href: "/store", label: t.store },
    { href: "/about", label: t.about },
    { href: "/content", label: t.content },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(8, 5, 15, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-brand-border)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Hood Hymns Publishing"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--color-brand-text)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Hood Hymns
            </span>
            <span
              style={{
                fontFamily: "var(--font-cinematic)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-brand-copper)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Publishing &amp; Apparel
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "36px",
          }}
          className="nav-desktop"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-brand-muted)",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-brand-muted)")}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--color-brand-text)",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: "var(--color-brand-black)",
            borderTop: "1px solid var(--color-brand-border)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--color-brand-text)",
                padding: "8px 0",
              }}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Link
            href="/free-chapter"
            className="btn-brand"
            onClick={() => setMobileOpen(false)}
            style={{ textDecoration: "none", textAlign: "center", marginTop: "8px" }}
          >
            {t.freeChapter}
          </Link>
        </div>
      )}

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
