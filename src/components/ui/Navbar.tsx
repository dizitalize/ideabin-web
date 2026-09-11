"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCenterTransition } from "@/components/animation/CenterTransition";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "FAQ", href: "#faq" },
] as const;

// Monogram wordmark matching the IdeaBin brand identity
function Wordmark({ isDark }: { isDark: boolean }) {
  return (
    <Link
      href="/"
      id="nav-wordmark"
      className="group flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
      aria-label="IdeaBin Home"
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg p-1 transition-all duration-300 ${isDark
            ? "bg-white text-black group-hover:bg-zinc-200"
            : "bg-black text-white group-hover:bg-zinc-800"
          }`}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M4 19L12 4L20 19" />
          <path d="M7 14h10" />
        </svg>
      </span>
      <span
        className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${isDark ? "text-white group-hover:text-zinc-200" : "text-neutral-900 group-hover:text-black"
          }`}
      >
        IdeaBin
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { trigger } = useCenterTransition();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    lastScrollYRef.current = typeof window !== "undefined" ? window.scrollY : 0;

    const SCROLL_DELTA_THRESHOLD = 8; // Ignore small scroll movements/micro-jitter
    const TOP_THRESHOLD = 50; // Always visible at the top of the page

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollYRef.current;

          // 1. At the top of the page: stay fully visible and sticky
          if (currentScrollY <= TOP_THRESHOLD) {
            if (!isVisibleRef.current) {
              isVisibleRef.current = true;
              setIsVisible(true);
            }
          } else if (Math.abs(diff) >= SCROLL_DELTA_THRESHOLD) {
            // 2. User scrolls DOWN: smoothly slide upward and hide
            if (diff > 0) {
              if (isVisibleRef.current) {
                isVisibleRef.current = false;
                setIsVisible(false);
              }
            } else {
              // 3. User scrolls UP: immediately slide back down and show
              if (!isVisibleRef.current) {
                isVisibleRef.current = true;
                setIsVisible(true);
              }
            }
            lastScrollYRef.current = currentScrollY;
          }

          setScrolled(currentScrollY > 48);
          ticking = false;
        });
        ticking = true;
      }
    };

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
        className="fixed inset-x-0 top-0 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          transform: isVisible || mobileOpen ? "translate3d(0, 0, 0)" : "translate3d(0, -105%, 0)",
          opacity: isVisible || mobileOpen ? 1 : 0,
          pointerEvents: isVisible || mobileOpen ? "auto" : "none",
          borderBottom: scrolled
            ? (theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)")
            : "1px solid transparent",
          background: scrolled
            ? (theme === "dark" ? "rgba(5,5,8,0.78)" : "rgba(255,255,255,0.85)")
            : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(150%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(150%)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
          {/* Left: Wordmark */}
          <Wordmark isDark={theme === "dark"} />

          {/* Center: Navigation Links (desktop) */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={`relative text-[13px] font-medium transition-colors duration-200 ease-out group focus-visible:outline-none focus-visible:ring-1 rounded ${theme === "dark"
                    ? "text-zinc-300 hover:text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] focus-visible:ring-white/40"
                    : "text-zinc-700 hover:text-black focus-visible:ring-black/40"
                  }`}
              >
                {label}
                {/* Underline micro-animation */}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 ease-out group-hover:w-full ${theme === "dark" ? "bg-white/80" : "bg-black/80"
                    }`}
                  aria-hidden
                />
              </a>
            ))}
          </nav>

          {/* Right: Theme Toggle + Contact + Spatial portal */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle (Dark / White) */}
            <button
              type="button"
              id="nav-theme-toggle"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "white" : "dark"} theme`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-mono tracking-wider transition-all duration-300 ease-out cursor-pointer ${theme === "dark"
                  ? "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white hover:bg-white/5"
                  : "border-black/15 text-zinc-700 hover:border-black/40 hover:text-black hover:bg-black/5 shadow-sm"
                }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${theme === "dark" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                  }`}
              />
              <span className="uppercase">{theme === "dark" ? "Dark" : "White"}</span>
            </button>

            <a
              href="#faq"
              id="nav-contact"
              className={`hidden sm:inline-flex items-center text-[13px] font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 rounded px-1 ${theme === "dark"
                  ? "text-zinc-200 hover:text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] focus-visible:ring-white/40"
                  : "text-zinc-700 hover:text-black focus-visible:ring-black/40"
                }`}
            >
              Contact
            </a>

            {/* Spatial transition trigger */}
            <button
              id="nav-spatial-trigger"
              onClick={handlePortalClick}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[12px] font-medium transition-all duration-300 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-1 ${theme === "dark"
                  ? "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white hover:bg-white/5 focus-visible:ring-white/40"
                  : "border-black/15 text-zinc-700 hover:border-black/40 hover:text-black hover:bg-black/5 focus-visible:ring-black/40 shadow-sm"
                }`}
            >
              Spatial
              <span className={theme === "dark" ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-700"} aria-hidden>↗</span>
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
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="text-3xl font-medium tracking-tight text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-mono uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white/50 transition-all cursor-pointer"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${theme === "dark" ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                />
                <span>Theme: {theme === "dark" ? "Dark" : "White"}</span>
              </button>
            </div>

            <button
              id="mobile-spatial-trigger"
              onClick={handlePortalClick}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:border-white/50 transition-all duration-300 cursor-pointer"
            >
              Enter Spatial World ↗
            </button>
          </nav>
        </div>
      )}
    </>
  );
}