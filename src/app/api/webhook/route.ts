import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Stripe Webhook → Printful Auto-Fulfillment
 * 
 * When a Stripe checkout completes, this webhook:
 * 1. Verifies the Stripe signature
 * 2. Extracts product and shipping info
 * 3. Creates a Printful order for fulfillment
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    // If webhook secret is configured, verify signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err) {
        console.error("[webhook] Signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // Development mode — parse without verification
      event = JSON.parse(body) as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const session = event.data.object as any;
      console.log(`[webhook] Checkout completed: ${session.id}`);

      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const shipping = session.shipping_details || session.shipping;

      if (!shipping?.address) {
        console.log("[webhook] No shipping address — digital product, skipping Printful");
        return NextResponse.json({ received: true });
      }

      // Create Printful order
      const printfulKey = process.env.PRINTFUL_API_KEY;
      const printfulStoreId = process.env.PRINTFUL_STORE_ID;

      if (!printfulKey) {
        console.error("[webhook] PRINTFUL_API_KEY not set");
        return NextResponse.json({ received: true, warning: "No Printful key" });
      }

      const printfulOrder = {
        recipient: {
          name: shipping.name || session.customer_details?.name || "Customer",
          address1: shipping.address.line1,
          address2: shipping.address.line2 || undefined,
          city: shipping.address.city,
          state_code: shipping.address.state,
          country_code: shipping.address.country,
          zip: shipping.address.postal_code,
          email: session.customer_details?.email,
        },
        items: lineItems.data.map((item) => ({
          // Map Stripe product to Printful sync variant
          // This uses the product metadata we set during creation
          external_id: item.price?.product as string,
          quantity: item.quantity || 1,
          retail_price: ((item.amount_total || 0) / 100).toFixed(2),
        })),
      };

      const headers: Record<string, string> = {
        Authorization: `Bearer ${printfulKey}`,
        "Content-Type": "application/json",
      };
      if (printfulStoreId) {
        headers["X-PF-Store-Id"] = printfulStoreId;
      }

      const printfulRes = await fetch("https://api.printful.com/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(printfulOrder),
      });

      const printfulData = await printfulRes.json();

      if (printfulData.code === 200) {
        console.log(`[webhook] ✅ Printful order created: ${printfulData.result?.id}`);
      } else {
        console.error(`[webhook] ⚠️ Printful order failed:`, printfulData);
        // Don't return error to Stripe — payment was already collected
        // Log for manual fulfillment
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
