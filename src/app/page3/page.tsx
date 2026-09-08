"use client";

import { useRouter } from "next/navigation";
import { useCenterTransition } from "@/components/animation/CenterTransition";
import { prefersReducedMotion } from "@/lib/performance";

export default function Page3() {
  const router = useRouter();
  const { trigger } = useCenterTransition();
  const reducedMotion = prefersReducedMotion();

  const handleReturnHome = () => {
    if (reducedMotion) {
      router.push("/");
      return;
    }
    trigger("/");
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#030508" }}
    >
      {/* Deep ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15,30,80,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Fine grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 section-container text-center">
        {/* Eyebrow */}
        <p
          className="eyebrow text-zinc-600 mb-8"
          style={{ letterSpacing: "0.3em" }}
        >
          Scene 05 · Spatial World
        </p>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-medium tracking-[-0.04em] text-white leading-[0.9] text-balance max-w-3xl mx-auto"
        >
          The next{" "}
          <span className="text-zinc-500">dimension</span>
          {" "}is
          <br />
          <span className="text-zinc-300">already</span> here.
        </h1>

        <p className="body mt-8 max-w-md mx-auto text-zinc-600 leading-relaxed">
          You arrived through a center-origin spatial transition. The old world contracted. This one expanded from the same point.
        </p>

        {/* Return CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="return-home-btn"
            onClick={handleReturnHome}
            className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 cursor-pointer"
          >
            <span
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            >
              ←
            </span>
            Return to Scene 01
          </button>

          <span className="text-[11px] text-zinc-700 uppercase tracking-[0.25em]">
            Center-origin exit transition
          </span>
        </div>
      </div>

      {/* Bottom metadata */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
        <p
          className="font-mono text-[11px] text-zinc-800 tracking-[0.25em] uppercase"
        >
          /page3 · Spatial Architecture
        </p>
      </div>
    </main>
  );
}
