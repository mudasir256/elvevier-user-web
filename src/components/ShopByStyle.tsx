"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { backgroundFromImage } from "@/lib/imageBackground";

export type StyleCategory = {
  name: string;
  href: string;
  image: string;
};

const SPEED = 35; // px per second, like the partners strip

export function ShopByStyle({ categories }: { categories: StyleCategory[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const holdUntil = useRef(0);
  const hovering = useRef(false);
  const [mobile, setMobile] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: true });

  // Auto-scroll only on mobile widths; desktop stays still and uses the arrows.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Each style shows once, so the arrows dim at either end of the row.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [categories.length]);

  // On mobile the row drifts to the end, rests, then glides back to the first style.
  useEffect(() => {
    const el = scroller.current;
    if (!el || !mobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    position.current = el.scrollLeft;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const max = el.scrollWidth - el.clientWidth;
      if (Math.abs(el.scrollLeft - position.current) > 2) position.current = el.scrollLeft; // user scrolled
      if (max > 8 && !hovering.current && now > holdUntil.current) {
        if (position.current >= max - 1) {
          position.current = 0;
          holdUntil.current = now + 2500;
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          position.current = Math.min(max, position.current + SPEED * dt);
          el.scrollLeft = position.current;
          if (position.current >= max - 1) holdUntil.current = now + 1500;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mobile, categories.length]);

  const pause = (ms: number) => {
    holdUntil.current = performance.now() + ms;
  };

  const scrollByCard = (direction: number) => {
    const el = scroller.current;
    if (!el) return;
    pause(1500);
    const card = el.querySelector<HTMLElement>("[data-style-card]");
    const amount = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!categories.length) return null;

  return (
    <section className="py-14 md:py-16" aria-label="Shop by style">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Explore</p>
            <h2 className="section-heading">Shop By Style</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous styles"
              onClick={() => scrollByCard(-1)}
              disabled={edges.start}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4ddd2] bg-white text-[#4a142a] transition hover:border-[#4a142a] disabled:opacity-35"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next styles"
              onClick={() => scrollByCard(1)}
              disabled={edges.end}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4a142a] text-white shadow-[0_8px_20px_rgba(74,20,42,0.22)] transition hover:bg-[#350e1e] disabled:opacity-35"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
        <div
          ref={scroller}
          className="flex gap-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
          onTouchStart={() => pause(4000)}
          onTouchEnd={() => pause(2500)}
          onWheel={() => pause(2500)}
          onFocus={() => pause(4000)}
        >
          {categories.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              data-style-card
              className="group w-[72vw] shrink-0 sm:w-[230px] md:w-[250px]"
            >
              <div
                className={`relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-[0_10px_30px_rgba(44,40,37,0.08)] ${
                  category.name === "Shoes" ? "bg-white" : "bg-[#efe8dc]"
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className={
                    category.name === "Shoes"
                      ? "object-contain object-center"
                      : "object-cover transition duration-700 ease-out group-hover:scale-105"
                  }
                  sizes="250px"
                  loading="eager"
                  crossOrigin="anonymous"
                  onLoad={(event) => {
                    // Paint the frame in the photo's own background so contained shoes have no band.
                    const color = backgroundFromImage(event.currentTarget);
                    const frame = event.currentTarget.parentElement;
                    if (color && frame) frame.style.backgroundColor = color;
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2c2825]/80 via-[#2c2825]/25 to-transparent px-4 pb-4 pt-20">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/70">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="section-heading mt-1 text-white">{category.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
