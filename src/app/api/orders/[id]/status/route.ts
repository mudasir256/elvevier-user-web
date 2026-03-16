import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const { status } = await request.json();
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const db = await getDb();
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ message: "Status updated.", status });
  } catch (err) {
    console.error("Update status error:", err);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
