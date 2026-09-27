"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { assets } from "@/data/assets";

export function HeroSlider() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    const play = () => {
      video.play().catch(() => {});
    };
    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, []);

  return (
    <section className="px-3 sm:px-4 md:px-6 pt-3 md:pt-4 pb-3 md:pb-5">
      <div className="relative min-h-[78vh] md:min-h-[82vh] rounded-[28px] overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          src={assets.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[var(--foreground)]/30 via-[var(--foreground)]/40 to-[var(--foreground)]/50" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full min-h-[78vh] md:min-h-[82vh] p-6 sm:p-8 md:p-12 lg:p-14 text-center">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--cream)]/80 mb-4">
              Spring / Summer 2026
            </p>
            <h1 className="section-heading text-5xl md:text-6xl lg:text-7xl font-semibold text-white">
              Cozy, always
            </h1>
            <p className="mt-5 text-base md:text-lg text-[var(--cream)]/90 max-w-md mx-auto leading-relaxed">
              New arrivals crafted for comfort — timeless pieces for everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/women"
                className="px-6 py-3 bg-[#4a142a] text-white font-medium rounded-lg hover:bg-[#350e1e] hover:!text-white transition-colors"
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
      </div>
    </section>
  );
}
