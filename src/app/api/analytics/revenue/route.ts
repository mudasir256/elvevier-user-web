import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    verifyAdmin(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const db = await getDb();
    const col = db.collection("orders");

    const daily = await col.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    const topProducts = await col.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          totalQty: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 10 },
    ]).toArray();

    const topCities = await col.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: "$deliveryAddress.city",
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 10 },
    ]).toArray();

    return NextResponse.json({ daily, topProducts, topCities });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics." }, { status: 500 });
  }
}
