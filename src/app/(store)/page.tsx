import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { Reels } from "@/components/Reels";
import { BlogCard } from "@/components/BlogCard";
import { blogs } from "@/data/blogs";
import { getActiveProducts } from "@/lib/catalog";
import { assets } from "@/data/assets";
import type { Product } from "@/types";

const browseCategories: {
  name: string;
  href: string;
  menHref: string;
  womenHref: string;
  eyebrow: string;
  match: (product: Product) => boolean;
}[] = [
  { name: "Shoes", href: "/shoes", menHref: "/shoes/men", womenHref: "/shoes/women", eyebrow: "Step Into Comfort", match: (product) => product.categoryId === "shoes" },
  { name: "Trouser", href: "/search?q=trouser", menHref: "/men?type=trouser", womenHref: "/women?type=trouser", eyebrow: "Tailored Ease", match: (product) => product.subcategory?.toLowerCase() === "trouser" },
  { name: "Sweatshirt", href: "/search?q=sweatshirt", menHref: "/men?type=sweatshirt", womenHref: "/women?type=sweatshirt", eyebrow: "Soft Layers", match: (product) => product.subcategory?.toLowerCase() === "sweatshirt" },
  { name: "Jeans", href: "/search?q=jeans", menHref: "/men?type=jeans", womenHref: "/women?type=jeans", eyebrow: "Everyday Denim", match: (product) => product.subcategory?.toLowerCase() === "jeans" },
  { name: "Hoodies", href: "/search?q=hoodie", menHref: "/men?type=hoodie", womenHref: "/women?type=hoodie", eyebrow: "Easy Warmth", match: (product) => product.subcategory?.toLowerCase() === "hoodie" },
  { name: "Jackets", href: "/search?q=jacket", menHref: "/men?type=jacket", womenHref: "/women?type=jacket", eyebrow: "Layer Up", match: (product) => product.subcategory?.toLowerCase() === "jacket" },
];

export default async function HomePage() {
  const catalog = await getActiveProducts();
  const newProducts = catalog.filter((product) => product.new);

  return (
    <div className="grain-overlay">
      <HeroSlider />

      <section className="border-y border-[#e7d0da] bg-[#f4e6ec] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-8 animate-fade-up text-center text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Browse by Category
          </p>
          <div className="mb-5 flex animate-fade-up flex-wrap justify-center gap-3">
            <Link
              href="/men"
              className="rounded-full bg-[#4a142a] px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#350e1e]"
            >
              Men
            </Link>
            <Link
              href="/women"
              className="rounded-full bg-[#4a142a] px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#350e1e]"
            >
              Women
            </Link>
          </div>
          <div className="flex animate-fade-up flex-wrap justify-center gap-3 animation-delay-100 md:gap-4">
            {browseCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10 animate-fade-up">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-2">Just Dropped</p>
            <h2 className="section-heading text-3xl md:text-4xl font-semibold">New Arrivals</h2>
          </div>
          <Link
            href="/women?filter=new"
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors duration-200 flex items-center gap-1 group"
          >
            View all
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7">
          {newProducts.slice(0, 5).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {browseCategories.map((category, sectionIndex) => {
        const products = catalog.filter(category.match).slice(0, 5);
        if (products.length === 0) return null;
        return (
          <section
            key={category.name}
            className={sectionIndex % 2 === 0 ? "bg-[radial-gradient(ellipse_at_top,#f4e6ec_0%,var(--background)_70%)] py-20" : "py-20"}
          >
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
              <div className="mb-10 flex items-end justify-between animate-fade-up">
                <div>
                  <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">{category.eyebrow}</p>
                  <h2 className="section-heading text-3xl font-semibold md:text-4xl">{category.name}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={category.menHref} className="text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]">
                    Men
                  </Link>
                  <Link href={category.womenHref} className="text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]">
                    Women
                  </Link>
                  <Link
                    href={category.href}
                    className="group flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--accent-hover)]"
                  >
                    View all
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-7 lg:grid-cols-5">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <Reels />

      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={assets.fashion}
          alt="Empulse lifestyle"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--foreground)]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-lg animate-fade-up">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--cream)]/80 mb-3">The Empulse Way</p>
              <h2 className="section-heading text-3xl md:text-5xl font-semibold text-[var(--cream)] leading-tight">
                Fashion that feels like home
              </h2>
              <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-[var(--cream)] font-medium hover:gap-3 transition-all duration-300">
                Our story
                <svg className="w-4 h-4 text-[#4a142a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">The journal</p>
            <h2 className="section-heading text-3xl font-semibold md:text-4xl">Blogs</h2>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--accent-hover)]"
          >
            View all
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
