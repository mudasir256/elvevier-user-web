"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const delayClasses = [
    "",
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
  ];
  const delayClass = delayClasses[Math.min(index, 5)] ?? "animation-delay-500";

  return (
    <article className={`group animate-fade-up ${delayClass}`}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--cream)] shadow-sm shadow-[var(--shadow-warm)] transition-all duration-300 group-hover:shadow-md group-hover:shadow-[var(--shadow-warm-md)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[var(--foreground)]/0 group-hover:bg-[var(--foreground)]/10 transition-colors duration-300" />
          {product.new && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-[var(--foreground)] text-[var(--cream)] rounded-full">
              New
            </span>
          )}
          {/* Quick view hint */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="block w-full py-2 text-center text-xs font-medium bg-[var(--card)]/95 backdrop-blur-sm text-[var(--foreground)] rounded-lg shadow-sm">
              View Product
            </span>
          </div>
        </div>
        <div className="mt-3.5 px-0.5">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider">{product.color}</p>
          <h3 className="font-medium text-[var(--foreground)] text-sm mt-1 line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-sm font-semibold mt-1.5 text-[var(--foreground)]">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <div className="px-0.5 mt-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full py-2.5 text-sm font-medium border border-[var(--border)] rounded-xl hover:bg-[var(--foreground)] hover:text-[var(--cream)] hover:border-[var(--foreground)] transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
