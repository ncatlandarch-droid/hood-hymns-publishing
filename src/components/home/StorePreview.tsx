"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/data/store";

export default function StorePreview() {
  const { t } = useI18n();
  const previewProducts = products.slice(0, 3);

  return (
    <section style={{ padding: "80px 24px", background: "var(--color-brand-surface)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
            {t.store}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.storeTitle}
          </h2>
          <div className="copper-divider" />
        </div>

        {/* Product grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {previewProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCartLabel={t.addToCart}
              notifyLabel={t.notifyMe}
            />
          ))}
        </div>

        {/* Browse all CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/store"
            className="btn-ghost"
            style={{ textDecoration: "none" }}
          >
            {t.heroCtaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
