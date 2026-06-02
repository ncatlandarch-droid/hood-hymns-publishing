import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";

const SITE_URL = "https://hoodhymns.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hood Hymns Publishing — Faith-Based Urban Fiction from Detroit",
    template: "%s | Hood Hymns Publishing",
  },
  description:
    "Faith-based urban fiction from Detroit. The Harmonies of Hope and The Prodigal Block by C.D. Howell. Positive stories rooted in the streets. Available in English, Spanish & Chinese.",
  keywords: [
    "C.D. Howell",
    "Hood Hymns Publishing",
    "faith fiction",
    "urban fiction",
    "Detroit",
    "The Harmonies of Hope",
    "The Prodigal Block",
    "Block to Blessing",
    "African American fiction",
    "inspirational drama",
    "faith-based books",
    "urban literature",
  ],
  authors: [{ name: "C.D. Howell" }],
  creator: "Hood Hymns Publishing",
  publisher: "Hood Hymns Publishing",
  icons: {
    icon: [
      { url: "/favicon.ico",        sizes: "32x32",  type: "image/x-icon" },
      { url: "/favicon-16x16.png",  sizes: "16x16",  type: "image/png" },
      { url: "/favicon-32x32.png",  sizes: "32x32",  type: "image/png" },
      { url: "/favicon-96x96.png",  sizes: "96x96",  type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon-96x96.png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Hood Hymns",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Hood Hymns Publishing — Faith-Based Urban Fiction from Detroit",
    description:
      "Faith-based urban fiction from Detroit by C.D. Howell. The Harmonies of Hope and The Prodigal Block — positive stories rooted in the streets.",
    url: SITE_URL,
    siteName: "Hood Hymns Publishing",
    images: [
      {
        url: "/book-harmonies-v1.png",
        width: 800,
        height: 1200,
        alt: "The Harmonies of Hope — Book Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hood Hymns Publishing — Faith-Based Urban Fiction from Detroit",
    description:
      "Faith-based urban fiction from Detroit by C.D. Howell. Positive stories rooted in the streets.",
    images: ["/book-harmonies-v1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ── JSON-LD Structured Data ── */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hood Hymns Publishing",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Faith-based urban fiction publisher from Detroit. Positive stories rooted in the streets.",
    founder: {
      "@type": "Person",
      name: "C.D. Howell",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "The Harmonies of Hope",
    author: { "@type": "Person", name: "C.D. Howell" },
    publisher: { "@type": "Organization", name: "Hood Hymns Publishing" },
    genre: ["Urban Fiction", "Faith-Based Fiction", "African American Fiction"],
    bookFormat: "https://schema.org/Paperback",
    isbn: "",
    numberOfPages: 285,
    inLanguage: ["en", "es", "zh"],
    image: `${SITE_URL}/book-harmonies-v1.png`,
    url: `${SITE_URL}/store`,
    description:
      "A faith-based urban fiction novel set in Detroit. The Harmonies of Hope follows the journey of redemption, community, and faith.",
    offers: {
      "@type": "Offer",
      price: "24.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/store`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "The Prodigal Block",
    author: { "@type": "Person", name: "C.D. Howell" },
    publisher: { "@type": "Organization", name: "Hood Hymns Publishing" },
    genre: ["Urban Fiction", "Faith-Based Fiction", "African American Fiction"],
    bookFormat: "https://schema.org/Paperback",
    isbn: "",
    numberOfPages: 310,
    inLanguage: ["en", "es", "zh"],
    image: `${SITE_URL}/book-prodigal-v1.png`,
    url: `${SITE_URL}/store`,
    description:
      "The Prodigal Block — a story of return, redemption, and the power of community. Faith-based urban fiction from Detroit by C.D. Howell.",
    offers: {
      "@type": "Offer",
      price: "24.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/store`,
    },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="noise-overlay">
        <I18nProvider>
          <Navbar />
          <main style={{ minHeight: "100vh" }}>{children}</main>
          <Footer />
          <ExitIntentPopup />
        </I18nProvider>
      </body>
    </html>
  );
}
