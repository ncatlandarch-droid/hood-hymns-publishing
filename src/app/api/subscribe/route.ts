// ─────────────────────────────────────────────────────────────────────────────
// Mailchimp Subscribe API Route — Hood Hymns Publishing
//
// POST /api/subscribe
// Accepts { email, name?, source, interests? }
// Upserts subscriber to Mailchimp audience with merge fields and tags.
// Gracefully handles missing Mailchimp configuration (forms still work).
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface SubscribeBody {
  email: string;
  name?: string;
  source: "free-chapter" | "newsletter" | "exit-popup";
  interests?: string[];
}

const SOURCE_TAGS: Record<string, string> = {
  "free-chapter": "Free Chapter",
  newsletter: "Newsletter",
  "exit-popup": "Exit Intent",
};

export async function POST(req: NextRequest) {
  try {
    const body: SubscribeBody = await req.json();
    const { email, name, source, interests } = body;

    // ── Basic validation ────────────────────────────────────────────────────
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required." },
        { status: 400 }
      );
    }

    // ── Check Mailchimp configuration ───────────────────────────────────────
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      // Mailchimp is not configured — return success so the site works
      // during development or before Mailchimp is set up.
      console.warn("[subscribe] Mailchimp env vars not set — skipping API call.");
      return NextResponse.json({ success: true });
    }

    // ── Extract datacenter from API key (everything after the last dash) ───
    const dc = apiKey.split("-").pop();
    if (!dc) {
      console.error("[subscribe] Invalid Mailchimp API key format.");
      return NextResponse.json({ success: true });
    }

    // ── Build subscriber hash (MD5 of lowercase email) ─────────────────────
    const subscriberHash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

    // ── Build merge fields ──────────────────────────────────────────────────
    const mergeFields: Record<string, string> = {
      SOURCE: source || "website",
    };

    if (name) {
      mergeFields.FNAME = name.split(" ")[0];
      if (name.split(" ").length > 1) {
        mergeFields.LNAME = name.split(" ").slice(1).join(" ");
      }
    }

    // ── Build tags ──────────────────────────────────────────────────────────
    const tags: string[] = [];
    if (SOURCE_TAGS[source]) {
      tags.push(SOURCE_TAGS[source]);
    }
    if (interests && interests.length > 0) {
      tags.push(...interests);
    }

    // ── Upsert subscriber via PUT ───────────────────────────────────────────
    const mailchimpPayload = {
      email_address: email.toLowerCase(),
      status_if_new: "subscribed",
      status: "subscribed",
      merge_fields: mergeFields,
      ...(tags.length > 0 && {
        tags: tags,
      }),
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailchimpPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[subscribe] Mailchimp API error:", response.status, errorData);

      // If it's a compliance-related error (e.g., GDPR), still return success
      // to the user — the form experience shouldn't break.
      if (response.status === 400) {
        return NextResponse.json({ success: true });
      }

      return NextResponse.json(
        { success: false, error: "Subscription service error." },
        { status: 500 }
      );
    }

    // ── Apply tags separately (PUT doesn't handle tags reliably) ────────────
    if (tags.length > 0) {
      try {
        const tagsUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}/tags`;
        await fetch(tagsUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: tags.map((tag) => ({ name: tag, status: "active" })),
          }),
        });
      } catch (tagError) {
        // Non-critical — subscriber was still added
        console.warn("[subscribe] Failed to apply tags:", tagError);
      }
    }

    return NextResponse.json({ success: true, downloadUrl: "/ebook.pdf" });
  } catch (error) {
    console.error("[subscribe] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
