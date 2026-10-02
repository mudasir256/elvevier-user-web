"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { flyProductToCart } from "@/lib/flyToCart";
import { ProductQuickView } from "@/components/ProductQuickView";
import { totalStock } from "@/lib/variants";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

function backgroundFromImage(image: HTMLImageElement) {
  if (!image.naturalWidth) return "";
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 4;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return "";
  try {
    context.drawImage(image, 0, 0, 16, 16, 0, 0, 4, 4);
    const { data } = context.getImageData(0, 0, 4, 4);
    let red = 0;
    let green = 0;
    let blue = 0;
    const count = data.length / 4;
    for (let index = 0; index < data.length; index += 4) {
      red += data[index];
      green += data[index + 1];
      blue += data[index + 2];
    }
    return `rgb(${Math.round(red / count)}, ${Math.round(green / count)}, ${Math.round(blue / count)})`;
  } catch {
    return "";
  }
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

function CardActions({
  product,
  onAdd,
  onView,
}: {
  product: Product;
  onAdd: (event: { currentTarget: HTMLElement }) => void;
  onView: () => void;
}) {
  const button =
    "flex h-9 w-9 items-center justify-center rounded-full transition duration-200 hover:scale-105";
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`View ${product.name}`}
        onClick={onView}
        className={`${button} bg-white text-[#4a142a] hover:bg-[#f4e6ec]`}
      >
        <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.6" strokeWidth={1.6} />
        </svg>
      </button>
      <button
        type="button"
        aria-label={`Add ${product.name} to cart`}
        onClick={onAdd}
        className={`${button} bg-[#4a142a] text-white hover:bg-[#350e1e]`}
      >
        <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </button>
    </div>
  );
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const closeDetails = useCallback(() => setDetailsOpen(false), []);
  const frameRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const [frameColor, setFrameColor] = useState("#e4e4e4");
  const delayClasses = [
    "",
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
  ];
  const delayClass = delayClasses[Math.min(index, 5)] ?? "animation-delay-500";
  const tracked = Boolean(product.variants?.length);
  const soldOut = tracked && totalStock(product.variants) < 1;

  const matchFrame = useCallback((image: HTMLImageElement) => {
    setImageReady(true);
    const next = backgroundFromImage(image);
    if (next) setFrameColor(next);
  }, []);

  useEffect(() => {
    const image = frameRef.current?.querySelector("img");
    if (image?.complete && image.naturalWidth > 0) matchFrame(image);
  }, [matchFrame, product.image]);

  return (
    <article className={`group flex h-full flex-col animate-fade-up ${delayClass}`}>
      <div ref={frameRef} className="relative aspect-[3/4] overflow-hidden rounded-[1.7rem]" style={{ backgroundColor: frameColor }}>
        <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          {!imageReady ? <div className="skeleton absolute inset-0 z-10" aria-hidden /> : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={(event) => matchFrame(event.currentTarget)}
          />
        </Link>
        {product.new && (
          <span className="absolute top-3 left-3 z-20 rounded-full bg-[#f4e6ec] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4a142a]">
            New
          </span>
        )}
        {soldOut ? (
          <span className="absolute top-3 right-3 z-20 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4a142a]">
            Sold out
          </span>
        ) : null}
        <div className="absolute bottom-3 right-3 z-20">
          <CardActions
            product={product}
            onAdd={(event) => {
              if (tracked) {
                setDetailsOpen(true);
                return;
              }
              addToCart(product);
              const photo = frameRef.current ?? event.currentTarget;
              flyProductToCart(photo, product.image);
            }}
            onView={() => setDetailsOpen(true)}
          />
        </div>
      </div>
      {detailsOpen ? <ProductQuickView product={product} onClose={closeDetails} /> : null}
      <Link href={`/product/${product.slug}`} className="mt-3 flex flex-1 flex-col">
        <span className="inline-flex w-fit max-w-full truncate rounded-full bg-[#f4e6ec] px-2.5 py-0.5 text-[11px] font-medium text-[#4a142a]">
          {product.color}
        </span>
        <h3 className="mt-2 h-10 overflow-hidden text-[15px] font-medium leading-5 text-[var(--foreground)] line-clamp-2 transition-colors duration-200 group-hover:text-[#4a142a]">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[15px] font-semibold text-[#4a142a]">{formatPrice(product.price)}</p>
      </Link>
    </article>
  );
}
