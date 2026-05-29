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
    tagline: "The debut series by C.D. Howell. A Detroit boy discovers purpose through music, faith, and family — from the two-family flat to the choir stand.",
    synopsis: `Chris is one of five siblings growing up in a lively two-family flat in the heart of Detroit. Between the laughter of cousins, the rhythms of concert band, and the sermons that shaped his soul, he discovers that music isn't just something he enjoys — it's part of his calling. The Harmonies of Hope follows Chris from elementary school to the choir stand, through moves, baptism, and the moment a youth overseer placed him in front of the choir and said, "Now direct." By C.D. Howell.`,
    upcoming: "Vol. II — The Choir Stand · Coming 2026",
    accentColor: "var(--color-brand-copper)",
  },
  {
    id: "prodigal-block",
    name: "The Prodigal Block",
    tagline: "Not everyone heard the choir the first time. A gritty redemption saga about the long road back to faith.",
    synopsis: `Marcus grew up in the same Detroit blocks. Heard the same sermons. Knew the same God. But when the streets called, he answered. The Prodigal Block follows the ones who wandered, the ones who fell, and the ones who fought their way back. Because God's GPS doesn't stop recalculating — no matter how far you drive in the wrong direction.`,
    upcoming: "Vol. II — Coming Home · Coming 2026",
    accentColor: "var(--color-brand-primary)",
  },
  {
    id: "studio-core",
    name: "Studio Merch",
    tagline: `Official merchandise from ${AUTHOR}'s Hood Hymns Studio. Limited run. Built to inspire.`,
    synopsis: "",
    upcoming: "",
    accentColor: "var(--color-brand-copper)",
  },
  {
    id: "block-to-blessing",
    name: "Block to Blessing",
    tagline: "From the streets to the sanctuary. Worn by the faithful. Built for the culture.",
    synopsis: `B2B is more than a clothing line — it's a testimony you can wear. Born from the same creative fire that fuels the books, Block to Blessing represents the journey from struggle to salvation. Premium quality. Limited drops. Faith first. Purple & copper. Always.`,
    upcoming: "B2B Summer '26 Drop · Coming Soon",
    accentColor: "#B87333",
  },
];

export const collectionsOrder = [
  "The Harmonies of Hope",
  "The Prodigal Block",
  "Studio Merch",
  "Block to Blessing",
];

export const products: Product[] = [
  // HARMONIES OF HOPE
  {
    id: "harmonies-v1-physical",
    title: "The Harmonies of Hope",
    type: "Paperback · Vol. I",
    price: "$24.99",
    image: "/book-harmonies-v1.png",
    description: `The debut novel by ${AUTHOR}. A young boy in Detroit discovers that music, faith, and family are the instruments God uses to compose your purpose. Published by Hood Hymns Publishing. 2026.`,
    collection: "The Harmonies of Hope",
  },
  {
    id: "harmonies-v1-digital",
    title: "The Harmonies of Hope",
    type: "E-Book · Vol. I",
    price: "$12.99",
    image: "/book-harmonies-v1.png",
    description: `The complete digital edition by ${AUTHOR}. DRM-free EPUB and PDF. Compatible with Kindle, Apple Books, Kobo, and all major e-readers. Delivered instantly.`,
    collection: "The Harmonies of Hope",
  },
  {
    id: "harmonies-character-tee",
    title: "Harmonies Character Tee",
    type: "Apparel · Limited Run",
    price: "$40.00",
    image: "/merch-character.png",
    description: `Premium vintage-wash black t-shirt. Original character graphic of a young trombonist from the novel — screen-printed in copper & royal purple. Runs true to size. Official ${AUTHOR} merchandise.`,
    collection: "The Harmonies of Hope",
  },
  // PRODIGAL BLOCK
  {
    id: "prodigal-v1-physical",
    title: "The Prodigal Block: Lost Frequency",
    type: "Paperback · Vol. I",
    price: "$24.99",
    image: "/book-prodigal-v1.png",
    description: `Book one of The Prodigal Block by ${AUTHOR}. Marcus chose the streets over the sanctuary — and this is the story of his long road back to grace. A gritty Detroit redemption saga. 285 pages.`,
    collection: "The Prodigal Block",
  },
  {
    id: "prodigal-v2-physical",
    title: "The Prodigal Block: Coming Home",
    type: "Paperback · Vol. II",
    price: "$24.99",
    image: "/book-prodigal-v2.png",
    description: `Book two of The Prodigal Block by ${AUTHOR}. The road back is longer than the road out. Marcus faces the hardest walk of his life — through the church doors he left behind. 310 pages.`,
    collection: "The Prodigal Block",
  },
  // STUDIO MERCH
  {
    id: "core-hoodie",
    title: "Hood Hymns Studio Hoodie",
    type: "Apparel · Premium",
    price: "$55.00",
    image: "/merch-hoodie.png",
    description: `Heavyweight 400g deep purple hoodie. Embroidered Hood Hymns Publishing logo in copper on chest. Reinforced cuffs and hem. Limited production run.`,
    collection: "Studio Merch",
  },
  {
    id: "core-tshirt",
    title: "Studio Signature Tee",
    type: "Apparel · Premium",
    price: "$35.00",
    image: "/merch-tshirt.png",
    description: `Premium 100% cotton heavyweight black tee. Official Hood Hymns Publishing studio mark in white & copper. Oversized cut. Pre-washed and pre-shrunk.`,
    collection: "Studio Merch",
  },
  {
    id: "core-snapback",
    title: "Studio Snapback",
    type: "Accessories",
    price: "$28.00",
    image: "/merch-snapback.png",
    description: `Structured 6-panel snapback in all black. Embroidered HH monogram in copper on front. Flat brim, adjustable snap closure. One size fits most.`,
    collection: "Studio Merch",
  },
  // BLOCK TO BLESSING
  {
    id: "b2b-hoodie",
    title: "B2B Logo Hoodie",
    type: "Apparel · B2B",
    price: "$55.00",
    image: "/b2b-hoodie.png",
    description: `Heavyweight 400g black hoodie with bold copper 'BLOCK TO BLESSING' across the chest. Cross emblem detail. Reinforced cuffs and hem. Oversized streetwear fit. Limited drop.`,
    collection: "Block to Blessing",
  },
  {
    id: "b2b-tee",
    title: "B2B Signature Tee",
    type: "Apparel · B2B",
    price: "$40.00",
    image: "/b2b-tee.png",
    description: `Premium heavyweight black tee featuring the B2B circular badge — copper logo with cross detail. 100% cotton. Pre-washed. Runs true to size. Official Block to Blessing.`,
    collection: "Block to Blessing",
  },
  {
    id: "b2b-cap",
    title: "B2B Embroidered Cap",
    type: "Accessories · B2B",
    price: "$30.00",
    image: "/b2b-cap.png",
    description: `Structured 6-panel snapback in deep purple. Copper embroidered B2B interlock monogram on front panel. Flat brim, adjustable snap closure. One size fits most.`,
    collection: "Block to Blessing",
  },
  {
    id: "b2b-crewneck",
    title: "B2B Classic Crewneck",
    type: "Apparel · B2B",
    price: "$50.00",
    image: "/b2b-crewneck.png",
    description: `Premium 380g black crewneck sweatshirt with subtle embroidered copper B2B interlock on the left chest. Minimal, clean, built to layer. Ribbed cuffs and waistband.`,
    collection: "Block to Blessing",
  },
  {
    id: "b2b-joggers",
    title: "B2B Joggers",
    type: "Apparel · B2B",
    price: "$45.00",
    image: "/b2b-joggers.png",
    description: `Premium cotton-blend black joggers with copper 'BLOCK TO BLESSING' branding down the left leg. Elastic cuffs, drawstring waist, zippered pockets. Matching set available with B2B Hoodie.`,
    collection: "Block to Blessing",
  },
  {
    id: "detroit-choir-tee",
    title: "Detroit Choir Tee",
    type: "Apparel · B2B",
    price: "$40.00",
    image: "/merch-detroit.png",
    description: `Premium black tee with artistic Detroit skyline and choir silhouette design in purple & copper. 'DETROIT • HOOD HYMNS' text. Urban faith meets streetwear. Official B2B.`,
    collection: "Block to Blessing",
  },
];
