import type { Product } from "@/types";
import { STORE_SALE, storeSalePercent } from "@/lib/campaign";

export const MAX_SALE_PERCENT = 90;

export function cleanSalePercent(value: unknown) {
  const percent = Math.floor(Number(value) || 0);
  return Math.min(MAX_SALE_PERCENT, Math.max(0, percent));
}

export function salePrice(price: number, percent: number) {
  return Math.round((price * (100 - cleanSalePercent(percent))) / 100);
}

// The discount a product gets right now: its own sale or the store-wide sale, whichever is bigger.
// They are never added together.
export function effectiveSale(ownPercent: unknown, now = Date.now()) {
  const own = cleanSalePercent(ownPercent);
  const store = cleanSalePercent(storeSalePercent(now));
  if (store > own) return { percent: store, saleName: STORE_SALE.name };
  return { percent: own, saleName: undefined };
}

// The price a customer pays for one item, from the original price in the database.
export function currentPrice(price: number, ownPercent: unknown, now = Date.now()) {
  return salePrice(price, effectiveSale(ownPercent, now).percent);
}

// Store pages show the sale price as the price and the original price struck through.
// The database keeps the original price, so removing the sale restores it.
export function withSale(product: Product, now = Date.now()): Product {
  const { percent, saleName } = effectiveSale(product.salePercent, now);
  if (!percent) return { ...product, salePercent: undefined, saleName: undefined };
  return {
    ...product,
    price: salePrice(product.price, percent),
    compareAtPrice: product.price,
    salePercent: percent,
    saleName,
  };
}

// What the shopper saves on these lines compared with the original prices.
export function savingsFor(lines: { product: Pick<Product, "price" | "compareAtPrice" | "salePercent">; quantity: number }[]) {
  return lines.reduce((sum, { product, quantity }) => {
    if (!product.salePercent || !product.compareAtPrice) return sum;
    return sum + Math.max(0, product.compareAtPrice - product.price) * quantity;
  }, 0);
}

// Checkout shows this before the order is placed; the server works it out again from its own prices.
export function promoDiscount(promo: { type: "percent" | "fixed"; value: number }, subtotal: number) {
  const amount = promo.type === "percent" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return Math.max(0, Math.min(subtotal, amount));
}
