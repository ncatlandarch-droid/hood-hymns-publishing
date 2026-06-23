import { NextResponse } from "next/server";

const GUMROAD_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;

export async function GET() {
  if (!GUMROAD_TOKEN) {
    return NextResponse.json({ error: "Gumroad token not configured" }, { status: 500 });
  }

  try {
    // Fetch products
    const productsRes = await fetch("https://api.gumroad.com/v2/products", {
      headers: { Authorization: `Bearer ${GUMROAD_TOKEN}` },
    });
    const productsData = await productsRes.json();

    // Fetch sales
    const salesRes = await fetch("https://api.gumroad.com/v2/sales", {
      headers: { Authorization: `Bearer ${GUMROAD_TOKEN}` },
    });
    const salesData = await salesRes.json();

    // Calculate totals
    const sales = salesData.sales || [];
    const totalRevenue = sales.reduce(
      (sum: number, s: { price: number }) => sum + (s.price || 0),
      0
    );
    const totalSales = sales.length;

    // Group sales by product
    const salesByProduct: Record<string, { count: number; revenue: number }> = {};
    for (const sale of sales) {
      const name = sale.product_name || "Unknown";
      if (!salesByProduct[name]) salesByProduct[name] = { count: 0, revenue: 0 };
      salesByProduct[name].count++;
      salesByProduct[name].revenue += sale.price || 0;
    }

    // Monthly revenue (last 6 months)
    const monthlyRevenue: Record<string, number> = {};
    for (const sale of sales) {
      const month = new Date(sale.created_at).toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (sale.price || 0);
    }

    return NextResponse.json({
      success: true,
      products: productsData.products || [],
      sales,
      totalRevenue: totalRevenue / 100,
      totalSales,
      salesByProduct,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Gumroad API error:", error);
    return NextResponse.json({ error: "Failed to fetch Gumroad data" }, { status: 500 });
  }
}
