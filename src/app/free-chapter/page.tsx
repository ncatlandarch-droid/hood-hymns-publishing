"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

export default function FreeChapterPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        {/* Header */}
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
          Hood Hymns Publishing
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          {t.freeChapterTitle}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-brand-muted)",
            marginBottom: "40px",
            lineHeight: 1.7,
          }}
        >
          {t.freeChapterSubtitle}
        </p>
        <div className="copper-divider" style={{ marginBottom: "40px" }} />

        {submitted ? (
          <div
            className="brutalist-card fade-in-up"
            style={{
              padding: "48px",
              borderColor: "var(--color-brand-copper)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📖</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Check Your Inbox!
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-brand-muted)", lineHeight: 1.6 }}>
              Chapter One of <em>The Harmonies of Hope</em> is on its way to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              className="brutalist-card"
              style={{ padding: "48px", display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Book cover preview */}
              <div
                style={{
                  width: "120px",
                  height: "160px",
                  margin: "0 auto",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "var(--color-brand-surface)",
                }}
              >
                <img
                  src="/book-harmonies-v1.png"
                  alt="The Harmonies of Hope"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "var(--color-brand-surface)",
                  border: "1px solid var(--color-brand-border)",
                  color: "var(--color-brand-text)",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-brand-copper)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-brand-border)")}
              />
              <button type="submit" className="btn-brand" style={{ width: "100%" }}>
                {t.freeChapterCta}
              </button>
              <p style={{ fontSize: "0.75rem", color: "var(--color-brand-muted)" }}>
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
