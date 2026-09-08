"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useCenterTransition } from "@/components/animation/CenterTransition";
import { prefersReducedMotion } from "@/lib/performance";

export default function PhilosophySection() {
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
      className="relative w-full section-py overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Ambient top fade */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #0a0a0f, transparent)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Eyebrow */}
        <p className="eyebrow text-zinc-600 mb-10">Scene 04 · Studio Philosophy</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 items-end">
          {/* Left: Philosophy text */}
          <div className="md:col-span-7">
            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.04em] text-white leading-[0.92] text-balance"
            >
              The cinematic{" "}
              <em className="not-italic text-zinc-500">layer</em>
              {" "}between{" "}
              <em className="not-italic text-zinc-300">idea</em>
              {" "}and{" "}
              <em className="not-italic text-zinc-500">execution</em>.
            </h2>

            <p className="body mt-8 max-w-[50ch] text-zinc-500 leading-relaxed">
              We sit at the intersection of spatial computing, editorial design, and high-performance engineering. Our work is not decoration — it is the argument itself.
            </p>
          </div>

          {/* Right: CTA panel */}
          <div className="md:col-span-5 md:pl-16 flex flex-col items-start md:items-end gap-8">
            <div className="text-right max-w-xs">
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Scene 05 takes you through a center-origin spatial transition. The next world awaits underneath.
              </p>

              {/* Center Circle Transition CTA */}
              <button
                ref={btnRef}
                id="enter-spatial-btn"
                onClick={handleEnterSpatial}
                className="group relative inline-flex items-center gap-3 text-white font-medium text-sm tracking-wide cursor-pointer select-none overflow-hidden rounded-full px-6 py-3 border border-white/20 hover:border-white/50 transition-all duration-400 ease-out"
                style={{
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {/* Hover fill */}
                <span
                  className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 ease-out rounded-full"
                  aria-hidden
                />
                <span className="relative z-10">Enter Spatial World</span>
                <span
                  className="relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  ↗
                </span>
              </button>

              <p className="mt-3 text-[11px] text-zinc-700 tracking-[0.15em] uppercase">
                Center-origin scene transition
              </p>
            </div>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className="mt-20 md:mt-28 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-zinc-700 uppercase tracking-[0.2em]">
          <span>© 2026 · Premium Digital Experience Studio</span>
          <span className="font-mono">Scene 05 / 05</span>
        </div>
      </div>
    </section>
  );
}
