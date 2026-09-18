"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';

interface HeroTypographyProps {
  isInView?: boolean;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ isInView = true }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative z-10 max-w-md select-none">
      {/* Eyebrow badge matching website design system */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 mb-3.5"
      >
        {/* <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)] animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-orange-500 font-semibold">
          06 // Client Feedback
        </span> */}
      </motion.div>

      {/* Main Headline matching website typography (Geist Sans font-sans, tracking-tight, medium weight) */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)', clipPath: 'inset(0 0 40% 0)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)' } : {}}
        transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <h2
          className={`font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-normal leading-[1.06] transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          <span>Real People.</span>
          <br />
          <span className="relative inline-block mt-1">
            Real Impact.
            {/* Hand-drawn double-loop pink marker underline with animated stroke */}
            <svg
              viewBox="0 0 280 24"
              className="absolute -bottom-3 left-0 w-[105%] h-5 overflow-visible pointer-events-none"
              fill="none"
            >
              <motion.path
                d="M 5 14 Q 90 2, 270 12 Q 220 18, 90 19"
                stroke="#ec4899"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </span>
        </h2>
      </motion.div>

      {/* Subtitle matching website typography */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-5 font-sans text-sm sm:text-base leading-relaxed max-w-sm transition-colors duration-300 ${
          isDark ? 'text-zinc-400' : 'text-neutral-600'
        }`}
      >
        Tactile experiences engineered for clarity and performance. Here’s what our clients have to say.
      </motion.p>
    </div>
  );
};
