import type { Metadata } from "next";
import { LaunchCountdown } from "@/components/LaunchCountdown";
import { privateMeta } from "@/lib/site";

export const metadata: Metadata = privateMeta({
  title: "Coming soon",
  description: "Empulse opens on 1 November. Fashion, footwear, and lifestyle.",
  path: "/coming-soon",
});

export default function ComingSoonPage() {
  return <LaunchCountdown />;
}
