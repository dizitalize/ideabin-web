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
        <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)] animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-orange-500 font-semibold">
          06 // Client Feedback
        </span>
      </motion.div>

      {/* Main Headline matching website typography (Geist Sans font-sans, tracking-tight, medium weight) */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)', clipPath: 'inset(0 0 40% 0)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)' } : {}}
        transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <h2
          className={`font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium tracking-tight leading-[1.08] transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          <span>Real People.</span>
          <br />
          <span className="relative inline-block mt-1">
            Real Impact.
            {/* Sleek brand accent marker underline */}
            <svg
              viewBox="0 0 240 18"
              className="absolute -bottom-2.5 left-0 w-[102%] h-3.5 overflow-visible pointer-events-none"
              fill="none"
            >
              <motion.path
                d="M 2 10 Q 70 2, 238 8"
                stroke="#f97316"
                strokeWidth="3.2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.1, delay: 0.45, ease: 'easeOut' }}
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
