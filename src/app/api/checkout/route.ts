import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateDownloadToken } from "@/lib/download-tokens";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });

    const body = await req.json();
    const { id, title, price, image, type } = body as {
      id: string;
      title: string;
      price: string;
      image: string;
      type?: "physical" | "digital";
    };

    if (!id || !title || !price) {
      return NextResponse.json(
        { error: "Missing required fields: id, title, and price are required." },
        { status: 400 }
      );
    }

    // Convert "$24.99" → 2499 (cents)
    const unitAmount = Math.round(
      parseFloat(price.replace(/[^0-9.]/g, "")) * 100
    );

    if (isNaN(unitAmount) || unitAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid price format." },
        { status: 400 }
      );
    }

    // Build absolute image URL for Stripe
    const origin = req.nextUrl.origin;
    const images: string[] = [];
    if (image) {
      const absoluteImage = image.startsWith("http")
        ? image
        : `${origin}${image.startsWith("/") ? "" : "/"}${image}`;
      images.push(absoluteImage);
    }

    const isDigital = type === "digital";

    // For digital products, generate a download token to include in the success URL
    let successUrl: string;
    if (id.includes("audiobook")) {
      // Audiobook: redirect back to audiobook page with unlock param
      successUrl = `${origin}/audiobook?purchased=audiobook`;
    } else if (isDigital) {
      // Map product IDs to ebook file IDs
      const fileIdMap: Record<string, string> = {
        "harmonies-v1-digital": "harmonies-of-hope",
        "harmonies-v1-digital-deal": "harmonies-of-hope",
      };
      const fileId = fileIdMap[id] ?? "harmonies-of-hope";
      const downloadToken = generateDownloadToken(fileId);
      successUrl = `${origin}/ebook-success?token=${downloadToken}`;
    } else {
      successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              images,
              metadata: { productId: id, productType: type ?? "physical" },
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      // Digital products don't need shipping address collection
      ...(isDigital
        ? {}
        : {
            shipping_address_collection: {
              allowed_countries: ["US", "CA", "GB", "AU"],
            },
          }),
      success_url: successUrl,
      cancel_url: `${origin}/store`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[checkout] Stripe error:", err);

    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : "An unexpected error occurred. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
