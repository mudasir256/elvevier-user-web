import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { blogs } from "@/data/blogs";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Fashion Blog: Style Guides, Size Charts & Shopping Tips",
  description:
    "Empulse style guides for Pakistan: how to spot original branded clothes, shoe and jeans size charts, cash on delivery tips and outfit ideas for men and women.",
  path: "/blog",
});

export default function BlogsPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">The journal</p>
        <h1 className="section-heading">Blogs</h1>
        <p className="type-copy mt-3 text-[var(--muted)]">
          Style guides, size charts and shopping tips for buying original fashion in Pakistan.
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
