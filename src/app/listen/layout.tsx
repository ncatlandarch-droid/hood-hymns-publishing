import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch & Listen — Audio Narrations",
  description:
    "Experience cinematic audio narrations of The Harmonies of Hope and The Prodigal Block. Immersive book trailers and chapter excerpts from Hood Hymns Publishing.",
  openGraph: {
    title: "Watch & Listen — Audio Narrations | Hood Hymns Publishing",
    description:
      "Cinematic audio narrations and book trailers for The Harmonies of Hope and The Prodigal Block.",
    images: ["/harmonies-scene1.jpg"],
  },
};

export default function ListenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
