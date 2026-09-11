"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useCenterTransition } from "@/components/animation/CenterTransition";
import { prefersReducedMotion } from "@/lib/performance";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function PhilosophySection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const router = useRouter();
  const { trigger } = useCenterTransition();
  const btnRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = prefersReducedMotion();

  const handleEnterSpatial = () => {
    if (reducedMotion) {
      router.push("/page3");
      return;
    }
    trigger("/page3");
  };

  return (
    <section
      id="philosophy"
      className="relative w-full section-py overflow-hidden transition-colors duration-500"
      style={{ background: isDark ? "#000000" : "#ffffff" }}
    >
      {/* Ambient top fade */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none transition-colors duration-500"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, #000000, transparent)"
            : "linear-gradient(to bottom, #ffffff, transparent)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Eyebrow */}
        <p className={`eyebrow mb-10 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Scene 04 · Studio Philosophy</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 items-end">
          {/* Left: Philosophy text */}
          <div className="md:col-span-7">
            <h2
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.92] text-balance transition-colors duration-300 ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              The cinematic{" "}
              <em className={`not-italic ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>layer</em>
              {" "}between{" "}
              <em className={`not-italic ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>idea</em>
              {" "}and{" "}
              <em className={`not-italic ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>execution</em>.
            </h2>

            <p className={`body mt-8 max-w-[50ch] leading-relaxed transition-colors duration-300 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              We sit at the intersection of spatial computing, editorial design, and high-performance engineering. Our work is not decoration — it is the argument itself.
            </p>
          </div>

          {/* Right: CTA panel */}
          <div className="md:col-span-5 md:pl-16 flex flex-col items-start md:items-end gap-8">
            <div className="text-right max-w-xs">
              <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>
                Scene 05 takes you through a center-origin spatial transition. The next world awaits underneath.
              </p>

              {/* Center Circle Transition CTA */}
              <button
                ref={btnRef}
                id="enter-spatial-btn"
                onClick={handleEnterSpatial}
                className={`group relative inline-flex items-center gap-3 font-medium text-sm tracking-wide cursor-pointer select-none overflow-hidden rounded-full px-6 py-3 border transition-all duration-400 ease-out ${
                  isDark
                    ? "text-white border-white/20 hover:border-white/50 bg-white/5"
                    : "text-neutral-900 border-black/20 hover:border-black/50 bg-black/5"
                }`}
              >
                {/* Hover fill */}
                <span
                  className={`absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 ease-out rounded-full ${
                    isDark ? "bg-white/10" : "bg-black/10"
                  }`}
                  aria-hidden
                />
                <span className="relative z-10">Enter Spatial World</span>
                <span
                  className={`relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 group-hover:translate-x-0.5 ${
                    isDark ? "bg-white/10 group-hover:bg-white/20" : "bg-black/10 group-hover:bg-black/20"
                  }`}
                  aria-hidden
                >
                  ↗
                </span>
              </button>

              <p className={`mt-3 text-[11px] tracking-[0.15em] uppercase ${
                isDark ? "text-zinc-600" : "text-zinc-400"
              }`}>
                Center-origin scene transition
              </p>
            </div>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className={`mt-20 md:mt-28 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] uppercase tracking-[0.2em] ${
          isDark ? "border-white/[0.08] text-zinc-600" : "border-black/[0.08] text-zinc-400"
        }`}>
          <span>© 2026 · Premium Digital Experience Studio</span>
          <span className="font-mono">Scene 05 / 05</span>
        </div>
      </div>
    </section>
  );
}
