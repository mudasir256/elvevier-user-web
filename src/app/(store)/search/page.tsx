import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/catalog";
import { SearchView } from "./SearchView";

export const metadata: Metadata = {
  title: "Search – Empulse",
  description: "Search the Empulse catalog.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await getActiveProducts();
  return <SearchView initialProducts={products} initialQuery={q ?? ""} />;
}
