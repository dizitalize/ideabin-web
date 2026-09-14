"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { TESTIMONIALS } from "@/components/testimonials/data/testimonials";
import { StickyTestimonial } from "@/components/testimonials/types";
import { StickyNote } from "@/components/testimonials/StickyNote";
import { HandwrittenAnnotations } from "@/components/testimonials/HandwrittenAnnotations";
import { HeroTypography } from "@/components/testimonials/HeroTypography";
import { TornScrap } from "@/components/testimonials/TornScrap";
import { playPaperRustle } from "@/components/testimonials/utils/audio";
import { useTheme } from "@/components/providers/ThemeProvider";

interface TornScrapItem {
  id: string;
  testimonial: StickyTestimonial;
  initialPos: { x: number; y: number };
}

export default function TestimonialsSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionRef = useRef<HTMLElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const mobileBoardRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection & in-view trigger
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Dynamic parallax floating drift for each note as the user scrolls
  const parallax0 = useTransform(scrollYProgress, [0, 1], [-35, 45]);
  const parallax1 = useTransform(scrollYProgress, [0, 1], [45, -40]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [-25, 35]);
  const parallax3 = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const parallax4 = useTransform(scrollYProgress, [0, 1], [-45, 35]);
  const parallax5 = useTransform(scrollYProgress, [0, 1], [-30, 40]);
  const parallax6 = useTransform(scrollYProgress, [0, 1], [40, -35]);

  // Dynamic subtle rotation flutter as the page scrolls
  const rot0 = useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]);
  const rot1 = useTransform(scrollYProgress, [0, 1], [2.5, -2.5]);
  const rot2 = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const rot3 = useTransform(scrollYProgress, [0, 1], [2.8, -2]);
  const rot4 = useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]);
  const rot5 = useTransform(scrollYProgress, [0, 1], [-2.8, 2]);
  const rot6 = useTransform(scrollYProgress, [0, 1], [2, -2.8]);

  const parallaxMap: Record<number, MotionValue<number>> = {
    0: parallax0,
    1: parallax1,
    2: parallax2,
    3: parallax3,
    4: parallax4,
    5: parallax5,
    6: parallax6,
  };

  const parallaxRotMap: Record<number, MotionValue<number>> = {
    0: rot0,
    1: rot1,
    2: rot2,
    3: rot3,
    4: rot4,
    5: rot5,
    6: rot6,
  };

  const heroParallax = useTransform(scrollYProgress, [0, 1], [-20, 25]);

  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [shiftedNoteIds, setShiftedNoteIds] = useState<Set<string>>(new Set());
  const [tornNoteIds, setTornNoteIds] = useState<Set<string>>(new Set());
  const [tornScraps, setTornScraps] = useState<TornScrapItem[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [zIndices, setZIndices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    TESTIMONIALS.forEach((t, i) => {
      initial[t.id] = t.hiddenUnderId ? 5 + i : 15 + i;
    });
    return initial;
  });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.width || 1);
    const y = (e.clientY - rect.top) / (rect.height || 1);
    setMousePos({ x, y });
  }, []);

  const bringToFront = useCallback((id: string) => {
    setZIndices((prev) => {
      const values = Object.values(prev) as number[];
      const maxZ = values.length > 0 ? Math.max(...values, 20) : 20;
      return { ...prev, [id]: maxZ + 2 };
    });
  }, []);

  // Tear note handler: coordinates are calculated RELATIVE TO THE MOODBOARD CONTAINER
  const handleTearNote = useCallback(
    (noteId: string, clickPos: { x: number; y: number }) => {
      const testimonial = TESTIMONIALS.find((t) => t.id === noteId);
      if (!testimonial) return;

      setTornNoteIds((prev) => new Set(prev).add(noteId));
      bringToFront(noteId);

      const scrapId = `scrap-${noteId}-${Date.now()}`;
      const boardRect = boardRef.current?.getBoundingClientRect();

      let relX = 350;
      let relY = 200;

      if (boardRect) {
        relX = Math.max(20, Math.min(boardRect.width - 150, clickPos.x - boardRect.left + 25));
        relY = Math.max(20, Math.min(boardRect.height - 120, clickPos.y - boardRect.top + 25));
      }

      setTornScraps((prev) => [
        ...prev.filter((s) => s.testimonial.id !== noteId),
        {
          id: scrapId,
          testimonial,
          initialPos: { x: relX, y: relY },
        },
      ]);
    },
    [bringToFront]
  );

  const handleReattachNote = useCallback((noteId: string) => {
    setTornNoteIds((prev) => {
      const next = new Set(prev);
      next.delete(noteId);
      return next;
    });
    setTornScraps((prev) => prev.filter((s) => s.testimonial.id !== noteId));
    playPaperRustle(0.9);
  }, []);

  const handleNoteClick = useCallback(
    (testimonial: StickyTestimonial) => {
      bringToFront(testimonial.id);
      if (testimonial.coversNoteId) {
        setShiftedNoteIds((prev) => {
          const next = new Set(prev);
          if (next.has(testimonial.id)) {
            next.delete(testimonial.id);
          } else {
            next.add(testimonial.id);
            if (testimonial.coversNoteId) bringToFront(testimonial.coversNoteId);
          }
          return next;
        });
      }
    },
    [bringToFront]
  );

  const handleTogglePeelAll = useCallback(() => {
    setShiftedNoteIds((prev) => {
      if (prev.size > 0) return new Set();
      const allCovering = new Set<string>();
      TESTIMONIALS.forEach((t) => {
        if (t.coversNoteId) allCovering.add(t.id);
      });
      return allCovering;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-label="Client Testimonials & Feedback Moodboard"
      className={`relative z-20 w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-12 transition-colors duration-500 rounded-t-[32px] sm:rounded-t-[44px] border-t border-x shadow-[0_-12px_40px_rgba(0,0,0,0.45)] ${
        isDark
          ? "bg-[#0d0d12]/90 backdrop-blur-xl text-white border-white/12"
          : "bg-[#fafafc]/95 backdrop-blur-xl text-[#222222] border-black/8"
      }`}
    >
      <div
        onPointerMove={handlePointerMove}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col"
      >
        {/* DESKTOP VIEW: Scattered Physical Moodboard Wall with scroll parallax & bounded dragging */}
<div
           ref={boardRef}
           className="relative hidden lg:block w-full overflow-visible"
           style={{ minHeight: "780px" }}
         >
          {/* Left Column: Hero Editorial Typography with scroll reveal and subtle parallax */}
          <motion.div
            style={{ y: heroParallax }}
            className="absolute left-0 top-8 z-10 pointer-events-none"
          >
            <HeroTypography isInView={isInView} />
          </motion.div>

          {/* Floating Handwritten Annotations & SVG Arrows with scroll reveal */}
          <HandwrittenAnnotations
            hoveredNoteId={hoveredNoteId}
            onSelectTargetNote={(id) => {
              setHoveredNoteId(id);
              bringToFront(id);
              playPaperRustle(0.8);
            }}
            onTriggerHiddenReveal={handleTogglePeelAll}
            isInView={isInView}
          />

          {/* Floating Draggable Torn Scraps — localized INSIDE this board container */}
          <AnimatePresence>
            {tornScraps.map((scrap) => (
              <TornScrap
                key={scrap.id}
                id={scrap.id}
                testimonial={scrap.testimonial}
                initialPos={scrap.initialPos}
                onReattach={handleReattachNote}
                boardRef={boardRef}
              />
            ))}
          </AnimatePresence>

          {/* Scattered Sticky Notes Wall with scroll parallax */}
          <div className="absolute inset-0 w-full h-full">
            {TESTIMONIALS.map((testimonial, index) => {
              const isShifted = shiftedNoteIds.has(testimonial.id);
              const isHovered = hoveredNoteId === testimonial.id;
              const isAnyHovered = hoveredNoteId !== null;
              const isTorn = tornNoteIds.has(testimonial.id);
              return (
                <StickyNote
                  key={testimonial.id}
                  testimonial={testimonial}
                  isHovered={isHovered}
                  isAnyHovered={isAnyHovered}
                  onHoverStart={() => setHoveredNoteId(testimonial.id)}
                  onHoverEnd={() => setHoveredNoteId(null)}
                  onClick={() => handleNoteClick(testimonial)}
                  bringToFront={bringToFront}
                  isShiftedAside={isShifted}
                  zIndex={zIndices[testimonial.id] || 10}
                  mousePos={mousePos}
                  isTorn={isTorn}
                  onTearNote={handleTearNote}
                  onReattachNote={handleReattachNote}
                  boardRef={boardRef}
                  parallaxY={parallaxMap[index]}
                  parallaxRot={parallaxRotMap[index]}
                  entranceIndex={index}
                  isInView={isInView}
                />
              );
            })}
          </div>
        </div>

        {/* MOBILE & TABLET VIEW: Organic vertical stack with staggered entrance */}
        <div ref={mobileBoardRef} className="block lg:hidden py-4 space-y-8">
          <HeroTypography isInView={isInView} />

          {/* Mobile Torn Scraps */}
          <AnimatePresence>
            {tornScraps.map((scrap) => (
              <TornScrap
                key={scrap.id}
                id={scrap.id}
                testimonial={scrap.testimonial}
                initialPos={scrap.initialPos}
                onReattach={handleReattachNote}
                boardRef={mobileBoardRef}
              />
            ))}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8 pt-4">
            {TESTIMONIALS.map((testimonial, index) => {
              const isTorn = tornNoteIds.has(testimonial.id);
              return (
                <div key={testimonial.id} className="relative flex justify-center py-2">
                  <div
                    className="w-full max-w-[280px] transition-transform duration-300"
                    style={{ transform: `rotate(${testimonial.baseRotation}deg)` }}
                  >
                    <StickyNote
                      testimonial={testimonial}
                      isHovered={hoveredNoteId === testimonial.id}
                      isAnyHovered={hoveredNoteId !== null}
                      onHoverStart={() => setHoveredNoteId(testimonial.id)}
                      onHoverEnd={() => setHoveredNoteId(null)}
                      onClick={() => handleNoteClick(testimonial)}
                      bringToFront={bringToFront}
                      isShiftedAside={shiftedNoteIds.has(testimonial.id)}
                      zIndex={zIndices[testimonial.id] || 10}
                      mousePos={{ x: 0.5, y: 0.5 }}
                      isMobileFlow={true}
                      isTorn={isTorn}
                      onTearNote={handleTearNote}
                      onReattachNote={handleReattachNote}
                      boardRef={mobileBoardRef}
                      entranceIndex={index}
                      isInView={isInView}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile annotation */}
          <div className="pt-4 pb-2 text-center select-none">
            <p className="font-editorial text-2xl text-pink-400">“Ideas that stay” ♡</p>
          </div>
        </div>
      </div>
    </section>
  );
}
