"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { StickyTestimonial } from './types';
import { PushPin } from './PushPin';
import { Tape } from './Tape';
import { playPaperRustle, playTactileTap, playPaperRip } from './utils/audio';

interface StickyNoteProps {
  testimonial: StickyTestimonial;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
  bringToFront?: (id: string) => void;
  isShiftedAside?: boolean;
  zIndex: number;
  mousePos: { x: number; y: number };
  isMobileFlow?: boolean;
  isTorn?: boolean;
  onTearNote?: (id: string, pos: { x: number; y: number }) => void;
  onReattachNote?: (id: string) => void;
  boardRef?: React.RefObject<HTMLDivElement | null>;
  parallaxY?: MotionValue<number>;
  parallaxRot?: MotionValue<number>;
  entranceIndex?: number;
  isInView?: boolean;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  testimonial,
  isHovered,
  isAnyHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
  bringToFront,
  isShiftedAside = false,
  zIndex,
  mousePos,
  isMobileFlow = false,
  isTorn = false,
  onTearNote,
  onReattachNote,
  boardRef,
  parallaxY,
  parallaxRot,
  entranceIndex = 0,
  isInView = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHoldingToTear, setIsHoldingToTear] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const startHold = (clientX: number, clientY: number) => {
    if (isTorn) return;
    startPosRef.current = { x: clientX, y: clientY };
    setIsHoldingToTear(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 2000; // 2 seconds hold to tear

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setHoldProgress(progress);
    }, 25);

    holdTimeoutRef.current = setTimeout(() => {
      clearHold();
      playPaperRip();
      if (onTearNote) {
        onTearNote(testimonial.id, { x: clientX, y: clientY });
      }
    }, duration);
  };

  const clearHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHoldingToTear(false);
    setHoldProgress(0);
    startPosRef.current = null;
  };

  // Calculate subtle 3D tilt based on mouse position relative to window center
  const tiltX = (mousePos.y - 0.5) * -6;
  const tiltY = (mousePos.x - 0.5) * 6;

  // Base rotation with optional shift-aside offset
  const currentRotation = isShiftedAside
    ? testimonial.baseRotation + (testimonial.baseRotation > 0 ? 14 : -16)
    : testimonial.baseRotation;

  // Shift offset when peeled aside to reveal the hidden note underneath
  const shiftX = isShiftedAside ? (testimonial.baseRotation > 0 ? 90 : -95) : 0;
  const shiftY = isShiftedAside ? 50 : 0;

  const handleMouseEnter = () => {
    playPaperRustle(0.7);
    onHoverStart();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (holdProgress < 0.15 && !isDragging) {
      playPaperRustle(1.2);
      playTactileTap();
      onClick();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPressed(true);
    bringToFront?.(testimonial.id);
    startHold(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startPosRef.current) {
      const dist = Math.hypot(
        e.clientX - startPosRef.current.x,
        e.clientY - startPosRef.current.y
      );
      // As soon as pointer moves more than 4px, cancel hold-to-tear so user can drag freely
      if (dist > 4) {
        clearHold();
      }
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    clearHold();
  };

  if (isTorn) {
    return null;
  }

  return (
    // Outer Draggable Container: handles free movement across the board and scroll parallax
    <motion.div
      ref={cardRef}
      id={`sticky-note-${testimonial.id}`}
      data-testid={`sticky-note-${testimonial.id}`}
      data-lenis-prevent
      drag
      dragConstraints={boardRef}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setIsDragging(true);
        clearHold();
        bringToFront?.(testimonial.id);
        playPaperRustle(1.1);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        playPaperRustle(0.8);
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        clearHold();
        onHoverEnd();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`${
        isMobileFlow ? 'relative w-full' : 'absolute'
      } cursor-grab active:cursor-grabbing select-none touch-none will-change-transform`}
      style={{
        top: isMobileFlow ? undefined : testimonial.position.desktop.top,
        left: isMobileFlow ? undefined : testimonial.position.desktop.left,
        width: isMobileFlow ? '100%' : testimonial.position.desktop.width,
        zIndex: isHoldingToTear ? zIndex + 30 : zIndex,
        position: isMobileFlow ? 'relative' : 'absolute',
      }}
    >
      {/* Scroll parallax and physical tilt container with scroll-driven entrance */}
      <motion.div
        style={{
          y: parallaxY,
          rotate: parallaxRot,
        }}
        initial={{
          opacity: 0,
          scale: 0.88,
          y: 40,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
              }
            : {}
        }
        transition={{
          duration: 0.7,
          delay: entranceIndex * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Inner Animated Container: handles hover tilt, rotation, and shift-aside animation */}
        <motion.div
          animate={{
            x: shiftX + (isHoldingToTear && holdProgress > 0.4 ? (Math.random() - 0.5) * 4 : 0),
            y: shiftY + (isHoldingToTear && holdProgress > 0.4 ? (Math.random() - 0.5) * 4 : 0),
            rotate: isHovered ? currentRotation * 0.7 : currentRotation,
            rotateX: isHovered ? tiltX * 1.3 : 0,
            rotateY: isHovered ? tiltY * 1.3 : 0,
            scale: isHovered ? 1.04 : isPressed ? 0.98 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24,
            mass: 0.8,
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1200px',
          }}
        >
          {/* Fastener: 3D Push Pin or Translucent Tape */}
          {testimonial.fastener === 'tape-light' && (
            <Tape variant="light" tilt={testimonial.baseRotation * 0.3} />
          )}
          {testimonial.fastener === 'tape-dark' && (
            <Tape variant="dark" tilt={testimonial.baseRotation * -0.4} />
          )}
          {testimonial.fastener === 'pin-purple' && <PushPin color="purple" />}
          {testimonial.fastener === 'pin-green' && <PushPin color="green" />}
          {testimonial.fastener === 'pin-red' && <PushPin color="red" />}

          {/* Main Solid Sticky Note Paper Card - Flat Realistic Paper Colors Without Gradients */}
          <div
            className={`relative overflow-hidden rounded-[2px] transition-shadow duration-300 ${
              isHovered ? 'paper-shadow-hover' : testimonial.color.shadowClass
            }`}
            style={{
              backgroundColor: testimonial.color.bg,
              color: testimonial.color.text,
              minHeight: '230px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isHovered
                ? '0 22px 40px -8px rgba(0, 0, 0, 0.7), 0 8px 16px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.08)'
                : '0 10px 22px -5px rgba(0, 0, 0, 0.5), 0 4px 8px -2px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Peel / Reveal indicator badge if this note covers another one */}
            {testimonial.coversNoteId && !isTorn && (
              <div
                className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] font-sans font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded transition-opacity duration-200 pointer-events-none ${
                  isHovered ? 'opacity-85' : 'opacity-0'
                }`}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.12)',
                  color: testimonial.color.text,
                }}
              >
                <span>{isShiftedAside ? 'Close' : 'Click to peek'}</span>
                <span className="text-[11px] leading-none">↺</span>
              </div>
            )}

            {/* Note Body Content with clean typography */}
            {!isTorn ? (
              <div className="p-5 md:p-6 pb-4">
                {/* Testimonial Quote */}
                <div className="relative z-10 pt-1">
                  <p
                    className="font-editorial text-[21px] md:text-[23px] leading-[1.3] tracking-normal select-none font-medium"
                    style={{
                      color: testimonial.color.text,
                    }}
                  >
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author Avatar & Meta */}
                <div className="relative z-10 mt-5 pt-3 flex items-center gap-3 border-t border-black/15">
                  <div className="relative flex-shrink-0">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-black/20 transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 font-sans">
                    <h4
                      className="text-[14px] font-bold leading-snug truncate"
                      style={{ color: testimonial.color.nameText }}
                    >
                      {testimonial.author}
                    </h4>
                    <p
                      className="text-[11px] font-medium leading-tight truncate opacity-85"
                      style={{ color: testimonial.color.subtext }}
                    >
                      {testimonial.role}
                      {testimonial.company ? `, ${testimonial.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Teared State: note body is removed, showing torn placeholder with reattach option */
              <div className="p-5 md:p-6 pb-4 flex flex-col items-center justify-center flex-1 text-center select-none min-h-[210px]">
                <div className="w-10 h-10 rounded-full border border-dashed border-black/25 flex items-center justify-center mb-2.5">
                  <span className="text-[14px] opacity-40">✂</span>
                </div>
                <p
                  className="text-[11px] font-mono font-semibold tracking-wider uppercase opacity-70"
                  style={{ color: testimonial.color.text }}
                >
                  Note Detached
                </p>
                <p
                  className="text-[10px] font-sans opacity-60 mt-1 max-w-[170px]"
                  style={{ color: testimonial.color.subtext }}
                >
                  Piece is on board
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReattachNote?.(testimonial.id);
                  }}
                  className="mt-3.5 px-3 py-1.5 rounded text-[9px] font-sans font-bold tracking-wider uppercase bg-black/80 hover:bg-black text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <span>Reattach</span>
                  <span className="text-[11px]">↺</span>
                </button>
              </div>
            )}

            {/* Realistic Corner Fold */}
            {testimonial.hasFoldedCorner && !isTorn && (
              <div
                className="absolute bottom-0 right-0 pointer-events-none"
                style={{ width: '28px', height: '28px' }}
              >
                <svg viewBox="0 0 28 28" className="w-full h-full">
                  <path d="M 28 0 L 0 28 L 28 28 Z" fill="rgba(0,0,0,0.18)" />
                  <path d="M 28 0 L 0 28 L 6 18 Q 18 18 28 6 Z" fill="rgba(255,255,255,0.4)" />
                </svg>
              </div>
            )}

            {/* Visual hold-to-tear countdown tension indicator */}
            {isHoldingToTear && !isTorn && (
              <div className="absolute inset-x-3 bottom-3 z-30 pointer-events-none">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-black/85 text-white backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <svg className="w-4 h-4 transform -rotate-90">
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          stroke="#F472B6"
                          strokeWidth="2"
                          strokeDasharray={37.7}
                          strokeDashoffset={37.7 * (1 - holdProgress)}
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[11px] font-mono tracking-wider font-semibold text-pink-300">
                      Tearing paper...
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {Math.round(holdProgress * 100)}%
                  </span>
                </div>
                <div
                  className="mt-1 h-[2px] w-full rounded"
                  style={{
                    background: `linear-gradient(90deg, #F472B6 ${holdProgress * 100}%, rgba(255,255,255,0.2) ${holdProgress * 100}%)`,
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
