"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useInView } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Minimal diagonal arrow SVG matching abox.agency
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

// Minimal right arrow SVG for service list items matching abox.agency
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
  href?: string;
  description: string;
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
    services: [
      { number: "01", title: "UI/UX Design", href: "#", clickable: true },
      { number: "02", title: "Brand Identity", href: "#", clickable: true },
      { number: "03", title: "Website Design", href: "#", clickable: true },
      { number: "04", title: "Graphic Design", clickable: false },
      { number: "05", title: "Packaging Design", clickable: false },
      { number: "06", title: "3D Product Rendering", href: "#", clickable: true },
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
    services: [
      { number: "01", title: "Shopify Development", clickable: false },
      { number: "02", title: "Shopify Plus Development", clickable: false },
      { number: "03", title: "Shopify Migration", clickable: false },
      { number: "04", title: "Shopify App Development", href: "#", clickable: true },
      { number: "05", title: "Headless Commerce", clickable: false },
      { number: "06", title: "CRO (Conversion Rate Optimization)", clickable: false },
      { number: "07", title: "A/B Testing", href: "#", clickable: true },
      { number: "08", title: "Store Performance Optimization", clickable: false },
    ],
  },
  {
    id: "development",
    index: "03",
    title: "Development",
    href: "#development",
    description:
      "Build powerful digital products with modern technologies. Our team delivers custom web development, Next.js, React.js, Node.js, Python, mobile applications, CMS development, API integrations, headless commerce, and enterprise solutions tailored to your business goals.",
    services: [
      { number: "01", title: "Custom Web Development", href: "#", clickable: true },
      { number: "02", title: "Next.js Development", href: "#", clickable: true },
      { number: "03", title: "React.js Development", href: "#", clickable: true },
      { number: "04", title: "Python Development", href: "#", clickable: true },
      { number: "05", title: "Mobile App Development", clickable: false },
      { number: "06", title: "CMS Development (WordPress, Webflow, Framer)", href: "#", clickable: true },
      { number: "07", title: "API & Third-Party Integrations", href: "#", clickable: true },
    ],
  },
  {
    id: "support",
    index: "04",
    title: "Support",
    description:
      "Scale confidently with continuous optimization and expert support. We provide Shopify store management, website maintenance, SEO, performance optimization, DevOps, cloud infrastructure, analytics, technical support, and ongoing growth consulting to keep your business performing at its best.",
    services: [
      { number: "01", title: "Shopify Store Management", href: "#", clickable: true },
      { number: "02", title: "Website Maintenance", clickable: false },
      { number: "03", title: "SEO Optimization", href: "#", clickable: true },
      { number: "04", title: "Performance Optimization", clickable: false },
      { number: "05", title: "Marketing Funnel Setup", clickable: false },
      { number: "06", title: "Analytics & Tracking", clickable: false },
      { number: "07", title: "DevOps & Cloud Management", clickable: false },
      { number: "08", title: "Technical Support", clickable: false },
    ],
  },
];

// Exact dimensions and scale math inferred directly from abox.agency
const STICKY_OFFSETS = [
  { mobile: 0, tablet: 0, desktop: 0 },
  { mobile: 67, tablet: 86, desktop: 86 },
  { mobile: 134, tablet: 172, desktop: 172 },
  { mobile: 201, tablet: 258, desktop: 258 },
];

const PILL_WIDTH = 48;
const PILL_HEIGHT_DESKTOP = 28;
const PILL_HEIGHT_MOBILE = 24;
const PILL_PAD_X = 16;
const PILL_PAD_Y_MOBILE = 4;

const getTitleScale = () => (typeof window !== "undefined" && window.innerWidth < 768 ? 0.8 : 0.4);
const getInverseScale = () => 1 / getTitleScale();
const getPillHeight = () =>
  typeof window !== "undefined" && window.innerWidth < 768 ? PILL_HEIGHT_MOBILE : PILL_HEIGHT_DESKTOP;
const getPillPadY = () =>
  typeof window !== "undefined" && window.innerWidth < 768 ? PILL_PAD_Y_MOBILE : 4;

const getStickyOffset = (idx: number) => {
  if (typeof window === "undefined") return 0;
  const cfg = STICKY_OFFSETS[idx] || { mobile: 0, tablet: 0, desktop: 0 };
  return window.innerWidth >= 1280 ? cfg.desktop : window.innerWidth >= 768 ? cfg.tablet : cfg.mobile;
};

const getDistanceToNext = (idx: number) => {
  const curr = getStickyOffset(idx);
  const next = STICKY_OFFSETS[idx + 1]
    ? getStickyOffset(idx + 1)
    : curr + (typeof window !== "undefined" && window.innerWidth >= 768 ? 86 : 67);
  return Math.max(next - curr, 1);
};

// Single service list row matching abox.agency with bottom-up orange fill
function ServiceListItem({ service, isDark, index }: { service: ServiceItem; isDark: boolean; index: number }) {
  const rowRef = useRef<HTMLLIElement>(null);
  const isItemInView = useInView(rowRef, { once: true, amount: 0.4 });

  const rowClass = `relative flex items-center gap-4 overflow-clip border-0 border-b border-solid px-0 py-3 outline-none md:gap-6 md:py-4 xl:gap-8 xl:py-6 transition-colors duration-300 ${
    isDark ? "border-white/10" : "border-[#222]/10"
  }`;

  const inner = (
    <>
      <span
        className={`relative z-10 w-7 shrink-0 text-[0.8rem] font-medium leading-[1.3] md:w-8 md:text-[clamp(1rem,1.6vw,1.5625rem)] md:leading-normal xl:w-[35px] transition-colors duration-300 ${
          isDark
            ? "text-zinc-500 group-hover:text-zinc-300"
            : "text-[#222]/40 group-hover:text-[#222]/70"
        }`}
      >
        {service.number}
      </span>
      <span
        className={`relative z-10 min-w-0 flex-1 text-[0.8rem] font-medium leading-[1.3] md:text-[clamp(1rem,1.6vw,1.5625rem)] md:leading-normal transition-colors duration-300 ${
          isDark
            ? "text-white group-hover:text-zinc-200"
            : "text-[#222] group-hover:text-black"
        }`}
      >
        {service.title}
      </span>
    </>
  );

  return (
    <motion.li
      ref={rowRef}
      initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
      animate={isItemInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.48, delay: 0.05 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {service.clickable ? (
        <a
          href={service.href ?? "#"}
          className={`group no-underline transition-colors duration-300 ${rowClass} ${
            isDark ? "!text-white hover:bg-white/[0.03]" : "!text-[#222] hover:bg-black/[0.03]"
          }`}
          aria-label={service.title}
        >
          {inner}
        </a>
      ) : (
        <div className={`${rowClass} cursor-default ${isDark ? "text-white" : "text-[#222]"}`}>
          {inner}
        </div>
      )}
    </motion.li>
  );
}

// Animated section header — blurs up and fades in on scroll entrance
function SectionHeaderAnimated({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div ref={ref} className="max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 pt-4 pb-16">
      <motion.h2
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] max-w-4xl ${
          isDark ? "text-white" : "text-neutral-900"
        }`}
      >
        Engineering digital architecture with precision.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-4 text-base sm:text-lg max-w-2xl leading-relaxed ${
          isDark ? "text-zinc-400" : "text-neutral-600"
        }`}
      >
        Choreographing brand identities, enterprise commerce, high-performance web systems, and cloud
        infrastructure.
      </motion.p>
    </div>
  );
}

// Master full-width Services Section configured identically to abox.agency
export default function ServicesSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<(HTMLElement | null)[]>([]);
  const titlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const pillsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    let ctx: gsap.Context | null = null;

    const setPillBase = (pill: HTMLElement) => {
      gsap.set(pill, {
        width: PILL_WIDTH,
        height: getPillHeight(),
        paddingLeft: PILL_PAD_X,
        paddingRight: PILL_PAD_X,
        paddingTop: getPillPadY(),
        paddingBottom: getPillPadY(),
        transformOrigin: "0% 50%",
        y: 0,
        force3D: true,
      });
    };

    // Desktop GSAP ScrollTrigger Scrub setup (>= 1024px)
    const initDesktop = () => {
      ctx = gsap.context(() => {
        CATEGORIES.forEach((_, n) => {
          const article = articlesRef.current[n];
          const title = titlesRef.current[n];
          const pill = pillsRef.current[n];
          const content = contentsRef.current[n];
          if (!article) return;

          const isLast = n === CATEGORIES.length - 1;
          const nextArticle = article.nextElementSibling as HTMLElement | null;

const tl = gsap.timeline({
             defaults: { ease: "power2.out", force3D: true },
             scrollTrigger: {
               trigger: isLast ? article : nextArticle,
               start: () =>
                 isLast
                   ? `top ${getStickyOffset(n) + getDistanceToNext(n - 1)}px`
                   : `top ${getStickyOffset(n + 1) + getDistanceToNext(n)}px`,
               end: () => (isLast ? `top ${getStickyOffset(n)}px` : `top ${getStickyOffset(n + 1)}px`),
               scrub: 0.8,
               invalidateOnRefresh: true,
             },
           });

          if (!isLast && nextArticle) {
            if (title) {
              gsap.set(title, { transformOrigin: "0% 0%", force3D: true });
              tl.fromTo(title, { scale: 1 }, { scale: () => getTitleScale(), duration: 1 }, 0);
            }
            if (pill) {
              setPillBase(pill);
              tl.fromTo(
                pill,
                { scale: 0, autoAlpha: 0 },
                { scale: () => getInverseScale(), autoAlpha: 1, duration: 1 },
                0
              );
            }
            if (content) {
              tl.fromTo(content, { opacity: 1, y: 0 }, { opacity: 0, y: -32, duration: 1 }, 0);
            }
          } else {
            // SUPPORT COMPONENT (the final category):
            // Smoothly reveals the orange arrow pill as Support locks into its sticky position.
            // Notice: Title does NOT collapse and content does NOT fade out!
            if (pill) {
              setPillBase(pill);
              tl.fromTo(pill, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1 }, 0);
            }
          }
        });

        ScrollTrigger.refresh();
      }, containerRef);
    };

    // Mobile / Tablet smooth scroll listener (< 1024px)
    const initMobile = () => {
      ctx = gsap.context(() => {
        const getOffsetTop = (el: HTMLElement) => {
          let top = 0;
          let curr: HTMLElement | null = el;
          while (curr) {
            top += curr.offsetTop;
            curr = curr.offsetParent as HTMLElement | null;
          }
          return top;
        };

        const getProgress = (
          currentArt: HTMLElement,
          nextArt: HTMLElement,
          index: number,
          isLast: boolean
        ) => {
          const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
          if (isLast) {
            const h = getStickyOffset(index);
            const start = getOffsetTop(currentArt) - (h + getDistanceToNext(index - 1));
            const end = getOffsetTop(currentArt) - h;
            return gsap.utils.clamp(0, 1, (scrollY - start) / Math.max(end - start, 1));
          }
          const m = getStickyOffset(index + 1);
          const start = getOffsetTop(nextArt) - (m + getDistanceToNext(index));
          const end = getOffsetTop(nextArt) - m;
          return gsap.utils.clamp(0, 1, (scrollY - start) / Math.max(end - start, 1));
        };

        const setPillBaseMobile = (pill: HTMLElement) => {
          gsap.set(pill, {
            position: "absolute",
            left: "100%",
            top: "50%",
            x: 12,
            yPercent: -50,
            width: PILL_WIDTH,
            height: getPillHeight(),
            paddingLeft: PILL_PAD_X,
            paddingRight: PILL_PAD_X,
            paddingTop: getPillPadY(),
            paddingBottom: getPillPadY(),
            scale: 1,
            transformOrigin: "0% 50%",
            force3D: true,
          });
        };

        type MobileItem = {
          tl: gsap.core.Timeline;
          article: HTMLElement;
          nextArticle: HTMLElement;
          index: number;
          isLast: boolean;
          playhead: { p: number };
          smoothTo: (value: number) => void;
        };

        const items: MobileItem[] = [];

        CATEGORIES.forEach((_, e) => {
          const r = articlesRef.current[e];
          const f = titlesRef.current[e];
          const w = pillsRef.current[e];
          const m = contentsRef.current[e];
          if (!r) return;
          const isLast = e === CATEGORIES.length - 1;
          const nextArticle = r.nextElementSibling as HTMLElement | null;
          const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", force3D: true } });

          if (!isLast && nextArticle) {
            f && tl.fromTo(f, { scale: 1 }, { scale: () => getTitleScale(), duration: 1 }, 0);
            w &&
              (setPillBaseMobile(w),
              tl.fromTo(
                w,
                { autoAlpha: 0, scale: 1 },
                { autoAlpha: 1, scale: () => getInverseScale(), duration: 1 },
                0
              ));
            m && tl.fromTo(m, { opacity: 1, y: 0 }, { opacity: 0, y: 0, duration: 1 }, 0);
            items.push({
              tl,
              article: r,
              nextArticle,
              index: e,
              isLast: false,
              playhead: { p: 0 },
              smoothTo: () => {},
            });
          } else {
            w &&
              (setPillBaseMobile(w),
              tl.fromTo(w, { autoAlpha: 0, scale: 1 }, { autoAlpha: 1, scale: 1, duration: 1 }, 0));
            items.push({
              tl,
              article: r,
              nextArticle: r,
              index: e,
              isLast: true,
              playhead: { p: 0 },
              smoothTo: () => {},
            });
          }
        });

        items.forEach((item) => {
          const prog = getProgress(item.article, item.nextArticle, item.index, item.isLast);
          item.playhead = { p: prog };
          item.tl.progress(prog);
          item.smoothTo = gsap.quickTo(item.playhead, "p", {
            duration: 0.38,
            ease: "power2.out",
            onUpdate: () => {
              item.tl.progress(item.playhead.p);
            },
          });
        });

        const onScroll = () => {
          items.forEach((item) => {
            item.smoothTo(getProgress(item.article, item.nextArticle, item.index, item.isLast));
          });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return () => {
          window.removeEventListener("scroll", onScroll);
          pillsRef.current.forEach((t) => t && gsap.set(t, { clearProps: "all" }));
          titlesRef.current.forEach((t) => t && gsap.set(t, { clearProps: "all" }));
          contentsRef.current.forEach((t) => t && gsap.set(t, { clearProps: "all" }));
        };
      }, containerRef);
    };

    const setup = () => {
      ctx?.revert();
      ctx = null;
      if (mediaQuery.matches) {
        initMobile();
      } else {
        initDesktop();
      }
    };

    setup();
    mediaQuery.addEventListener("change", setup);

    return () => {
      mediaQuery.removeEventListener("change", setup);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="services"
      className={`relative w-full pt-16 pb-0 transition-colors duration-500 ${
        isDark ? "bg-transparent text-white" : "bg-transparent text-[#222222]"
      }`}
      aria-label="IdeaBin Capabilities & Services"
    >
      {/* Editorial Section Header — scroll-animated blur+slide entrance */}
      <SectionHeaderAnimated isDark={isDark} />

      {/* Stacking Service Category Articles with exact abox.agency architecture */}
      <div ref={containerRef} className="relative z-10 flex flex-col w-full">
        {CATEGORIES.map((category, idx) => {
          const cfg = STICKY_OFFSETS[idx] || { mobile: 0, tablet: 0, desktop: 0 };
          const isSlightLight = idx % 2 === 0;
          const cardStyleClasses = isDark
            ? isSlightLight
              ? "bg-[#0d0d12] border-white/12 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.45)]"
              : "bg-[#000000] border-white/10 text-white shadow-[0_-12px_36px_rgba(0,0,0,0.6)]"
            : isSlightLight
              ? "bg-[#fafafc] border-black/8 text-[#222] shadow-[0_-6px_20px_rgba(0,0,0,0.03)]"
              : "bg-[#ffffff] border-black/10 text-[#222] shadow-[0_-8px_28px_rgba(0,0,0,0.05)]";

          return (
            <article
              key={category.id}
              ref={(el) => {
                articlesRef.current[idx] = el;
              }}
              id={category.id}
              className={`sticky flex flex-col border-0 border-t border-x border-solid rounded-t-[28px] sm:rounded-t-[36px] lg:rounded-t-[40px] pt-6 pb-[50px] px-6 sm:px-12 lg:px-16 xl:px-24 transition-colors duration-500 ${cardStyleClasses}`}
              style={
                {
                  zIndex: idx + 1,
                  top: "var(--top)",
                  "--top": `${cfg.mobile}px`,
                  "--top-md": `${cfg.tablet}px`,
                  "--top-xl": `${cfg.desktop}px`,
                } as React.CSSProperties
              }
            >
              {/* Responsive top style injector matching abox.agency */}
              <style jsx>{`
                article#${category.id} {
                  top: ${cfg.mobile}px;
                }
                @media (min-width: 768px) {
                  article#${category.id} {
                    top: ${cfg.tablet}px;
                  }
                }
                @media (min-width: 1280px) {
                  article#${category.id} {
                    top: ${cfg.desktop}px;
                  }
                }
              `}</style>

              <div className="max-w-[1720px] mx-auto w-full">
                {/* Large Category Title + Inline CTA Pill */}
                <h3 className="m-0">
                  <div
                    ref={(el) => {
                      titlesRef.current[idx] = el;
                    }}
                    className={`group w-fit origin-top-left ${
                      category.href ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <a
                      href={category.href ?? `#${category.id}`}
                      className={`inline-flex items-center gap-3 md:gap-4 leading-none text-[32px] md:text-[110px] font-medium max-lg:relative no-underline select-none transition-colors duration-300 ${
                        isDark ? "text-white" : "text-[#222]"
                      }`}
                      aria-label={`Explore ${category.title} services`}
                    >
                      {category.title}

                      
                    </a>
                  </div>
                </h3>

                {/* Category Content: 2-Column Desktop Grid */}
                <div
                  ref={(el) => {
                    contentsRef.current[idx] = el;
                  }}
                  className="mt-8 overflow-hidden xl:mt-[30px] max-lg:mt-4 max-lg:min-w-0"
                >
                  <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:gap-[200px] justify-between max-lg:min-w-0 max-lg:gap-5 sm:max-lg:gap-10">
                    {/* Left Column: Descriptive Paragraph */}
                    <p
                      className={`m-0 text-[clamp(1rem,1.8vw,1.5rem)] font-medium leading-[1.2] max-lg:min-w-0 max-lg:text-[clamp(0.875rem,1.8vw,1.5rem)] transition-colors duration-300 ${
                        isDark ? "text-zinc-300" : "text-[#222]"
                      }`}
                    >
                      {category.description}
                    </p>

                    {/* Right Column: Numbered Service List — stagger-animated on scroll */}
                    <ol className="m-0 flex min-w-0 w-full list-none flex-col p-0 md:max-w-[760px] md:text-nowrap">
                      {category.services.map((service, sIdx) => (
                        <ServiceListItem key={service.title} service={service} isDark={isDark} index={sIdx} />
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
