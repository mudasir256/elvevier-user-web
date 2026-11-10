import { NextResponse, after } from "next/server";
import { getCustomer } from "@/lib/customerAuth";
import { reserveStock, restoreStock } from "@/lib/stock";
import { getSupabase } from "@/lib/supabase";
import { sendNewOrderAlert, sendOrderConfirmation, type OrderEmail } from "@/lib/email";
import { PAUSED_NOTICE, PRODUCTS_PAUSED } from "@/lib/storeStatus";
import { checkPromo, cleanCode, serverPricedLines } from "@/lib/promo";
import type { OrderItem } from "@/lib/orders";
import { shippingFor } from "@/lib/shipping";

export async function POST(request: Request) {
  if (PRODUCTS_PAUSED) {
    return NextResponse.json({ error: `${PAUSED_NOTICE.title}. ${PAUSED_NOTICE.text}` }, { status: 507 });
  }
  try {
    const customer = await getCustomer(request);
    const {
      email, firstName, lastName, address, apartment,
      city, state, postalCode, phone, orderItems,
      subtotal, promoCode,
    } = await request.json();

    if (!email || !firstName || !lastName || !address || !city || !phone) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // Every order is priced on the server from the database prices, including product sales and
    // the store-wide sale, so a discount can neither be faked nor missed.
    const server = await serverPricedLines(orderItems as (OrderItem & { productId?: string })[]);
    if (server === null) {
      return NextResponse.json({ error: "Your cart has changed. Please refresh the page." }, { status: 400 });
    }
    // The shopper must see the price they pay. If a sale started or ended while the page was open,
    // ask them to look again instead of charging a different amount.
    if (Number.isFinite(Number(subtotal)) && Number(subtotal) !== server.subtotal) {
      return NextResponse.json(
        { error: "Prices in your cart have just been updated. Please refresh the page to see the latest prices.", code: "PRICES_CHANGED" },
        { status: 409 }
      );
    }
    const pricedItems = server.lines;
    let discount = 0;
    let promo: { promo_code: string; discount: number } | null = null;
    if (cleanCode(promoCode)) {
      const result = await checkPromo({ code: promoCode, subtotal: server.subtotal, email, phone });
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
      discount = result.discount;
      promo = { promo_code: result.promo.code, discount };
    }
    const fee = shippingFor(server.subtotal);
    const priced = {
      subtotal: server.subtotal,
      shipping: fee === 0 ? "Free" : `Rs. ${fee}`,
      total: server.subtotal - discount + fee,
    };

    const stock = await reserveStock(
      orderItems.map((item: { productId?: string; size?: string; color?: string; variant?: string; quantity?: number }) => ({
        productId: item.productId,
        size: item.size,
        color: item.color || item.variant,
        quantity: item.quantity,
      }))
    );
    if (stock.error) {
      if (stock.applied.length) await restoreStock(stock.applied);
      return NextResponse.json({ error: stock.error }, { status: 400 });
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
        order_items: pricedItems,
        subtotal: priced.subtotal,
        shipping: priced.shipping,
        total: priced.total,
        payment_method: "cod", // No online payment gateway yet; never trust a "card" sent by an old page.
        status: "pending",
        ...promo,
      })
      .select("id")
      .single();

    if (error) {
      await restoreStock(stock.applied);
      throw error;
    }

    // Email the customer and the store once the response has gone out, so checkout stays fast.
    const placed: OrderEmail = {
      id: data.id,
      email: email.toLowerCase().trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      apartment: (apartment || "").trim(),
      city: city.trim(),
      phone: phone.trim(),
      items: pricedItems,
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      total: priced.total,
      discount: promo?.discount ?? 0,
      promoCode: promo?.promo_code,
      paymentMethod: "cod",
    };
    after(() => Promise.all([sendOrderConfirmation(placed), sendNewOrderAlert(placed)]));

    return NextResponse.json(
      { message: "Order placed successfully!", orderId: data.id, total: priced.total },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
