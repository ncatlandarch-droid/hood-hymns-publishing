"use client";

import { useI18n } from "@/context/I18nContext";
import ShortsCard, { ShortClip } from "@/components/ui/ShortsCard";

export default function ContentPage() {
  const { t } = useI18n();

  // Clips are defined inside the component so titles/categories use i18n
  const clips: ShortClip[] = [
    {
      id: "bts-1",
      title: t.clipTitle1,
      thumbnail: "/harmonies-scene1.jpg",
      duration: "0:58",
      category: t.clipCatBehindScenes,
    },
    {
      id: "bts-2",
      title: t.clipTitle2,
      thumbnail: "/prodigal-scene1.jpg",
      duration: "1:24",
      category: t.clipCatOnLocation,
    },
    {
      id: "bts-3",
      title: t.clipTitle3,
      thumbnail: "/harmonies-scene2.jpg",
      duration: "2:10",
      category: t.clipCatAuthorTalk,
    },
    {
      id: "bts-4",
      title: t.clipTitle4,
      thumbnail: "/prodigal-scene2.jpg",
      duration: "3:45",
      category: t.clipCatWritingProcess,
    },
    {
      id: "bts-5",
      title: t.clipTitle5,
      thumbnail: "/harmonies-scene1.jpg",
      duration: "1:15",
      category: t.clipCatBrand,
    },
    {
      id: "bts-6",
      title: t.clipTitle6,
      thumbnail: "/prodigal-scene2.jpg",
      duration: "2:30",
      category: t.clipCatStudio,
    },
  ];

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
            {t.hoodHymnsTag}
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
