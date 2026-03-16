"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results =
    q.length > 0
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q) ||
            p.categoryId.includes(q) ||
            (p.subcategory?.toLowerCase().includes(q) ?? false)
        )
      : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold mb-6">Search</h1>
      <input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--cream)]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{product.color}</p>
            <p className="font-medium line-clamp-2 group-hover:text-[var(--accent)]">
              {product.name}
            </p>
            <p className="text-sm font-medium">{formatPrice(product.price)}</p>
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
