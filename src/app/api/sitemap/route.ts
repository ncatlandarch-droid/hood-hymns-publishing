import { NextResponse } from "next/server";

const SITE_URL = "https://hood-hymns-publishing.netlify.app";

const pages = [
  { url: "/",             priority: "1.0", changefreq: "weekly"  },
  { url: "/store",        priority: "0.9", changefreq: "weekly"  },
  { url: "/free-chapter", priority: "0.85",changefreq: "monthly" },
  { url: "/listen",       priority: "0.8", changefreq: "monthly" },
  { url: "/about",        priority: "0.8", changefreq: "monthly" },
  { url: "/audiobook",    priority: "0.75",changefreq: "monthly" },
  { url: "/films",        priority: "0.75",changefreq: "monthly" },
  { url: "/subscribe",    priority: "0.7", changefreq: "monthly" },
  { url: "/content",      priority: "0.7", changefreq: "weekly"  },
];

export function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
