"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/data/assets";

export function HeroMedia() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [mobileReady, setMobileReady] = useState(false);
  const [desktopReady, setDesktopReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const sync = () => {
      const [mobile, desktop] = frame.querySelectorAll("img");
      if (mobile?.complete && mobile.naturalWidth > 0) setMobileReady(true);
      if (desktop?.complete && desktop.naturalWidth > 0) setDesktopReady(true);
    };
    sync();
    const images = frame.querySelectorAll("img");
    images.forEach((image) => image.addEventListener("load", sync));
    return () => images.forEach((image) => image.removeEventListener("load", sync));
  }, []);

  return (
    <div ref={frameRef} className="relative mx-auto aspect-[1122/1402] h-auto w-full overflow-hidden rounded-[28px] bg-[#f4e6ec] md:aspect-[1958/803]">
      {!mobileReady ? <div className="skeleton absolute inset-0 z-10 md:hidden" aria-hidden /> : null}
      {!desktopReady ? <div className="skeleton absolute inset-0 z-10 hidden md:block" aria-hidden /> : null}
      <Image
        src={assets.heroMobile}
        alt="Empulse, we sell all original brands, coming soon"
        fill
        priority
        className="object-cover object-center md:hidden"
        sizes="100vw"
        onLoad={() => setMobileReady(true)}
      />
      <Image
        src={assets.hero}
        alt="Empulse, we sell all original brands, coming soon"
        fill
        priority
        className="hidden object-cover object-center md:block"
        sizes="100vw"
        onLoad={() => setDesktopReady(true)}
      />
    </div>
  );
}
