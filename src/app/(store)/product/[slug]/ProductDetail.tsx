"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { AddToCartButton } from "./AddToCartButton";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export function ProductDetail({ product }: { product: Product }) {
  const photos = (product.images?.length ? product.images : [product.image]).filter(Boolean);
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--cream)]">
        {current ? (
          <Image
            src={current}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : null}
        {product.new ? (
          <span className="absolute top-4 left-4 rounded bg-[var(--foreground)] px-3 py-1 text-sm font-medium text-[var(--cream)]">
            New
          </span>
        ) : null}
      </div>

      <div>
        <p className="text-sm uppercase tracking-wider text-[var(--muted)]">{product.color}</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">{product.name}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-[var(--muted)] line-through">{formatPrice(product.compareAtPrice)}</span>
          ) : null}
        </div>
        {product.description ? <p className="mt-6 text-[var(--muted)]">{product.description}</p> : null}

        {photos.length > 1 ? (
          <div className="mt-8 flex gap-3 overflow-x-auto">
            {photos.map((photo, index) => (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[var(--cream)] ${
                  index === active ? "border-[#4a142a]" : "border-[var(--border)]"
                }`}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === active}
              >
                <Image src={photo} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">Free shipping on orders above Rs. 2,500. Easy returns.</p>
      </div>
    </div>
  );
}
