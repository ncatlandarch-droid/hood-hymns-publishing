"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

export interface Product {
  id: string;
  title: string;
  type: string;
  price: string;
  image: string;
  description: string;
  collection: string;
  paymentLink?: string;
  productType?: "physical" | "digital";
}

interface ProductCardProps {
  product: Product;
  addToCartLabel?: string;
  notifyLabel?: string;
}

export default function ProductCard({
  product,
  addToCartLabel = "Add to Cart",
  notifyLabel = "Notify Me",
}: ProductCardProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const isComingSoon =
    (product.image.includes("v2") && product.collection === "The Prodigal Block") ||
    product.id.includes("coming-soon");
  const isMerch = !product.type.includes("Paperback") && !product.type.includes("E-Book");
  const isDigital = product.productType === "digital";

  async function handleCheckout() {
    if (loading || isComingSoon) return;
    setLoading(true);

    // Use direct Stripe payment link if available
    if (product.paymentLink) {
      window.location.href = product.paymentLink;
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          title: `${product.title} — ${product.type}`,
          price: product.price,
          image: product.image,
          type: product.productType ?? "physical",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed. Please try again.");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      const raw =
        err instanceof Error ? err.message : "Something went wrong.";
      // Hide config errors from end users
      const message = raw.includes("STRIPE") || raw.includes("configured")
        ? "Store coming soon! Check back shortly."
        : raw;
      alert(message);
      setLoading(false);
    }
  }

  return (
    <div className="brutalist-card group" style={{ overflow: "hidden" }}>
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          background: "var(--color-brand-surface)",
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,12,16,0.9) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        {/* Limited Edition Badge — merch only (not books) */}
        {isMerch && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 3,
              background:
                "linear-gradient(135deg, rgba(184, 115, 51, 0.9) 0%, rgba(212, 148, 74, 0.85) 100%)",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: "4px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 2px 12px rgba(184, 115, 51, 0.3)",
            }}
          >
            {product.type.includes("Accessories") ? t.firstRun : t.limitedEdition}
          </div>
        )}
        {/* Digital Download Badge */}
        {isDigital && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 3,
              background:
                "linear-gradient(135deg, rgba(0, 180, 216, 0.9) 0%, rgba(0, 150, 199, 0.85) 100%)",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: "4px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 2px 12px rgba(0, 180, 216, 0.3)",
            }}
          >
            {t.digitalDownload}
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: "24px" }}>
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-brand-copper)",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          {product.type}
        </p>
        {/* Instant Download info for digital products */}
        {isDigital && !isComingSoon && (
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "rgba(0, 200, 230, 0.85)",
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t.instantDownload}
          </p>
        )}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "8px",
            lineHeight: 1.3,
          }}
        >
          {product.title}
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--color-brand-muted)",
            marginBottom: "16px",
            lineHeight: 1.6,
          }}
        >
          {product.description.length > 120
            ? product.description.substring(0, 120) + "…"
            : product.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--color-brand-copper)",
            }}
          >
            {product.price}
          </span>
          <button
            className={isComingSoon ? "btn-ghost" : "btn-brand"}
            style={{
              padding: "10px 20px",
              fontSize: "0.8rem",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
            onClick={handleCheckout}
            disabled={loading || isComingSoon}
          >
            {isComingSoon
              ? notifyLabel
              : loading
                ? t.redirecting
                : addToCartLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
