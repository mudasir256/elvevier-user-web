"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import type { Product } from "@/types";
import { catalogApi, useGetProductsQuery } from "@/store/catalogApi";
import type { AppDispatch } from "@/store/store";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export function SearchView({ initialProducts }: { initialProducts: Product[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(catalogApi.util.upsertQueryData("getProducts", undefined, initialProducts));
    setReady(true);
  }, [dispatch, initialProducts]);

  const { data } = useGetProductsQuery(undefined, {
    skip: !ready,
    refetchOnMountOrArgChange: 120,
  });
  const products = data ?? initialProducts;
  const q = query.trim().toLowerCase();
  const results =
    q.length > 0
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(q) ||
            product.color.toLowerCase().includes(q) ||
            product.categoryId.includes(q) ||
            (product.subcategory?.toLowerCase().includes(q) ?? false)
        )
      : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold mb-6">Search</h1>
      <input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        autoFocus
      />
      {query && (
        <p className="mt-4 text-sm text-[var(--muted)]">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
        {results.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} className="group flex h-full flex-col">
            <div className="relative aspect-[3/4] shrink-0 overflow-hidden rounded-xl bg-[var(--cream)]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
            <p className="mt-2 h-5 truncate text-sm text-[var(--muted)]">{product.color}</p>
            <p className="h-12 overflow-hidden font-medium leading-6 line-clamp-2 group-hover:text-[var(--accent)]">
              {product.name}
            </p>
            <p className="mt-auto pt-1 text-sm font-medium">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
      {query && results.length === 0 && (
        <p className="text-center text-[var(--muted)] py-12">
          No products found for &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  );
}
