"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#08050F",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
          padding: "60px 40px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, rgba(45,27,105,0.35) 0%, rgba(8,5,15,0.9) 100%)",
          border: "1px solid rgba(184,115,51,0.25)",
          boxShadow:
            "0 0 80px rgba(45,27,105,0.2), 0 0 40px rgba(184,115,51,0.08)",
          animation: "successFadeIn 0.8s ease-out",
        }}
      >
        {/* Animated check */}
        <div
          style={{
            width: "88px",
            height: "88px",
            margin: "0 auto 32px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #B87333 0%, #D4956B 50%, #B87333 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "checkPulse 2s ease-in-out infinite",
            boxShadow: "0 0 30px rgba(184,115,51,0.4)",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#08050F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#B87333",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          Order Confirmed
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          Thank You for Your Support
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            marginBottom: "12px",
            maxWidth: "440px",
            margin: "0 auto 12px",
          }}
        >
          Your order from Hood Hymns Publishing has been placed successfully.
          You&apos;ll receive a confirmation email with your receipt and order
          details.
        </p>

        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "40px",
          }}
        >
          Every purchase fuels the mission. Faith forward.&nbsp;🙏🏾
        </p>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #B87333, transparent)",
            margin: "0 auto 32px",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/store"
            className="btn-brand"
            style={{
              padding: "14px 32px",
              fontSize: "0.85rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="btn-ghost"
            style={{
              padding: "14px 32px",
              fontSize: "0.85rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes successFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes checkPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(184,115,51,0.4); }
          50%      { box-shadow: 0 0 50px rgba(184,115,51,0.65), 0 0 80px rgba(45,27,105,0.3); }
        }
      `}</style>
    </div>
  );
}
