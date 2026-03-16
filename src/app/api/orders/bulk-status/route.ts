import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    verifyAdmin(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const { orderIds, status } = await request.json();
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "No orders selected." }, { status: 400 });
    }
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const ids = orderIds.map((id: string) => new ObjectId(id));
    const db = await getDb();
    const result = await db.collection("orders").updateMany(
      { _id: { $in: ids } },
      { $set: { status, updatedAt: new Date() } }
    );
    return NextResponse.json({
      message: `${result.modifiedCount} order(s) updated.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Bulk status error:", err);
    return NextResponse.json({ error: "Failed to update orders." }, { status: 500 });
  }
}
