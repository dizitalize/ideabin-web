"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/performance";
import { useTheme } from "@/components/providers/ThemeProvider";


// Minimal diagonal arrow SVG matching Image 2
function DiagonalArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
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
  stickyTopDesktop: number; // 0, 76, 152, 228
  stickyTopMobile: number;  // 0, 58, 116, 174
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
    stickyTopDesktop: 76,
    stickyTopMobile: 58,
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
    stickyTopDesktop: 152,
    stickyTopMobile: 116,
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
    stickyTopDesktop: 228,
    stickyTopMobile: 174,
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
      <div className={`relative flex items-center justify-between py-3.5 sm:py-4 border-b select-none transition-colors duration-300 ${isDark ? "border-white/10" : "border-black/10"
        }`}>
        <div className="flex items-baseline">
          <span className={`text-sm sm:text-base font-mono mr-6 tracking-tight ${isDark ? "text-zinc-500" : "text-neutral-400"
            }`}>
            {service.number}
          </span>
          <span className={`text-base sm:text-lg lg:text-[1.15rem] font-medium tracking-tight ${isDark ? "text-zinc-400" : "text-[#222222]"
            }`}>
            {service.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={service.href ?? "#"}
      className={`group relative block w-full py-3.5 sm:py-4 border-b transition-colors duration-300 select-none overflow-hidden focus-visible:outline-none ${isDark ? "border-white/10" : "border-black/10"
        }`}
      aria-label={service.title}
    >
      {/* Fill hover background rising from bottom */}
      <span
        className={`absolute inset-0 translate-y-[101%] group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDark ? "bg-[#1f3d2b]" : "bg-[#2d5a3f]"
          }`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-between px-2">
        <div className="flex items-baseline">
          <span
            className={`text-sm sm:text-base font-mono mr-6 tracking-tight transition-colors duration-500 ${isDark
              ? "text-zinc-500 group-hover:text-orange-400 group-focus-visible:text-orange-400"
              : "text-neutral-400 group-hover:text-neutral-300 group-focus-visible:text-neutral-300"
              }`}
          >
            {service.number}
          </span>
          <span
            className={`text-base sm:text-lg lg:text-[1.15rem] font-medium tracking-tight transition-colors duration-500 ${isDark
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

const STICKY_TOP_CLASSES: Record<string, string> = {
  design: "top-0",
  ecommerce: "top-[58px] md:top-[76px]",
  development: "top-[116px] md:top-[152px]",
  support: "top-[174px] md:top-[228px]",
};

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

  // Scroll tracking to interpolate content reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  // Content reveal: vertical translation from -24px to 0, opacity 0 to 1
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.85],
    isFirst ? [1, 1] : [0, 1]
  );
  const contentTranslateY = useTransform(
    scrollYProgress,
    [0.3, 0.85],
    isFirst ? [0, 0] : [-24, 0]
  );

  return (
    <article
      ref={containerRef}
      id={category.id}
      style={{
        zIndex: category.zIndex,
      }}
      className={`sticky w-full border-t pt-0 ${STICKY_TOP_CLASSES[category.id] ?? "top-0"} ${isLast ? "pb-0" : "pb-16 sm:pb-24 lg:pb-[400px]"
        } px-6 sm:px-12 lg:px-16 xl:px-24 will-change-transform transition-colors duration-500 ${isDark
          ? "bg-black border-white/10 shadow-[0_-1px_0_rgba(255,255,255,0.08)]"
          : "bg-white border-black/10 shadow-[0_-1px_0_rgba(0,0,0,0.05)]"
        }`}
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Category Header Row (Flush height matching sticky offsets so tab stack is clean like Image 2) */}
        <div className="h-[58px] md:h-[76px] flex items-center border-b border-black/10 dark:border-white/10 mb-8 sm:mb-12">
          <a
            href={category.href}
            className="group inline-flex items-center gap-3 sm:gap-4 cursor-pointer focus-visible:outline-none"
            aria-label={`Explore ${category.title} services`}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-medium leading-none tracking-[-0.03em] select-none transition-colors duration-300 ${isDark ? "text-white" : "text-[#111111]"
              }`}>
              {category.title}
            </h2>

            {/* Muted Forest Green Pill with Diagonal Arrow */}
            <span
              className="inline-flex items-center justify-center w-7 h-4 sm:w-9 sm:h-5 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm bg-[#3d664e] text-white"
            >
              <DiagonalArrow className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </a>
        </div>

        {/* Category Content: 2-Column Desktop Grid */}
        <motion.div
          style={{
            opacity: reducedMotion ? 1 : contentOpacity,
            y: reducedMotion ? 0 : contentTranslateY,
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-[160px] will-change-transform"
        >
          {/* Left Column: Descriptive Paragraph */}
          <div>
            <p className={`text-[0.95rem] sm:text-[1.1rem] lg:text-[1.15rem] font-normal leading-relaxed max-w-xl transition-colors duration-300 ${isDark ? "text-zinc-300" : "text-neutral-700"
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
      className={`relative w-full pt-16 pb-8 sm:pb-12 transition-colors duration-500 ${isDark ? "bg-transparent text-white" : "bg-transparent text-[#222222]"
        }`}
      aria-label="IdeaBin Capabilities & Services"
    >
      {/* Editorial Section Header */}
      <div className="max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 pt-4 pb-16">

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
