"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type StyleCategory = {
  name: string;
  href: string;
  image: string;
};

export function ShopByStyle({ categories }: { categories: StyleCategory[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = () => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [categories.length]);

  const scrollByCard = (direction: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("a");
    const amount = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!categories.length) return null;

  return (
    <section className="py-14 md:py-16" aria-label="Shop by style">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.28em] text-[#4a142a]">Explore</p>
            <h2 className="section-heading text-3xl font-semibold md:text-4xl">Shop By Style</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous styles"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4ddd2] bg-white text-[#4a142a] transition hover:border-[#4a142a] disabled:opacity-35"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next styles"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
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
          className="flex gap-5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group w-[72vw] shrink-0 sm:w-[230px] md:w-[250px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[#efe8dc] shadow-[0_10px_30px_rgba(44,40,37,0.08)]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  sizes="250px"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2c2825]/80 via-[#2c2825]/25 to-transparent px-4 pb-4 pt-20">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/70">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-serif text-[1.65rem] leading-none text-white">{category.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
