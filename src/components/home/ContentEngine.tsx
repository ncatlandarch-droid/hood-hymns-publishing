"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import ShortsCard, { ShortClip } from "@/components/ui/ShortsCard";

const DEMO_CLIPS: ShortClip[] = [
  {
    id: "clip-1",
    title: "The Two-Family Flat — Behind the Story",
    thumbnail: "/harmonies-scene1.jpg",
    duration: "0:58",
    category: "Behind the Scenes",
  },
  {
    id: "clip-2",
    title: "Detroit Streets: Filming Locations",
    thumbnail: "/prodigal-scene1.jpg",
    duration: "1:24",
    category: "On Location",
  },
  {
    id: "clip-3",
    title: "Faith & Music — Author's Reflection",
    thumbnail: "/harmonies-scene2.jpg",
    duration: "2:10",
    category: "Author Talk",
  },
];

export default function ContentEngine() {
  const { t } = useI18n();

  return (
    <section className="section-gap" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header */}
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
            {t.content}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.contentTitle}
          </h2>
          <div className="copper-divider" />
        </div>

        {/* Clips grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {DEMO_CLIPS.map((clip) => (
            <ShortsCard key={clip.id} clip={clip} />
          ))}
        </div>

        {/* Community callout */}
        <div
          className="brutalist-card"
          style={{
            padding: "48px",
            textAlign: "center",
            borderColor: "var(--color-brand-copper)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Join the <span className="text-gradient-copper">Hood Hymns</span> Community
          </h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--color-brand-muted)",
              marginBottom: "24px",
              maxWidth: "500px",
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            Get exclusive content, early chapter drops, and behind-the-scenes updates.
          </p>
          <Link
            href="/subscribe"
            className="btn-brand"
            style={{ textDecoration: "none" }}
          >
            {t.subscribeCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
