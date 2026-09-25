"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { assets } from "@/data/assets";

const slides = [
  { src: assets.hero, alt: "Empulse spring collection" },
  { src: assets.fashion, alt: "Burgundy knit dress" },
  { src: assets.paris, alt: "Empulse street style" },
  { src: assets.saleBanner1, alt: "Empulse women collection" },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback((next: number) => {
    setIndex((next + count) % count);
  }, [count]);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count, index]);

  return (
    <section className="px-3 sm:px-4 md:px-6 pt-3 md:pt-4 pb-3 md:pb-5">
      <div className="relative min-h-[78vh] md:min-h-[82vh] rounded-[28px] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-[var(--foreground)]/30 via-[var(--foreground)]/40 to-[var(--foreground)]/50" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full min-h-[78vh] md:min-h-[82vh] p-6 sm:p-8 md:p-12 lg:p-14 text-center">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--cream)]/80 mb-4">
              Spring / Summer 2026
            </p>
            <h1 className="section-heading text-5xl md:text-6xl lg:text-7xl font-semibold text-[var(--cream)]">
              Cozy, always
            </h1>
            <p className="mt-5 text-base md:text-lg text-[var(--cream)]/90 max-w-md mx-auto leading-relaxed">
              New arrivals crafted for comfort — timeless pieces for everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/women"
                className="px-6 py-3 bg-[var(--cream)] text-[var(--foreground)] font-medium rounded-lg hover:bg-white hover:!text-[var(--foreground)] transition-colors"
              >
                Shop Women
              </Link>
              <Link
                href="/men"
                className="px-6 py-3 border border-[var(--cream)]/80 text-[var(--cream)] font-medium rounded-lg hover:bg-[var(--cream)] hover:!text-[var(--foreground)] transition-colors"
              >
                Shop Men
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-[var(--foreground)] flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-[var(--foreground)] flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/55 hover:bg-white/80"
              }`}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
