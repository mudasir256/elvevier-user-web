"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="w-full md:w-auto px-10 py-4 bg-[#4a142a] text-white font-medium rounded-lg hover:bg-[#350e1e] transition"
    >
      Add to cart
    </button>
  );
}
