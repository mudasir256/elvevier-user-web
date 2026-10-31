"use client";

import { useEffect, useState } from "react";
import { Confetti } from "@/components/Confetti";
import { LAUNCH_AT, hasLaunched } from "@/lib/launch";

const SEEN_KEY = "empulse-launch-celebrated";
// Visitors who arrive within this window after launch get the welcome once.
const CELEBRATE_FOR_MS = 48 * 60 * 60 * 1000;

export function LaunchCelebration() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (!hasLaunched(now) || now > LAUNCH_AT + CELEBRATE_FOR_MS) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode: still celebrate, it just may show again next visit.
    }
    setShow(true);
    const timer = setTimeout(() => setShow(false), 9000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <>
      <Confetti />
      <div className="fixed inset-x-3 bottom-20 z-[110] flex justify-center md:bottom-8" role="status">
        <div className="animate-fade-up flex max-w-md items-center gap-3 rounded-2xl border border-[#eadfe4] bg-white px-5 py-4 shadow-[0_18px_45px_rgba(74,20,42,0.22)]">
          <span className="text-2xl" aria-hidden="true">🎉</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#4a142a]">We are live!</p>
            <p className="text-xs text-[#6b6560]">Welcome to Empulse. Original fashion, delivered across Pakistan.</p>
          </div>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="rounded-full p-1.5 text-[#8a7f78] hover:bg-[#f4e6ec] hover:text-[#4a142a]"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
