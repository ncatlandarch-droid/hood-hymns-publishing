import { Product } from "@/components/ui/ProductCard";

export const AUTHOR = "C.D. Howell";

export interface SeriesMeta {
  id: string;
  name: string;
  tagline: string;
  synopsis: string;
  upcoming: string;
  accentColor: string;
}

export const seriesList: SeriesMeta[] = [
  {
    id: "harmonies-of-hope",
    name: "The Harmonies of Hope",
    tagline: "Series One — A Hood Hymns Publishing Original. A Detroit boy discovers purpose through music, faith, and family — from the two-family flat to the choir stand.",
    synopsis: `James is one of five siblings growing up in a lively two-family flat in the heart of Detroit. Between the laughter of cousins, the rhythms of concert band, and the sermons that shaped his soul, he discovers that music isn't just something he enjoys — it's part of his calling. The Harmonies of Hope follows James from elementary school to the choir stand, through moves, baptism, and the moment a youth overseer placed him in front of the choir and said, "Now direct." By C.D. Howell.`,
    upcoming: "Vol. II — The Choir Stand · Coming 2026",
    accentColor: "var(--color-brand-copper)",
  },
  {
    id: "prodigal-block",
    name: "The Prodigal Block",
    tagline: "Series Two — A Hood Hymns Publishing Original. Not everyone heard the choir the first time. A gritty redemption saga about the long road back to faith.",
    synopsis: `Marcus grew up in the same Detroit blocks. Heard the same sermons. Knew the same God. But when the streets called, he answered. The Prodigal Block follows the ones who wandered, the ones who fell, and the ones who fought their way back. Because God's GPS doesn't stop recalculating — no matter how far you drive in the wrong direction.`,
    upcoming: "Vol. II — Coming Home · Coming 2026  |  Vol. III — Planned",
    accentColor: "var(--color-brand-primary)",
  },
  {
    id: "apparel",
    name: "Hood Hymns Apparel",
    tagline: "Official garment-dyed heavyweight tees from Hood Hymns Publishing & Block to Blessing. Faith-forward streetwear. Limited runs.",
    synopsis: `Premium garment-dyed heavyweight tees featuring Hood Hymns Publishing and Block to Blessing designs. Each shirt is a testimony you can wear — born from the same creative fire that fuels the books. Copper & purple. Always.`,
    upcoming: "More styles dropping Summer '26",
    accentColor: "#B87333",
  },
];

export const collectionsOrder = [
  "The Harmonies of Hope",
  "The Prodigal Block",
  "Hood Hymns Apparel",
];

export const products: Product[] = [
  // ── HARMONIES OF HOPE (Books) ──
  {
    id: "harmonies-v1-physical",
    title: "The Harmonies of Hope",
    type: "Paperback · Vol. I",
    price: "$24.99",
    image: "/book-harmonies-v1.png",
    description: `The debut novel by ${AUTHOR}. A young boy in Detroit discovers that music, faith, and family are the instruments God uses to compose your purpose. Published by Hood Hymns Publishing. 2026.`,
    collection: "The Harmonies of Hope",
    productType: "physical",
  },
  {
    id: "harmonies-v1-digital",
    title: "The Harmonies of Hope",
    type: "E-Book · Vol. I",
    price: "$12.99",
    image: "/book-harmonies-v1.png",
    description: `The complete digital edition by ${AUTHOR}. DRM-free EPUB and PDF. Compatible with Kindle, Apple Books, Kobo, and all major e-readers. Delivered instantly.`,
    collection: "The Harmonies of Hope",
    productType: "digital",
  },

  // ── PRODIGAL BLOCK (Books) ──
  {
    id: "prodigal-v1-physical",
    title: "The Prodigal Block: Lost Frequency",
    type: "Paperback · Vol. I",
    price: "$24.99",
    image: "/book-prodigal-v1.png",
    description: `Book one of The Prodigal Block by ${AUTHOR}. Marcus chose the streets over the sanctuary — and this is the story of his long road back to grace. A gritty Detroit redemption saga. 285 pages.`,
    collection: "The Prodigal Block",
    productType: "physical",
  },
  {
    id: "prodigal-v1-coming-soon-digital",
    title: "The Prodigal Block: Lost Frequency — Digital Edition",
    type: "E-Book · Vol. I",
    price: "$9.99",
    image: "/book-prodigal-v1.png",
    description: `The Prodigal Block in digital format by ${AUTHOR}. DRM-free PDF. Read on any device. A raw Detroit redemption saga — coming soon to instant download.`,
    collection: "The Prodigal Block",
    productType: "digital",
  },
  {
    id: "prodigal-v2-physical",
    title: "The Prodigal Block: Coming Home",
    type: "Paperback · Vol. II",
    price: "$24.99",
    image: "/book-prodigal-v2.png",
    description: `Book two of The Prodigal Block by ${AUTHOR}. The road back is longer than the road out. Marcus faces the hardest walk of his life — through the church doors he left behind. 310 pages.`,
    collection: "The Prodigal Block",
    productType: "physical",
  },

  // ── HOOD HYMNS APPAREL (Only real Printful Quickstore products) ──
  {
    id: "core-tshirt",
    title: "Studio Signature Tee",
    type: "Garment-Dyed Heavyweight · HH Logo",
    price: "$20.00",
    image: "/merch-real/merch-real-tshirt.png",
    description: `Premium garment-dyed heavyweight tee. Official Hood Hymns Publishing logo — open book, cross, and HH monogram in copper & white. Pre-shrunk, runs true to size.`,
    collection: "Hood Hymns Apparel",
    paymentLink: "https://hood-hymns-publishing.printful.me/",
    productType: "physical",
  },
  {
    id: "harmonies-character-tee",
    title: "Harmonies Character Tee",
    type: "Garment-Dyed Heavyweight · Character Art",
    price: "$20.00",
    image: "/merch-real/merch-real-character.png",
    description: `Premium garment-dyed heavyweight tee. Original character graphic of a young trombonist from the novel — screen-printed in copper & royal purple. Official ${AUTHOR} merchandise.`,
    collection: "Hood Hymns Apparel",
    paymentLink: "https://hood-hymns-publishing.printful.me/",
    productType: "physical",
  },
  {
    id: "b2b-tee",
    title: "B2B Signature Tee",
    type: "Garment-Dyed Heavyweight · Block to Blessing",
    price: "$25.00",
    image: "/merch-real/merch-real-b2b-tee.png",
    description: `Premium garment-dyed heavyweight tee featuring the B2B circular badge — copper logo with cross detail. Block to Blessing. Faith first. Runs true to size.`,
    collection: "Hood Hymns Apparel",
    paymentLink: "https://hood-hymns-publishing.printful.me/",
    productType: "physical",
  },
  {
    id: "detroit-choir-tee",
    title: "Detroit Choir Tee",
    type: "Garment-Dyed Heavyweight · Detroit",
    price: "$25.00",
    image: "/merch-real/merch-real-detroit.png",
    description: `Premium garment-dyed heavyweight tee with artistic Detroit skyline and choir silhouette design in purple & copper. 'DETROIT • HOOD HYMNS' text. Urban faith meets streetwear.`,
    collection: "Hood Hymns Apparel",
    paymentLink: "https://hood-hymns-publishing.printful.me/",
    productType: "physical",
  },
];
