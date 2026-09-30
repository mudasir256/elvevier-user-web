import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { Reels } from "@/components/Reels";
import { BlogCard } from "@/components/BlogCard";
import { ShopByStyle } from "@/components/ShopByStyle";
import { blogs } from "@/data/blogs";
import { getActiveProducts } from "@/lib/catalog";
import { assets } from "@/data/assets";
import type { Product } from "@/types";

const styleCategories: {
  name: string;
  href: string;
  match: (product: Product) => boolean;
}[] = [
  { name: "Shoes", href: "/shoes", match: (product) => product.categoryId === "shoes" },
  { name: "Jackets", href: "/jackets", match: (product) => product.subcategory?.toLowerCase() === "jacket" },
  { name: "Hoodies", href: "/hoodies", match: (product) => product.subcategory?.toLowerCase() === "hoodie" },
  { name: "Sweatshirts", href: "/sweatshirts", match: (product) => product.subcategory?.toLowerCase() === "sweatshirt" },
  { name: "Trousers", href: "/trousers", match: (product) => product.subcategory?.toLowerCase() === "trouser" },
  { name: "Jeans", href: "/jeans", match: (product) => product.subcategory?.toLowerCase() === "jeans" },
];

export default async function HomePage() {
  const catalog = await getActiveProducts();
  const newProducts = catalog.filter((product) => product.new);
  const styles = styleCategories.flatMap((category) => {
    const product = catalog.find(category.match);
    if (!product) return [];
    return [{ name: category.name, href: category.href, image: product.image }];
  });

  return (
    <div className="grain-overlay">
      <HeroSlider />

      {/* New Arrivals */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 pt-16 pb-6 md:pt-20">
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

      <ShopByStyle categories={styles} />

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
