"use client";

import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { StickyTestimonial } from './types';
import { playPaperRustle } from './utils/audio';

interface TornScrapProps {
  id: string;
  testimonial: StickyTestimonial;
  initialPos: { x: number; y: number };
  onReattach: (id: string) => void;
  boardRef?: React.RefObject<HTMLDivElement | null>;
}

export const TornScrap: React.FC<TornScrapProps> = React.memo(({
  testimonial,
  initialPos,
  onReattach,
  boardRef,
}) => {
  const x = useMotionValue(initialPos.x);
  const y = useMotionValue(initialPos.y);

return (
     <motion.div
       drag
       dragConstraints={boardRef}
       dragMomentum={false}
       dragElastic={0}
       onDragStart={() => {
        playPaperRustle(1.0);
      }}
      onDragEnd={() => {
        playPaperRustle(0.8);
      }}
      initial={{
        scale: 0.8,
        rotate: testimonial.baseRotation + 12,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: testimonial.baseRotation + 16,
      }}
      exit={{
        scale: 0.5,
        opacity: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 22,
      }}
      // Absolute positioning inside the moodboard container so it never scrolls across the rest of the site!
      className="absolute z-40 cursor-grab active:cursor-grabbing select-none group touch-none"
      style={{
        x,
        y,
        top: 0,
        left: 0,
        width: '128px',
        height: '96px',
      }}
    >
      {/* Floating Paper Shadow */}
      <div
        className="absolute inset-1 rounded-sm pointer-events-none -z-10"
        style={{
          boxShadow: '0 16px 32px rgba(0,0,0,0.6), 0 6px 12px rgba(0,0,0,0.45)',
          transform: 'translateY(6px) rotate(4deg)',
        }}
      />

      {/* Torn Scrap Paper Body with Jagged Torn Edge and Solid Color */}
      <div
        className="relative w-full h-full overflow-hidden rounded-br-sm border-r border-b border-black/20 transition-transform group-hover:scale-105"
        style={{
          backgroundColor: testimonial.color.bg,
          clipPath:
            'polygon(0% 28%, 8% 22%, 18% 30%, 28% 18%, 38% 26%, 48% 14%, 58% 25%, 70% 12%, 82% 20%, 94% 8%, 100% 15%, 100% 100%, 0% 100%)',
        }}
      >
        {/* White pulp fiber deckle edge line across the top tear */}
        <div className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none bg-white/70" />

        {/* Content on the torn scrap with small image & author */}
        <div className="p-2.5 pt-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2">
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-black/20 shadow-xs flex-shrink-0"
              loading="lazy"
            />
            <div className="min-w-0">
              <span
                className="text-[8px] font-mono font-bold tracking-wider uppercase opacity-80 block leading-tight"
                style={{ color: testimonial.color.subtext }}
              >
                Torn Scrap
              </span>
              <span
                className="text-[10px] font-editorial italic font-bold truncate block leading-tight mt-0.5"
                style={{ color: testimonial.color.text }}
              >
                {testimonial.author}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="text-[8px] font-sans-clean font-bold tracking-wider text-black/60 uppercase">
              Drag away ↗
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReattach(testimonial.id);
              }}
              title="Snap back onto sticky note"
              className="px-2 py-0.5 rounded text-[8px] font-sans-clean font-bold bg-black/20 hover:bg-black/30 text-black transition-colors cursor-pointer flex items-center gap-0.5 hover:scale-105 active:scale-95"
            >
              <span>Reattach</span>
              <span className="text-[9px]">↺</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
TornScrap.displayName = 'TornScrap';
