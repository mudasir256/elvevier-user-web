import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import {
  getNewProducts,
  getProductsByCategory,
} from "@/lib/catalog";
import { assets } from "@/data/assets";

const browseCategories = [
  { name: "Shoes", href: "/shoes" },
  { name: "Trouser", href: "/search?q=trouser" },
  { name: "Sweatshirt", href: "/search?q=sweater" },
  { name: "Jeans", href: "/search?q=jeans" },
  { name: "Hoodies", href: "/search?q=hoodie" },
  { name: "Jackets", href: "/search?q=jacket" },
];

export default async function HomePage() {
  const newProducts = await getNewProducts();
  const shoes = (await getProductsByCategory("shoes")).slice(0, 5);
  const bags = (await getProductsByCategory("bags")).slice(0, 5);

  return (
    <div className="grain-overlay">
      <HeroSlider />

      <section className="border-y border-[#e7d0da] bg-[#f4e6ec] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-8 animate-fade-up text-center text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Browse by Category
          </p>
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

      {/* Shoes */}
      <section className="bg-[radial-gradient(ellipse_at_top,#f4e6ec_0%,var(--background)_70%)] py-20">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 animate-fade-up">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-2">Step Into Comfort</p>
              <h2 className="section-heading text-3xl md:text-4xl font-semibold">Shoes</h2>
            </div>
            <Link
              href="/shoes"
              className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors duration-200 flex items-center gap-1 group"
            >
              View all
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7">
            {shoes.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* End of Season Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-2">Limited Time</p>
          <h2 className="section-heading text-3xl md:text-4xl font-semibold">End of Season</h2>
          <p className="text-[var(--muted)] mt-3 max-w-md mx-auto">Timeless styles at exceptional prices. Shop before they&apos;re gone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link
            href="/women"
            className="relative block aspect-[3/4] md:aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--cream)] group animate-fade-up animation-delay-100"
          >
            <Image
              src={assets.saleBanner1}
              alt="Sale – Women"
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm uppercase tracking-[0.15em] text-[var(--cream)]/80 mb-1">Women&apos;s Collection</p>
              <span className="inline-block py-2.5 px-6 bg-[var(--cream)] text-[var(--foreground)] font-medium rounded-full text-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-lg">
                Shop Women
              </span>
            </div>
          </Link>
          <Link
            href="/men"
            className="relative block aspect-[3/4] md:aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--cream)] group animate-fade-up animation-delay-200"
          >
            <Image
              src={assets.saleBanner2}
              alt="Sale – Men"
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm uppercase tracking-[0.15em] text-[var(--cream)]/80 mb-1">Men&apos;s Collection</p>
              <span className="inline-block py-2.5 px-6 bg-[var(--cream)] text-[var(--foreground)] font-medium rounded-full text-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-lg">
                Shop Men
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Bags */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10 animate-fade-up">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-2">Carry in Style</p>
            <h2 className="section-heading text-3xl md:text-4xl font-semibold">Bags</h2>
          </div>
          <Link
            href="/bags"
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors duration-200 flex items-center gap-1 group"
          >
            View all
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7">
          {bags.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Lifestyle image break */}
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
    </div>
  );
}
