"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { salePhase } from "@/lib/campaign";
import { OfferTicker } from "@/components/OfferTicker";

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

// The announcement bar at the very top: the offer ticker, led by the sale messages while the
// store-wide sale is live.
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
  return <OfferTicker sale />;
}
