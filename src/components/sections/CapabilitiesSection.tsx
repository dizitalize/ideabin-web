"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/performance";

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
      className="relative w-full section-py"
      style={{ background: "#0a0a0f" }}
    >
      <div className="section-container">
        {/* Section header */}
        <div className="mb-16 md:mb-24 max-w-xl">
          <p className="eyebrow text-zinc-600 mb-5">Scene 03 · Capabilities</p>
          <h2
            className="h2 text-white"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/[0.06]">
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.number}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-delay={String(i * 80)}
              className="group relative border-b border-r-0 md:even:border-r-0 md:odd:border-r border-white/[0.06] py-10 md:py-12 pr-0 md:pr-12 cursor-default"
              style={{
                opacity: reducedMotion ? 1 : 0,
                transform: reducedMotion ? "translateY(0)" : "translateY(28px)",
                transition:
                  "opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {/* Number */}
              <span className="mono text-[11px] text-zinc-700 tracking-[0.2em] font-medium group-hover:text-orange-500/70 transition-colors duration-300">
                {cap.number}
              </span>

              {/* Title */}
              <h3 className="h3 text-white mt-3 mb-4 group-hover:text-zinc-100 transition-colors duration-300">
                {cap.title}
              </h3>

              {/* Description */}
              <p className="body-sm text-zinc-500 max-w-[38ch] leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                {cap.description}
              </p>

              {/* Subtle right-arrow on hover */}
              <span
                className="absolute right-0 top-10 md:top-12 text-orange-500/0 group-hover:text-orange-500/60 text-xl transition-all duration-300 group-hover:translate-x-1"
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
