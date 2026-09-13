"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "Capabilities & Engagements",
    items: [
      {
        id: "faq-services",
        question: "What core services does IdeaBin deliver?",
        answer:
          "We engineer spatial 3D web experiences, bespoke e-commerce platforms (Shopify & Headless), full-stack web applications, brand identities, and high-performance cloud infrastructure for visionary brands.",
      },
      {
        id: "faq-scroll-3d",
        question: "How do you achieve 60fps 3D scroll animations without lag?",
        answer:
          "We use pre-rendered WebP/JPG frame sequences rendered directly to HTML5 Canvas via requestAnimationFrame, decoupled from React state renders. With dual-channel preloading and direct DOM transforms, frame rates remain locked at a buttery 60fps across desktop and mobile.",
      },
      {
        id: "faq-timeline",
        question: "What is your typical project timeline?",
        answer:
          "Brand & interactive landing page sprints typically take 2–4 weeks. Complete full-stack web platforms, e-commerce stores, and enterprise 3D web applications generally range between 6–10 weeks depending on custom 3D asset pipelines and integration scope.",
      },
      {
        id: "faq-maintenance",
        question: "Do you offer ongoing retainer support and optimization?",
        answer:
          "Yes. We partner with clients long-term through dedicated maintenance, CRO (conversion rate optimization), performance tuning, security audits, and continuous feature development.",
      },
      {
        id: "faq-get-started",
        question: "How do we get started with IdeaBin?",
        answer:
          "Contact our creative directors directly. We'll review your project requirements, schedule an exploratory discovery session, and deliver an actionable technical roadmap and transparent scope estimate within 48 hours.",
      },
    ],
  },
];

// Minimal Plus SVG icon
function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function FAQSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  // Open state: starts null while items load one-by-one, then opens item 1 after all loads
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // When section enters view, items stagger in. After all 5 items load, open the first item automatically.
  useEffect(() => {
    if (isInView && !hasAutoOpened) {
      const totalItems = FAQ_DATA[0].items.length;
      // Stagger time: (totalItems - 1) * 120ms + 400ms entrance duration + 100ms settle
      const totalLoadTime = (totalItems - 1) * 120 + 500;

      const timer = setTimeout(() => {
        setHasAutoOpened(true);
        if (!userInteracted) {
          setOpenId("faq-services");
        }
      }, totalLoadTime);

      return () => clearTimeout(timer);
    }
  }, [isInView, hasAutoOpened, userInteracted]);

  const toggleItem = (id: string) => {
    setUserInteracted(true);
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className={`relative z-20 w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-12 transition-colors duration-500 rounded-t-[32px] sm:rounded-t-[44px] border-t border-x shadow-[0_-12px_40px_rgba(0,0,0,0.45)] ${isDark
          ? "bg-[#0d0d12]/90 backdrop-blur-xl text-white border-white/12"
          : "bg-[#fafafc]/95 backdrop-blur-xl text-[#222222] border-black/8"
        }`}
      aria-label="Frequently Asked Questions"
    >
      <div ref={containerRef} className="mx-auto w-full max-w-4xl overflow-hidden">
        {/* Header Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2
            className={`mx-auto max-w-5xl text-center tracking-tight font-medium text-3xl md:text-5xl md:leading-tight transition-colors duration-300 ${isDark ? "text-white" : "text-[#111111]"
              }`}
          >
            <span style={{ display: "inline-block", verticalAlign: "top", textWrap: "balance" }}>
              Frequently Asked Questions
            </span>
          </h2>
          <p
            className={`my-4 text-sm md:text-base text-center font-normal mx-auto mt-4 max-w-2xl transition-colors duration-300 ${isDark ? "text-zinc-400" : "text-neutral-600"
              }`}
          >
            <span style={{ display: "inline-block", verticalAlign: "top", textWrap: "balance" }}>
              Everything you need to know about our engineering standards, 3D pipelines, and studio engagements.
            </span>
          </p>
        </motion.div>

        {/* Categories List */}
        <div className="relative flex w-full flex-col gap-16">
          {FAQ_DATA.map((category) => (
            <div key={category.title} className="relative w-full">
              {/* Category Header Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full px-4 sm:px-6 mb-2"
              >
                <h3
                  className={`pt-5 pb-3 text-lg sm:text-xl font-medium tracking-tight px-3 sm:px-4 transition-colors duration-300 ${isDark ? "text-white" : "text-[#111111]"
                    }`}
                >
                  {category.title}
                </h3>
              </motion.div>

              {/* Accordion Grid Matrix with scroll-based staggered reveal */}
              <div className="relative w-full">
                <div className="flex flex-col">
                  {category.items.map((item, index) => {
                    const isOpen = openId === item.id;
                    const isHovered = hoveredId === item.id;
                    const showDotted = isOpen || isHovered;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 24 }
                        }
                        transition={{
                          duration: 0.5,
                          delay: 0.15 + index * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="relative w-full"
                      >
                        {/* Dotted border guidelines scoped to opened or hovered item with slightly increased 1.5px dots */}
                        <AnimatePresence>
                          {showDotted && (
                            <>
                              {/* Horizontal dotted line ABOVE FAQ with crosshair overshoot */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className={`absolute top-0 left-0 right-0 h-0 border-t-[1.5px] border-dotted pointer-events-none transition-colors duration-200 ${
                                  isDark ? "border-white/20" : "border-black/20"
                                }`}
                              />

                              {/* Left vertical dotted border for item */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className={`absolute left-4 sm:left-6 -top-2 -bottom-2 w-0 border-l-[1.5px] border-dotted pointer-events-none transition-colors duration-200 ${
                                  isDark ? "border-white/20" : "border-black/20"
                                }`}
                              />

                              {/* Right vertical dotted border for item */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className={`absolute right-4 sm:right-6 -top-2 -bottom-2 w-0 border-r-[1.5px] border-dotted pointer-events-none transition-colors duration-200 ${
                                  isDark ? "border-white/20" : "border-black/20"
                                }`}
                              />

                              {/* Horizontal dotted line BELOW FAQ with crosshair overshoot */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className={`absolute bottom-0 left-0 right-0 h-0 border-b-[1.5px] border-dotted pointer-events-none transition-colors duration-200 ${
                                  isDark ? "border-white/20" : "border-black/20"
                                }`}
                              />
                            </>
                          )}
                        </AnimatePresence>

                        {/* Item Content Box */}
                        <div className="px-4 sm:px-6">
                          <div className="px-3 sm:px-4 py-4 sm:py-5">
                            <button
                              type="button"
                              onClick={() => toggleItem(item.id)}
                              className="flex w-full items-center justify-between gap-4 text-left cursor-pointer group focus-visible:outline-none"
                              aria-expanded={isOpen}
                            >
                              <span
                                className={`text-sm sm:text-base leading-snug transition-colors duration-200 ${isOpen
                                    ? isDark
                                      ? "font-medium text-white"
                                      : "font-medium text-[#111111]"
                                    : isDark
                                      ? "font-normal text-white/90 group-hover:text-white"
                                      : "font-normal text-[#222222] group-hover:text-black"
                                  }`}
                              >
                                {item.question}
                              </span>

                              <motion.span
                                animate={{ rotate: isOpen ? 45 : 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className={`shrink-0 p-0.5 transition-colors ${isDark
                                    ? "text-zinc-400 group-hover:text-white"
                                    : "text-neutral-500 group-hover:text-orange-500"
                                  }`}
                                aria-label={isOpen ? "Close question" : "Open question"}
                              >
                                <PlusIcon className="w-4 h-4" />
                              </motion.span>
                            </button>

                            {/* Collapsible Answer with smooth height & opacity transitions */}
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  key="content"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{
                                    opacity: 1,
                                    height: "auto",
                                    transition: {
                                      height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                                      opacity: { duration: 0.22, delay: 0.06, ease: "easeOut" },
                                    },
                                  }}
                                  exit={{
                                    opacity: 0,
                                    height: 0,
                                    transition: {
                                      height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                                      opacity: { duration: 0.16, ease: "easeIn" },
                                    },
                                  }}
                                  className="overflow-hidden"
                                >
                                  <p
                                    className={`pt-3.5 text-sm sm:text-[14.5px] leading-relaxed max-w-3xl transition-colors duration-300 ${isDark ? "text-zinc-400" : "text-neutral-600"
                                      }`}
                                  >
                                    {item.answer}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
