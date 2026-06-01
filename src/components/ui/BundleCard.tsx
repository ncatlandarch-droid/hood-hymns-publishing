"use client";

import { useI18n } from "@/context/I18nContext";

export interface BundleData {
  nameKey: "starterBundle" | "collectorBundle" | "completeBundle";
  items: string[];
  originalPrice: string;
  bundlePrice: string;
  savePercent: number;
  storeLink: string;
}

interface BundleCardProps {
  bundle: BundleData;
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const { t } = useI18n();

  return (
    <div
      className="bundle-card"
      style={{
        background: "rgba(20, 14, 36, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(184, 115, 51, 0.15)",
        borderRadius: "16px",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(184, 115, 51, 0.5)";
        el.style.boxShadow =
          "0 0 30px rgba(184, 115, 51, 0.12), 0 8px 32px rgba(0, 0, 0, 0.3)";
        el.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(184, 115, 51, 0.15)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Subtle gradient overlay at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "120px",
          background:
            "linear-gradient(180deg, rgba(184, 115, 51, 0.06) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Bundle Name — copper gradient */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          fontWeight: 700,
          lineHeight: 1.3,
          background:
            "linear-gradient(135deg, #D4944A 0%, #B87333 50%, #D4944A 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          position: "relative",
        }}
      >
        {t[bundle.nameKey]}
      </h3>

      {/* Items Included */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
        }}
      >
        {bundle.items.map((item, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontSize: "0.88rem",
              color: "var(--color-brand-muted)",
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                color: "#4ADE80",
                fontSize: "0.85rem",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Pricing Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Original price struck through */}
        <span
          style={{
            fontSize: "0.9rem",
            color: "var(--color-brand-muted)",
            textDecoration: "line-through",
            opacity: 0.7,
          }}
        >
          {bundle.originalPrice}
        </span>

        {/* Bundle price — large copper */}
        <span
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "var(--color-brand-copper)",
            fontFamily: "var(--font-cinematic)",
            letterSpacing: "-0.02em",
          }}
        >
          {bundle.bundlePrice}
        </span>

        {/* Savings badge */}
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            background:
              "linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.08) 100%)",
            color: "#4ADE80",
            border: "1px solid rgba(74, 222, 128, 0.25)",
            borderRadius: "20px",
            padding: "4px 12px",
          }}
        >
          Save {bundle.savePercent}%
        </span>
      </div>

      {/* Buy Bundle Button */}
      <a
        href={bundle.storeLink}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          background:
            "linear-gradient(135deg, var(--color-brand-copper) 0%, var(--color-brand-copper-dark) 100%)",
          color: "white",
          padding: "14px 28px",
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textDecoration: "none",
          borderRadius: "8px",
          border: "1px solid rgba(184, 115, 51, 0.4)",
          transition: "all 0.25s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background =
            "linear-gradient(135deg, #D4944A 0%, var(--color-brand-copper) 100%)";
          el.style.boxShadow = "0 4px 20px rgba(184, 115, 51, 0.3)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background =
            "linear-gradient(135deg, var(--color-brand-copper) 0%, var(--color-brand-copper-dark) 100%)";
          el.style.boxShadow = "none";
        }}
      >
        {t.buyBundle} →
      </a>
    </div>
  );
}
