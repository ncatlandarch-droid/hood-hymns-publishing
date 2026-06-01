import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Chapter — The Harmonies of Hope",
  description:
    "Read Chapter One of The Harmonies of Hope for free. Enter your email and dive into faith-based urban fiction from Detroit by C.D. Howell.",
  openGraph: {
    title: "Free Chapter — The Harmonies of Hope | Hood Hymns Publishing",
    description:
      "Read Chapter One of The Harmonies of Hope for free. Faith-based urban fiction from Detroit.",
    images: ["/book-harmonies-v1.png"],
  },
};

export default function FreeChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
