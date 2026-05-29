"use client";

import { useState } from "react";

export interface Product {
  id: string;
  title: string;
  type: string;
  price: string;
  image: string;
  description: string;
  collection: string;
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
  const [loading, setLoading] = useState(false);
  const isComingSoon = product.image.includes("v2") && product.collection === "The Prodigal Block";

  async function handleCheckout() {
    if (loading || isComingSoon) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          title: `${product.title} — ${product.type}`,
          price: product.price,
          image: product.image,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed. Please try again.");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
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
                ? "Redirecting…"
                : addToCartLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
