"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

export default function SubscribePage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  const tiers = [
    {
      name: "Community",
      price: "Free",
      features: ["Monthly newsletter", "Release announcements", "Community access"],
      accent: "var(--color-brand-muted)",
      featured: false,
    },
    {
      name: "Insider",
      price: "$5/mo",
      features: [
        "Everything in Community",
        "Early chapter drops",
        "Behind-the-scenes content",
        "Exclusive audio narrations",
        "Priority merch access",
      ],
      accent: "var(--color-brand-copper)",
      featured: true,
    },
    {
      name: "Patron",
      price: "$15/mo",
      features: [
        "Everything in Insider",
        "Signed copies on release",
        "Direct author Q&A access",
        "Name in acknowledgements",
        "Exclusive B2B drops",
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
            Newsletter
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
              You&apos;re In!
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-brand-muted)" }}>
              Welcome to the Hood Hymns community. Look for our next update in your inbox.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "12px",
              maxWidth: "500px",
              margin: "0 auto 60px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "16px",
                background: "var(--color-brand-surface)",
                border: "1px solid var(--color-brand-border)",
                color: "var(--color-brand-text)",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <button type="submit" className="btn-brand">
              {t.subscribeCta}
            </button>
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
                  Most Popular
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
                {tier.features.map((feature) => (
                  <li
                    key={feature}
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
