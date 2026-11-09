"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { STORE_SALE, salePhase } from "@/lib/campaign";

// The current time, checked every 15 seconds so the sale ends on time on an open page. null until the page is on screen, so the
// server render and the first browser render match.
export function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

// The announcement bar at the very top. Shows the store-wide sale while it is live,
// and the usual offer ticker otherwise.
export function SaleBar({ fallback }: { fallback: React.ReactNode }) {
  const now = useNow();
  const phase = salePhase(now ?? Date.now());
  const router = useRouter();
  const { refreshCart } = useCart();
  const seenPhase = useRef(phase);

  // When the sale starts or ends while the page is open, load the new prices straight away.
  useEffect(() => {
    if (now === null || seenPhase.current === phase) return;
    const priceChanged = seenPhase.current === "live" || phase === "live";
    seenPhase.current = phase;
    if (!priceChanged) return;
    router.refresh();
    refreshCart();
  }, [now, phase, router, refreshCart]);

  if (phase !== "live") return <>{fallback}</>;

  return (
    <div className="bg-[#4a142a] text-white" role="region" aria-label={STORE_SALE.name}>
      <div className="mx-auto flex max-w-[90rem] items-center justify-center gap-2 px-3 py-2 text-[11px] sm:gap-3 sm:text-xs">
        <span className="shrink-0 rounded-full bg-[#c989a3] px-2 py-0.5 font-bold tracking-wide text-[#4a142a]">
          {STORE_SALE.short}
        </span>
        <span className="min-w-0 truncate font-medium uppercase tracking-[0.14em]">
          Sale is live · {STORE_SALE.percent}% off everything<span className="hidden sm:inline"> · no code needed</span>
        </span>
      </div>
    </div>
  );
}
