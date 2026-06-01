import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store — Books, Merch & B2B",
  description:
    "Shop The Harmonies of Hope, The Prodigal Block, Block to Blessing merch, and bulk B2B orders. Faith-based urban fiction and streetwear from Hood Hymns Publishing.",
  openGraph: {
    title: "Store — Books, Merch & B2B | Hood Hymns Publishing",
    description:
      "Shop faith-based urban fiction books, Block to Blessing merch, and B2B bulk orders from Hood Hymns Publishing.",
    images: ["/book-harmonies-v1.png"],
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
