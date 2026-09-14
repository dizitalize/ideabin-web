import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playPaperRustle } from '../utils/audio';

interface HandwrittenAnnotationsProps {
  hoveredNoteId: string | null;
  onSelectTargetNote: (id: string) => void;
  onTriggerHiddenReveal: () => void;
}

export const HandwrittenAnnotations: React.FC<HandwrittenAnnotationsProps> = ({
  hoveredNoteId,
  onSelectTargetNote,
  onTriggerHiddenReveal,
}) => {
  const [ideasStayHovered, setIdeasStayHovered] = useState(false);

  // Maya's annotation: "Creative Friendly Reliable"
  const isMayaActive = hoveredNoteId === 'maya';

  // Arjun's annotation: "Big ideas Happier people"
  const isArjunActive = hoveredNoteId === 'arjun';

  // Priya's annotation: "Ideas that stay"
  const isPriyaActive = hoveredNoteId === 'priya' || ideasStayHovered;

  const handleIdeasHover = () => {
    setIdeasStayHovered(true);
    playPaperRustle(0.6);
    onTriggerHiddenReveal();
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {/* 1. TOP RIGHT: "Big ideas / Happier people" pointing to Arjun */}
      <motion.div
        className="absolute pointer-events-auto cursor-pointer select-none hidden lg:block"
        style={{ top: '3.5%', right: '7%' }}
        onClick={() => onSelectTargetNote('arjun')}
        animate={{
          y: [0, -3, 0],
          opacity: isArjunActive ? 1 : 0.82,
          scale: isArjunActive ? 1.05 : 1,
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 0.25 },
        }}
      >
        <div className="relative">
          <p
            className={`font-editorial text-[22px] md:text-[24px] leading-tight tracking-wide transition-colors duration-300 ${
              isArjunActive ? 'text-purple-300' : 'text-neutral-400 hover:text-purple-200'
            }`}
          >
            Big ideas<br />
            Happier people
          </p>

          {/* Curved Hand-drawn Arrow pointing to Arjun's sticky note */}
          <div className="w-24 h-16 -mt-1 ml-4 relative">
            <svg
              viewBox="0 0 90 60"
              className="w-full h-full overflow-visible"
              fill="none"
              stroke={isArjunActive ? '#c084fc' : '#888891'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Animated curved marker stroke */}
              <motion.path
                d="M 50 8 C 30 10, 15 22, 18 42"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
              />
              {/* Arrow Head */}
              <motion.path
                d="M 10 32 L 18 44 L 28 36"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 1.5 }}
              />
            </svg>
          </div>

          {/* Hand-drawn smiley face doodle */}
          <div className="absolute -top-1 -right-7 w-8 h-8">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke={isArjunActive ? '#e9d5ff' : '#71717a'}
              strokeWidth="1.8"
              strokeLinecap="round"
              className="w-full h-full"
            >
              <circle cx="16" cy="16" r="11" />
              <circle cx="12" cy="13" r="1" fill="currentColor" />
              <circle cx="20" cy="13" r="1" fill="currentColor" />
              <path d="M 11 19 Q 16 24 21 19" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* 2. MID-LEFT: "Creative / Friendly / Reliable" pointing to Maya */}
      <motion.div
        className="absolute pointer-events-auto cursor-pointer select-none hidden md:block"
        style={{ top: '53%', left: '7%' }}
        onClick={() => onSelectTargetNote('maya')}
        animate={{
          y: [0, 4, 0],
          opacity: isMayaActive ? 1 : 0.85,
          scale: isMayaActive ? 1.06 : 1,
        }}
        transition={{
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          scale: { duration: 0.25 },
        }}
      >
        <div className="relative">
          <div
            className={`font-editorial text-[23px] md:text-[25px] leading-[1.25] tracking-wide transition-colors duration-300 ${
              isMayaActive ? 'text-pink-300' : 'text-neutral-400 hover:text-pink-200'
            }`}
          >
            <p>Creative</p>
            <p>Friendly</p>
            <p>Reliable</p>
          </div>

          {/* Curved Hand-drawn Arrow pointing down-right to Maya's pink note */}
          <div className="w-28 h-16 ml-10 -mt-2">
            <svg
              viewBox="0 0 100 60"
              className="w-full h-full overflow-visible"
              fill="none"
              stroke={isMayaActive ? '#f472b6' : '#888891'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M 12 10 C 25 35, 45 42, 70 38"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
              />
              <motion.path
                d="M 58 28 L 72 38 L 56 46"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 1.7 }}
              />
            </svg>
          </div>

          {/* Hand-drawn tiny star doodle */}
          <motion.div
            className="absolute -top-3 -left-3 text-pink-400/80 font-handwriting text-lg select-none"
            animate={{ rotate: [0, 15, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            ✦
          </motion.div>
        </div>
      </motion.div>

      {/* 3. RIGHT SIDE: "Ideas that stay" with hand-drawn imperfect circle and doodles */}
      <motion.div
        className="absolute pointer-events-auto cursor-pointer select-none hidden lg:block"
        style={{ top: '51%', right: '1.5%' }}
        onMouseEnter={handleIdeasHover}
        onMouseLeave={() => setIdeasStayHovered(false)}
        onClick={() => {
          playPaperRustle(1);
          onTriggerHiddenReveal();
        }}
        animate={{
          y: [0, -5, 0],
          scale: isPriyaActive ? 1.08 : 1,
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 },
          scale: { duration: 0.3 },
        }}
      >
        <div className="relative p-6 group">
          {/* Hand-drawn Imperfect Marker Circle around "Ideas that stay" */}
          <svg
            viewBox="0 0 160 110"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            fill="none"
            stroke={isPriyaActive ? '#f472b6' : '#737373'}
            strokeWidth={isPriyaActive ? '2.4' : '1.8'}
            strokeLinecap="round"
          >
            {/* Imperfect organic loop */}
            <motion.path
              d="M 22 55 C 20 22, 55 12, 98 15 C 138 18, 152 48, 142 78 C 132 102, 85 106, 42 98 C 15 92, 10 65, 26 42 C 34 28, 58 20, 85 22"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: 1,
                stroke: isPriyaActive ? '#f472b6' : '#737373',
              }}
              transition={{
                pathLength: { duration: 1.8, ease: 'easeInOut', delay: 0.8 },
                stroke: { duration: 0.3 },
              }}
            />
          </svg>

          {/* Text inside the circle */}
          <div className="relative z-10 text-center px-4 py-2">
            <p
              className={`font-editorial text-[24px] md:text-[26px] tracking-wide leading-tight transition-all duration-300 ${
                isPriyaActive
                  ? 'text-pink-300 drop-shadow-[0_0_12px_rgba(244,114,182,0.4)]'
                  : 'text-neutral-400 group-hover:text-pink-200'
              }`}
            >
              Ideas<br />that stay
            </p>
          </div>

          {/* Hand-drawn Heart Doodle ♡ */}
          <div className="absolute -bottom-1 right-8 w-6 h-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={isPriyaActive ? '#f472b6' : '#71717a'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <path d="M 12 21 C 12 21, 3 14, 3 8.5 C 3 5.5, 5.5 3, 8.5 3 C 10.5 3, 11.5 4, 12 5 C 12.5 4, 13.5 3, 15.5 3 C 18.5 3, 21 5.5, 21 8.5 C 21 14, 12 21, 12 21 Z" />
            </svg>
          </div>

          {/* Sparkle doodle ✦ */}
          <div className="absolute -top-1 left-4 text-purple-300/80 text-sm font-handwriting">
            ✦
          </div>

          {/* Hover hint tag */}
          <div
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-sans-clean tracking-wider uppercase text-neutral-400 transition-opacity duration-200 ${
              ideasStayHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Click to peel stack
          </div>
        </div>
      </motion.div>
    </div>
  );
};
