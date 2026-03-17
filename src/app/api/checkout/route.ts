import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const {
      email, firstName, lastName, address, apartment,
      city, state, postalCode, phone, orderItems,
      subtotal, shipping, total, paymentMethod,
    } = await request.json();

    if (!email || !firstName || !lastName || !address || !city || !phone) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const order = {
      contact: { email: email.toLowerCase().trim() },
      deliveryAddress: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        apartment: (apartment || "").trim(),
        city: city.trim(),
        state: (state || "").trim(),
        postalCode: (postalCode || "").trim(),
        phone: phone.trim(),
      },
      orderItems,
      subtotal: Number(subtotal),
      shipping: shipping || "Free",
      total: Number(total),
      paymentMethod: paymentMethod || "cod",
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
