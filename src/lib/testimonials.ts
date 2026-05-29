// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — Testimonials
// ─────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  book: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Jasmine T.",
    location: "Detroit, MI",
    quote: "I grew up in a flat just like the one C.D. Howell writes about. Every page feels like coming home. This book reminded me that God was there the whole time.",
    rating: 5,
    book: "The Harmonies of Hope",
  },
  {
    id: "t2",
    name: "Marcus W.",
    location: "Atlanta, GA",
    quote: "The Prodigal Block hit different. I've been Marcus. I've made those choices. But reading about the road back gave me hope I didn't know I needed.",
    rating: 5,
    book: "The Prodigal Block",
  },
  {
    id: "t3",
    name: "Deacon Ray",
    location: "Chicago, IL",
    quote: "Finally — faith fiction that doesn't water down the streets or the sermon. C.D. Howell writes with honesty and grace. Our whole book club is hooked.",
    rating: 5,
    book: "The Harmonies of Hope",
  },
  {
    id: "t4",
    name: "Tiana M.",
    location: "Houston, TX",
    quote: "I bought this for my teenage son. He read it in two days. Said it was the first book that 'sounded like us.' That's the highest compliment.",
    rating: 5,
    book: "The Harmonies of Hope",
  },
  {
    id: "t5",
    name: "Pastor Kevin",
    location: "Detroit, MI",
    quote: "C.D. Howell captures the rhythm of Detroit — the music, the faith, the struggle. These aren't just stories. They're testimonies wrapped in fiction.",
    rating: 5,
    book: "The Prodigal Block",
  },
];
