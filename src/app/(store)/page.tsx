import type { Metadata } from "next";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { Reels } from "@/components/Reels";
import { BlogCard } from "@/components/BlogCard";
import { ShopByStyle } from "@/components/ShopByStyle";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { AboutUs } from "@/components/AboutUs";
import { blogs } from "@/data/blogs";
import { getActiveProducts } from "@/lib/catalog";
import type { Product } from "@/types";
import { JsonLd } from "@/components/JsonLd";
import { siteGraphJsonLd } from "@/lib/seo";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Original Fashion, Shoes & Accessories in Pakistan",
    description:
      "Shop original men's, women's and kids' clothing, shoes, belts, caps and bags at Empulse. Nationwide delivery in Pakistan. Free shipping over Rs. 5,000.",
    path: "/",
  }),
  title: { absolute: "Empulse | Original Fashion, Shoes & Accessories in Pakistan" },
};

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
      <JsonLd data={siteGraphJsonLd()} />
      <HeroSlider />

      <section className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 md:pt-14">
        <h1 className="section-heading">Original fashion, shoes and accessories</h1>
        <p className="type-copy mt-3 max-w-2xl text-[var(--muted)]">
          Empulse is a Pakistan store for men&apos;s, women&apos;s and kids&apos; clothing, shoes, belts, caps and bags.
          Original brands, nationwide delivery, and free shipping on orders above Rs. 5,000.
        </p>
      </section>

      <ShopByStyle categories={styles} />

      {/* New Arrivals */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 pt-4 pb-16 md:pb-20">
        <div className="flex items-end justify-between mb-10 animate-fade-up">
          <div>
            <p className="eyebrow mb-2">Just Dropped</p>
            <h2 className="section-heading">New Arrivals</h2>
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

      <div className="bg-[#F9F7F5]">
      <WhyChooseUs />
      <AboutUs />

      <Reels />

      <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2">The journal</p>
            <h2 className="section-heading">Blogs</h2>
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
    </div>
  );
}
