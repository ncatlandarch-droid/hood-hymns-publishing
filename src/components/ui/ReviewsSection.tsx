"use client";

import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

interface Review {
  text: string;
  name: string;
  location: string;
  stars: number;
}

const REVIEWS: Review[] = [
  {
    text: "This book changed how I see my own story. Chris put Detroit on the map for faith fiction.",
    name: "Marcus T.",
    location: "Detroit, MI",
    stars: 5,
  },
  {
    text: "I couldn't put it down. Felt like I was sitting in that two-family flat myself.",
    name: "Keisha W.",
    location: "Atlanta, GA",
    stars: 5,
  },
  {
    text: "Bought the hoodie too. The whole brand is fire.",
    name: "Devon J.",
    location: "Charlotte, NC",
    stars: 5,
  },
  {
    text: "Read it in one sitting. Then ordered copies for my whole book club.",
    name: "Pastor Linda M.",
    location: "Chicago, IL",
    stars: 5,
  },
  {
    text: "Finally, urban fiction that doesn't glorify the streets. This is what we need.",
    name: "James R.",
    location: "Houston, TX",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <span
      style={{
        display: "flex",
        gap: "2px",
        fontSize: "1rem",
        color: "#F59E0B",
      }}
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsSection() {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  }

  return (
    <section
      style={{
        paddingTop: "80px",
        paddingBottom: "80px",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
          padding: "0 24px",
        }}
      >
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
          ★★★★★
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          {t.storeReviewsTitle}
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--color-brand-muted)",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          {t.storeReviewsSubtitle}
        </p>
      </div>

      {/* Scroll container wrapper */}
      <div style={{ position: "relative" }}>
        {/* Left fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "60px",
            background:
              "linear-gradient(to right, var(--color-brand-black), transparent)",
            pointerEvents: "none",
            zIndex: 2,
            opacity: canScrollLeft ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Right fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "60px",
            background:
              "linear-gradient(to left, var(--color-brand-black), transparent)",
            pointerEvents: "none",
            zIndex: 2,
            opacity: canScrollRight ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Horizontal scroll track */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            paddingLeft: "max(24px, calc((100vw - 1200px) / 2))",
            paddingRight: "max(24px, calc((100vw - 1200px) / 2))",
            paddingTop: "8px",
            paddingBottom: "16px",
            scrollSnapType: "x mandatory",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="review-card"
              style={{
                flexShrink: 0,
                width: "320px",
                background: "rgba(20, 14, 36, 0.5)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--color-brand-border)",
                borderRadius: "12px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                scrollSnapAlign: "center",
                transition: "border-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(184, 115, 51, 0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-brand-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Stars */}
              <StarRating count={review.stars} />

              {/* Quote */}
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.7,
                  color: "var(--color-brand-text)",
                  fontStyle: "italic",
                  flex: 1,
                }}
              >
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderTop: "1px solid rgba(38, 24, 64, 0.6)",
                  paddingTop: "14px",
                }}
              >
                {/* Avatar circle */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-copper-dark) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--color-brand-copper-glow)",
                    flexShrink: 0,
                  }}
                >
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--color-brand-text)",
                      marginBottom: "2px",
                    }}
                  >
                    {review.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--color-brand-muted)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid var(--color-brand-border)",
            background: canScrollLeft
              ? "rgba(20, 14, 36, 0.8)"
              : "transparent",
            color: canScrollLeft
              ? "var(--color-brand-text)"
              : "var(--color-brand-border)",
            fontSize: "1rem",
            cursor: canScrollLeft ? "pointer" : "default",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Scroll reviews left"
        >
          ←
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid var(--color-brand-border)",
            background: canScrollRight
              ? "rgba(20, 14, 36, 0.8)"
              : "transparent",
            color: canScrollRight
              ? "var(--color-brand-text)"
              : "var(--color-brand-border)",
            fontSize: "1rem",
            cursor: canScrollRight ? "pointer" : "default",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Scroll reviews right"
        >
          →
        </button>
      </div>

      {/* Hide native scrollbar */}
      <style>{`
        .review-card::-webkit-scrollbar,
        div[style*="overflowX"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
