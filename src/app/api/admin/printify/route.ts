import { NextResponse } from "next/server";

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = "28018533";

export async function GET() {
  if (!PRINTIFY_TOKEN) {
    return NextResponse.json({ error: "Printify token not configured" }, { status: 500 });
  }

  try {
    // Fetch products
    const productsRes = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/products.json`,
      { headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` } }
    );
    const productsData = await productsRes.json();
    const products = productsData.data || [];

    // Fetch orders
    const ordersRes = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`,
      { headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` } }
    );
    const ordersData = await ordersRes.json();
    const orders = ordersData.data || [];

    // Calculate order stats
    const totalOrders = orders.length;
    const ordersByStatus: Record<string, number> = {};
    for (const order of orders) {
      const status = order.status || "unknown";
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    }

    // Product summary
    const productSummary = products.map((p: { id: string; title: string; images?: { src: string }[]; variants?: { price: number; is_enabled: boolean }[] }) => ({
      id: p.id,
      title: p.title,
      image: p.images?.[0]?.src || null,
      variants: p.variants?.filter((v: { is_enabled: boolean }) => v.is_enabled).length || 0,
      minPrice: p.variants?.length
        ? Math.min(...p.variants.filter((v: { is_enabled: boolean }) => v.is_enabled).map((v: { price: number }) => v.price)) / 100
        : 0,
    }));

    return NextResponse.json({
      success: true,
      products: productSummary,
      totalProducts: products.length,
      orders,
      totalOrders,
      ordersByStatus,
    });
  } catch (error) {
    console.error("Printify API error:", error);
    return NextResponse.json({ error: "Failed to fetch Printify data" }, { status: 500 });
  }
}
