import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET(
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
    const db = await getDb();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error("Fetch order error:", err);
    return NextResponse.json({ error: "Failed to fetch order." }, { status: 500 });
  }
}

export async function DELETE(
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
    const db = await getDb();
    const result = await db.collection("orders").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ message: "Order deleted." });
  } catch (err) {
    console.error("Delete order error:", err);
    return NextResponse.json({ error: "Failed to delete order." }, { status: 500 });
  }
}
