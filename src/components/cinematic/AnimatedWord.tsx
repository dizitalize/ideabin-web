import React, { useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export interface AnimatedWordProps {
  word: string;
  className?: string;
  isBold?: boolean;
  direction?: number;
  duration?: number;
  align?: 'left' | 'right';
  trajectory?: 'vertical' | 'upward-right';
}

const TRANSITION_EASE = [0.76, 0, 0.24, 1] as const;

const createWordVariants = (
  duration: number,
  trajectory: 'vertical' | 'upward-right' = 'vertical'
): Variants => {
  if (trajectory === 'upward-right') {
    return {
      enter: (dir: number) => ({
        y: dir > 0 ? '100%' : '-100%',
        x: dir > 0 ? '-35%' : '35%',
        opacity: 0,
        transition: {
          duration,
          ease: TRANSITION_EASE,
          y: { duration, ease: TRANSITION_EASE },
          x: { duration, ease: TRANSITION_EASE },
          opacity: { duration: duration * 0.45, ease: TRANSITION_EASE },
        },
      }),
      center: {
        y: '0%',
        x: '0%',
        opacity: 1,
        transition: {
          duration,
          ease: TRANSITION_EASE,
          y: { duration, ease: TRANSITION_EASE },
          x: { duration, ease: TRANSITION_EASE },
          opacity: { duration: duration * 0.45, ease: TRANSITION_EASE },
        },
      },
      exit: (dir: number) => ({
        y: dir > 0 ? '-100%' : '100%',
        x: dir > 0 ? '35%' : '-35%',
        opacity: 0,
        transition: {
          duration,
          ease: TRANSITION_EASE,
          y: { duration, ease: TRANSITION_EASE },
          x: { duration, ease: TRANSITION_EASE },
          opacity: { duration: duration * 0.45, ease: TRANSITION_EASE },
        },
      }),
    };
  }

  return {
    enter: (dir: number) => ({
      y: dir > 0 ? '100%' : '-100%',
      x: '0%',
      opacity: 0,
      transition: {
        duration,
        ease: TRANSITION_EASE,
        y: { duration, ease: TRANSITION_EASE },
        opacity: { duration: duration * 0.45, ease: TRANSITION_EASE },
      },
    }),
    center: {
      y: '0%',
      x: '0%',
      opacity: 1,
      transition: {
        duration,
        ease: TRANSITION_EASE,
        y: { duration, ease: TRANSITION_EASE },
        opacity: { duration: duration * 0.45, ease: TRANSITION_EASE },
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? '-100%' : '100%',
      x: '0%',
      opacity: 0,
      transition: {
        duration,
        ease: TRANSITION_EASE,
        y: { duration, ease: TRANSITION_EASE },
        opacity: { duration: duration * 0.45, ease: TRANSITION_EASE },
      },
    }),
  };
};

export const AnimatedWord: React.FC<AnimatedWordProps> = ({
  word,
  className = '',
  isBold = false,
  direction = 1,
  duration = 0.45,
  align = 'left',
  trajectory = 'vertical',
}: AnimatedWordProps) => {
  const variants = useMemo(
    () => createWordVariants(duration, trajectory as 'vertical' | 'upward-right'),
    [duration, trajectory]
  );

  return (
    <span
      className={`relative inline-grid grid-cols-1 grid-rows-1 ${
        align === 'right' ? 'justify-items-end' : 'justify-items-start'
      } overflow-hidden h-[1.38em] leading-[1.38em] align-middle select-none ${
        isBold ? 'font-bold' : 'font-normal'
      } ${className}`}
      style={{
        verticalAlign: 'middle',
        contain: 'paint',
        isolation: 'isolate',
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.span
          key={word}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration,
            ease: TRANSITION_EASE,
          }}
          className={`inline-flex items-center h-full whitespace-nowrap ${
            align === 'right' ? 'justify-end text-right' : 'justify-start text-left'
          }`}
          style={{
            gridArea: '1 / 1 / 2 / 2',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
