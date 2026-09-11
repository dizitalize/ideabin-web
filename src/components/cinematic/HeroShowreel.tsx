"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TypographySequence, SEQUENCE_DATA } from './TypographySequence';
import { THEMES } from './theme';

interface HeroShowreelProps {
  className?: string;
  onComplete?: () => void;
  transparentBg?: boolean;
  isDark?: boolean;
}

export const HeroShowreel: React.FC<HeroShowreelProps> = ({
  className = '',
  onComplete,
  transparentBg = false,
  isDark = true,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);
  const activeTheme = isDark ? THEMES.obsidian : THEMES.alabaster;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const holdTime = stepIndex === SEQUENCE_DATA.length - 1 ? 2200 : 620;

    timerRef.current = window.setTimeout(() => {
      if (stepIndex >= SEQUENCE_DATA.length - 1) {
        if (onComplete) {
          onComplete();
        } else {
          setDirection(1);
          setStepIndex(0);
        }
        return;
      }
      setDirection(1);
      setStepIndex((prev) => prev + 1);
    }, holdTime);

    return () => clearTimer();
  }, [isPlaying, stepIndex, clearTimer, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (stepIndex >= SEQUENCE_DATA.length - 1) {
          if (onComplete) {
            onComplete();
            return;
          }
        }
        setDirection(1);
        setStepIndex((prev) => (prev + 1) % SEQUENCE_DATA.length);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setDirection(-1);
        setStepIndex((prev) => (prev - 1 + SEQUENCE_DATA.length) % SEQUENCE_DATA.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepIndex, onComplete]);

  return (
    <div
      id="hero-showreel-stage"
      onClick={() => {
        if (stepIndex >= SEQUENCE_DATA.length - 1) {
          if (onComplete) {
            onComplete();
            return;
          }
        }
        setDirection(1);
        setStepIndex((prev) => (prev + 1) % SEQUENCE_DATA.length);
      }}
      className={`relative w-full h-full overflow-hidden select-none cursor-pointer flex items-center justify-center ${
        transparentBg ? 'bg-transparent text-white' : activeTheme.bgClass
      } ${className}`}
      style={transparentBg ? undefined : activeTheme.bgStyle}
    >
      <TypographySequence
        currentIndex={stepIndex}
        direction={direction}
        isVisible={true}
        theme={activeTheme}
      />
    </div>
  );
};
