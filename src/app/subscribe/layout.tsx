import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe — Join the Community",
  description:
    "Join the Hood Hymns Publishing community. Get exclusive content, early book access, behind-the-scenes updates, and subscriber-only perks from C.D. Howell.",
  openGraph: {
    title: "Subscribe — Join the Community | Hood Hymns Publishing",
    description:
      "Join the Hood Hymns community for exclusive content, early access, and subscriber perks.",
    images: ["/book-harmonies-v1.png"],
  },
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
