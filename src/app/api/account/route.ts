import { NextResponse } from "next/server";
import { getCustomer, unauthorized } from "@/lib/customerAuth";
import { getSupabase } from "@/lib/supabase";
import { toOrder, type OrderRow } from "@/lib/orders";

export async function GET(request: Request) {
  const customer = await getCustomer(request);
  if (!customer) return unauthorized();

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("email", customer.email)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const orders = ((data ?? []) as OrderRow[]).map((row) => {
      const order = toOrder(row);
      return {
        _id: order._id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        orderItems: order.orderItems,
      };
    });

    return NextResponse.json({ user: customer, orders });
  } catch (err) {
    console.error("Account orders error:", err);
    return NextResponse.json({ error: "Could not load your orders." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const customer = await getCustomer(request);
  if (!customer) return unauthorized();

  try {
    const name = String((await request.json()).name ?? "").trim();
    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    const supabase = getSupabase();
    const updated = await supabase.auth.admin.updateUserById(customer.id, {
      user_metadata: { name },
    });
    if (updated.error) throw updated.error;

    await supabase.from("profiles").update({ name }).eq("id", customer.id);

    return NextResponse.json({ user: { ...customer, name } });
  } catch (err) {
    console.error("Update name error:", err);
    return NextResponse.json({ error: "Could not update your name." }, { status: 500 });
  }
}
