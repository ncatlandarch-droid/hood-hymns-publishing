"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

const INTEREST_OPTIONS = [
  { id: "books", label: "📚 Books & New Releases" },
  { id: "merch", label: "🎵 Merch & Drops" },
  { id: "films", label: "🎬 Films & Trailers" },
  { id: "behind-the-scenes", label: "✨ Behind the Scenes" },
];

export default function SubscribePage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name.trim() || undefined,
          source: "newsletter",
          interests: interests.length > 0 ? interests : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        localStorage.setItem("hh-subscribed", "true");
      }
    } catch {
      // Graceful degradation
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      name: t.communityTierName,
      price: t.communityTierPrice,
      features: [t.communityFeature1, t.communityFeature2, t.communityFeature3],
      accent: "var(--color-brand-muted)",
      featured: false,
    },
    {
      name: t.insiderTierName,
      price: t.insiderTierPrice,
      features: [
        t.insiderFeature1,
        t.insiderFeature2,
        t.insiderFeature3,
        t.insiderFeature4,
        t.insiderFeature5,
      ],
      accent: "var(--color-brand-copper)",
      featured: true,
    },
    {
      name: t.patronTierName,
      price: t.patronTierPrice,
      features: [
        t.patronFeature1,
        t.patronFeature2,
        t.patronFeature3,
        t.patronFeature4,
        t.patronFeature5,
      ],
      accent: "var(--color-brand-primary)",
      featured: false,
    },
  ];

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
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
            {t.newsletterTag}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.subscribeTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)", maxWidth: "600px", margin: "0 auto" }}>
            {t.subscribeSubtitle}
          </p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Email signup */}
        {submitted ? (
          <div
            className="brutalist-card fade-in-up"
            style={{
              padding: "48px",
              textAlign: "center",
              borderColor: "var(--color-brand-copper)",
              marginBottom: "60px",
              maxWidth: "500px",
              margin: "0 auto 60px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎵</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px" }}>
              {t.youreIn}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-brand-muted)" }}>
              {t.youreInBody}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "500px",
              margin: "0 auto 60px",
            }}
          >
            {/* Name field */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.yourName}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "var(--color-brand-surface)",
                border: "1px solid var(--color-brand-border)",
                color: "var(--color-brand-text)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s ease",
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-brand-copper)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-brand-border)")}
            />

            {/* Email field */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "var(--color-brand-surface)",
                border: "1px solid var(--color-brand-border)",
                color: "var(--color-brand-text)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s ease",
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-brand-copper)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-brand-border)")}
            />

            {/* Interests */}
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-brand-muted)",
                  marginBottom: "12px",
                  fontWeight: 600,
                }}
              >
                {t.interestedIn}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      fontSize: "0.8rem",
                      border: `1px solid ${
                        interests.includes(opt.id)
                          ? "var(--color-brand-copper)"
                          : "var(--color-brand-border)"
                      }`,
                      background: interests.includes(opt.id)
                        ? "rgba(184, 115, 51, 0.15)"
                        : "var(--color-brand-surface)",
                      color: interests.includes(opt.id)
                        ? "var(--color-brand-copper)"
                        : "var(--color-brand-muted)",
                      cursor: loading ? "wait" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn-brand"
              disabled={loading}
              style={{
                width: "100%",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "..." : t.subscribeCta}
            </button>

            <p style={{ fontSize: "0.75rem", color: "var(--color-brand-muted)", textAlign: "center" }}>
              {t.privacyNote}
            </p>
          </form>
        )}

        {/* Tiers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="brutalist-card"
              style={{
                padding: "40px 32px",
                borderColor: tier.featured ? "var(--color-brand-copper)" : undefined,
                position: "relative",
              }}
            >
              {tier.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--color-brand-copper)",
                    color: "white",
                    padding: "4px 16px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {t.mostPopular}
                </span>
              )}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: tier.accent,
                }}
              >
                {tier.name}
              </h3>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: "24px",
                  color: "var(--color-brand-text)",
                }}
              >
                {tier.price}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {tier.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: "8px 0",
                      fontSize: "0.85rem",
                      color: "var(--color-brand-muted)",
                      borderBottom: "1px solid var(--color-brand-border)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "var(--color-brand-copper)" }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
