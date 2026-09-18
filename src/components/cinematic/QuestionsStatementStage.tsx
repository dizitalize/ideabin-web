"use client";

import React, { useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = () => {
    if (onScrollToSeeMore) {
      onScrollToSeeMore();
    } else {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollBy({ top: window.innerHeight * 1.2, behavior: "smooth" });
      }
    }
  };

  // Modern kinetic text reveal variants
  const lineVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(12px)",
      scale: 0.98,
    },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.85,
        delay: custom * 0.16 + 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  // Sleek animated gradient divider variants
  const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: (custom: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 1.0,
        delay: custom * 0.16 + 0.22,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 select-none z-30 pointer-events-auto ${className}`}
    >
      {/* Dynamic Ambient Core Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: isDark ? [0.35, 0.55, 0.35] : [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(249, 115, 22, 0.18) 0%, rgba(20, 20, 28, 0.65) 50%, rgba(0, 0, 0, 0.95) 100%)"
            : "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(249, 115, 22, 0.12) 0%, rgba(255, 255, 255, 0.85) 60%, rgba(240, 238, 233, 0.95) 100%)",
        }}
      />

      {/* Main Editorial Lockup */}
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col justify-center">
        {/* Eyebrow / Scene Marker */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
          className="mb-4 sm:mb-6 flex items-center justify-start gap-2.5"
        >

        </motion.div>

        {/* Row 1: WE DON’T START */}
        <div className="relative w-full overflow-visible pb-1 sm:pb-2">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase italic tracking-[-0.035em] leading-[0.96] transition-colors duration-300 ${isDark
                ? "text-zinc-300 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] hover:text-white"
                : "text-zinc-800 drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:text-zinc-900"
                }`}
            >
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
          className={`w-full h-[1px] my-1 sm:my-2 ${isDark
            ? "bg-gradient-to-r from-zinc-500/40 via-white/30 to-transparent"
            : "bg-gradient-to-r from-zinc-300/80 via-zinc-400/50 to-transparent"
            }`}
        />

        {/* Row 2: WITH ANSWERS */}
        <div className="relative w-full overflow-visible py-1 sm:pt-2 pl-[10%] sm:pl-[15%] md:pl-[18%]">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase italic tracking-[-0.035em] leading-[0.96] transition-colors duration-300 ${isDark
                ? "text-zinc-300 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] hover:text-white"
                : "text-zinc-800 drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:text-zinc-900"
                }`}
            >
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
          className={`w-full h-[1px] my-1 sm:my-2 ${isDark
            ? "bg-gradient-to-r from-transparent via-white/30 to-zinc-500/40"
            : "bg-gradient-to-r from-transparent via-zinc-400/50 to-zinc-300/80"
            }`}
        />

        {/* Row 3: WE START WITH THE */}
        <div className="relative w-full overflow-visible py-1 sm:py-2 pl-[18%] sm:pl-[24%] md:pl-[28%]">
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase not-italic tracking-[-0.04em] leading-[0.96] ${isDark
                ? "text-white drop-shadow-[0_4px_32px_rgba(255,255,255,0.22)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                : "text-zinc-950 drop-shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
                }`}
            >
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
          className={`w-full h-[1px] my-1 sm:my-2 ${isDark
            ? "bg-gradient-to-r from-orange-500/50 via-white/40 to-transparent"
            : "bg-gradient-to-r from-orange-500/40 via-zinc-500/50 to-transparent"
            }`}
        />

        {/* Row 4: RIGHT QUESTIONS */}
        <div className="relative w-full overflow-visible pt-1 sm:pt-2 pl-[18%] sm:pl-[24%] md:pl-[28%]">
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase not-italic tracking-[-0.04em] leading-[0.96] ${isDark
                ? "bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(249,115,22,0.5)]"
                : "bg-gradient-to-r from-zinc-950 via-zinc-800 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
                }`}
            >
              RIGHT QUESTIONS
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Modern Scroll Text Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center gap-3 z-40"
      >
        {/* <motion.button
          type="button"
          onClick={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Scroll to see more content"
          className={`group relative inline-flex items-center gap-4 px-7 py-3.5 rounded-full cursor-pointer transition-all duration-300 shadow-2xl backdrop-blur-2xl border ${isDark
            ? "bg-zinc-950/85 hover:bg-zinc-900 text-white border-white/20 hover:border-orange-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            : "bg-white/95 hover:bg-white text-zinc-900 border-zinc-200 hover:border-orange-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.12)] hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]"
          }`} */}
        {/* > */}
        {/* Subtle button ambient back-glow on hover */}
        {/* <div
          className={`absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none ${isDark
            ? "bg-gradient-to-r from-orange-500/30 via-white/20 to-orange-500/30"
            : "bg-gradient-to-r from-orange-500/20 via-zinc-400/20 to-orange-500/20"
          }`}
        /> */}

        {/* Animated Mouse Track Icon */}
        <div
          className={`relative w-4 h-6 rounded-full border flex items-start justify-center p-0.5 transition-colors duration-300 ${isDark
            ? "border-white/40 group-hover:border-orange-400"
            : "border-zinc-400 group-hover:border-orange-500"
            }`}
        >
          <motion.div
            animate={{
              y: [0, 7, 0],
              opacity: [1, 0.4, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]"
          />
        </div>

        {/* Action Label */}
        {/* <span className="relative font-mono text-xs uppercase tracking-[0.24em] font-semibold text-zinc-200 group-hover:text-white transition-colors duration-300">
          Scroll to see more
        </span> */}

        {/* Animated Arrow indicator */}
        <motion.span
          animate={{
            y: [0, 3, 0],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative text-sm font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
        >
          
        </motion.span>
        {/* </motion.button> */}

        {/* Micro-hint */}
        {/* <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-zinc-500/80">
          Scrub or click to advance
        </span> */}
      </motion.div>
    </motion.div>
  );
};