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
    const search = searchParams.get("search");

    const pipeline: Record<string, unknown>[] = [
      {
        $group: {
          _id: "$contact.email",
          firstName: { $first: "$deliveryAddress.firstName" },
          lastName: { $first: "$deliveryAddress.lastName" },
          phone: { $first: "$deliveryAddress.phone" },
          city: { $first: "$deliveryAddress.city" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          lastOrder: { $max: "$createdAt" },
        },
      },
      { $sort: { lastOrder: -1 } },
    ];
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { "contact.email": { $regex: search, $options: "i" } },
            { "deliveryAddress.firstName": { $regex: search, $options: "i" } },
            { "deliveryAddress.lastName": { $regex: search, $options: "i" } },
            { "deliveryAddress.phone": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    const db = await getDb();
    const customers = await db.collection("orders").aggregate(pipeline).toArray();
    return NextResponse.json(customers);
  } catch (err) {
    console.error("Customers error:", err);
    return NextResponse.json({ error: "Failed to fetch customers." }, { status: 500 });
  }
}
