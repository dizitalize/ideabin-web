"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Minimal Close / X SVG icon
function CloseIcon({ className = "" }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function FAQSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Item 1 open by default
  const [openId, setOpenId] = useState<string | null>("faq-services");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className={`relative z-20 w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-12 transition-colors duration-500 border-t ${isDark ? "bg-black/85 backdrop-blur-xl text-white border-white/10" : "bg-white/85 backdrop-blur-xl text-neutral-900 border-black/10"
        }`}
      aria-label="Frequently Asked Questions"
    >
      <div className="mx-auto w-full max-w-4xl overflow-hidden">
        {/* Header Title & Subtitle */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="mx-auto max-w-5xl text-center tracking-tight font-medium text-3xl md:text-5xl md:leading-tight text-neutral-900 dark:text-white">
            <span style={{ display: "inline-block", verticalAlign: "top", textWrap: "balance" }}>
              Frequently Asked Questions
            </span>
          </h2>
          <p className="my-4 text-sm md:text-base text-center font-normal text-neutral-600 dark:text-zinc-400 mx-auto mt-4 max-w-2xl">
            <span style={{ display: "inline-block", verticalAlign: "top", textWrap: "balance" }}>
              Everything you need to know about our engineering standards, 3D pipelines, and studio engagements.
            </span>
          </p>
        </div>

        {/* Categories List */}
        <div className="relative flex w-full flex-col gap-16">
          {FAQ_DATA.map((category) => (
            <div key={category.title} className="relative w-full">
              {/* Category Header Row with overshooting top dotted line */}
              <div className="relative w-full px-4 sm:px-6 mb-2">
                {/* Horizontal dotted line overshooting past vertical guidelines */}
                {/* <div
                  className={`absolute top-0 left-0 right-0 h-0 border-t border-dotted pointer-events-none transition-colors duration-300 ${isDark ? "border-white/15" : "border-black/15"
                    }`}
                /> */}

                <h3
                  className={`pt-5 pb-3 text-lg sm:text-xl font-medium tracking-tight px-3 sm:px-4 ${isDark ? "text-white" : "text-neutral-900"
                    }`}
                >
                  {category.title}
                </h3>
              </div>

              {/* Accordion Grid Matrix */}
              <div className="relative w-full">
                {/* Items List */}
                <div className="flex flex-col">
                  {category.items.map((item) => {
                    const isOpen = openId === item.id;

                    return (
                      <div key={item.id} className="relative w-full">
                        {/* Dotted border guidelines scoped strictly to the opened item with smooth fade & overshoot */}
                        <AnimatePresence>
                          {isOpen && (
                            <>
                              {/* Horizontal dotted line ABOVE opened FAQ with crosshair overshoot */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className={`absolute top-0 left-0 right-0 h-0 border-t border-dotted pointer-events-none transition-colors duration-300 ${isDark ? "border-white/15" : "border-black/15"
                                  }`}
                              />

                              {/* Left vertical dotted border for opened item */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className={`absolute left-4 sm:left-6 -top-2 -bottom-2 w-0 border-l border-dotted pointer-events-none transition-colors duration-300 ${isDark ? "border-white/15" : "border-black/15"
                                  }`}
                              />

                              {/* Right vertical dotted border for opened item */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className={`absolute right-4 sm:right-6 -top-2 -bottom-2 w-0 border-r border-dotted pointer-events-none transition-colors duration-300 ${isDark ? "border-white/15" : "border-black/15"
                                  }`}
                              />

                              {/* Horizontal dotted line BELOW opened FAQ with crosshair overshoot */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className={`absolute bottom-0 left-0 right-0 h-0 border-b border-dotted pointer-events-none transition-colors duration-300 ${isDark ? "border-white/15" : "border-black/15"
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
                                    : "font-medium text-neutral-900"
                                  : isDark
                                    ? "font-normal text-white group-hover:text-zinc-200"
                                    : "font-normal text-neutral-800 group-hover:text-neutral-950"
                                  }`}
                              >
                                {item.question}
                              </span>

                              <motion.span
                                animate={{ rotate: isOpen ? 45 : 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className={`shrink-0 p-0.5 transition-colors ${isDark
                                  ? "text-zinc-400 group-hover:text-white"
                                  : "text-neutral-500 group-hover:text-neutral-900"
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
                                    className={`pt-3.5 text-sm sm:text-[14.5px] leading-relaxed max-w-3xl ${isDark ? "text-zinc-400" : "text-neutral-600"
                                      }`}
                                  >
                                    {item.answer}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
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

