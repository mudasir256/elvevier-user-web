import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign up – Empulse",
  description: "Create your Empulse account for faster checkout and order tracking.",
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
          <SignupForm />
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
