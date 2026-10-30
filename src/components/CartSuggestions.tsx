"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { useGetProductsQuery } from "@/store/catalogApi";
import { isSold } from "@/lib/variants";
import { sameType } from "@/lib/productTypes";

const LIMIT = 6;

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

// Best matches first: same type as the last item added, then same category, then same brand.
function related(products: Product[], cart: Product[]) {
  const last = cart[cart.length - 1];
  if (!last) return [];
  const inCart = new Set(cart.map((product) => product.id));
  const score = (product: Product) =>
    (product.subcategory && last.subcategory && sameType(product.subcategory, last.subcategory) ? 4 : 0) +
    (product.categoryId === last.categoryId ? 2 : 0) +
    (product.brand && product.brand === last.brand ? 1 : 0);
  return products
    .filter((product) => !inCart.has(product.id) && !isSold(product))
    .map((product) => ({ product, score: score(product) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((entry) => entry.product);
}

export function CartSuggestions({ cart, onPick }: { cart: Product[]; onPick: () => void }) {
  const { data: products = [] } = useGetProductsQuery(undefined, { skip: cart.length === 0 });
  const picks = related(products, cart);
  if (!picks.length) return null;

  return (
    <section className="mt-8 border-t border-[var(--border)] pt-6" aria-label="You may also like">
      <h3 className="eyebrow">You may also like</h3>
      <ul className="-mx-5 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {picks.map((product) => (
          <li key={product.id} className="w-24 shrink-0 snap-start">
            <Link href={`/product/${product.slug}`} onClick={onPick} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--cream)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              {product.brand ? (
                <p className="mt-1.5 truncate text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">{product.brand}</p>
              ) : null}
              <p className="mt-0.5 line-clamp-2 text-[10px] font-medium leading-snug text-[var(--foreground)] group-hover:text-[#4a142a]">
                {product.name}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-[#4a142a]">{formatPrice(product.price)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
