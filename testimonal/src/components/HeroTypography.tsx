import React from 'react';
import { motion } from 'motion/react';

export const HeroTypography: React.FC = () => {
  return (
    <div className="relative z-10 max-w-md select-none">
      {/* Top Pill: ♥ CLIENT LOVE */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-6 shadow-sm"
      >
        <span className="text-[#f472b6] text-xs leading-none">♥</span>
        <span className="text-[11px] font-sans-clean font-semibold tracking-widest uppercase text-neutral-300">
          Client Love
        </span>
      </motion.div>

      {/* Main Editorial Headline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative"
      >
        <h1 className="font-editorial text-[56px] sm:text-[68px] lg:text-[76px] font-normal leading-[0.98] text-[#f4f4f5] tracking-tight">
          <span>Real People.</span>
          <br />
          <span className="relative inline-block mt-1">
            Real Impact.
            {/* Vivid hot pink hand-drawn marker underline stroke */}
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
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
              />
            </svg>
          </span>
        </h1>
      </motion.div>

      {/* Subtitle / Supporting copy */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-8 font-sans-clean text-[16px] sm:text-[17px] text-neutral-400 font-normal leading-relaxed max-w-sm"
      >
        Ideas turned into experiences. Here’s what our amazing clients have to say.
      </motion.p>
    </div>
  );
};
