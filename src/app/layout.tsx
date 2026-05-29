import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";

export const metadata: Metadata = {
  title: "Hood Hymns Publishing — Positive Stories Rooted in the Streets",
  description:
    "Faith-based urban fiction from Detroit. The Harmonies of Hope and The Prodigal Block by C.D. Howell. Published by Hood Hymns Publishing. Positive stories rooted in the streets.",
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
  ],
  openGraph: {
    title: "Hood Hymns Publishing — Positive Stories Rooted in the Streets",
    description: "Hood Hymns Publishing — Faith-based urban fiction from Detroit by C.D. Howell. Positive stories rooted in the streets.",
    type: "website",
  },
};

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
