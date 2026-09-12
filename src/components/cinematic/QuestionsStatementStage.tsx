"use client";

import React from "react";
import { motion } from "framer-motion";

interface QuestionsStatementStageProps {
  isDark?: boolean;
  onScrollToSeeMore?: () => void;
  className?: string;
}

export const QuestionsStatementStage: React.FC<QuestionsStatementStageProps> = ({
  isDark = true,
  onScrollToSeeMore,
  className = "",
}) => {
  const handleScroll = () => {
    if (onScrollToSeeMore) {
      onScrollToSeeMore();
    } else {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: custom * 0.18,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: (custom: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.9,
        delay: custom * 0.18 + 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 select-none z-30 pointer-events-auto ${className}`}
    >
      {/* Background subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20, 20, 28, 0.45) 0%, rgba(0, 0, 0, 0.75) 100%)"
            : "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(240, 238, 233, 0.85) 100%)",
        }}
      />

      {/* Main Typography Lockup matching the editorial layout */}
      <div className="w-full max-w-3xl lg:max-w-4xl mx-auto flex flex-col justify-center">
        {/* Row 1: WE DON’T START */}
        <div className="relative w-full overflow-visible pb-1 sm:pb-2 md:pb-3">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase italic tracking-[-0.03em] leading-[0.98] text-zinc-400 dark:text-zinc-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              WE DON’T START
            </h2>
          </motion.div>
        </div>

        {/* Divider 1 */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={dividerVariants}
          style={{ originX: 0 }}
          className="w-full h-px border-b border-zinc-300/80 dark:border-white/15 my-1 sm:my-1.5"
        />

        {/* Row 2: WITH ANSWERS */}
        <div className="relative w-full overflow-visible py-1 sm:py-2 md:py-3 pl-[12%] sm:pl-[16%] md:pl-[18%]">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase italic tracking-[-0.03em] leading-[0.98] text-zinc-400 dark:text-zinc-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              WITH ANSWERS
            </h2>
          </motion.div>
        </div>

        {/* Divider 2 */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={dividerVariants}
          style={{ originX: 0 }}
          className="w-full h-px border-b border-zinc-300/80 dark:border-white/15 my-1 sm:my-1.5"
        />

        {/* Row 3: WE START WITH THE */}
        <div className="relative w-full overflow-visible py-1 sm:py-2 md:py-3 pl-[22%] sm:pl-[28%] md:pl-[30%]">
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold uppercase not-italic tracking-[-0.035em] leading-[0.98] text-neutral-900 dark:text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              WE START WITH THE
            </h2>
          </motion.div>
        </div>

        {/* Divider 3 */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={dividerVariants}
          style={{ originX: 0 }}
          className="w-full h-px border-b border-zinc-300/80 dark:border-white/15 my-1 sm:my-1.5"
        />

        {/* Row 4: RIGHT QUESTIONS */}
        <div className="relative w-full overflow-visible pt-1 sm:pt-2 md:pt-3 pl-[22%] sm:pl-[28%] md:pl-[30%]">
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold uppercase not-italic tracking-[-0.035em] leading-[0.98] text-neutral-900 dark:text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              RIGHT QUESTIONS
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Scroll to see more button */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center gap-3 z-40"
      >
        <button
          type="button"
          onClick={handleScroll}
          aria-label="Scroll to see more content"
          className={`group relative inline-flex items-center gap-3.5 px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl ${
            isDark
              ? "bg-zinc-900/80 hover:bg-zinc-800/90 text-white border border-white/20 backdrop-blur-xl shadow-black/60"
              : "bg-white/90 hover:bg-neutral-100 text-neutral-900 border border-black/15 backdrop-blur-xl shadow-neutral-400/40"
          }`}
        >
          {/* Animated mouse scroll icon */}
          <div
            className={`relative w-4 h-6 rounded-full border flex items-start justify-center p-0.5 ${
              isDark ? "border-white/40" : "border-neutral-400"
            }`}
          >
            <div className="w-1 h-2 rounded-full bg-[#417B5A] animate-bounce" />
          </div>

          <span className="font-mono text-xs uppercase tracking-[0.22em] font-semibold">
            Scroll to see more
          </span>

          <span className="text-sm font-bold text-[#417B5A] transition-transform duration-300 group-hover:translate-y-1">
            ↓
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};
