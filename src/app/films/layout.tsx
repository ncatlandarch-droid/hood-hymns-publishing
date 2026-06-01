import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Films — Cinematic Adaptations",
  description:
    "Coming soon: cinematic adaptations of The Harmonies of Hope and The Prodigal Block. Feature films and short films from Hood Hymns Studios.",
  openGraph: {
    title: "Films — Cinematic Adaptations | Hood Hymns Publishing",
    description:
      "Coming soon: cinematic film adaptations of faith-based urban fiction from Hood Hymns Studios.",
    images: ["/harmonies-scene1.jpg"],
  },
};

export default function FilmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
