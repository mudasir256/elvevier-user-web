import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { blogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blogs – Empulse",
  description: "Notes on hoodies, trousers, jeans, and shoes from Empulse.",
};

export default function BlogsPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">The journal</p>
        <h1 className="section-heading text-4xl font-semibold md:text-5xl">Blogs</h1>
        <p className="mt-3 text-[var(--muted)]">
          Short notes on how to wear the clothes already in the shop.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {blogs.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <p className="mt-12 text-sm text-[var(--muted)]">
        <Link href="/" className="text-[#4a142a] hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
