import type { Metadata } from "next";
import Image from "next/image";
import { assets } from "@/data/assets";

export const metadata: Metadata = {
  title: "Coming soon",
  description: "Empulse is opening soon. Fashion, footwear, and lifestyle.",
};

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f5] px-6 py-16 text-center">
      <Image
        src={assets.logo}
        alt="Empulse"
        width={2045}
        height={392}
        priority
        className="h-12 w-auto md:h-16"
      />
      <p className="mt-12 text-xs font-semibold uppercase tracking-[0.32em] text-[#4a142a]">Opening soon</p>
      <h1 className="mt-4 font-serif text-5xl font-semibold tracking-tight text-[#2c2825] md:text-7xl">Coming soon</h1>
      <p className="mt-5 max-w-md text-base leading-7 text-[#6b6560]">
        Fashion, footwear, and lifestyle. A new Empulse store is on the way.
      </p>
    </main>
  );
}
