"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { flyProductToCart } from "@/lib/flyToCart";
import { ProductQuickView } from "@/components/ProductQuickView";
import { galleryFor, isSold, uniqueValues } from "@/lib/variants";
import { SoldBadge } from "@/components/SoldBadge";
import { SaleTag } from "@/components/SaleTag";
import { trackAddToCart } from "@/lib/metaPixel";
import { backgroundFromImage } from "@/lib/imageBackground";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

const HOLD_DELAY = 220;
const PHOTO_INTERVAL = 1200;
const MOVE_TOLERANCE = 10;

// Press and hold on touch screens (or hover with a mouse) to flip through a product's photos.
// Extra photos only load once someone starts interacting with the card.
function usePhotoPreview(count: number) {
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loop = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  const clearTimers = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (loop.current) clearInterval(loop.current);
    holdTimer.current = null;
    loop.current = null;
  }, []);

  const play = useCallback(() => {
    if (count < 2) return;
    setArmed(true);
    setPlaying(true);
    setActive(1);
    loop.current = setInterval(() => setActive((current) => (current + 1) % count), PHOTO_INTERVAL);
  }, [count]);

  const stop = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setActive(0);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  const handlers = {
    onTouchStart(event: React.TouchEvent) {
      if (count < 2 || event.touches.length > 1) return;
      if ((event.target as HTMLElement).closest("button")) return;
      const touch = event.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
      suppressClick.current = false;
      setArmed(true);
      clearTimers();
      holdTimer.current = setTimeout(() => {
        suppressClick.current = true;
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
        play();
      }, HOLD_DELAY);
    },
    onTouchMove(event: React.TouchEvent) {
      const origin = touchStart.current;
      const touch = event.touches[0];
      if (!origin || !touch) return;
      if (Math.abs(touch.clientX - origin.x) > MOVE_TOLERANCE || Math.abs(touch.clientY - origin.y) > MOVE_TOLERANCE) {
        touchStart.current = null;
        stop();
      }
    },
    onTouchEnd() {
      touchStart.current = null;
      stop();
    },
    onContextMenu(event: React.MouseEvent) {
      if (suppressClick.current || playing) event.preventDefault();
    },
    onPointerEnter(event: React.PointerEvent) {
      if (event.pointerType !== "mouse") return;
      clearTimers();
      play();
    },
    onPointerLeave(event: React.PointerEvent) {
      if (event.pointerType !== "mouse") return;
      stop();
    },
  };

  // A hold that showed photos should not also open the product when the finger lifts.
  function consumeClick(event: React.MouseEvent) {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
  }

  return { active, armed, playing, handlers, consumeClick };
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
    "flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition duration-200 hover:scale-105 active:scale-90 sm:h-9 sm:w-9";
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

// Opened by the bag icon on products with sizes, so shoppers can add to cart without the quick view.
function QuickSizePicker({
  sizes,
  onPick,
  onClose,
}: {
  sizes: { size: string; available: boolean }[];
  onPick: (size: string) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) onClose();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="animate-fade-up absolute inset-x-2 bottom-2 z-30 rounded-2xl bg-white/95 p-3 shadow-[0_12px_30px_rgba(44,40,37,0.18)] backdrop-blur-sm"
      role="dialog"
      aria-label="Choose a size"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4a142a]">Choose size</p>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 rounded-full p-1 text-[var(--muted)] hover:bg-[#f4e6ec] hover:text-[#4a142a]"
          aria-label="Close size picker"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {sizes.map(({ size, available }) => (
          <button
            key={size}
            type="button"
            disabled={!available}
            onClick={() => onPick(size)}
            className="min-w-9 rounded-lg border border-[var(--border)] bg-white px-2 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[#4a142a] hover:bg-[#4a142a] hover:text-white disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 disabled:hover:border-[var(--border)] disabled:hover:bg-white disabled:hover:text-[var(--foreground)]"
          >
            {size}
          </button>
        ))}
      </div>
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
  const soldOut = isSold(product);
  const firstColor = product.variants?.find((variant) => variant.color)?.color;
  const [pickingSize, setPickingSize] = useState(false);
  const closePicker = useCallback(() => setPickingSize(false), []);
  // Sizes in the card's own color, falling back to the first color the product has.
  const cardColor =
    product.variants?.find((variant) => variant.color && variant.color.toLowerCase() === product.color?.toLowerCase())?.color ??
    firstColor ??
    "";
  const colorVariants = (product.variants ?? []).filter((variant) => (variant.color ?? "") === cardColor);
  const sizeOptions = uniqueValues(colorVariants, "size").map((size) => ({
    size,
    available: colorVariants.some((variant) => variant.size === size && variant.stock > 0),
  }));
  const photos = [...new Set([product.image, ...galleryFor(product, firstColor)].filter(Boolean))].slice(0, 6);
  const preview = usePhotoPreview(photos.length);

  const matchFrame = useCallback((image: HTMLImageElement) => {
    setImageReady(true);
    const next = backgroundFromImage(image);
    if (next) setFrameColor(next);
  }, []);

  useEffect(() => {
    const image = frameRef.current?.querySelector("img");
    if (image?.complete && image.naturalWidth > 0) matchFrame(image);
  }, [matchFrame, product.image]);

  const addCard = (from: HTMLElement | null, size?: string) => {
    addToCart(product, 1, size, tracked ? cardColor : undefined);
    trackAddToCart({
      id: product.id,
      name: product.name,
      category: product.categoryId,
      price: product.price,
    });
    if (from) flyProductToCart(frameRef.current ?? from, galleryFor(product, cardColor)[0] || product.image);
  };

  return (
    <article className={`group flex h-full flex-col animate-fade-up ${delayClass}`}>
      <div
        ref={frameRef}
        className="relative aspect-[3/4] select-none overflow-hidden rounded-[1.7rem] transition-transform duration-200 active:scale-[0.985] [-webkit-touch-callout:none]"
        style={{ backgroundColor: frameColor }}
        {...preview.handlers}
      >
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0"
          aria-label={product.name}
          draggable={false}
          onClick={preview.consumeClick}
        >
          {!imageReady ? <div className="skeleton absolute inset-0 z-10" aria-hidden /> : null}
          {photos.map((photo, photoIndex) =>
            photoIndex === 0 || preview.armed ? (
              <Image
                key={photo}
                src={photo}
                alt={photoIndex === 0 ? product.name : ""}
                fill
                draggable={false}
                // Photos load straight from Supabase; CORS lets matchFrame read their edge colour.
                crossOrigin="anonymous"
                className={`object-contain will-change-[opacity,transform] [transition:opacity_800ms_cubic-bezier(0.4,0,0.2,1),transform_1600ms_cubic-bezier(0.25,0.1,0.25,1)] ${
                  preview.active === photoIndex ? "opacity-100" : "opacity-0"
                } ${preview.playing && preview.active === photoIndex ? "motion-safe:scale-[1.025]" : "scale-100"}`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onLoad={photoIndex === 0 ? (event) => matchFrame(event.currentTarget) : undefined}
              />
            ) : null
          )}
        </Link>
        {product.new && (
          <span className="absolute top-3 left-3 z-20 rounded-full bg-[#f4e6ec] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4a142a]">
            New
          </span>
        )}
        {product.salePercent ? <SaleTag percent={product.salePercent} /> : null}
        {soldOut ? <SoldBadge /> : null}
        <div className="absolute bottom-3 right-3 z-20">
          <CardActions
            product={product}
            onAdd={(event) => {
              const inStock = sizeOptions.filter((option) => option.available);
              if (tracked && (soldOut || !inStock.length)) {
                setDetailsOpen(true);
                return;
              }
              if (tracked && inStock.length > 1) {
                setPickingSize(true);
                return;
              }
              addCard(event.currentTarget, inStock[0]?.size);
            }}
            onView={() => setDetailsOpen(true)}
          />
        </div>
        {pickingSize ? (
          <QuickSizePicker
            sizes={sizeOptions}
            onClose={closePicker}
            onPick={(size) => {
              setPickingSize(false);
              addCard(frameRef.current, size);
            }}
          />
        ) : null}
      </div>
      {detailsOpen ? <ProductQuickView product={product} onClose={closeDetails} /> : null}
      <Link href={`/product/${product.slug}`} className="mt-3 flex flex-1 flex-col">
        <span className="inline-flex w-fit max-w-full truncate rounded-full bg-[#f4e6ec] px-2.5 py-0.5 text-[11px] font-medium text-[#4a142a]">
          {product.color}
        </span>
        {product.brand || product.categoryId === "unisex" ? (
          <span className="mt-2 block truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {[product.brand, product.categoryId === "unisex" ? "Unisex" : ""].filter(Boolean).join(" · ")}
          </span>
        ) : null}
        <h3 className={`${product.brand || product.categoryId === "unisex" ? "mt-0.5" : "mt-2"} h-10 overflow-hidden text-[15px] font-medium leading-5 text-[var(--foreground)] line-clamp-2 transition-colors duration-200 group-hover:text-[#4a142a]`}>
          {product.name}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-[15px] font-semibold text-[#4a142a]">
          {formatPrice(product.price)}
          {product.salePercent && product.compareAtPrice ? (
            <>
              <span className="text-[13px] font-normal text-[var(--muted)] line-through">{formatPrice(product.compareAtPrice)}</span>
              <span className="text-[12px] font-semibold text-red-600">{product.salePercent}% off</span>
            </>
          ) : null}
        </p>
      </Link>
    </article>
  );
}
