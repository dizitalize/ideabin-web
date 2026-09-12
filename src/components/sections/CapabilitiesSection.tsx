"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/performance";
import { useTheme } from "@/components/providers/ThemeProvider";

const CAPABILITIES = [
  {
    number: "01",
    title: "Spatial 3D Experiences",
    description:
      "Pre-rendered frame sequences, scroll-controlled cinematic timelines, and real-time canvas rendering that feel like operating a physical camera.",
  },
  {
    number: "02",
    title: "Creative Engineering",
    description:
      "Architecture-grade frontend systems built with performance as a first-class constraint. 60fps. Sub-100ms interactions. Zero compromise.",
  },
  {
    number: "03",
    title: "Editorial Systems",
    description:
      "Typography as narrative. Motion as intent. Every layout decision informed by a single question: does this serve the idea?",
  },
  {
    number: "04",
    title: "Real-time Interaction",
    description:
      "Interfaces that respond at the speed of thought. Scroll-driven choreography, magnetic hover states, and pointer-aware compositions.",
  },
] as const;

export default function CapabilitiesSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (reducedMotion) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLDivElement;
            const delay = el.dataset.delay ?? "0";
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, parseInt(delay, 10));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "-80px 0px -80px 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative w-full section-py transition-colors duration-500"
      style={{ background: isDark ? "#000000" : "#ffffff" }}
    >
      <div className="section-container">
        {/* Section header */}
        <div className="mb-16 md:mb-24 max-w-xl">
          <p className={`eyebrow mb-5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Scene 03 · Capabilities</p>
          <h2
            className={`h2 ${isDark ? "text-white" : "text-neutral-900"}`}
            style={{
              opacity: reducedMotion ? 1 : 0,
              transform: reducedMotion ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
            }}
            ref={(el) => {
              if (el) {
                if (reducedMotion) return;
                const obs = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting) {
                      (el as HTMLHeadingElement).style.opacity = "1";
                      (el as HTMLHeadingElement).style.transform = "translateY(0)";
                      obs.disconnect();
                    }
                  },
                  { threshold: 0.1 }
                );
                obs.observe(el);
              }
            }}
          >
            What we build.
          </h2>
        </div>

        {/* Capabilities grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 border-t ${
          isDark ? "border-white/[0.08]" : "border-black/[0.08]"
        }`}>
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.number}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-delay={String(i * 80)}
              className={`group relative border-b border-r-0 md:even:border-r-0 md:odd:border-r py-10 md:py-12 pr-0 md:pr-12 cursor-default ${
                isDark ? "border-white/[0.08]" : "border-black/[0.08]"
              }`}
              style={{
                opacity: reducedMotion ? 1 : 0,
                transform: reducedMotion ? "translateY(0)" : "translateY(28px)",
                transition:
                  "opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {/* Number */}
              <span className={`mono text-[11px] tracking-[0.2em] font-medium transition-colors duration-300 ${
                isDark ? "text-zinc-600 group-hover:text-[#417B5A]" : "text-zinc-400 group-hover:text-[#417B5A]"
              }`}>
                {cap.number}
              </span>

              {/* Title */}
              <h3 className={`h3 mt-3 mb-4 transition-colors duration-300 ${
                isDark ? "text-white group-hover:text-zinc-100" : "text-neutral-900 group-hover:text-black"
              }`}>
                {cap.title}
              </h3>

              {/* Description */}
              <p className={`body-sm max-w-[38ch] leading-relaxed transition-colors duration-300 ${
                isDark ? "text-zinc-400 group-hover:text-zinc-300" : "text-zinc-600 group-hover:text-zinc-800"
              }`}>
                {cap.description}
              </p>

              {/* Subtle right-arrow on hover */}
              <span
                className="absolute right-0 top-10 md:top-12 text-[#417B5A]/0 group-hover:text-[#417B5A]/80 text-xl transition-all duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
