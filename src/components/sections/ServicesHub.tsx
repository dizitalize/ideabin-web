"use client";

import { ArrowUpRight, Code, ShieldCheck, Megaphone, Cpu, Brain, Gauge, ChartLine, Lightning, Wrench } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { services as serviceData } from "@/lib/site";
import { useTheme } from "@/components/providers/ThemeProvider";
import { prefersReducedMotion } from "@/lib/performance";

const icons = [Code, ShieldCheck, Megaphone, Cpu, Brain, Gauge, ChartLine, Lightning, Wrench];

const services = serviceData.map((service, index) => ({
  ...service,
  icon: icons[index],
  details:
    index === 0
      ? ["Next.js & motion UI", "Mobile-first responsive", "Sub-second page loads", "Semantic SEO architecture"]
      : index === 1
      ? ["Zero-trust security", "ISO 27001 & SOC 2", "End-to-end encryption", "24/7 threat monitoring"]
      : index === 2
      ? ["Technical SEO", "Targeted paid media", "Production & motion video", "Organic social growth"]
      : index === 3
      ? ["Bespoke enterprise software", "Intelligent API automation", "AI workflow integration", "Real-time analytics"]
      : index === 4
      ? ["LLM fine-tuning", "RAG pipelines", "Agent orchestration", "Model ops"]
      : index === 5
      ? ["Performance auditing", "Core Web Vitals", "Edge caching", "Image & font optimization"]
      : index === 6
      ? ["Cohort analysis", "Funnel experimentation", "Attribution modeling", "Growth loops"]
      : index === 7
      ? ["Automated CI/CD", "IaC & cloud scaling", "Observability", "Incident runbooks"]
      : ["Support & maintenance", "SLA-backed patches", "Knowledge transfer", "Quarterly review"],
}));

export default function ServicesHub() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const reduced = prefersReducedMotion();
  const activeService = services[active];
  const IconComponent = activeService.icon;

  return (
    <section
      id="services"
      data-journey-stop="services"
      data-page="04"
      aria-labelledby="services-heading"
      className={`relative section-py theme-bg transition-colors duration-300 ${
        isDark ? "theme-bg" : "theme-surface"
      }`}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <header className="md:col-span-5">
            <p className="eyebrow">04 — Capabilities</p>
            <h2
              id="services-heading"
              className={`h1 mt-4 ${isDark ? "text-white" : "text-zinc-900"}`}
            >
              What we engineer, end-to-end.
            </h2>
            <p className={`body mt-5 max-w-[40ch] ${isDark ? "theme-fg-muted" : "theme-fg-muted"}`}>
              Nine disciplines under one roof — from the interactive surfaces a user
              first touches to the AI, security, and growth systems behind them.
            </p>
          </header>

          <div className="md:col-span-7">
            <div
              role="tablist"
              aria-label="Service capabilities"
              className={`flex flex-wrap gap-1.5 border-b ${
                isDark ? "border-white/10" : "border-black/10"
              } pb-3`}
            >
              {services.map((service, i) => {
                const Icon = service.icon;
                const isActive = active === i;
                return (
                  <button
                    key={service.title}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${i}`}
                    id={`tab-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    data-cursor="hover"
                    className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-300 ${
                      isActive
                        ? isDark
                          ? "bg-white/10 text-white"
                          : "bg-black/[0.06] text-zinc-900"
                        : isDark
                        ? "text-white/55 hover:text-white"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    <Icon
                      size={14}
                      weight={isActive ? "fill" : "regular"}
                      className={
                        isActive
                          ? "accent-text"
                          : isDark
                          ? "text-white/40"
                          : "text-zinc-400"
                      }
                    />
                    <span>{service.title}</span>
                  </button>
                );
              })}
            </div>

            <div
              id={`panel-${active}`}
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              key={`panel-${active}-${mounted}`}
              className={`pt-7 ${reduced ? "" : "transition-opacity duration-300 ease-out"}`}
              style={{ opacity: mounted ? 1 : 0 }}
            >
              <div className="flex items-baseline gap-4">
                <IconComponent
                  size={22}
                  weight="light"
                  className="accent-text shrink-0 translate-y-[2px]"
                />
                <h3 className={`h2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {activeService.title}
                </h3>
              </div>

              <p className={`body mt-4 max-w-[60ch] ${isDark ? "theme-fg-muted" : "theme-fg-muted"}`}>
                {activeService.description}
              </p>

              <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {activeService.details.map((detail) => (
                  <li
                    key={detail}
                    className={`flex items-baseline gap-3 text-[14px] ${
                      isDark ? "text-white/80" : "text-zinc-800"
                    }`}
                  >
                    <span className="meta font-mono">—</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                data-cursor="hover"
                className={`mt-8 inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wide transition-colors ${
                  isDark
                    ? "text-white/80 hover:text-orange-400"
                    : "text-zinc-700 hover:text-orange-600"
                }`}
              >
                Start a project in this discipline
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}