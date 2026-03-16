"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    itemCount,
    total,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-[var(--muted)]">
          Add something cozy from our collection.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-[var(--foreground)] text-[var(--cream)] font-medium rounded-lg hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl font-semibold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={`${item.product.id}-${item.size ?? ""}`}
                className="flex gap-4 py-6 border-b border-[var(--border)]"
              >
                <div className="relative w-24 h-32 md:w-28 md:h-36 rounded-lg overflow-hidden bg-[var(--cream)] shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-medium hover:text-[var(--accent)]"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-[var(--muted)] mt-0.5">
                    {item.product.color}
                    {item.size && ` · ${item.size}`}
                  </p>
                  <p className="mt-2 font-medium">
                    {formatPrice(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.max(0, item.quantity - 1)
                        )
                      }
                      className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center hover:bg-[var(--cream)]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center hover:bg-[var(--cream)]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-4 text-sm text-[var(--muted)] hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="sticky top-24 bg-[var(--cream)] rounded-2xl p-6 border border-[var(--border)]">
            <h2 className="font-semibold text-lg">Order summary</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Subtotal ({itemCount} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-[var(--muted)] pt-2">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
            <Link
              href="/checkout"
              className="block w-full mt-6 py-4 bg-[var(--foreground)] text-[var(--cream)] font-medium rounded-lg hover:opacity-90 transition text-center"
            >
              Check out
            </Link>
            <Link
              href="/"
              className="block mt-4 text-center text-sm text-[var(--accent)] hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
