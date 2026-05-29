"use client";

import { useI18n } from "@/context/I18nContext";
import { LANGUAGES, Locale } from "@/data/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Select language"
        style={{
          background: "transparent",
          color: "var(--color-brand-text)",
          border: "1px solid var(--color-brand-border)",
          padding: "6px 12px",
          fontSize: "0.8rem",
          borderRadius: "4px",
          cursor: "pointer",
          appearance: "none",
          paddingRight: "28px",
        }}
      >
        {LANGUAGES.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            style={{ background: "var(--color-brand-black)", color: "var(--color-brand-text)" }}
          >
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: "8px",
          pointerEvents: "none",
          fontSize: "0.6rem",
          color: "var(--color-brand-muted)",
        }}
      >
        ▼
      </span>
    </div>
  );
}
