"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { navCategories } from "@/data/categories";
import { assets } from "@/data/assets";
import { useState } from "react";

export function Header() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openNavId, setOpenNavId] = useState<string | null>(null);
  const [openMobileSubId, setOpenMobileSubId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Promo bar */}
        <div className="hidden sm:flex items-center justify-center py-2 text-xs tracking-wide text-[var(--muted)] animate-fade-down">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Free shipping on orders above Rs. 2,500
          </span>
        </div>

        <div className="flex items-center justify-between h-16 md:h-[72px] animate-fade-down animation-delay-100">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--cream)] transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setOpenNavId(cat.id)}
                onMouseLeave={() => setOpenNavId(null)}
              >
                <Link
                  href={`/${cat.slug}`}
                  className="px-3.5 py-2 text-[14px] font-medium text-[var(--foreground)] hover:text-[var(--accent)] rounded-lg hover:bg-[var(--cream)]/60 transition-all duration-200"
                >
                  {cat.name}
                </Link>
                {openNavId === cat.id && (
                  <div className="absolute left-0 top-full pt-2 animate-scale-in">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg shadow-[var(--shadow-warm)] py-2 min-w-[220px]">
                      {cat.children.map((child) => (
                        <Link
                          key={child.slug}
                          href={`/${child.slug}`}
                          className="flex items-center px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--cream)] hover:text-[var(--accent)] transition-colors rounded-lg mx-1"
                          onClick={() => setOpenNavId(null)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center transition-all duration-300 hover:scale-105"
            aria-label="Evlevier home"
          >
            <Image
              src={assets.logo}
              alt="Evlevier"
              width={140}
              height={48}
              className="h-9 w-auto md:h-11 object-contain"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] rounded-lg hover:bg-[var(--cream)]/60 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/search"
              className="p-2.5 rounded-xl hover:bg-[var(--cream)] transition-colors duration-200"
              aria-label="Search"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button
              type="button"
              className="relative p-2.5 rounded-xl hover:bg-[var(--cream)] transition-colors duration-200"
              onClick={openCart}
              aria-label="Cart"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[var(--accent)] text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-[var(--background)]">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile profile */}
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="p-2 rounded-lg hover:bg-[var(--cream)] transition-colors duration-200"
              aria-label="Account"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" aria-hidden onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-52 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg shadow-[var(--shadow-warm)] animate-scale-in">
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--cream)] hover:text-[var(--accent)] rounded-lg mx-1 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--cream)] hover:text-[var(--accent)] rounded-lg mx-1 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign up
                  </Link>
                  <div className="my-1 mx-3 border-t border-[var(--border)]" />
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--cream)] rounded-lg mx-1 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              aria-hidden
              onClick={() => setMenuOpen(false)}
            />
            <div className="fixed top-16 left-0 right-0 z-50 md:hidden max-h-[70vh] overflow-y-auto bg-[var(--card)] border-b border-[var(--border)] shadow-xl animate-fade-down rounded-b-2xl">
              <nav className="py-3 px-4 space-y-0.5">
                {navCategories.map((cat) => {
                  const isSubOpen = openMobileSubId === cat.id;
                  const hasChildren = cat.children.length > 0;
                  return (
                    <div key={cat.id}>
                      {hasChildren ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setOpenMobileSubId((id) => (id === cat.id ? null : cat.id))}
                            className="flex items-center justify-between w-full py-3 px-2 font-medium text-left rounded-lg hover:bg-[var(--cream)] transition-colors"
                            aria-expanded={isSubOpen}
                          >
                            {cat.name}
                            <svg
                              className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isSubOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="overflow-hidden">
                              <div className="pl-4 space-y-0.5 pt-1 pb-2">
                                {cat.children.map((child) => (
                                  <Link
                                    key={child.slug}
                                    href={`/${child.slug}`}
                                    className="block py-2 px-3 text-sm text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--cream)] rounded-lg transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Link
                          href={`/${cat.slug}`}
                          className="block py-3 px-2 font-medium rounded-lg hover:bg-[var(--cream)] transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
