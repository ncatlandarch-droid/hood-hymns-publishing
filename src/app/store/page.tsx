"use client";

import { useI18n } from "@/context/I18nContext";
import ProductCard from "@/components/ui/ProductCard";
import { products, seriesList, collectionsOrder } from "@/data/store";

export default function StorePage() {
  const { t } = useI18n();

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
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
            Shop
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.storeTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)", maxWidth: "600px", margin: "0 auto" }}>
            {t.storeSubtitle}
          </p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Collections */}
        {collectionsOrder.map((collectionName) => {
          const series = seriesList.find((s) => s.name === collectionName);
          const collectionProducts = products.filter((p) => p.collection === collectionName);
          if (collectionProducts.length === 0) return null;

          return (
            <section key={collectionName} style={{ marginBottom: "80px" }}>
              {/* Collection header */}
              <div style={{ marginBottom: "32px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: series?.accentColor || "var(--color-brand-copper)" }}>
                    {collectionName}
                  </span>
                </h2>
                {series?.tagline && (
                  <p style={{ fontSize: "0.9rem", color: "var(--color-brand-muted)", lineHeight: 1.6, maxWidth: "600px" }}>
                    {series.tagline}
                  </p>
                )}
                {series?.upcoming && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-brand-copper)",
                      marginTop: "8px",
                      fontWeight: 600,
                    }}
                  >
                    {series.upcoming}
                  </p>
                )}
              </div>

              {/* Product grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {collectionProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCartLabel={t.addToCart}
                    notifyLabel={t.notifyMe}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
