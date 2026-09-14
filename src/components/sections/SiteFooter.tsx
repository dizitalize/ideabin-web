"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { usePrefersReducedMotion } from "@/lib/performance";
import { IdeaBinBrand } from "@/components/ui/IdeaBinBrand";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Pages",
    links: [
      { label: "All Products", href: "#services" },
      { label: "Studio", href: "#" },
      { label: "Clients", href: "#" },
      { label: "Pricing", href: "#faq" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
  {
    title: "Register",
    links: [
      { label: "Sign Up", href: "#" },
      { label: "Login", href: "#" },
      { label: "Forgot Password", href: "#" },
    ],
  },
];

// Logo mark matching design system with Sora font & fluid ribbon emblem
function IdeaBinLogo() {
  return (
    <div className="flex flex-col">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="group inline-flex select-none focus-visible:outline-none cursor-pointer"
        aria-label="IdeaBin Home"
      >
        <IdeaBinBrand size="lg" showTagline={true} taglineSize="sm" />
      </Link>
    </div>
  );
}

export default function SiteFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reducedMotion = usePrefersReducedMotion();

  const footerRef = useRef<HTMLElement>(null);

  // Smooth scroll parallax for the footer entrance
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const textParallaxY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [24, 0]);

  return (
    <footer
      ref={footerRef}
      id="footer"
      className={`relative z-20 w-full overflow-hidden transition-colors duration-500 rounded-t-[32px] sm:rounded-t-[40px] lg:rounded-t-[48px] border-t border-x shadow-[0_-16px_48px_rgba(0,0,0,0.5)] ${
        isDark
          ? "bg-black/65 backdrop-blur-2xl text-white border-white/10"
          : "bg-white/80 backdrop-blur-2xl text-[#222222] border-black/10"
      }`}
      aria-label="Site Footer"
    >
      {/* Top Content Grid */}
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 pt-14 pb-3 sm:pt-16 sm:pb-5 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Copyright Column */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <IdeaBinLogo />
            <p
              className={`mt-4 text-xs sm:text-[13px] leading-relaxed max-w-xs transition-colors duration-300 ${
                isDark ? "text-zinc-400" : "text-neutral-500"
              }`}
            >
              © copyright IdeaBin 2026. All rights reserved.
            </p>
          </div>

          {/* 4 Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col">
                <h3
                  className={`text-sm font-medium tracking-normal mb-4 transition-colors duration-300 ${
                    isDark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`text-[13.5px] sm:text-[14px] transition-colors duration-200 block ${
                          isDark
                            ? "text-zinc-400 hover:text-white"
                            : "text-[#222222]/60 hover:text-[#111111]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Massive Cropped Watermark Typography — boldly visible and smoothly animated on scroll */}
      <div
        className="w-full select-none pointer-events-none overflow-hidden relative leading-none flex items-end justify-start pt-0 pb-1 sm:pb-2 px-4 sm:px-8"
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0.6, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: textParallaxY }}
          className="inline-flex whitespace-nowrap will-change-transform"
        >
          <span
            className={`text-[17vw] sm:text-[18vw] lg:text-[19vw] font-bold tracking-tight leading-[0.85] select-none transition-colors duration-500 ${
              isDark
                ? "text-zinc-600/80 hover:text-zinc-500 drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]"
                : "text-neutral-300/85 hover:text-neutral-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            }`}
            style={{ letterSpacing: "-0.04em" }}
          >
            IdeaBin
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
