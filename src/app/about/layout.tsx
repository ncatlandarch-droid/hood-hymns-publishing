import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About C.D. Howell — Author, Musician, Storyteller",
  description:
    "Meet C.D. Howell — the Detroit-born author, musician, and storyteller behind Hood Hymns Publishing. Learn about his journey from the streets to faith-based fiction.",
  openGraph: {
    title: "About C.D. Howell — Author, Musician, Storyteller",
    description:
      "Meet C.D. Howell — Detroit-born author behind The Harmonies of Hope and The Prodigal Block.",
    images: ["/author-photo.jpg"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
