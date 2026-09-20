"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SiteFooter from "@/components/sections/SiteFooter";
import { useTheme } from "@/components/providers/ThemeProvider";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: "Engineering" | "Design" | "Artificial Intelligence" | "Tutorials";
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content?: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Changelog for 2024",
    description:
      "Explore the latest updates and enhancements in our 2024 changelog. Discover new features, spatial canvas workflows, and improved performance.",
    category: "Engineering",
    date: "Jan 15, 2024",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1696429175928-793a1cdef1d3?q=80&w=3000&auto=format&fit=crop",
    author: {
      name: "Manu Arora",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: "Founder & Lead Architect",
    },
    content: [
      "2024 marks a monumental turning point for web experiences. Modern browsers can now execute full-fidelity Three.js shader pipelines and scroll-driven frame rendering with zero lag.",
      "In this release, we have rebuilt the core animation scheduler to synchronize requestAnimationFrame cycles directly with Lenis smooth scrolling, eliminating jank across desktop and high-refresh mobile screens.",
      "Key upgrades include dynamic GPU texture pre-compression, memory-efficient WebP sequencers, and an overhaul of our interactive 3D particle lighting algorithms.",
    ],
  },
  {
    id: "post-2",
    title: "Understanding React Hooks",
    description:
      "A comprehensive guide to understanding and using React Hooks in your projects with real-world state management and animation patterns.",
    category: "Tutorials",
    date: "Feb 02, 2024",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=3542&auto=format&fit=crop",
    author: {
      name: "Manu Arora",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: "Founder & Lead Architect",
    },
    content: [
      "React Hooks changed how we encapsulate component logic. But when building high-performance 60fps web apps, naive hook usage can trigger cascade re-renders that ruin scroll continuity.",
      "Learn how to pair useSyncExternalStore and direct ref mutation with Framer Motion, avoiding unnecessary React render cycles while maintaining total reactive state accuracy.",
      "We'll explore custom hooks for scroll thresholds, viewport intersection caching, and canvas device-pixel-ratio scaling.",
    ],
  },
  {
    id: "post-3",
    title: "CSS Grid Layout",
    description:
      "Learn how to create complex, responsive layouts easily with modern CSS Grid, subgrids, and dynamic container queries.",
    category: "Design",
    date: "Feb 18, 2024",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=3000&auto=format&fit=crop",
    author: {
      name: "Manu Arora",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: "Founder & Lead Architect",
    },
    content: [
      "Modern CSS Grid is far more than columns and rows. With native CSS Subgrid and container queries now widely supported across all modern browsers, editorial bento layouts can adapt to any container size.",
      "Explore how fractional tracks, named grid areas, and minmax() functions can eliminate thousands of lines of fragile JavaScript math.",
    ],
  },
  {
    id: "post-4",
    title: "JavaScript ES2021 Features",
    description:
      "An overview of the new features introduced in JavaScript ES2021 including String.prototype.replaceAll, Promise.any, and logical assignment operators.",
    category: "Engineering",
    date: "Mar 05, 2024",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=4846&auto=format&fit=crop",
    author: {
      name: "Manu Arora",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: "Founder & Lead Architect",
    },
    content: [
      "Modern JavaScript continues to evolve rapidly. From logical assignment operators (&&=, ||=, ??=) to Promise.any and WeakRef, writing clean asynchronous code has never been more expressive.",
      "We break down practical benchmarks for each feature and analyze how V8 optimizes these native primitives under the hood.",
    ],
  },
  {
    id: "post-5",
    title: "Building RESTful APIs with Node.js",
    description:
      "Step-by-step guide to building scalable, production-ready RESTful APIs using Node.js, Express, and TypeScript with secure authentication.",
    category: "Engineering",
    date: "Mar 20, 2024",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?q=80&w=5069&auto=format&fit=crop",
    author: {
      name: "Manu Arora",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: "Founder & Lead Architect",
    },
    content: [
      "Architecture matters when scaling to millions of daily requests. This guide demonstrates how to design stateless, type-safe API gateways with rate limiting, Redis caching, and robust schema validation using Zod.",
    ],
  },
  {
    id: "post-6",
    title: "Mastering TypeScript",
    description:
      "A deep dive into TypeScript, its advanced type inference, template literal types, and how to effectively use it in large-scale modern codebases.",
    category: "Artificial Intelligence",
    date: "Apr 12, 2024",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=3212&auto=format&fit=crop",
    author: {
      name: "Jane Doe",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      role: "AI Research Engineer",
    },
    content: [
      "TypeScript's type system is Turing-complete. By leveraging conditional types, mapped types, and branded primitives, developers can prevent whole categories of runtime vulnerabilities before deployment.",
    ],
  },
];

const CATEGORIES = [
  "All",
  "Engineering",
  "Design",
  "Artificial Intelligence",
  "Tutorials",
] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const filteredPosts =
    selectedCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 selection:bg-orange-500/20 selection:text-orange-300">
      {/* Subtle Background Grid Pattern matching Aceternity UI simple-blog-with-grid */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,white_20%,transparent_75%)] opacity-35">
          <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>
        {/* Soft atmospheric ambient glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-24">
        {/* Navigation Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/80 backdrop-blur-md text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white hover:border-neutral-700 transition-all duration-200"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back to Home</span>
          </Link>

          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline-block">
            {filteredPosts.length} Articles Available
          </span>
        </div>

        {/* Hero Section Header matching Aceternity UI */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Blog
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Discover insightful resources and expert advice from our seasoned
            team to elevate your knowledge.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-black font-semibold"
                    : "text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Column Blog Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.article
                layout
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={() => setActivePost(post)}
                className="group relative flex flex-col rounded-3xl border border-neutral-800/80 bg-neutral-900/50 p-2.5 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/85 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 cursor-pointer"
              >
                {/* Image Container with smooth zoom on hover */}
                <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-neutral-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md border border-white/10 text-neutral-200">
                    {post.category}
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  {/* Author Row */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/15"
                    />
                    <span className="text-xs font-medium text-neutral-300 group-hover:text-white transition-colors">
                      {post.author.name}
                    </span>
                    <span className="text-xs text-neutral-500 ml-auto font-mono">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors duration-200 mb-2.5">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                    {post.description}
                  </p>

                  {/* Footer read link */}
                  <div className="mt-auto pt-2 flex items-center text-xs font-semibold text-orange-400/90 group-hover:text-orange-300 gap-1.5 transition-colors">
                    <span>Read Article</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      ⟶
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Interactive Article Reading Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePost(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl shadow-black text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Cover Image */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-6 bg-neutral-900">
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/70 backdrop-blur-md border border-white/10 text-white">
                  {activePost.category}
                </div>
              </div>

              {/* Author & Meta */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {activePost.author.name}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {activePost.author.role} · {activePost.date} · {activePost.readTime}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                {activePost.title}
              </h2>

              {/* Paragraphs */}
              <div className="space-y-4 text-neutral-300 text-base leading-relaxed border-t border-neutral-800/80 pt-5">
                <p className="font-medium text-neutral-200">
                  {activePost.description}
                </p>
                {activePost.content?.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="px-5 py-2 rounded-full border border-neutral-800 bg-neutral-900 text-sm font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Close Article
                </button>
                <span className="text-xs font-mono text-neutral-500">
                  IdeaBin Journal · Spatial Tech
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Site Footer */}
      <SiteFooter />
    </div>
  );
}
