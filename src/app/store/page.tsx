"use client";

import { useI18n } from "@/context/I18nContext";
import ProductCard from "@/components/ui/ProductCard";
import BundleCard, { BundleData } from "@/components/ui/BundleCard";
import ReviewsSection from "@/components/ui/ReviewsSection";
import { products, seriesList, collectionsOrder } from "@/data/store";

const BUNDLES: BundleData[] = [
  {
    nameKey: "starterBundle",
    items: [
      "The Harmonies of Hope (Paperback)",
      "The Prodigal Block: Lost Frequency (Paperback)",
      "Studio Signature Tee",
    ],
    originalPrice: "$94.98",
    bundlePrice: "$79.99",
    savePercent: 15,
    storeLink: "/store",
  },
  {
    nameKey: "collectorBundle",
    items: [
      "The Harmonies of Hope (Paperback)",
      "The Prodigal Block: Lost Frequency (Paperback)",
      "Hood Hymns Studio Hoodie",
      "Studio Snapback",
    ],
    originalPrice: "$147.98",
    bundlePrice: "$129.99",
    savePercent: 12,
    storeLink: "/store",
  },
  {
    nameKey: "completeBundle",
    items: [
      "The Harmonies of Hope (Paperback)",
      "The Prodigal Block: Lost Frequency (Paperback)",
      "Hood Hymns Studio Hoodie",
      "Studio Signature Tee",
      "Studio Snapback",
      "B2B Embroidered Cap",
    ],
    originalPrice: "$217.97",
    bundlePrice: "$189.99",
    savePercent: 13,
    storeLink: "/store",
  },
];

export default function StorePage() {
  const { t } = useI18n();

  // Find the index after the first two series to insert bundles between
  const firstTwoCollections = collectionsOrder.slice(0, 2);
  const remainingCollections = collectionsOrder.slice(2);

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
            {t.shopTag}
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

        {/* First two collections (books) */}
        {firstTwoCollections.map((collectionName) => {
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

        {/* ── Bundle Deals Section ── */}
        <section style={{ marginBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
              🔥 {t.bundleAndSave}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                marginBottom: "12px",
                background:
                  "linear-gradient(135deg, #D4944A 0%, #B87333 50%, #D4944A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.bundleAndSave}
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--color-brand-muted)",
                maxWidth: "550px",
                margin: "0 auto",
              }}
            >
              {t.bundleSubtitle}
            </p>
            <div className="copper-divider" style={{ marginTop: "24px" }} />
          </div>

          {/* Bundle cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {BUNDLES.map((bundle) => (
              <BundleCard key={bundle.nameKey} bundle={bundle} />
            ))}
          </div>
        </section>

        {/* Remaining collections (merch) */}
        {remainingCollections.map((collectionName) => {
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

      {/* ── Social Proof / Reviews Section ── */}
      <ReviewsSection />
    </div>
  );
}
