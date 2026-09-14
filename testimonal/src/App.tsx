import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from './data/testimonials';
import { StickyTestimonial } from './types';
import { StickyNote } from './components/StickyNote';
import { HandwrittenAnnotations } from './components/HandwrittenAnnotations';
import { HeroTypography } from './components/HeroTypography';
import { TornScrap } from './components/TornScrap';
import { playPaperRustle } from './utils/audio';

interface TornScrapItem {
  id: string;
  testimonial: StickyTestimonial;
  initialPos: { x: number; y: number };
}

export default function App() {
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [shiftedNoteIds, setShiftedNoteIds] = useState<Set<string>>(new Set());
  const [tornNoteIds, setTornNoteIds] = useState<Set<string>>(new Set());
  const [tornScraps, setTornScraps] = useState<TornScrapItem[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [zIndices, setZIndices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    TESTIMONIALS.forEach((t, i) => {
      // Background / hidden notes have lower initial zIndex
      initial[t.id] = t.hiddenUnderId ? 5 + i : 15 + i;
    });
    return initial;
  });
  const [wallKey, setWallKey] = useState(0);
  const rafId = useRef<number | null>(null);

  // Handle pointer tracking throttled to animation frames
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (rafId.current !== null) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      setMousePos({
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight,
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Bring a clicked note to the highest z-index
  const bringToFront = useCallback((id: string) => {
    setZIndices((prev) => {
      const values = Object.values(prev) as number[];
      const maxZ = values.length > 0 ? Math.max(...values, 20) : 20;
      return {
        ...prev,
        [id]: maxZ + 1,
      };
    });
  }, []);

  // Tear note handler (triggered after 2 seconds hold)
  const handleTearNote = useCallback(
    (noteId: string, clickPos: { x: number; y: number }) => {
      const testimonial = TESTIMONIALS.find((t) => t.id === noteId);
      if (!testimonial) return;

      setTornNoteIds((prev) => new Set(prev).add(noteId));
      bringToFront(noteId);

      // Create a draggable torn scrap offset from the note
      const scrapId = `scrap-${noteId}-${Date.now()}`;
      setTornScraps((prev) => [
        ...prev.filter((s) => s.testimonial.id !== noteId),
        {
          id: scrapId,
          testimonial,
          initialPos: {
            x: Math.max(30, Math.min(window.innerWidth - 140, clickPos.x + 35)),
            y: Math.max(30, Math.min(window.innerHeight - 120, clickPos.y + 25)),
          },
        },
      ]);
    },
    [bringToFront]
  );

  // Reattach single note
  const handleReattachNote = useCallback((noteId: string) => {
    setTornNoteIds((prev) => {
      const next = new Set(prev);
      next.delete(noteId);
      return next;
    });
    setTornScraps((prev) => prev.filter((s) => s.testimonial.id !== noteId));
    playPaperRustle(0.9);
  }, []);

  // Toggle shift-aside reveal for notes that cover other notes
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
            // Also bring the covered note up so it's easily readable
            if (testimonial.coversNoteId) {
              bringToFront(testimonial.coversNoteId);
            }
          }
          return next;
        });
      }
    },
    [bringToFront]
  );

  // Trigger reveal of all hidden notes
  const handleTogglePeelAll = useCallback(() => {
    setShiftedNoteIds((prev) => {
      if (prev.size > 0) {
        return new Set();
      } else {
        const allCovering = new Set<string>();
        TESTIMONIALS.forEach((t) => {
          if (t.coversNoteId) allCovering.add(t.id);
        });
        return allCovering;
      }
    });
  }, []);

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative min-h-screen bg-[#050505] text-[#f4f4f5] overflow-x-hidden flex flex-col justify-between select-none"
    >
      {/* Dark studio surface micro-texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-screen"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Draggable Torn Scraps */}
      <AnimatePresence>
        {tornScraps.map((scrap) => (
          <TornScrap
            key={scrap.id}
            id={scrap.id}
            testimonial={scrap.testimonial}
            initialPos={scrap.initialPos}
            onReattach={handleReattachNote}
          />
        ))}
      </AnimatePresence>

      {/* Top Navigation Bar: Agency Brand */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="text-[12px] font-sans-clean font-bold tracking-widest uppercase text-neutral-400">
            Studio Kinetic
          </span>
          <span className="text-neutral-600 text-[11px] font-sans-clean hidden sm:inline">
            /
          </span>
          <span className="text-neutral-500 text-[11px] font-sans-clean hidden sm:inline">
            Client Moodboard Wall
          </span>
        </div>
      </header>

      {/* Main Section Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex-1 flex flex-col justify-center">
        {/* DESKTOP VIEW: Large Scattered Physical Moodboard Wall */}
        <div
          key={wallKey}
          className="relative hidden lg:block w-full"
          style={{ height: '700px' }}
        >
          {/* Left Column: Hero Editorial Typography */}
          <div className="absolute left-0 top-6 z-10">
            <HeroTypography />
          </div>

          {/* Floating Handwritten Annotations & SVG Arrows */}
          <HandwrittenAnnotations
            hoveredNoteId={hoveredNoteId}
            onSelectTargetNote={(id) => {
              setHoveredNoteId(id);
              bringToFront(id);
              playPaperRustle(0.8);
            }}
            onTriggerHiddenReveal={() => {
              handleTogglePeelAll();
            }}
          />

          {/* Scattered Sticky Notes Wall */}
          <div className="absolute inset-0 w-full h-full">
            {TESTIMONIALS.map((testimonial) => {
              // If note is torn, remove it completely from the wall
              if (tornNoteIds.has(testimonial.id)) {
                return null;
              }

              const isShifted = shiftedNoteIds.has(testimonial.id);
              const isHovered = hoveredNoteId === testimonial.id;
              const isAnyHovered = hoveredNoteId !== null;

              return (
                <StickyNote
                  key={testimonial.id}
                  testimonial={testimonial}
                  isHovered={isHovered}
                  isAnyHovered={isAnyHovered}
                  onHoverStart={() => setHoveredNoteId(testimonial.id)}
                  onHoverEnd={() => setHoveredNoteId(null)}
                  onClick={() => handleNoteClick(testimonial)}
                  isShiftedAside={isShifted}
                  zIndex={zIndices[testimonial.id] || 10}
                  mousePos={mousePos}
                  isTorn={false}
                  onTearNote={handleTearNote}
                  onReattachNote={handleReattachNote}
                />
              );
            })}
          </div>
        </div>

        {/* MOBILE & TABLET VIEW: Controlled Vertical Stack with preserved organic rotations */}
        <div className="block lg:hidden py-4 space-y-8">
          <HeroTypography />

          {/* Sticky Notes in Responsive Organic Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8 pt-4">
            {TESTIMONIALS.map((testimonial) => {
              // If note is torn, remove it completely from the wall
              if (tornNoteIds.has(testimonial.id)) {
                return null;
              }

              return (
                <div
                  key={testimonial.id}
                  className="relative flex justify-center py-2"
                >
                  <div
                    className="w-full max-w-[280px] transition-transform duration-300"
                    style={{
                      transform: `rotate(${testimonial.baseRotation}deg)`,
                    }}
                  >
                    <StickyNote
                      testimonial={testimonial}
                      isHovered={hoveredNoteId === testimonial.id}
                      isAnyHovered={hoveredNoteId !== null}
                      onHoverStart={() => setHoveredNoteId(testimonial.id)}
                      onHoverEnd={() => setHoveredNoteId(null)}
                      onClick={() => handleNoteClick(testimonial)}
                      isShiftedAside={shiftedNoteIds.has(testimonial.id)}
                      zIndex={zIndices[testimonial.id] || 10}
                      mousePos={{ x: 0.5, y: 0.5 }}
                      isMobileFlow={true}
                      isTorn={false}
                      onTearNote={handleTearNote}
                      onReattachNote={handleReattachNote}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile annotation badge */}
          <div className="pt-4 pb-2 text-center">
            <p className="font-editorial text-2xl text-pink-300">
              “Ideas that stay” ♡
            </p>
            <p className="text-xs font-sans-clean text-neutral-500 mt-1">
              Tap any note to peek underneath, hold 2s to tear, or drag to reposition
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
