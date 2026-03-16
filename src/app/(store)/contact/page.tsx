import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Evlevier",
  description: "Get in touch with Evlevier. We're here to help with orders, returns and questions.",
};

export default function ContactPage() {
  return (
    <div className="bg-warm-radial">
      {/* Header */}
      <section className="bg-[var(--cream)] py-16 md:py-20 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)] font-medium mb-3 animate-fade-down">Get in Touch</p>
          <h1 className="section-heading text-4xl md:text-5xl font-semibold animate-fade-up">
            Contact Us
          </h1>
          <p className="text-[var(--muted)] mt-4 max-w-lg mx-auto animate-fade-up animation-delay-100">
            Have a question, feedback or need help with an order? We&apos;re here for you.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick info */}
          <div className="md:col-span-1 space-y-5 animate-fade-up">
            {[
              {
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                title: "Email",
                text: "support@evlevier.com",
              },
              {
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                title: "Location",
                text: "Lahore, Pakistan",
              },
              {
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Response",
                text: "24–48 hours on business days",
              },
            ].map((item) => (
              <div key={item.title} className="card-warm p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{item.title}</p>
                  <p className="text-sm text-[var(--muted)] mt-0.5">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-2 card-warm p-8 animate-fade-up animation-delay-100">
            <form className="space-y-5" action="#" method="post">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    Name
                  </label>
                  <input id="name" name="name" type="text" required className="input-warm" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    Email
                  </label>
                  <input id="email" name="email" type="email" required className="input-warm" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Subject
                </label>
                <select id="subject" name="subject" className="input-warm">
                  <option value="order">Order / Shipping</option>
                  <option value="return">Returns / Exchanges</option>
                  <option value="product">Product Question</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="input-warm resize-y"
                  placeholder="How can we help?"
                />
              </div>
              <button type="submit" className="btn-primary">
                Send Message
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
