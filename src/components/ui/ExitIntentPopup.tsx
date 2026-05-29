"use client";

import { useState, useEffect } from "react";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        animation: "fadeInUp 0.4s ease-out",
      }}
      onClick={handleDismiss}
    >
      <div
        className="brutalist-card"
        style={{
          padding: "48px",
          maxWidth: "480px",
          width: "90%",
          textAlign: "center",
          position: "relative",
          border: "1px solid var(--color-brand-copper)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "var(--color-brand-muted)",
            fontSize: "1.5rem",
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-brand-copper)",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          Wait — before you go
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: "16px",
            lineHeight: 1.3,
          }}
        >
          Get Chapter One <span className="text-gradient-copper">Free</span>
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-brand-muted)",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          Read the opening chapter of <em>The Harmonies of Hope</em> — no strings attached.
        </p>
        <a
          href="/free-chapter"
          className="btn-brand"
          style={{
            display: "inline-block",
            textDecoration: "none",
            padding: "14px 32px",
            fontSize: "0.85rem",
          }}
        >
          Send My Free Chapter
        </a>
      </div>
    </div>
  );
}
