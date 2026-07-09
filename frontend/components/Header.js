"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
        {/* Left: menu */}
        <div className="flex flex-1 items-center">
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            className="p-2 -ml-2 text-foreground transition hover:opacity-60"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Center: logo */}
        <Link
          href="/"
          className="font-display text-3xl font-medium tracking-[0.25em] text-foreground"
        >
          ZB
        </Link>

        {/* Right: search + cart */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <Link href="/collections" aria-label="Search" className="p-2 transition hover:opacity-60">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative p-2 transition hover:opacity-60">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>

      {/* Slide-in menu (rendered outside the blurred header so `fixed` covers the full viewport) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-background p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="eyebrow text-muted">Menu</span>
              <button
                aria-label="Close"
                onClick={() => setMenuOpen(false)}
                className="p-1 transition hover:opacity-60"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>
            <ul className="space-y-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-2xl text-foreground transition hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Admin access */}
            <div className="absolute inset-x-6 bottom-6 border-t border-border pt-5">
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-foreground transition hover:bg-foreground hover:text-background"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 4 5v6c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V5l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">Admin Panel</span>
                  <span className="text-xs opacity-60 group-hover:opacity-80">Manage artwork</span>
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="ml-auto"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
