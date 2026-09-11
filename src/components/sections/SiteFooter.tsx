"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

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

// Logo mark matching the attached screenshot
function IdeaBinLogo({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center p-1.5 transition-colors duration-300 ${isDark ? "bg-white text-black" : "bg-black text-white"
          }`}
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
      </div>
      <span
        className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isDark ? "text-white" : "text-neutral-900"
          }`}
      >
        IdeaBin
      </span>
    </div>
  );
}

export default function SiteFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      id="footer"
      className={`relative z-20 w-full overflow-hidden transition-colors duration-500 border-t ${isDark
        ? "bg-black/90 text-white border-white/10"
        : "bg-white/90 text-neutral-900 border-black/10"
        }`}
      aria-label="Site Footer"
    >
      {/* Top Content Grid */}
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 pt-16 pb-12 sm:pt-20 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Copyright Column */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <IdeaBinLogo isDark={isDark} />
            <p
              className={`mt-4 text-xs sm:text-[13px] leading-relaxed max-w-xs transition-colors duration-300 ${isDark ? "text-zinc-500" : "text-neutral-500"
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
                  className={`text-sm font-semibold tracking-normal mb-4 transition-colors duration-300 ${isDark ? "text-white" : "text-neutral-900"
                    }`}
                >
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`text-[13.5px] sm:text-[14px] transition-colors duration-200 block ${isDark
                          ? "text-zinc-400 hover:text-white"
                          : "text-neutral-600 hover:text-neutral-950"
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

      {/* Massive Cropped Watermark Typography matching the screenshot */}
      <div
        className="w-full select-none pointer-events-none overflow-hidden relative leading-none flex items-end justify-start -mb-4 sm:-mb-8 md:-mb-12 px-4 sm:px-8"
        aria-hidden="true"
      >
        <span
          className={`text-[18vw] sm:text-[19vw] lg:text-[20vw] font-bold tracking-tight leading-[0.82] transition-colors duration-500 ${isDark
            ? "text-zinc-900/60 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
            : "text-neutral-200/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            }`}
          style={{ letterSpacing: "-0.04em" }}
        >
          IdeaBin
        </span>
      </div>
    </footer>
  );
}
