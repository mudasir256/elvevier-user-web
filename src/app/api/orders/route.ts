import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    verifyAdmin(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { "contact.email": { $regex: search, $options: "i" } },
        { "deliveryAddress.firstName": { $regex: search, $options: "i" } },
        { "deliveryAddress.lastName": { $regex: search, $options: "i" } },
        { "deliveryAddress.phone": { $regex: search, $options: "i" } },
        { "deliveryAddress.city": { $regex: search, $options: "i" } },
      ];
    }

    const db = await getDb();
    const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
