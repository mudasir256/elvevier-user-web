import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/catalog";
import { SearchView } from "./SearchView";
import { privateMeta } from "@/lib/site";

export const metadata: Metadata = privateMeta({
  title: "Search",
  description: "Search the Empulse catalog.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await getActiveProducts();
  return <SearchView initialProducts={products} initialQuery={q ?? ""} />;
}
