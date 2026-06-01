// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — Ebook Delivery API
//
// GET /api/deliver-ebook?token=<download-token>
//
// Validates a one-time download token and serves the ebook PDF.
// Tokens expire after 24 hours and allow up to 3 downloads.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { consumeDownloadToken } from "@/lib/download-tokens";
import { readFile } from "fs/promises";
import path from "path";

/** Map of fileId → actual filename in /public/ebooks/ */
const FILE_MAP: Record<string, string> = {
  "harmonies-of-hope": "harmonies-of-hope.pdf",
};

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing download token." },
      { status: 400 }
    );
  }

  // Validate and consume the token
  const fileId = consumeDownloadToken(token);

  if (!fileId) {
    return NextResponse.json(
      { error: "Invalid, expired, or exhausted download link. Please purchase again or contact support." },
      { status: 403 }
    );
  }

  // Resolve the file
  const fileName = FILE_MAP[fileId];
  if (!fileName) {
    return NextResponse.json(
      { error: "Ebook file not found." },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), "public", "ebooks", fileName);

  try {
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": fileBuffer.byteLength.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    console.error(`[deliver-ebook] File not found: ${filePath}`);
    return NextResponse.json(
      { error: "Ebook file could not be loaded. Please contact support." },
      { status: 500 }
    );
  }
}
