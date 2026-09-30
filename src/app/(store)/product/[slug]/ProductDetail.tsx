"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { ProductPurchase } from "@/components/ProductPurchase";
import { galleryFor, uniqueValues } from "@/lib/variants";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export function ProductDetail({ product }: { product: Product }) {
  const [color, setColor] = useState(uniqueValues(product.variants ?? [], "color")[0] ?? "");
  const photos = galleryFor(product, color);
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];
  const onColorChange = useCallback((next: string) => {
    setColor((currentColor) => {
      if (currentColor !== next) setActive(0);
      return next;
    });
  }, []);

  return (
    <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#e4e4e4]">
        {current ? (
          <Image
            src={current}
            alt={product.name}
            fill
            className="object-contain"
            priority
            key={current}
            sizes="(max-width: 768px) 100vw, 60vw"
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
          <div className="mt-8 flex gap-3 overflow-x-auto pb-3">
            {photos.map((photo, index) => (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-[#e4e4e4] ${
                  index === active ? "border-[#4a142a]" : "border-[var(--border)]"
                }`}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === active}
              >
                <Image src={photo} alt="" fill className="object-contain" sizes="96px" />
              </button>
            ))}
          </div>
        ) : null}

        <ProductPurchase product={product} onColorChange={onColorChange} />
        <p className="mt-4 text-sm text-[var(--muted)]">Free shipping on orders above Rs. 2,500. Easy returns.</p>
      </div>
    </div>
  );
}
