"use client";

import { useEffect, useRef, useState } from "react";
import { useCenterTransition } from "@/components/animation/CenterTransition";

const NAV_LINKS = [
  { label: "Work", href: "#capabilities" },
  { label: "About", href: "#story" },
  { label: "Services", href: "#philosophy" },
] as const;

// Monogram wordmark
function Wordmark() {
  return (
    <a
      href="/"
      id="nav-wordmark"
      className="group flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
      aria-label="Home"
    >
      {/* Mark */}
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-white text-black text-[11px] font-bold tracking-[0.05em] group-hover:bg-zinc-200 transition-colors duration-300"
        aria-hidden
      >
        S
      </span>
      <span className="hidden sm:inline text-[13px] font-medium tracking-tight text-zinc-300 group-hover:text-white transition-colors duration-300">
        Studio
      </span>
    </a>
  );
}

export default function Navbar() {
  const { trigger } = useCenterTransition();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handlePortalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    trigger("/page3");
  };

  return (
    <>
      {/* Skip link */}
      <a
        href="#story"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black focus:outline-none"
      >
        Skip to content
      </a>

      {/* Primary Navbar */}
      <header
        id="site-navbar"
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out"
        style={{
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid transparent",
          background: scrolled
            ? "rgba(5,5,8,0.72)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(150%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(150%)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
          {/* Left: Wordmark */}
          <Wordmark />

          {/* Center: Navigation Links (desktop) */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="relative text-[13px] font-medium text-zinc-300 hover:text-white transition-colors duration-200 ease-out group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
              >
                {label}
                {/* Underline micro-animation */}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-white/80 group-hover:w-full transition-all duration-300 ease-out"
                  aria-hidden
                />
              </a>
            ))}
          </nav>

          {/* Right: Contact + Spatial portal */}
          <div className="flex items-center gap-3">
            <a
              href="#philosophy"
              id="nav-contact"
              className="hidden sm:inline-flex items-center text-[13px] font-medium text-zinc-200 hover:text-white transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded px-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
            >
              Contact
            </a>

            {/* Spatial transition trigger */}
            <button
              id="nav-spatial-trigger"
              onClick={handlePortalClick}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-[12px] font-medium text-zinc-300 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            >
              Spatial
              <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors" aria-hidden>↗</span>
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              id="nav-mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="md:hidden relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 cursor-pointer"
            >
              <span
                className="block h-px w-5 bg-white/70 transition-all duration-300"
                style={{
                  transform: mobileOpen ? "translateY(5px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-px w-5 bg-white/70 transition-all duration-300"
                style={{
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? "scaleX(0)" : "none",
                }}
              />
              <span
                className="block h-px w-5 bg-white/70 transition-all duration-300"
                style={{
                  transform: mobileOpen ? "translateY(-5px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 md:hidden"
          style={{
            background: "rgba(5,5,8,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Close tap area */}
          <div
            className="absolute inset-0"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <nav
            className="relative flex flex-col justify-center items-center h-full gap-10"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-medium tracking-tight text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ))}
            <a
              href="#philosophy"
              onClick={() => setMobileOpen(false)}
              className="text-3xl font-medium tracking-tight text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
            <button
              id="mobile-spatial-trigger"
              onClick={handlePortalClick}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:border-white/50 transition-all duration-300 cursor-pointer"
            >
              Enter Spatial World ↗
            </button>
          </nav>
        </div>
      )}
    </>
  );
}