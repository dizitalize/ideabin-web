"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThreeDMarquee } from "@/components/cinematic/ThreeDMarquee";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function MarqueePage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [columns, setColumns] = useState<number>(4);

  return (
    <main
      className={`relative w-full h-screen overflow-hidden select-none transition-colors duration-500 ${isDark ? "bg-[#050508] text-white" : "bg-[#f5f5f7] text-neutral-900"
        }`}
    >
      {/* Top Floating Control Bar */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-6 pointer-events-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase border transition-all duration-200 ${isDark
                ? "bg-white/5 border-white/10 hover:border-white/30 text-white"
                : "bg-black/5 border-black/10 hover:border-black/30 text-black"
              }`}
          >
            ← Home
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isDark ? "bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "bg-orange-500"
                }`}
            />
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">
              3D Marquee · {columns} Columns Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center p-1 rounded-full border ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
              }`}
          >
            {[3, 4, 5].map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => setColumns(col)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${columns === col
                    ? isDark
                      ? "bg-white text-black shadow"
                      : "bg-black text-white shadow"
                    : "opacity-60 hover:opacity-100"
                  }`}
              >
                {col} Col
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all ${isDark
                ? "bg-white/5 border-white/10 hover:border-white/30 text-white"
                : "bg-black/5 border-black/10 hover:border-black/30 text-black"
              }`}
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* Main 3D Marquee Component with 4 Columns */}
      <div className="w-full h-full flex items-center justify-center">
        <ThreeDMarquee
          key={`marquee-cols-${columns}`}
          columns={columns}
          height="100%"
          gap={24}
          scale={1.02}
          rotation={{ x: 48, y: 0, z: -28 }}
          perspective={1100}
          showGridLines={true}
          interactive={true}
          hoverLift={14}
          isDark={isDark}
        />
      </div>

      {/* Bottom Hint */}
      <footer className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div
          className={`px-4 py-2 rounded-full border text-[11px] font-mono tracking-widest uppercase opacity-75 backdrop-blur-md ${isDark ? "bg-black/60 border-white/10 text-white" : "bg-white/70 border-black/10 text-black"
            }`}
        >
          Click & drag to rotate in 3D · Click any card to inspect
        </div>
      </footer>
    </main>
  );
}
