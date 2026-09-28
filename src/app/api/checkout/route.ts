import { NextResponse } from "next/server";
import { getCustomer } from "@/lib/customerAuth";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const customer = await getCustomer(request);
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

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        address: address.trim(),
        apartment: (apartment || "").trim(),
        city: city.trim(),
        state: (state || "").trim(),
        postal_code: (postalCode || "").trim(),
        phone: phone.trim(),
        user_id: customer?.id ?? null,
        order_items: orderItems,
        subtotal: Number(subtotal),
        shipping: shipping || "Free",
        total: Number(total),
        payment_method: paymentMethod || "cod",
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Order placed successfully!", orderId: data.id },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
