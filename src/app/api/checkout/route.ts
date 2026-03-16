import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const {
      email, firstName, lastName, address, apartment,
      city, state, postalCode, phone, orderItems, subtotal, shipping, total,
    } = await request.json();

    if (!email || !firstName || !lastName || !address || !city || !phone) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const order = {
      contact: { email },
      deliveryAddress: {
        firstName, lastName, address,
        apartment: apartment || "",
        city, state: state || "", postalCode: postalCode || "", phone,
      },
      orderItems: orderItems || [],
      subtotal,
      shipping: shipping || "Free",
      total,
      status: "pending",
      notes: [],
      createdAt: new Date(),
    };

    const db = await getDb();
    const result = await db.collection("orders").insertOne(order);
    return NextResponse.json(
      { message: "Order placed successfully!", orderId: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to place order. Please try again." }, { status: 500 });
  }
}
