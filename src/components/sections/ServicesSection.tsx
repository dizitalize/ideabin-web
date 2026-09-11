"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/performance";
import { useTheme } from "@/components/providers/ThemeProvider";

// Minimal diagonal arrow SVG matching Abox Agency
function DiagonalArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

// Minimal right arrow SVG for service list items
function RightArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

interface ServiceItem {
  number: string;
  title: string;
  href?: string;
  clickable: boolean;
}

interface ServiceCategoryData {
  id: string;
  index: string;
  title: string;
  href: string;
  description: string;
  stickyTopDesktop: number; // in px: 0, 86, 172, 258
  stickyTopMobile: number;  // in px: 0, 67, 134, 201
  zIndex: number;
  services: ServiceItem[];
}

const CATEGORIES: ServiceCategoryData[] = [
  {
    id: "design",
    index: "01",
    title: "Design",
    href: "#design",
    description:
      "Create memorable brands that customers trust and remember. From brand identity, UI/UX design, website design, packaging, graphic design, 3D product rendering, and product photography, we craft visually compelling experiences that strengthen your brand and increase customer engagement.",
    stickyTopDesktop: 0,
    stickyTopMobile: 0,
    zIndex: 1,
    services: [
      { number: "01", title: "UI/UX Design", href: "#", clickable: true },
      { number: "02", title: "Brand Identity", href: "#", clickable: true },
      { number: "03", title: "Website Design", href: "#", clickable: true },
      { number: "04", title: "Graphic Design", clickable: false },
      { number: "05", title: "Packaging Design", clickable: false },
      { number: "06", title: "3D Product Rendering", clickable: false },
      { number: "07", title: "Product Photography", clickable: false },
      { number: "08", title: "Motion Graphics", clickable: false },
    ],
  },
  {
    id: "ecommerce",
    index: "02",
    title: "Ecommerce",
    href: "#ecommerce",
    description:
      "Launch, migrate, and scale high-performing Shopify and Shopify Plus stores built for growth. We specialize in custom Shopify development, store migrations, CRO, A/B testing, subscription models, custom apps, performance optimization, and seamless shopping experiences that increase conversions and revenue.",
    stickyTopDesktop: 86,
    stickyTopMobile: 67,
    zIndex: 2,
    services: [
      { number: "01", title: "Shopify Development", href: "#", clickable: true },
      { number: "02", title: "Shopify Plus Development", href: "#", clickable: true },
      { number: "03", title: "Shopify Migration", href: "#", clickable: true },
      { number: "04", title: "Shopify App Development", href: "#", clickable: true },
      { number: "05", title: "Headless Commerce", href: "#", clickable: true },
      { number: "06", title: "CRO (Conversion Rate Optimization)", href: "#", clickable: true },
      { number: "07", title: "A/B Testing", href: "#", clickable: true },
      { number: "08", title: "Store Performance Optimization", href: "#", clickable: true },
    ],
  },
  {
    id: "development",
    index: "03",
    title: "Development",
    href: "#development",
    description:
      "Build powerful digital products with modern technologies. Our team delivers custom web development, Next.js, React.js, Node.js, Python, mobile applications, CMS development, API integrations, headless commerce, and enterprise solutions tailored to your business goals.",
    stickyTopDesktop: 172,
    stickyTopMobile: 134,
    zIndex: 3,
    services: [
      { number: "01", title: "Custom Web Development", href: "#", clickable: true },
      { number: "02", title: "Next.js Development", href: "#", clickable: true },
      { number: "03", title: "React.js Development", href: "#", clickable: true },
      { number: "04", title: "Python Development", href: "#", clickable: true },
      { number: "05", title: "Mobile App Development", href: "#", clickable: true },
      { number: "06", title: "CMS Development (WordPress, Webflow, Framer)", href: "#", clickable: true },
      { number: "07", title: "API & Third-Party Integrations", href: "#", clickable: true },
    ],
  },
  {
    id: "support",
    index: "04",
    title: "Support",
    href: "#support",
    description:
      "Scale confidently with continuous optimization and expert support. We provide Shopify store management, website maintenance, SEO, performance optimization, DevOps, cloud infrastructure, analytics, technical support, and ongoing growth consulting to keep your business performing at its best.",
    stickyTopDesktop: 258,
    stickyTopMobile: 201,
    zIndex: 4,
    services: [
      { number: "01", title: "Shopify Store Management", href: "#", clickable: true },
      { number: "02", title: "Website Maintenance", href: "#", clickable: true },
      { number: "03", title: "SEO Optimization", href: "#", clickable: true },
      { number: "04", title: "Performance Optimization", href: "#", clickable: true },
      { number: "05", title: "DevOps & Cloud Infrastructure", href: "#", clickable: true },
      { number: "06", title: "Analytics & Reporting", href: "#", clickable: true },
      { number: "07", title: "Technical Support & Consulting", href: "#", clickable: true },
    ],
  },
];

// Single service list row with rising bottom-up green fill
function ServiceListItem({ service, isDark }: { service: ServiceItem; isDark: boolean }) {
  if (!service.clickable) {
    return (
      <div className={`relative flex items-center justify-between py-6 border-b select-none transition-colors duration-300 ${isDark ? "border-white/10" : "border-[#222222]/10"
        }`}>
        <div className="flex items-baseline">
          <span className={`text-sm sm:text-base font-medium mr-4 sm:mr-6 tracking-tight ${isDark ? "text-zinc-500" : "text-[#222222]/40"
            }`}>
            {service.number}
          </span>
          <span className={`text-lg sm:text-xl lg:text-[1.5625rem] font-medium tracking-tight ${isDark ? "text-zinc-400" : "text-[#222222]"
            }`}>
            {service.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={service.href || "#"}
      className={`group relative block w-full py-5 sm:py-6 border-b overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500/50 transition-colors duration-300 ${isDark ? "border-white/10" : "border-black/10"
        }`}
      aria-label={`${service.number} ${service.title}`}
    >
      {/* Rising Background Fill on Hover */}
      <span
        className={`absolute inset-x-0 bottom-0 h-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-full group-focus-visible:h-full pointer-events-none z-0 ${isDark ? "bg-white/[0.07] backdrop-blur-md" : "bg-neutral-900 text-white"
          }`}
        aria-hidden="true"
      />

      {/* Row Content with horizontal padding expansion on hover */}
      <div className="relative z-10 flex items-center justify-between w-full px-0 group-hover:px-6 xl:group-hover:px-8 group-focus-visible:px-6 xl:group-focus-visible:px-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-baseline">
          <span
            className={`text-sm sm:text-base font-mono mr-4 sm:mr-6 tracking-tight transition-colors duration-500 ${isDark
                ? "text-zinc-500 group-hover:text-orange-400 group-focus-visible:text-orange-400"
                : "text-neutral-400 group-hover:text-neutral-300 group-focus-visible:text-neutral-300"
              }`}
          >
            {service.number}
          </span>
          <span
            className={`text-lg sm:text-xl lg:text-[1.5625rem] font-medium tracking-tight transition-colors duration-500 ${isDark
                ? "text-white group-hover:text-white group-focus-visible:text-white"
                : "text-neutral-900 group-hover:text-white group-focus-visible:text-white"
              }`}
          >
            {service.title}
          </span>
        </div>

        {/* Right Arrow Icon (fades in on hover) */}
        <div
          className={`opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform translate-x-2 group-hover:translate-x-0 ml-4 flex-shrink-0 ${isDark ? "text-orange-400" : "text-white"
            }`}
        >
          <RightArrow className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
}

// Single sticky category article
function ServiceCategory({
  category,
  isFirst,
  isLast,
  isDark,
}: {
  category: ServiceCategoryData;
  isFirst: boolean;
  isLast: boolean;
  isDark: boolean;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Scroll tracking to interpolate title scale, CTA expansion, and content reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  // Scale interpolation: grows from compressed 0.4 (or 1 for reduced motion) to 1.0
  const titleScale = useTransform(
    scrollYProgress,
    [0.1, 0.75],
    isFirst ? [1, 1] : [0.4, 1.0]
  );

  // CTA Pill expansion
  const pillScale = useTransform(
    scrollYProgress,
    [0.35, 0.8],
    isFirst ? [1, 1] : [0, 1]
  );
  const pillOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.7],
    isFirst ? [1, 1] : [0, 1]
  );

  // Content reveal: vertical translation from -32px to 0, opacity 0 to 1
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.85],
    isFirst ? [1, 1] : [0, 1]
  );
  const contentTranslateY = useTransform(
    scrollYProgress,
    [0.3, 0.85],
    isFirst ? [0, 0] : [-32, 0]
  );

  return (
    <article
      ref={containerRef}
      id={category.id}
      style={{
        zIndex: category.zIndex,
      }}
      className={`sticky w-full border-t pt-5 pb-16 sm:pb-24 lg:pb-[560px] px-6 sm:px-12 lg:px-16 xl:px-24 will-change-transform transition-colors duration-500 ${isDark
        ? "bg-black/85 backdrop-blur-xl border-white/10 shadow-[0_-1px_0_rgba(255,255,255,0.08)]"
        : "bg-white/85 backdrop-blur-xl border-black/10 shadow-[0_-1px_0_rgba(0,0,0,0.05)]"
        }`}
    >
      {/* Dynamic responsive sticky offsets injected via inline style container */}
      <style jsx>{`
        article#${category.id} {
          top: ${category.stickyTopMobile}px;
        }
        @media (min-width: 768px) {
          article#${category.id} {
            top: ${category.stickyTopDesktop}px;
          }
        }
      `}</style>

      <div className="max-w-[1720px] mx-auto">
        {/* Large Category Title + Inline CTA Pill */}
        <div className="mb-10 sm:mb-14 lg:mb-20">
          <motion.div
            style={{
              scale: reducedMotion ? 1 : titleScale,
              transformOrigin: "0% 0%",
            }}
            className="inline-flex items-center flex-wrap gap-4 sm:gap-6 will-change-transform"
          >
            <a
              href={category.href}
              className="group inline-flex items-center gap-4 sm:gap-6 cursor-pointer focus-visible:outline-none"
              aria-label={`Explore ${category.title} services`}
            >
              <h2 className={`text-[32px] sm:text-[64px] md:text-[88px] lg:text-[110px] font-medium leading-[1] tracking-[-0.03em] select-none transition-colors duration-300 ${isDark ? "text-white" : "text-[#222222]"
                }`}>
                {category.title}
              </h2>

              {/* Studio CTA Pill with Diagonal Arrow */}
              <motion.span
                style={{
                  scale: reducedMotion ? 1 : pillScale,
                  opacity: reducedMotion ? 1 : pillOpacity,
                  transformOrigin: "left center",
                }}
                className={`inline-flex items-center justify-center w-10 h-6 sm:w-12 sm:h-7 rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-105 shadow-sm ${isDark
                    ? "bg-white text-black group-hover:bg-orange-500 group-hover:text-white"
                    : "bg-neutral-900 text-white group-hover:bg-orange-600"
                  }`}
              >
                <DiagonalArrow className="w-3 h-3 sm:w-[15px] sm:h-[15px] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45 group-focus-visible:rotate-45" />
              </motion.span>
            </a>
          </motion.div>
        </div>

        {/* Category Content: 2-Column Desktop Grid */}
        <motion.div
          style={{
            opacity: reducedMotion ? 1 : contentOpacity,
            y: reducedMotion ? 0 : contentTranslateY,
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-[200px] will-change-transform"
        >
          {/* Left Column: Descriptive Paragraph */}
          <div>
            <p className={`text-[1.125rem] sm:text-[1.35rem] lg:text-[clamp(1rem,1.8vw,1.5rem)] font-medium leading-[1.25] max-w-xl transition-colors duration-300 ${isDark ? "text-zinc-300" : "text-[#222222]"
              }`}>
              {category.description}
            </p>
          </div>

          {/* Right Column: Numbered Service List */}
          <div className="w-full">
            {category.services.map((service, index) => (
              <ServiceListItem key={index} service={service} isDark={isDark} />
            ))}
          </div>
        </motion.div>
      </div>
    </article>
  );
}

// Master full-width Services Section with dark and white theme support
export default function ServicesSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="services"
      className={`relative w-full pt-16 pb-16 sm:pb-32 transition-colors duration-500 ${isDark ? "bg-transparent text-white" : "bg-transparent text-[#222222]"
        }`}
      aria-label="IdeaBin Capabilities & Services"
    >
      {/* Editorial Section Header */}
      <div className="max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 pt-4 pb-16">
        <p className={`font-mono text-xs uppercase tracking-[0.25em] font-medium mb-4 flex items-center gap-2 ${isDark ? "text-orange-400" : "text-orange-600"
          }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          04 · Capabilities & Services
        </p>
        <h2 className={`text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] max-w-4xl ${isDark ? "text-white" : "text-neutral-900"
          }`}>
          Engineering digital architecture with precision.
        </h2>
        <p className={`mt-4 text-base sm:text-lg max-w-2xl leading-relaxed ${isDark ? "text-zinc-400" : "text-neutral-600"
          }`}>
          Choreographing brand identities, enterprise commerce, high-performance web systems, and cloud infrastructure.
        </p>
      </div>

      {/* Stacking Service Category Articles */}
      <div className="relative w-full">
        {CATEGORIES.map((category, idx) => (
          <ServiceCategory
            key={category.id}
            category={category}
            isFirst={idx === 0}
            isLast={idx === CATEGORIES.length - 1}
            isDark={isDark}
          />
        ))}
      </div>
    </section>
  );
}
