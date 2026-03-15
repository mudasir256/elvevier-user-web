import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up – Evlevier",
  description: "Create your Evlevier account for faster checkout and order tracking.",
};

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16 bg-warm-radial">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-3">Join the Family</p>
          <h1 className="section-heading text-3xl md:text-4xl font-semibold">
            Create Account
          </h1>
          <p className="text-[var(--muted)] mt-2 text-sm">
            Faster checkout, order tracking and early access to drops.
          </p>
        </div>

        <div className="card-warm p-8 animate-fade-up animation-delay-100">
          <form className="space-y-5" action="#" method="post">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="input-warm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input-warm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                className="input-warm"
                placeholder="At least 8 characters"
              />
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                Must be at least 8 characters.
              </p>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Create Account
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[var(--muted)] text-sm animate-fade-up animation-delay-200">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
