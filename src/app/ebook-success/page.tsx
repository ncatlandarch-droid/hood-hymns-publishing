"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/context/I18nContext";

function EbookSuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { t } = useI18n();

  const downloadUrl = `/api/deliver-ebook?token=${encodeURIComponent(token)}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--color-brand-bg, #0a0c10)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow effects */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184, 115, 51, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(107, 65, 175, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "540px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "48px 36px",
          textAlign: "center",
          boxShadow:
            "0 32px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* Success check icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 24px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(184, 115, 51, 0.2) 0%, rgba(212, 175, 55, 0.15) 100%)",
            border: "2px solid rgba(184, 115, 51, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B87333"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Tag */}
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-brand-copper, #B87333)",
            marginBottom: "8px",
          }}
        >
          {t.digitalDownload}
        </p>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display, 'Playfair Display', serif)",
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "12px",
            background:
              "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t.ebookReady}
        </h1>

        {/* Book cover */}
        <div
          style={{
            margin: "24px auto",
            maxWidth: "180px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow:
              "0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            transform: "perspective(600px) rotateY(-3deg)",
            transition: "transform 0.4s ease",
          }}
        >
          <img
            src="/book-harmonies-v1.png"
            alt="The Harmonies of Hope — Digital Edition"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* Download button */}
        <a
          href={downloadUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 40px",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "#fff",
            background:
              "linear-gradient(135deg, #B87333 0%, #D4942A 50%, #B87333 100%)",
            backgroundSize: "200% 200%",
            border: "none",
            borderRadius: "12px",
            textDecoration: "none",
            cursor: "pointer",
            boxShadow:
              "0 8px 32px rgba(184, 115, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s ease",
            animation: "shimmer 3s ease-in-out infinite",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.transform =
              "translateY(-2px) scale(1.02)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 12px 40px rgba(184, 115, 51, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "none";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 32px rgba(184, 115, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t.downloadNow}
        </a>

        {/* Instructions */}
        <div
          style={{
            marginTop: "28px",
            padding: "16px 20px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--color-brand-muted, #8a8f9e)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            ⏳ {t.downloadExpires}
            <br />
            📥 {t.downloadLimit}
          </p>
        </div>

        {/* Add to library suggestion */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "0.78rem",
            color: "var(--color-brand-muted, #8a8f9e)",
            fontStyle: "italic",
          }}
        >
          💡 {t.addToLibrary}
        </p>

        {/* Back to store */}
        <a
          href="/store"
          style={{
            display: "inline-block",
            marginTop: "24px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--color-brand-copper, #B87333)",
            textDecoration: "none",
            letterSpacing: "0.05em",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.7";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          ← {t.continueShopping}
        </a>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184, 115, 51, 0.2); }
          50% { box-shadow: 0 0 20px 8px rgba(184, 115, 51, 0.15); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          50% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </main>
  );
}

export default function EbookSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-brand-bg, #0a0c10)",
            color: "var(--color-brand-muted, #8a8f9e)",
            fontSize: "1rem",
          }}
        >
          Loading…
        </div>
      }
    >
      <EbookSuccessContent />
    </Suspense>
  );
}
