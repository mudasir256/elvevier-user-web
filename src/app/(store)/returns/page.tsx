import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchanges – Evlevier",
  description:
    "How to return or exchange your Evlevier order. Easy process within 14 days.",
};

const steps = [
  {
    num: "01",
    title: "Contact us",
    text: "Reach out via the Contact Us page or email with your order number.",
  },
  {
    num: "02",
    title: "Get approval",
    text: "We'll confirm eligibility and send you return instructions.",
  },
  {
    num: "03",
    title: "Ship it back",
    text: "Pack the item securely and ship it to the address we provide.",
  },
  {
    num: "04",
    title: "Refund or exchange",
    text: "Once inspected, we'll process your refund or ship the exchange.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="bg-warm-radial">
      {/* Header */}
      <section className="bg-[var(--cream)] py-16 md:py-20 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)] font-medium mb-3 animate-fade-down">Easy Returns</p>
          <h1 className="section-heading text-4xl md:text-5xl font-semibold animate-fade-up">
            Returns & Exchanges
          </h1>
          <p className="text-[var(--muted)] mt-4 animate-fade-up animation-delay-100">
            14-day hassle-free returns on all eligible items.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Eligibility */}
        <div className="card-warm p-6 md:p-8 mb-10 animate-fade-up">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--foreground)] mb-2">Eligibility</h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Items must be unused, unwashed and in original packaging with tags
                attached. We accept returns and exchanges within 14 days of delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-6 animate-fade-up">How It Works</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`card-warm p-6 animate-fade-up ${i === 1 ? "animation-delay-100" : i === 2 ? "animation-delay-200" : i === 3 ? "animation-delay-300" : ""}`}
            >
              <span className="text-2xl font-serif font-semibold text-[var(--accent-soft)]">{step.num}</span>
              <h3 className="font-medium text-[var(--foreground)] mt-2 mb-1.5">{step.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up">
          <div className="card-warm p-6">
            <h3 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-2">Refunds</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Refunds are issued to the original payment method within 5–7 business
              days after we receive the return. Exchanges ship as soon as approved.
            </p>
          </div>
          <div className="card-warm p-6">
            <h3 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-2">Non-Returnable Items</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              For hygiene reasons, certain items may not be returnable. This is
              noted on product pages. Sale items may have different terms.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center animate-fade-up">
          <Link href="/contact" className="btn-primary">
            Start a Return
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
