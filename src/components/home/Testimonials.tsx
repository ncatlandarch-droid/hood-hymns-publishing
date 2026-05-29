"use client";

import { useState, useEffect } from "react";
import { testimonials } from "@/lib/testimonials";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        {/* Section header */}
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
          Reader Testimonials
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "40px",
          }}
        >
          What Readers Are Saying
        </h2>

        {/* Testimonial card */}
        <div
          key={t.id}
          className="brutalist-card fade-in-up"
          style={{
            padding: "48px",
            borderColor: "var(--color-brand-copper)",
            transition: "all 0.5s ease",
          }}
        >
          {/* Stars */}
          <div style={{ marginBottom: "20px", fontSize: "1.2rem", color: "var(--color-brand-copper)" }}>
            {"★".repeat(t.rating)}
          </div>

          {/* Quote */}
          <blockquote
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.15rem",
              fontStyle: "italic",
              lineHeight: 1.7,
              marginBottom: "24px",
              color: "var(--color-brand-text)",
            }}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          {/* Author */}
          <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>
            — {t.name}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--color-brand-muted)" }}>
            {t.location} · <span style={{ color: "var(--color-brand-copper)" }}>{t.book}</span>
          </p>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Testimonial ${i + 1}`}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "none",
                background: i === current ? "var(--color-brand-copper)" : "var(--color-brand-border)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
