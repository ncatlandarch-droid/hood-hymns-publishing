"use client";

import { useI18n } from "@/context/I18nContext";
import { ExcerptEntry } from "@/data/content";
import { excerptTranslations, excerptLabels } from "@/data/i18n";

interface BookExcerptProps {
  excerpt: ExcerptEntry;
}

export default function BookExcerpt({ excerpt }: BookExcerptProps) {
  const { locale } = useI18n();
  const labels = excerptLabels[locale];

  const translated = excerptTranslations[excerpt.id]?.[locale];
  const bookTitle = translated?.bookTitle || excerpt.bookTitle;
  const chapterTitle = translated?.chapterTitle || excerpt.chapterTitle;
  const text = excerpt.text; // Use full text from content.ts

  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);

  return (
    <div className="brutalist-card" style={{ padding: "40px", maxWidth: "720px" }}>
      {/* Header */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "32px" }}>
        <div
          style={{
            width: "60px",
            height: "80px",
            flexShrink: 0,
            borderRadius: "4px",
            overflow: "hidden",
            background: "var(--color-brand-surface)",
          }}
        >
          <img
            src={excerpt.coverImage}
            alt={bookTitle}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <div>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-brand-copper)",
              marginBottom: "4px",
              fontWeight: 700,
            }}
          >
            {labels.excerpt}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            {bookTitle}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-brand-muted)", fontStyle: "italic" }}>
            {chapterTitle}
          </p>
        </div>
      </div>

      {/* Dropcap text */}
      <div style={{ lineHeight: 1.9, fontSize: "0.95rem", color: "var(--color-brand-text)" }}>
        <span
          style={{
            float: "left",
            fontSize: "4rem",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 0.8,
            marginRight: "8px",
            marginTop: "4px",
            color: "var(--color-brand-copper)",
          }}
        >
          {firstLetter}
        </span>
        {restOfText}
      </div>

      {/* CTA */}
      <div style={{ marginTop: "32px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <a href="/store" className="btn-brand" style={{ padding: "10px 24px", fontSize: "0.8rem", textDecoration: "none" }}>
          {labels.getBook}
        </a>
      </div>
    </div>
  );
}
