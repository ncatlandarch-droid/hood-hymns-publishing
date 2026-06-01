"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/context/I18nContext";

export default function ExitIntentPopup() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDismiss = useCallback(() => {
    setShow(false);
    sessionStorage.setItem("hh-exit-dismissed", "true");
  }, []);

  useEffect(() => {
    // Don't show if already subscribed
    if (localStorage.getItem("hh-subscribed") === "true") return;
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("hh-exit-dismissed") === "true") return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        // Remove listener after triggering once
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    // Delay attaching listener to avoid triggering on page load
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-popup" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        localStorage.setItem("hh-subscribed", "true");
      }
    } catch {
      // Graceful degradation
      setSuccess(true);
    } finally {
      setLoading(false);
    }
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
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={handleDismiss}
    >
      <div
        className="brutalist-card"
        style={{
          padding: "48px 40px",
          maxWidth: "440px",
          width: "90%",
          textAlign: "center",
          position: "relative",
          border: "1px solid var(--color-brand-copper)",
          background: "rgba(8, 5, 15, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 0 60px rgba(184, 115, 51, 0.15), 0 24px 48px rgba(0,0,0,0.5)",
          animation: "slideUp 0.4s ease-out",
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
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand-copper)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-brand-muted)")}
          aria-label={t.exitPopupClose}
        >
          ✕
        </button>

        {success ? (
          /* ── Success State ────────────────────────────────────────── */
          <div className="fade-in-up">
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📖</div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "12px",
                color: "var(--color-brand-copper)",
              }}
            >
              {t.exitPopupSuccess}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-brand-muted)",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              {t.exitPopupSuccessBody}
            </p>
            <button
              onClick={handleDismiss}
              className="btn-brand"
              style={{ padding: "12px 32px", fontSize: "0.85rem" }}
            >
              {t.exitPopupClose}
            </button>
          </div>
        ) : (
          /* ── Form State ───────────────────────────────────────────── */
          <>
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
              {t.exitPopupTag}
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
              {t.exitPopupHeading}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-brand-muted)",
                marginBottom: "28px",
                lineHeight: 1.6,
              }}
            >
              {t.exitPopupBody}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
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
              <button
                type="submit"
                className="btn-brand"
                disabled={loading}
                style={{
                  width: "100%",
                  fontSize: "0.85rem",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading ? "..." : t.exitPopupCta}
              </button>
            </form>

            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--color-brand-muted)",
                marginTop: "16px",
                opacity: 0.7,
              }}
            >
              {t.exitPopupNoSpam}
            </p>
          </>
        )}
      </div>

      {/* ── Inline keyframe animations ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
