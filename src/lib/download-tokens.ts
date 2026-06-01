// ─────────────────────────────────────────────────────────────────────────────
// Hood Hymns Publishing — Download Token Manager
//
// In-memory token store for ebook download delivery.
// Tokens are single-use (up to 3 downloads) and expire after 24 hours.
//
// NOTE: In-memory storage resets on server restart. For production scale,
// replace with a database-backed store (e.g., Firebase, Postgres).
// ─────────────────────────────────────────────────────────────────────────────

import { randomUUID } from "crypto";

interface TokenRecord {
  /** Identifier for the ebook file (maps to a filename in /public/ebooks/) */
  fileId: string;
  /** ISO timestamp when the token expires */
  expiresAt: number;
  /** Number of times this token has been used to download */
  downloadCount: number;
  /** Maximum downloads allowed */
  maxDownloads: number;
}

/** In-memory token store */
const tokenStore = new Map<string, TokenRecord>();

/** Token lifetime: 24 hours in milliseconds */
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** Maximum downloads per token */
const MAX_DOWNLOADS = 3;

/**
 * Generate a new download token for an ebook.
 * @param fileId – The ebook file identifier (e.g., "harmonies-of-hope")
 * @returns The generated token string
 */
export function generateDownloadToken(fileId: string): string {
  const token = randomUUID();
  tokenStore.set(token, {
    fileId,
    expiresAt: Date.now() + TOKEN_TTL_MS,
    downloadCount: 0,
    maxDownloads: MAX_DOWNLOADS,
  });

  // Cleanup expired tokens periodically (simple garbage collection)
  pruneExpiredTokens();

  return token;
}

/**
 * Validate a download token and increment its usage counter.
 * @returns The fileId if valid, or null if invalid/expired/exhausted
 */
export function consumeDownloadToken(token: string): string | null {
  const record = tokenStore.get(token);

  if (!record) return null;

  // Check expiration
  if (Date.now() > record.expiresAt) {
    tokenStore.delete(token);
    return null;
  }

  // Check download limit
  if (record.downloadCount >= record.maxDownloads) {
    return null;
  }

  // Increment and return
  record.downloadCount += 1;
  return record.fileId;
}

/**
 * Remove all expired tokens from the store.
 */
function pruneExpiredTokens(): void {
  const now = Date.now();
  for (const [key, record] of tokenStore.entries()) {
    if (now > record.expiresAt) {
      tokenStore.delete(key);
    }
  }
}
