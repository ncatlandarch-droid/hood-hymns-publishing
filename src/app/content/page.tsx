"use client";

import { useI18n } from "@/context/I18nContext";
import ShortsCard, { ShortClip } from "@/components/ui/ShortsCard";

const clips: ShortClip[] = [
  {
    id: "bts-1",
    title: "The Two-Family Flat — Behind the Story",
    thumbnail: "/harmonies-scene1.jpg",
    duration: "0:58",
    category: "Behind the Scenes",
  },
  {
    id: "bts-2",
    title: "Detroit Streets: Filming Locations",
    thumbnail: "/prodigal-scene1.jpg",
    duration: "1:24",
    category: "On Location",
  },
  {
    id: "bts-3",
    title: "Faith & Music — Author's Reflection",
    thumbnail: "/harmonies-scene2.jpg",
    duration: "2:10",
    category: "Author Talk",
  },
  {
    id: "bts-4",
    title: "Writing The Prodigal Block — Process",
    thumbnail: "/prodigal-scene2.jpg",
    duration: "3:45",
    category: "Writing Process",
  },
  {
    id: "bts-5",
    title: "Block to Blessing — Brand Story",
    thumbnail: "/harmonies-scene1.jpg",
    duration: "1:15",
    category: "Brand",
  },
  {
    id: "bts-6",
    title: "Hood Hymns Studio Tour",
    thumbnail: "/prodigal-scene1.jpg",
    duration: "2:30",
    category: "Studio",
  },
];

export default function ContentPage() {
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
            Hood Hymns
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {t.contentTitle}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-brand-muted)", maxWidth: "600px", margin: "0 auto" }}>
            {t.contentSubtitle}
          </p>
          <div className="copper-divider" style={{ marginTop: "24px" }} />
        </div>

        {/* Clips grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {clips.map((clip) => (
            <ShortsCard key={clip.id} clip={clip} />
          ))}
        </div>
      </div>
    </div>
  );
}
