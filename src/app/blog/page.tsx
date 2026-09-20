"use client";

import React from "react";
import Link from "next/link";
import BlogSection from "@/components/sections/BlogSection";
import SiteFooter from "@/components/sections/SiteFooter";
import FluidBackground from "@/components/fluid/FluidBackground";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function BlogPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <main id="main" className="relative w-full min-h-screen">
      {/* Interactive WebGL Fluid simulation active in background matching home page */}
      <FluidBackground />

      {/* Top breadcrumb navigation cleanly nested beneath global floating Navbar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-36 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all duration-200 cursor-pointer ${isDark
              ? "border-white/12 bg-white/5 hover:border-white/30 text-zinc-300 hover:text-white"
              : "border-black/10 bg-black/5 hover:border-black/25 text-neutral-700 hover:text-black"
              }`}
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Editorial bento blog grid with auto-cycling tiles */}
      <BlogSection />

      {/* Studio Signature Footer matching full website theme */}
      <SiteFooter />
    </main>
  );
}
