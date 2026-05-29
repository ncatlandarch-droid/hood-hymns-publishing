import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
    const { id, title, price, image } = body as {
      id: string;
      title: string;
      price: string;
      image: string;
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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              images,
              metadata: { productId: id },
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
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
