"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { ProductPurchase } from "@/components/ProductPurchase";
import { galleryFor, uniqueValues } from "@/lib/variants";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export function ProductQuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const titleId = useId();
  const [color, setColor] = useState(uniqueValues(product.variants ?? [], "color")[0] ?? "");
  const photos = galleryFor(product, color);
  const [active, setActive] = useState(0);
  const onColorChange = useCallback((next: string) => {
    setColor((currentColor) => {
      if (currentColor !== next) setActive(0);
      return next;
    });
  }, []);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const current = photos[active] ?? photos[0];

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      onClose();
      return;
    }
    setClosing(true);
    window.setTimeout(onClose, 220);
  }, [onClose]);

  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 ${closing ? "quick-view-backdrop-out" : "quick-view-backdrop"}`}
        aria-label="Close product details"
        onClick={requestClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 grid max-h-[min(94vh,980px)] w-full max-w-6xl grid-cols-1 overflow-y-auto rounded-[1.4rem] bg-[var(--background)] shadow-2xl md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] ${
          closing ? "quick-view-panel-out" : "quick-view-panel"
        }`}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4a142a] shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="bg-[#e4e4e4] p-4 sm:p-6" style={{ backgroundColor: "#e4e4e4" }}>
          <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-[#e4e4e4]" style={{ backgroundColor: "#e4e4e4" }}>
            {current ? (
              <Image key={current} src={current} alt={product.name} fill className="object-contain" sizes="(max-width: 768px) 100vw, 56vw" style={{ backgroundColor: "#e4e4e4" }} />
            ) : null}
            {product.new ? (
              <span className="absolute top-3 left-3 rounded-full bg-[#f4e6ec] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4a142a]">
                New
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex h-full flex-col px-5 py-6 sm:px-7 sm:py-8">
          <p className="text-sm font-medium text-[#4a142a]">{product.color}</p>
          <h2 id={titleId} className="mt-2 text-2xl font-semibold leading-tight text-[var(--foreground)]">
            {product.name}
          </h2>
          {product.description ? (
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{product.description}</p>
          ) : null}
          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-lg font-semibold text-[#4a142a]">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-sm text-[var(--muted)] line-through">{formatPrice(product.compareAtPrice)}</p>
            ) : null}
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-[var(--muted)]">Category</dt>
              <dd className="capitalize text-[var(--foreground)]">{product.categoryId}</dd>
            </div>
            {product.subcategory ? (
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[var(--muted)]">Type</dt>
                <dd className="text-[var(--foreground)]">{product.subcategory}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-auto pt-6">
          {photos.length > 1 ? (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {photos.map((photo, index) => (
                <button
                  key={`${photo}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-[#e4e4e4] ${
                    index === active ? "border-[#4a142a]" : "border-transparent"
                  }`}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === active}
                >
                  <Image src={photo} alt="" fill className="object-contain" sizes="80px" loading="eager" />
                </button>
              ))}
            </div>
          ) : null}

          <ProductPurchase product={product} onAdded={requestClose} onColorChange={onColorChange} />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/product/${product.slug}`}
              className="rounded-full bg-[#f4e6ec] px-6 py-3 text-center text-sm font-medium text-[#4a142a] hover:bg-[#ead3dc]"
            >
              Open product page
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">Free shipping on orders above Rs. 2,500. Easy returns.</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
