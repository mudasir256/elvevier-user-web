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
    const db = await getDb();
    const col = db.collection("orders");
    const [totalOrders, statuses, revenueAgg] = await Promise.all([
      col.countDocuments(),
      col.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
      col.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, revenue: { $sum: "$total" } } },
      ]).toArray(),
    ]);
    const statusCounts: Record<string, number> = {};
    statuses.forEach((s) => (statusCounts[s._id as string] = s.count));
    return NextResponse.json({ totalOrders, revenue: revenueAgg[0]?.revenue || 0, statusCounts });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
