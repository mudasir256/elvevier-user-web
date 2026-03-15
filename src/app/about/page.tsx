import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/data/assets";

export const metadata: Metadata = {
  title: "About Us – Evlevier",
  description:
    "Learn about Evlevier – cozy fashion for everyone. Meet our CEO Arsal Ali. Quality clothing, shoes and accessories for men, women and kids.",
};

export default function AboutPage() {
  return (
    <div className="bg-warm-radial">
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-[var(--cream)] py-20 md:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--accent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)] font-medium mb-4 animate-fade-down">Our Story</p>
          <h1 className="section-heading text-4xl md:text-5xl font-semibold animate-fade-up">
            About Evlevier
          </h1>
          <p className="mt-5 text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed animate-fade-up animation-delay-100">
            Built around one idea: cozy, always. We believe everyone
            deserves quality clothing that feels good and lasts.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        {/* Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 animate-fade-up animation-delay-200">
          <div className="card-warm p-8">
            <div className="w-12 h-12 rounded-full bg-[var(--cream)] flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-[var(--muted)] leading-relaxed text-sm">
              Quality clothing, shoes and accessories for men, women and kids.
              We focus on timeless pieces and seasonal drops so you can dress
              for the moment without the clutter.
            </p>
          </div>
          <div className="card-warm p-8">
            <div className="w-12 h-12 rounded-full bg-[var(--cream)] flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold mb-3">Our Promise</h3>
            <p className="text-[var(--muted)] leading-relaxed text-sm">
              Free shipping on orders above Rs. 2,500 is our way of making
              quality fashion a little more accessible. Easy returns within
              14 days, no questions asked.
            </p>
          </div>
        </div>

        {/* CEO section */}
        <section className="card-warm p-8 md:p-10 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-6">Leadership</p>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative w-full sm:w-52 aspect-square rounded-2xl overflow-hidden bg-[var(--cream)] shrink-0 shadow-md shadow-[var(--shadow-warm)]">
              <Image
                src={assets.ceo}
                alt="Arsal Ali – CEO, Evlevier"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 208px"
                priority
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
                Arsal Ali
              </h3>
              <p className="text-sm text-[var(--accent)] mt-1 font-medium">Chief Executive Officer</p>
              <p className="text-[var(--muted)] leading-relaxed mt-5 text-sm">
                Arsal Ali leads Evlevier from Lahore, bringing a clear vision for
                accessible, quality fashion. Under his leadership, Evlevier has grown
                around the idea of cozy, always — offering thoughtful clothing,
                shoes and accessories for men, women and kids.
              </p>
              <p className="text-[var(--muted)] leading-relaxed mt-3 text-sm">
                From Lahore to the rest of Pakistan, Arsal is focused on making
                everyday style easy and enjoyable for everyone.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center animate-fade-up">
          <p className="text-[var(--muted)] mb-6">
            Thank you for being here. We&apos;d love to hear from you.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
