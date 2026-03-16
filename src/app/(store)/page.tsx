import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import {
  getFeaturedProducts,
  getNewProducts,
  getProductsByCategory,
} from "@/data/products";
import { navCategories } from "@/data/categories";
import { assets } from "@/data/assets";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newProducts = getNewProducts();
  const shoes = getProductsByCategory("shoes").slice(0, 5);
  const bags = getProductsByCategory("bags").slice(0, 5);

  return (
    <div className="grain-overlay">
      {/* Hero */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={assets.hero}
            alt=""
            fill
            className="object-cover scale-105"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--foreground)]/30 via-[var(--foreground)]/40 to-[var(--foreground)]/60" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <p className="text-sm md:text-base uppercase tracking-[0.25em] text-[var(--cream)]/80 mb-4 animate-fade-down">
            Spring / Summer 2026
          </p>
          <h1 className="section-heading text-5xl md:text-7xl lg:text-8xl font-semibold text-[var(--cream)] animate-fade-up">
            Cozy, always
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[var(--cream)]/90 max-w-md mx-auto leading-relaxed animate-fade-up animation-delay-200">
            New arrivals crafted for comfort — timeless pieces for everyone.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center animate-fade-up animation-delay-400">
            <Link
              href="/women"
              className="px-8 py-3.5 bg-[var(--cream)] text-[var(--foreground)] font-medium rounded-full hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Shop Women
            </Link>
            <Link
              href="/men"
              className="px-8 py-3.5 border-2 border-[var(--cream)]/80 text-[var(--cream)] font-medium rounded-full hover:bg-[var(--cream)] hover:text-[var(--foreground)] transition-all duration-300 hover:scale-105"
            >
              Shop Men
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <svg className="w-6 h-6 text-[var(--cream)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Shipping banner */}
      <div className="bg-[var(--accent)] text-white text-center py-3.5 text-sm font-medium tracking-wide animate-fade-in">
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Free shipping on orders above Rs. 2,500
        </span>
      </div>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
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

      {/* Feature strip - brand values */}
      <section className="bg-[var(--cream)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center animate-fade-up">
            {[
              { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", label: "Free Shipping", sub: "Above Rs. 2,500" },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "Easy Returns", sub: "14-day policy" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Secure Payment", sub: "100% protected" },
              { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Made with Care", sub: "Quality crafted" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--foreground)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shoes */}
      <section className="bg-warm-radial py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

      {/* Categories strip */}
      <section className="py-14 bg-[var(--cream)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm uppercase tracking-[0.2em] text-[var(--muted)] mb-8 animate-fade-up">Browse by Category</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 animate-fade-up animation-delay-100">
            {navCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="px-6 py-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-sm transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bags */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
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
          alt="Evlevier lifestyle"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--foreground)]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-lg animate-fade-up">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--cream)]/80 mb-3">The Evlevier Way</p>
              <h2 className="section-heading text-3xl md:text-5xl font-semibold text-[var(--cream)] leading-tight">
                Fashion that feels like home
              </h2>
              <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-[var(--cream)] font-medium hover:gap-3 transition-all duration-300">
                Our story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[var(--foreground)] text-[var(--cream)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--accent)] blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--accent-soft)] blur-[100px]" />
        </div>
        <div className="relative max-w-xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent-soft)] mb-3 animate-fade-up">Join the Family</p>
          <h2 className="section-heading text-3xl md:text-4xl font-semibold animate-fade-up animation-delay-100">
            Sign up & save 10%
          </h2>
          <p className="mt-3 text-[var(--muted)] animate-fade-up animation-delay-200">
            Get early access to new drops, exclusive offers, and cozy style inspiration.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-fade-up animation-delay-300">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-[var(--cream)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-transparent transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              className="px-7 py-3.5 bg-[var(--accent)] text-white font-medium rounded-full hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-[var(--muted)]/70 animate-fade-up animation-delay-400">No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
