import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout – Evlevier",
  description: "Complete your order. Enter address and payment details.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
