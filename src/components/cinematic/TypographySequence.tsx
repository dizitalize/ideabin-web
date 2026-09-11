"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedWord } from './AnimatedWord';
import { ThemeConfig, THEMES } from './theme';

export interface SequenceItem {
  id: number;
  leftWord: string;
  rightWord: string;
  category: string;
}

export const SEQUENCE_DATA: SequenceItem[] = [
  { id: 0, leftWord: 'UI', rightWord: 'Design', category: 'Interface Architecture' },
  { id: 1, leftWord: 'Product', rightWord: 'Design', category: 'Digital Experiences' },
  { id: 2, leftWord: 'Product Website', rightWord: 'Design', category: 'Brand Platforms' },
  { id: 3, leftWord: 'Website', rightWord: 'Design', category: 'Creative Web Systems' },
  { id: 4, leftWord: 'Branding', rightWord: 'Design', category: 'Identity & Typography' },
  { id: 5, leftWord: 'Websites', rightWord: 'Development', category: 'Full-Stack Engineering' },
  { id: 6, leftWord: 'Shopify', rightWord: 'Development', category: 'E-Commerce Platforms' },
];

export interface TypographySequenceProps {
  currentIndex: number;
  direction?: number;
  isVisible?: boolean;
  theme?: ThemeConfig;
}

export const TypographySequence: React.FC<TypographySequenceProps> = ({
  currentIndex,
  direction = 1,
  isVisible = true,
  theme = THEMES.obsidian,
}) => {
  const currentItem = SEQUENCE_DATA[currentIndex] || SEQUENCE_DATA[0];

  return (
    <div
      id="typography-center-stage"
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20 px-4 sm:px-8"
    >
      <motion.div
        id="typography-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.98 }}
        transition={{
          duration: 0.4,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="w-full max-w-2xl mx-auto flex items-center justify-center"
      >
        <div
          id="typography-lockup"
          className="w-full grid grid-cols-2 items-center text-[clamp(10px,1.55vw,24px)] tracking-[-0.035em] leading-tight"
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <div
            id="prefix-slot-column"
            className="flex items-center justify-end pr-[0.18em] sm:pr-[0.22em] overflow-visible"
          >
            <AnimatedWord
              word={currentItem.leftWord}
              isBold={false}
              align="right"
              direction={direction}
              className={theme.prefixTextClass}
            />
          </div>

          <div
            id="suffix-slot-column"
            className="flex items-center justify-start pl-[0.18em] sm:pl-[0.22em] overflow-visible"
          >
            <AnimatedWord
              word={currentItem.rightWord}
              isBold={true}
              align="left"
              direction={direction}
              className={theme.suffixTextClass}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
