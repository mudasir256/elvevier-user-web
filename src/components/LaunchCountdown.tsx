"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/assets";
import { LAUNCH_AT } from "@/lib/launch";

const DAY = 24 * 60 * 60 * 1000;

function secondsLeft() {
  return Math.max(0, Math.ceil((LAUNCH_AT - Date.now()) / 1000));
}

function Unit({ value, label }: { value: number | null; label: string }) {
  const digits = value === null ? "--" : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex min-w-[5.25rem] justify-center overflow-hidden rounded-[1.4rem] border border-[#eadfe4] bg-white/80 px-3 py-4 shadow-[0_18px_45px_rgba(74,20,42,0.10)] backdrop-blur-sm sm:min-w-[7rem] md:min-w-[9.5rem] md:rounded-[1.9rem] md:px-6 md:py-7">
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#4a142a]/[0.06]" aria-hidden="true" />
        {digits.split("").map((digit, index) => (
          <span
            key={`${index}-${digit}`}
            className="countdown-digit inline-block w-[0.62em] text-center text-5xl font-semibold leading-none tabular-nums text-[#4a142a] sm:text-6xl md:text-8xl"
          >
            {digit}
          </span>
        ))}
      </div>
      <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a7f78] md:text-xs">{label}</span>
    </div>
  );
}

function Colon() {
  return (
    <span
      className="countdown-blink -mt-7 select-none text-3xl font-light text-[#c989a3] sm:text-4xl md:-mt-9 md:text-6xl"
      aria-hidden="true"
    >
      :
    </span>
  );
}

export function LaunchCountdown() {
  // Null until mounted so the server render and the first client render match.
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(secondsLeft());
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, []);

  const live = left === 0;

  // At launch the proxy stops showing this page, so a reload opens the store.
  useEffect(() => {
    if (!live) return;
    const timer = setTimeout(() => window.location.replace("/"), 2500);
    return () => clearTimeout(timer);
  }, [live]);

  const days = left === null ? null : Math.floor(left / 86400);
  const hours = left === null ? null : Math.floor((left % 86400) / 3600);
  const minutes = left === null ? null : Math.floor((left % 3600) / 60);
  const seconds = left === null ? null : left % 60;
  // How far through the final day we are, for the progress line.
  const progress = left === null ? 0 : Math.min(100, Math.max(0, 100 - (left * 1000 * 100) / DAY));

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#faf8f5] px-4 py-16 text-center">
      <div
        className="countdown-glow pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#c989a3]/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="countdown-glow pointer-events-none absolute -bottom-48 -right-40 h-[38rem] w-[38rem] rounded-full bg-[#4a142a]/[0.12] blur-3xl [animation-delay:-7s]"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-4xl flex-col items-center">
        <Image src={assets.logo} alt="Empulse" width={2045} height={392} priority className="h-10 w-auto md:h-14" />

        <p className="eyebrow mt-12 flex items-center gap-3">
          <span className="h-px w-8 bg-[#c989a3]" aria-hidden="true" />
          {live ? "We are live" : "Opening 1 November"}
          <span className="h-px w-8 bg-[#c989a3]" aria-hidden="true" />
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-tight text-[#2c2825] sm:text-4xl md:text-6xl">
          {live ? "Welcome to Empulse" : "The wait is almost over"}
        </h1>
        <p className="type-copy mt-4 max-w-lg text-[#6b6560]">
          {live
            ? "The store is open. Taking you there now…"
            : "Original fashion, footwear and lifestyle, delivered across Pakistan. Our doors open in"}
        </p>

        {live ? (
          <Link
            href="/"
            className="mt-10 rounded-full bg-[#4a142a] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(74,20,42,0.28)] transition hover:bg-[#350e1e]"
          >
            Enter the store
          </Link>
        ) : (
          <>
            <div
              className="mt-10 flex items-center justify-center gap-2 sm:gap-4 md:gap-6"
              role="timer"
              aria-live="off"
              aria-label={
                left === null ? "Countdown to launch" : `${hours} hours, ${minutes} minutes and ${seconds} seconds until launch`
              }
            >
              {days ? (
                <>
                  <Unit value={days} label={days === 1 ? "Day" : "Days"} />
                  <Colon />
                </>
              ) : null}
              <Unit value={hours} label="Hours" />
              <Colon />
              <Unit value={minutes} label="Minutes" />
              <Colon />
              <Unit value={seconds} label="Seconds" />
            </div>

            <div className="mt-10 w-full max-w-md">
              <div className="h-1.5 overflow-hidden rounded-full bg-[#4a142a]/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c989a3] to-[#4a142a] transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-xs font-medium tracking-wide text-[#8a7f78]">
                Sunday, 1 November · 12:00 AM (PKT)
              </p>
            </div>
          </>
        )}

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#4a142a]/80">
          <li>Nationwide delivery</li>
          <li className="text-[#c989a3]" aria-hidden="true">•</li>
          <li>100% original</li>
          <li className="text-[#c989a3]" aria-hidden="true">•</li>
          <li>First check then pay</li>
        </ul>
      </div>
    </main>
  );
}
