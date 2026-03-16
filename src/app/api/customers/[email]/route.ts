import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    verifyAdmin(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const { email: rawEmail } = await params;
    const email = decodeURIComponent(rawEmail);
    const db = await getDb();
    const orders = await db.collection("orders").find({ "contact.email": email }).sort({ createdAt: -1 }).toArray();
    if (orders.length === 0) return NextResponse.json({ error: "Customer not found." }, { status: 404 });

    const customer = {
      email,
      firstName: orders[0].deliveryAddress.firstName,
      lastName: orders[0].deliveryAddress.lastName,
      phone: orders[0].deliveryAddress.phone,
      address: orders[0].deliveryAddress.address,
      city: orders[0].deliveryAddress.city,
      state: orders[0].deliveryAddress.state,
      postalCode: orders[0].deliveryAddress.postalCode,
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum: number, o) => sum + (o.total || 0), 0),
      orders,
    };
    return NextResponse.json(customer);
  } catch (err) {
    console.error("Customer detail error:", err);
    return NextResponse.json({ error: "Failed to fetch customer." }, { status: 500 });
  }
}
