"use client";

import { useEffect, useRef, useState } from "react";
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
  const frameRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const delayClasses = [
    "",
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
  ];
  const delayClass = delayClasses[Math.min(index, 5)] ?? "animation-delay-500";

  useEffect(() => {
    const image = frameRef.current?.querySelector("img");
    if (image?.complete && image.naturalWidth > 0) setImageReady(true);
  }, []);

  return (
    <article className={`group flex h-full flex-col animate-fade-up ${delayClass}`}>
      <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col">
        <div ref={frameRef} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f4e6ec] shadow-sm shadow-[var(--shadow-warm)] transition-all duration-300 group-hover:shadow-md group-hover:shadow-[var(--shadow-warm-md)]">
          {!imageReady ? <div className="skeleton absolute inset-0 z-10" aria-hidden /> : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageReady(true)}
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
            <span className="block w-full py-2 text-center text-xs font-medium bg-[#4a142a] text-white rounded-lg shadow-sm">
              View Product
            </span>
          </div>
        </div>
        <div className="mt-3.5 px-0.5">
          <p className="h-4 truncate text-xs uppercase tracking-wider text-[var(--muted)]">{product.color}</p>
          <h3 className="mt-1 h-10 overflow-hidden text-sm font-medium leading-5 text-[var(--foreground)] line-clamp-2 transition-colors duration-200 group-hover:text-[var(--accent)]">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm font-semibold text-[var(--foreground)]">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <div className="mt-auto px-0.5 pt-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full py-2.5 text-sm font-medium border border-[var(--border)] rounded-xl hover:bg-[#4a142a] hover:text-white hover:border-[#4a142a] transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
