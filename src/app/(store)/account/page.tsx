import type { Metadata } from "next";
import { AccountView } from "@/components/AccountView";

export const metadata: Metadata = {
  title: "Profile – Empulse",
  description: "View your Empulse orders and update your account.",
};

export default function AccountPage() {
  return <AccountView />;
}
