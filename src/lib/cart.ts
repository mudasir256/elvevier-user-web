import { NextResponse } from "next/server";
import type { Product } from "@/types";
import { ensureCatalog } from "@/lib/catalog";
import { getCustomer } from "@/lib/customerAuth";
import { getSupabase } from "@/lib/supabase";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  category_id: Product["categoryId"];
  subcategory: string;
  color: string;
  image: string;
  images: string[] | null;
  description: string;
  featured: boolean;
  is_new: boolean;
  active: boolean;
};

type ItemRow = {
  id: string;
  quantity: number;
  size: string;
  product: ProductRow | ProductRow[] | null;
};

export type StoredCartItem = {
  product: Product;
  quantity: number;
  size?: string;
};

function toProduct(row: ProductRow): Product {
  const gallery = Array.isArray(row.images) ? row.images.map(String).filter(Boolean) : [];
  const images = gallery.length ? gallery : row.image ? [row.image] : [];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    categoryId: row.category_id,
    subcategory: row.subcategory || undefined,
    color: row.color,
    image: images[0] || row.image,
    images,
    description: row.description || undefined,
    featured: row.featured,
    new: row.is_new,
    active: row.active,
  };
}

function oneProduct(value: ItemRow["product"]) {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function cartResponse(items: StoredCartItem[], guestToken?: string | null) {
  return NextResponse.json({
    items,
    ...(guestToken ? { guestToken } : {}),
  });
}

async function readItems(cartId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity, size, product:products(*)")
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as unknown as ItemRow[];
  return rows.flatMap((row) => {
    const product = oneProduct(row.product);
    if (!product?.active) return [];
    return [
      {
        product: toProduct(product),
        quantity: row.quantity,
        size: row.size || undefined,
      },
    ];
  });
}

async function findByGuest(guestToken: string) {
  const { data, error } = await getSupabase().from("carts").select("id, user_id, guest_token").eq("guest_token", guestToken).maybeSingle();
  if (error) throw error;
  return data;
}

async function findByUser(userId: string) {
  const { data, error } = await getSupabase().from("carts").select("id, user_id, guest_token").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

async function moveItems(fromCartId: string, toCartId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("cart_items").select("product_id, quantity, size").eq("cart_id", fromCartId);
  if (error) throw error;
  for (const row of data ?? []) {
    const size = String(row.size ?? "");
    const { data: existing, error: existingError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", toCartId)
      .eq("product_id", row.product_id)
      .eq("size", size)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: Math.min(20, existing.quantity + row.quantity) })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        cart_id: toCartId,
        product_id: row.product_id,
        quantity: Math.min(20, row.quantity),
        size,
      });
      if (insertError) throw insertError;
    }
  }
}

async function openCart(userId: string | null, guestToken: string | null) {
  const supabase = getSupabase();
  const token = guestToken && UUID.test(guestToken) ? guestToken : crypto.randomUUID();
  const guestRow = guestToken && UUID.test(guestToken) ? await findByGuest(token) : null;
  const userRow = userId ? await findByUser(userId) : null;

  if (guestRow && userRow && guestRow.id !== userRow.id) {
    await moveItems(userRow.id, guestRow.id);
    const { error: clearError } = await supabase.from("carts").update({ user_id: null }).eq("id", userRow.id);
    if (clearError) throw clearError;
    const { error: claimError } = await supabase.from("carts").update({ user_id: userId }).eq("id", guestRow.id);
    if (claimError) throw claimError;
    await supabase.from("carts").delete().eq("id", userRow.id);
    return { cartId: guestRow.id as string, guestToken: token };
  }

  if (guestRow) {
    if (userId && !guestRow.user_id) {
      await supabase.from("carts").update({ user_id: userId }).eq("id", guestRow.id);
    }
    return { cartId: guestRow.id as string, guestToken: token };
  }

  if (userRow) {
    if (!userRow.guest_token) {
      await supabase.from("carts").update({ guest_token: token }).eq("id", userRow.id);
    }
    return { cartId: userRow.id as string, guestToken: (userRow.guest_token as string | null) || token };
  }

  const { data, error } = await supabase
    .from("carts")
    .insert({ guest_token: token, ...(userId ? { user_id: userId } : {}) })
    .select("id")
    .single();
  if (error || !data) {
    const again = await findByGuest(token);
    if (again) return { cartId: again.id as string, guestToken: token };
    if (userId) {
      const byUser = await findByUser(userId);
      if (byUser) return { cartId: byUser.id as string, guestToken: (byUser.guest_token as string | null) || token };
    }
    throw error;
  }
  return { cartId: data.id as string, guestToken: token };
}

export async function resolveCartOwner(request: Request) {
  const customer = await getCustomer(request);
  const headerToken = request.headers.get("x-cart-token")?.trim() ?? "";
  const guestToken = UUID.test(headerToken) ? headerToken : null;
  return { userId: customer?.id ?? null, guestToken };
}

export async function getCartItems(userId: string | null, guestToken: string | null) {
  await ensureCatalog();
  if (userId && guestToken) {
    const guestRow = await findByGuest(guestToken);
    const userRow = await findByUser(userId);
    if (guestRow && userRow && guestRow.id !== userRow.id) {
      const cart = await openCart(userId, guestToken);
      return readItems(cart.cartId);
    }
  }
  if (guestToken) {
    const guestRow = await findByGuest(guestToken);
    if (guestRow) {
      if (userId && !guestRow.user_id) {
        await getSupabase().from("carts").update({ user_id: userId }).eq("id", guestRow.id);
      }
      return readItems(guestRow.id);
    }
  }
  if (userId) {
    const userRow = await findByUser(userId);
    if (userRow) return readItems(userRow.id);
  }
  return [];
}

async function touchCart(cartId: string) {
  await getSupabase().from("carts").update({ updated_at: new Date().toISOString() }).eq("id", cartId);
}

export async function addCartItem(
  userId: string | null,
  guestToken: string | null,
  productId: string,
  quantity: number,
  size: string
) {
  await ensureCatalog();
  const supabase = getSupabase();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("active", true)
    .maybeSingle();
  if (productError) throw productError;
  if (!product) return { error: "That product is no longer available." as const };

  const cart = await openCart(userId, guestToken);
  const qty = Math.min(20, Math.max(1, Math.floor(quantity) || 1));
  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.cartId)
    .eq("product_id", productId)
    .eq("size", size)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: Math.min(20, existing.quantity + qty) })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("cart_items").insert({
      cart_id: cart.cartId,
      product_id: productId,
      quantity: qty,
      size,
    });
    if (error) throw error;
  }

  await touchCart(cart.cartId);
  return { items: await readItems(cart.cartId), guestToken: cart.guestToken };
}

export async function updateCartItem(
  userId: string | null,
  guestToken: string | null,
  productId: string,
  quantity: number,
  size: string
) {
  await ensureCatalog();
  const cart = await openCart(userId, guestToken);
  const cartId = cart.cartId;

  const supabase = getSupabase();
  if (quantity <= 0) {
    let query = supabase.from("cart_items").delete().eq("cart_id", cartId).eq("product_id", productId);
    if (size) query = query.eq("size", size);
    const { error } = await query;
    if (error) throw error;
  } else {
    const qty = Math.min(20, Math.floor(quantity));
    let query = supabase.from("cart_items").update({ quantity: qty }).eq("cart_id", cartId).eq("product_id", productId);
    if (size) query = query.eq("size", size);
    const { error } = await query;
    if (error) throw error;
  }

  await touchCart(cartId);
  return { items: await readItems(cartId), guestToken: cart.guestToken };
}

export async function removeCartItem(userId: string | null, guestToken: string | null, productId: string) {
  await ensureCatalog();
  const cart = guestToken || userId ? await openCart(userId, guestToken) : null;
  if (!cart) return [] as StoredCartItem[];
  const { error } = await getSupabase().from("cart_items").delete().eq("cart_id", cart.cartId).eq("product_id", productId);
  if (error) throw error;
  await touchCart(cart.cartId);
  return readItems(cart.cartId);
}

export async function clearCartItems(userId: string | null, guestToken: string | null) {
  const cartId = guestToken
    ? (await findByGuest(guestToken))?.id
    : userId
      ? (await findByUser(userId))?.id
      : null;
  if (!cartId) return;
  const { error } = await getSupabase().from("cart_items").delete().eq("cart_id", cartId);
  if (error) throw error;
  await touchCart(cartId);
}

export async function mergeGuestCart(userId: string, guestToken: string) {
  await ensureCatalog();
  const cart = await openCart(userId, guestToken);
  return readItems(cart.cartId);
}
