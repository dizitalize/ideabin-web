"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SiteFooter from "@/components/sections/SiteFooter";
import { useTheme } from "@/components/providers/ThemeProvider";

// Minimal Plus SVG icon matching main page FAQ
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "Pricing" | "Agents" | "Spatial 3D" | "Legal";
}

const FAQ_SECTIONS: { category: "Pricing" | "Agents" | "Spatial 3D" | "Legal"; title: string; items: FaqItem[] }[] = [
  {
    category: "Pricing",
    title: "Pricing & Plans",
    items: [
      {
        id: "faq-pricing-1",
        category: "Pricing",
        question: "How much does it cost to deploy AI agents?",
        answer:
          "Our pricing starts at $49/month for the Starter plan which includes up to 5 AI agents and 10,000 task executions. Scale plans start at $199/month for unlimited agents and 100,000 executions. Enterprise pricing is available for high-volume needs and custom VPC deployments.",
      },
      {
        id: "faq-pricing-2",
        category: "Pricing",
        question: "Is there a free trial available?",
        answer:
          "Yes! We offer a 14-day free trial on all Starter and Pro plans with complete access to our orchestration dashboard, live agent debugging, and pre-built integration templates. No credit card is required to begin.",
      },
      {
        id: "faq-pricing-3",
        category: "Pricing",
        question: "What happens if I exceed my plan limits?",
        answer:
          "If you reach your execution threshold, your agents won't abruptly stop. We provide a soft buffer and will notify you via dashboard alerts and email. You can auto-scale additional execution packs or upgrade your tier seamlessly at prorated rates.",
      },
      {
        id: "faq-pricing-4",
        category: "Pricing",
        question: "Can I change plans at any time?",
        answer:
          "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from the billing portal. Upgrades take effect immediately with prorated billing, and downgrades apply at the end of your current billing cycle.",
      },
      {
        id: "faq-pricing-5",
        category: "Pricing",
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for all annual commitments if you're not satisfied with our platform's reliability or execution speed. Monthly plans can be cancelled at any time without further charges.",
      },
    ],
  },
  {
    category: "Agents",
    title: "Agents & Automation",
    items: [
      {
        id: "faq-agents-1",
        category: "Agents",
        question: "What can AI agents automate?",
        answer:
          "AI agents can automate end-to-end multi-step workflows including customer support routing, document processing, database ETL syncs, API orchestrations, automated lead research, code testing, and continuous deployment triggers.",
      },
      {
        id: "faq-agents-2",
        category: "Agents",
        question: "How do I deploy and orchestrate my agents?",
        answer:
          "Deploying agents is instantaneous through our CLI or intuitive visual canvas. Connect your trigger sources (webhooks, cron schedules, event buses), configure tool permissions, select your LLM provider (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro), and deploy globally with single-command rollback.",
      },
      {
        id: "faq-agents-3",
        category: "Agents",
        question: "Can agents make autonomous decisions?",
        answer:
          "Yes, agents operate with autonomous reasoning loops (ReAct / Plan-and-Execute) guided by strict guardrails and policy filters you define. You can configure 'Human-in-the-loop' verification gates for high-stakes actions like financial transfers or production database updates.",
      },
      {
        id: "faq-agents-4",
        category: "Agents",
        question: "Can agents integrate with our internal databases and APIs?",
        answer:
          "Absolutely. We support native REST, GraphQL, PostgreSQL, MongoDB, Redis, and OpenAPI schema ingestion, as well as secure VPC peering, mTLS, and custom proxy tunneling for on-premise private network architectures.",
      },
    ],
  },
  {
    category: "Spatial 3D",
    title: "Spatial 3D & Web Engineering",
    items: [
      {
        id: "faq-spatial-1",
        category: "Spatial 3D",
        question: "How do you achieve 60fps 3D scroll animations without lag?",
        answer:
          "We use pre-rendered high-fidelity WebP/JPG frame sequences rendered directly onto an HTML5 Canvas via hardware-accelerated requestAnimationFrame loops, decoupled from React component lifecycle re-renders. Dual-channel preloading and direct CSS GPU transforms guarantee a locked 60fps across desktop and mobile devices.",
      },
      {
        id: "faq-spatial-2",
        category: "Spatial 3D",
        question: "Does the 3D scroll experience work smoothly on mobile browsers?",
        answer:
          "Yes. Our canvas engine auto-detects device pixel ratios (DPR), network latency, and memory constraints. On mobile, it serves optimized 0.75x–1x resolution frames with touch-normalized inertia scrolling powered by Lenis smooth scroll.",
      },
      {
        id: "faq-spatial-3",
        category: "Spatial 3D",
        question: "What 3D software and asset pipelines do you support?",
        answer:
          "We accept frame sequences and 3D scenes rendered in Blender, Cinema 4D, Maya, Houdini, Unreal Engine, or After Effects. We handle automatic WebP compression, aspect ratio normalization, and dark/light mode asset switching.",
      },
    ],
  },
  {
    category: "Legal",
    title: "Legal & Data Security",
    items: [
      {
        id: "faq-legal-1",
        category: "Legal",
        question: "How is my data protected?",
        answer:
          "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We operate in SOC-2 Type II compliant environments with automated penetration testing and strict zero-trust role-based access control (RBAC).",
      },
      {
        id: "faq-legal-2",
        category: "Legal",
        question: "Are you GDPR compliant?",
        answer:
          "Yes, we are fully GDPR, CCPA, and HIPAA compliant. We offer dedicated EU data residency, standard Data Processing Agreements (DPA), and self-serve data export/deletion workflows.",
      },
      {
        id: "faq-legal-3",
        category: "Legal",
        question: "What are your terms of service and code ownership policies?",
        answer:
          "You retain 100% full intellectual property ownership of your prompts, data, custom models, and deployed code. IdeaBin never trains foundation models on your proprietary business data or private logs.",
      },
    ],
  },
];

const CATEGORIES = ["All", "Pricing", "Agents", "Spatial 3D", "Legal"] as const;

export default function FAQPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  // Automatically open the first question after initial load animation (matching main page FAQ)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInteracted) {
        setOpenId("faq-pricing-1");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [userInteracted]);

  const toggleItem = (id: string) => {
    setUserInteracted(true);
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Filter sections and items based on category and search query
  const filteredSections = useMemo(() => {
    return FAQ_SECTIONS.map((section) => {
      if (selectedCategory !== "All" && section.category !== selectedCategory) {
        return null;
      }
      const filteredItems = section.items.filter((item) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
        );
      });
      if (filteredItems.length === 0) return null;
      return {
        ...section,
        items: filteredItems,
      };
    }).filter(Boolean) as typeof FAQ_SECTIONS;
  }, [selectedCategory, searchQuery]);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#09090c] text-white" : "bg-[#fafafc] text-[#222222]"
      }`}
    >
      <main className="mx-auto w-full max-w-4xl px-4 pt-32 pb-24 sm:px-6 md:px-8 md:pt-36">
        {/* Top Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex items-center justify-between"
        >
          <Link
            href="/"
            className={`group inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
              isDark ? "text-zinc-400 hover:text-white" : "text-neutral-600 hover:text-black"
            }`}
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span>Back to Home</span>
          </Link>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
              isDark
                ? "border-white/10 bg-white/5 text-zinc-400"
                : "border-black/10 bg-black/5 text-neutral-600"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Questions & Answers
          </span>
        </motion.div>

        {/* Header Title & Subtitle — matching main page FAQ dramatic clip+blur reveal */}
        <motion.div
          initial={{ opacity: 0, y: 36, filter: "blur(10px)", clipPath: "inset(0 0 40% 0)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 sm:mb-16"
        >
          <h1
            className={`mx-auto max-w-5xl text-center tracking-tight font-medium text-3xl md:text-5xl md:leading-tight transition-colors duration-300 ${
              isDark ? "text-white" : "text-[#111111]"
            }`}
          >
            <span style={{ display: "inline-block", verticalAlign: "top", textWrap: "balance" }}>
              Frequently Asked Questions
            </span>
          </h1>
          <p
            className={`my-4 text-sm md:text-base text-center font-normal mx-auto mt-4 max-w-2xl transition-colors duration-300 ${
              isDark ? "text-zinc-400" : "text-neutral-600"
            }`}
          >
            <span style={{ display: "inline-block", verticalAlign: "top", textWrap: "balance" }}>
              Everything you need to know about our engineering standards, 3D pipelines, pricing, and studio engagements.
            </span>
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-md">
            <div
              className={`relative flex items-center rounded-xl border border-dashed px-3.5 py-2.5 transition-all ${
                isDark
                  ? "border-white/15 bg-white/5 focus-within:border-white/35 focus-within:bg-white/[0.08]"
                  : "border-black/15 bg-black/5 focus-within:border-black/35 focus-within:bg-black/[0.08]"
              }`}
            >
              <svg
                className={`mr-2.5 h-4 w-4 shrink-0 ${isDark ? "text-zinc-400" : "text-neutral-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. pricing, 60fps, agents)..."
                className={`w-full bg-transparent text-sm border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-zinc-500 ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
                style={{ outline: "none", boxShadow: "none" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`text-xs p-1 rounded-full outline-none focus:outline-none focus-visible:outline-none ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-neutral-500 hover:text-black"
                  }`}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 border cursor-pointer outline-none focus:outline-none focus-visible:outline-none ${
                    active
                      ? isDark
                        ? "bg-white text-black border-white shadow-sm"
                        : "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                      : isDark
                      ? "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                      : "border-black/10 bg-black/5 text-neutral-600 hover:border-black/20 hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Categories List matching main page FAQ */}
        <div className="relative flex w-full flex-col gap-14 sm:gap-16">
          {filteredSections.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-12 text-center ${
                isDark ? "border-white/15 bg-white/5 text-zinc-400" : "border-black/15 bg-black/5 text-neutral-600"
              }`}
            >
              <p className="text-base font-medium">No questions matched &quot;{searchQuery}&quot;</p>
              <p className="mt-1 text-xs text-zinc-500">Try searching for different terms or reset your filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className={`mt-4 inline-flex items-center rounded-lg px-4 py-2 text-xs font-medium border border-dashed transition-colors ${
                  isDark
                    ? "border-white/20 hover:bg-white/10 text-white"
                    : "border-black/20 hover:bg-black/10 text-black"
                }`}
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredSections.map((category) => (
              <div key={category.title} className="relative w-full">
                {/* Category Header Row */}
                <motion.div
                  initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full px-4 sm:px-6 mb-2"
                >
                  <h2
                    className={`pt-5 pb-3 text-lg sm:text-xl font-medium tracking-tight px-3 sm:px-4 transition-colors duration-300 ${
                      isDark ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {category.title}
                  </h2>
                </motion.div>

                {/* Accordion Items Matrix with signature crosshair dotted/dashed lines */}
                <div className="relative w-full">
                  <div className="flex flex-col">
                    {category.items.map((item, index) => {
                      const isOpen = openId === item.id;
                      const isHovered = hoveredId === item.id;
                      const showDotted = isOpen || isHovered;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)", filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", filter: "blur(0px)" }}
                          transition={{
                            duration: 0.6,
                            delay: 0.18 + index * 0.07,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          onMouseEnter={() => setHoveredId(item.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className="relative w-full"
                        >
                          {/* Signature Dotted/Dashed border guidelines scoped to opened or hovered item with crosshair overshoot */}
                          <AnimatePresence>
                            {showDotted && (
                              <>
                                {/* Horizontal line ABOVE with crosshair overshoot */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className={`absolute top-0 left-0 right-0 h-0 border-t-[1.5px] border-dotted pointer-events-none transition-colors duration-200 ${
                                    isDark ? "border-white/20" : "border-black/20"
                                  }`}
                                />

                                {/* Left vertical line */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className={`absolute left-4 sm:left-6 -top-2 -bottom-2 w-0 border-l-[1.5px] border-dotted pointer-events-none transition-colors duration-200 ${
                                    isDark ? "border-white/20" : "border-black/20"
                                  }`}
                                />

                                {/* Right vertical line */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className={`absolute right-4 sm:right-6 -top-2 -bottom-2 w-0 border-r-[1.5px] border-dotted pointer-events-none transition-colors duration-200 ${
                                    isDark ? "border-white/20" : "border-black/20"
                                  }`}
                                />

                                {/* Horizontal line BELOW with crosshair overshoot */}
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

                          {/* Item Content Box matching main page FAQ */}
                          <div className="px-4 sm:px-6">
                            <div className="px-3 sm:px-4 py-4 sm:py-5">
                              <button
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className="flex w-full items-center justify-between gap-4 text-left cursor-pointer group focus-visible:outline-none"
                                aria-expanded={isOpen}
                              >
                                <span
                                  className={`text-sm sm:text-base leading-snug transition-colors duration-200 ${
                                    isOpen
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
                                  className={`shrink-0 p-0.5 transition-colors ${
                                    isDark
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
                                      className={`pt-3.5 text-sm sm:text-[14.5px] leading-relaxed max-w-3xl transition-colors duration-300 ${
                                        isDark ? "text-zinc-400" : "text-neutral-600"
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
            ))
          )}
        </div>

        {/* Bottom Support CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`mt-20 rounded-2xl border border-dashed p-8 sm:p-10 text-center transition-colors ${
            isDark
              ? "border-white/15 bg-white/5 text-white"
              : "border-black/15 bg-black/5 text-neutral-900"
          }`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4 border border-dashed border-emerald-500/30">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.154-.63 4.887 4.887 0 0 0 1.282-3.138C4.542 15.82 4 14.015 4 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold tracking-tight">Still have questions?</h3>
          <p
            className={`mx-auto mt-2 max-w-md text-sm leading-relaxed ${
              isDark ? "text-zinc-400" : "text-neutral-600"
            }`}
          >
            Can&apos;t find the answer you&apos;re looking for? Connect with our creative directors and systems architects.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#contact"
              className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              Get in Touch
            </Link>
            <Link
              href="/blog"
              className={`rounded-xl border border-dashed px-5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                isDark
                  ? "border-white/20 text-zinc-300 hover:bg-white/10"
                  : "border-black/20 text-neutral-700 hover:bg-black/10"
              }`}
            >
              Read Technical Blog
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Global Site Footer */}
      <SiteFooter />
    </div>
  );
}
