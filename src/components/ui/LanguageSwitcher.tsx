"use client";
import { useI18n } from "@/context/I18nContext";
import { LANGUAGES, Locale } from "@/data/i18n";

/**
 * LanguageSwitcher
 * ─────────────────
 * Compact flag+label dropdown for English / Español / 中文.
 * Sits in the Navbar — selecting a language changes all UI strings instantly.
 * Styled with Hood Hymns dark purple/copper brand.
 */
export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const current = LANGUAGES.find(l => l.code === locale)!;

  return (
    <div style={{ position: "relative" }} className="lang-switcher-wrap">
      <button
        className="lang-switcher-btn"
        aria-label="Select language"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-brand-text)",
          background: "none",
          border: "1px solid var(--color-brand-border)",
          padding: "6px 12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <span>{current.flag}</span>
        <span className="lang-label-desktop">{current.label}</span>
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ opacity: 0.6 }}>
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className="lang-dropdown"
        style={{
          position: "absolute",
          right: 0,
          top: "100%",
          marginTop: "4px",
          minWidth: "160px",
          background: "var(--color-brand-black)",
          border: "1px solid var(--color-brand-border)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          opacity: 0,
          visibility: "hidden" as const,
          transition: "all 0.15s ease",
          zIndex: 50,
        }}
      >
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code as Locale)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: lang.code === locale ? "var(--color-brand-surface)" : "transparent",
              color: lang.code === locale ? "var(--color-brand-copper)" : "var(--color-brand-muted)",
            }}
            onMouseEnter={e => {
              if (lang.code !== locale) {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--color-brand-surface)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-text)";
              }
            }}
            onMouseLeave={e => {
              if (lang.code !== locale) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand-muted)";
              }
            }}
          >
            <span style={{ fontSize: "1rem" }}>{lang.flag}</span>
            <span>{lang.label}</span>
            {lang.code === locale && (
              <span
                style={{
                  marginLeft: "auto",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--color-brand-copper)",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Hover / interaction styles */}
      <style jsx>{`
        .lang-switcher-wrap:hover .lang-dropdown,
        .lang-switcher-wrap:focus-within .lang-dropdown {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .lang-switcher-btn:hover {
          border-color: var(--color-brand-copper) !important;
          color: var(--color-brand-copper) !important;
        }
        @media (max-width: 640px) {
          .lang-label-desktop {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
