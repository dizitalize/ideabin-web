"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCenterTransition } from "@/components/animation/CenterTransition";
import { useTheme } from "@/components/providers/ThemeProvider";
import { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";
import { arriveAt, resolveSectionScrollY, setPendingSection } from "@/lib/hero-scroll";

interface NavLinkItem {
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
  { label: "Testimonials", href: "#testimonials" },
];

const MotionLink = motion.create(Link);

/**
 * Geometric 7-circle rosette logo icon matching the Verdea branding in screenshot
 */
function VerdeaLogo({ className = "w-5 h-5 text-current" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central circle */}
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.9" />
      {/* 6 surrounding circles forming symmetrical rosette */}
      <circle cx="12" cy="6.2" r="2.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17" cy="9.1" r="2.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17" cy="14.9" r="2.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="17.8" r="2.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="7" cy="14.9" r="2.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="7" cy="9.1" r="2.2" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

export default function Navbar() {
  const { trigger } = useCenterTransition();
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // Section anchors only exist on the home page; elsewhere they resolve to /#hash
  const resolveHref = (href: string) => (href.startsWith("#") && !isHome ? `/${href}` : href);

  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("Projects");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const consultationButtonRef = useRef<HTMLButtonElement>(null);

  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(true);

  // ---------------------------------------------------------------------------
  // Professional Hide / Show on Scroll & Active Section Tracking
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (pathname !== "/") {
      // Off the home page: highlight the nav item matching the current route
      if (pathname.startsWith("/services")) setActiveSection("Services");
      else if (pathname.startsWith("/testimonials")) setActiveSection("Testimonials");
      else if (pathname.startsWith("/blog")) setActiveSection("Blog");
      else setActiveSection("Home");
      return;
    }

    lastScrollYRef.current = typeof window !== "undefined" ? window.scrollY : 0;

    // Sync immediately when landing on the home page at the top (no scroll event fires)
    if (typeof window !== "undefined" && window.scrollY <= 120) {
      setActiveSection("Home");
    }

    const SCROLL_THRESHOLD = 8;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const diff = currentY - lastScrollYRef.current;

          // 1. Top of page: always visible
          if (currentY <= 60) {
            if (!isVisibleRef.current) {
              isVisibleRef.current = true;
              setIsVisible(true);
            }
          } else if (Math.abs(diff) >= SCROLL_THRESHOLD) {
            // 2. Scrolling down: hide smoothly
            if (diff > 0 && currentY > 100) {
              if (isVisibleRef.current) {
                isVisibleRef.current = false;
                setIsVisible(false);
              }
            } else if (diff < 0) {
              // 3. Scrolling up: show immediately
              if (!isVisibleRef.current) {
                isVisibleRef.current = true;
                setIsVisible(true);
              }
            }
            lastScrollYRef.current = currentY;
          }

          // 4. Active section scroll-spy
          const servicesEl = document.getElementById("services");
          const faqEl = document.getElementById("faq");
          const testimonialsEl = document.getElementById("testimonials");
          const footerEl = document.getElementById("footer");

          const scrollMiddle = currentY + window.innerHeight * 0.4;

          if (currentY <= 120) {
            setActiveSection("Home");
          } else if (footerEl && scrollMiddle >= footerEl.offsetTop) {
            setActiveSection("Testimonials");
          } else if (testimonialsEl && scrollMiddle >= testimonialsEl.offsetTop) {
            setActiveSection("Testimonials");
          } else if (faqEl && scrollMiddle >= faqEl.offsetTop) {
            setActiveSection("FAQ");
          } else if (servicesEl && scrollMiddle >= servicesEl.offsetTop) {
            setActiveSection("Services");
          } else {
            setActiveSection("Projects");
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Lock body scroll when mobile menu or consultation modal is open
  useEffect(() => {
    if (mobileOpen || consultationOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen, consultationOpen]);

// Handle escape key
   useEffect(() => {
     const onKeyDown = (e: KeyboardEvent) => {
       if (e.key === "Escape") {
         const wasConsultationOpen = consultationOpen;
         setMobileOpen(false);
         setConsultationOpen(false);
         
         // Return focus to consultation button if it was open
         if (wasConsultationOpen && consultationButtonRef.current) {
           consultationButtonRef.current.focus();
         }
       }
     };
     window.addEventListener("keydown", onKeyDown);
     return () => window.removeEventListener("keydown", onKeyDown);
   }, [consultationOpen]);

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    setMobileOpen(false);

    // Modified clicks (new tab / window / download) keep the native Link behaviour
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    setActiveSection(label);

    if (!isHome) {
      // Section anchors live on the home page. Hand the target to HomeArrival and
      // push "/" without a hash so Next's own hash scroll cannot race our restore.
      if (href.startsWith("#")) {
        e.preventDefault();
        setPendingSection(href);
        router.push("/");
      }
      return;
    }

    // Route links (e.g. /blog) use the native Link navigation.
    if (!href.startsWith("#")) return;

    e.preventDefault();

    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetY = resolveSectionScrollY(href);
    if (targetY !== null) {
      arriveAt(targetY, { smooth: true, mode: "interactive" });
    }
  };

  const handleOpenConsultation = () => {
    setMobileOpen(false);
    setConsultationOpen(true);
  };

  return (
    <>
      {/* Floating Pill Navbar Container */}
      <motion.header
        id="site-navbar"
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isVisible || mobileOpen ? 0 : -100,
          opacity: isVisible || mobileOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.38,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-4 sm:top-5 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none will-change-transform"
      >
        <div
          className={`pointer-events-auto flex items-center justify-between w-full max-w-[880px] h-[52px] sm:h-[58px] px-3 sm:px-4 rounded-full transition-all duration-300 ${
            isDark
              ? "bg-neutral-900/90 text-white border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
              : "bg-white/95 text-neutral-900 border border-black/5 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)]"
          } backdrop-blur-xl`}
        >
{/* 1. Left: Logo + Brand Name */}
           <Link
              href="/"
              onClick={(e) => {
                if (!isHome) return;
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex items-center pl-1.5 sm:pl-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full cursor-pointer"
              aria-label="IdeaBin Home"
            >
              <IdeaBinBrand size="sm" />
            </Link>

          {/* 2. Center: Navigation Links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2 relative px-2"
            onMouseLeave={() => setHoveredLink(null)}
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === label;
              const isHovered = hoveredLink === label;

              return (
                <Link
                  key={label}
                  href={resolveHref(href)}
                  onClick={(e) => handleNavClick(e, href, label)}
                  onMouseEnter={() => setHoveredLink(label)}
                  className={`relative flex items-center gap-2 px-3 lg:px-3.5 py-1.5 text-[13px] font-medium tracking-tight rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? isDark
                        ? "text-white font-semibold"
                        : "text-neutral-950 font-semibold"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  {/* Sliding Hover Pill */}
                  {isHovered && !isActive && (
                    <motion.span
                      layoutId="navbar-hover-pill"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isDark ? "bg-white/10" : "bg-neutral-100"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}

                  {/* Active Background Pill */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className={`absolute inset-0 rounded-full -z-10 border ${
                        isDark
                          ? "bg-white/[0.08] border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.08)]"
                          : "bg-orange-500/[0.06] border-orange-500/20"
                      }`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}


                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: CTA Button + Theme Toggle + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Micro-Button */}
            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-zinc-500 hover:text-black hover:bg-neutral-100"
              }`}
            >
              {isDark ? (
                // Sun Icon
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                // Moon Icon
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

{/* Book a Consultation Button */}
             <motion.button
               ref={consultationButtonRef}
               type="button"
               id="nav-book-consultation"
               onClick={handleOpenConsultation}
               whileHover={{ scale: 1.03 }}
               whileTap={{ scale: 0.97 }}
               className={`relative inline-flex items-center justify-center px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-medium tracking-tight cursor-pointer transition-all duration-200 shadow-sm ${
                 isDark
                   ? "bg-white hover:bg-zinc-100 text-neutral-950 font-semibold shadow-black/40"
                   : "bg-[#18181b] hover:bg-black text-white font-medium shadow-black/20"
               }`}
             >
               <span>Book a Consultation</span>
             </motion.button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              id="nav-mobile-toggle"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={`md:hidden flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                isDark ? "text-zinc-200 hover:bg-white/10" : "text-zinc-700 hover:bg-neutral-100"
              }`}
            >
              <div className="relative w-4 h-3.5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full rounded-full transition-transform duration-300 ${
                    isDark ? "bg-white" : "bg-neutral-900"
                  } ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full transition-opacity duration-300 ${
                    isDark ? "bg-white" : "bg-neutral-900"
                  } ${mobileOpen ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full transition-transform duration-300 ${
                    isDark ? "bg-white" : "bg-neutral-900"
                  } ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ------------------------------------------------------------------- */}
      {/* Mobile Animated Drawer Menu */}
      {/* ------------------------------------------------------------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
            />

            {/* Floating Mobile Pill Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 inset-x-4 z-40 md:hidden flex justify-center"
            >
              <div
                className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border backdrop-blur-2xl ${
                  isDark
                    ? "bg-neutral-900/95 border-white/15 text-white shadow-black/80"
                    : "bg-white/95 border-black/10 text-neutral-900 shadow-neutral-500/20"
                }`}
              >
                <div className="flex flex-col gap-2">
                  {NAV_LINKS.map(({ label, href }, index) => {
                    const isActive = activeSection === label;
                    return (
                      <MotionLink
                        key={label}
                        href={resolveHref(href)}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 + 0.05 }}
                        onClick={(e) => handleNavClick(e, href, label)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                          isActive
                            ? isDark
                              ? "bg-white/10 text-white font-semibold"
                              : "bg-neutral-100 text-black font-semibold"
                            : isDark
                            ? "text-zinc-400 hover:text-white hover:bg-white/5"
                            : "text-zinc-600 hover:text-black hover:bg-neutral-50"
                        }`}
                      >
                        <span>{label}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]" />
                        )}
                      </MotionLink>
                    );
                  })}

                  <div className="h-px bg-zinc-200 dark:bg-white/10 my-2" />

                  {/* Mobile Book a Consultation button */}
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    onClick={handleOpenConsultation}
                    className={`w-full py-3.5 rounded-2xl font-medium text-sm text-center shadow-md transition-all ${
                      isDark
                        ? "bg-white text-neutral-950 hover:bg-zinc-100 font-semibold"
                        : "bg-neutral-950 text-white hover:bg-black"
                    }`}
                  >
                    Book a Consultation
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------- */}
      {/* Interactive Consultation Modal */}
      {/* ------------------------------------------------------------------- */}
      <AnimatePresence>
        {consultationOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConsultationOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border backdrop-blur-2xl z-10 ${
                isDark
                  ? "bg-neutral-950/95 border-white/15 text-white shadow-black"
                  : "bg-white border-black/10 text-neutral-900 shadow-2xl"
              }`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setConsultationOpen(false)}
                aria-label="Close consultation modal"
                className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${
                  isDark ? "text-zinc-400 hover:text-white hover:bg-white/10" : "text-zinc-500 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Consultation Requested</h3>
                  <p className={`text-sm max-w-xs mx-auto mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Thank you! Our studio team will reach out to you within 24 hours to confirm our appointment.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setConsultationOpen(false);
                    }}
                    className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-neutral-800"
                    }`}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-orange-400 font-semibold">
                      Book a Session
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    Book a Consultation
                  </h3>
                  <p className={`text-xs sm:text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Discuss your spatial 3D experience, product vision, or digital architecture with our senior team.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        Your Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Maya Lin"
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-orange-500"
                            : "bg-neutral-50 border-black/10 text-neutral-900 placeholder-zinc-400 focus:border-orange-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="name@company.com"
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-orange-500"
                            : "bg-neutral-50 border-black/10 text-neutral-900 placeholder-zinc-400 focus:border-orange-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        Project Focus
                      </label>
                      <select
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                          isDark
                            ? "bg-neutral-900 border-white/10 text-white focus:border-orange-500"
                            : "bg-neutral-50 border-black/10 text-neutral-900 focus:border-orange-500"
                        }`}
                      >
                        <option>3D Scroll Web Experience</option>
                        <option>Spatial Computing & Digital Showroom</option>
                        <option>Brand Identity & Design Engineering</option>
                        <option>Custom Creative Technology</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3 mt-2 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                        isDark
                          ? "bg-white text-neutral-950 hover:bg-zinc-200 shadow-md"
                          : "bg-neutral-950 text-white hover:bg-black shadow-md"
                      }`}
                    >
                      Confirm Request
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}