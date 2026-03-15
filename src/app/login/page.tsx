import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login – Evlevier",
  description: "Sign in to your Evlevier account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16 bg-warm-radial">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-3">Welcome Back</p>
          <h1 className="section-heading text-3xl md:text-4xl font-semibold">
            Sign In
          </h1>
          <p className="text-[var(--muted)] mt-2 text-sm">
            Track orders and save your favourites.
          </p>
        </div>

        <div className="card-warm p-8 animate-fade-up animation-delay-100">
          <form className="space-y-5" action="#" method="post">
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input-warm"
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Sign In
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[var(--muted)] text-sm animate-fade-up animation-delay-200">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
