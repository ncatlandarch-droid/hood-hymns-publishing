"use client";

import HeroLeadMagnet from "@/components/home/HeroLeadMagnet";
import ContentEngine from "@/components/home/ContentEngine";
import StorePreview from "@/components/home/StorePreview";
import Testimonials from "@/components/home/Testimonials";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { useI18n } from "@/context/I18nContext";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <HeroLeadMagnet />

      {/* ── Testimonial of the Day ── */}
      <section style={{ padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
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
            Hood Hymns Publishing
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "40px",
              color: "var(--color-brand-text)",
            }}
          >
            {t.testimonialOfTheDay}
          </h2>
          <TestimonialCard />
        </div>
      </section>

      <StorePreview />
      <Testimonials />
      <ContentEngine />
    </>
  );
}
