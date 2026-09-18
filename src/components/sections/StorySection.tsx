"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  FRAME_COUNT as FRAME_COUNT_02,
  preloadFirstFrame as preloadFirstFrame_02,
  preloadRunwayFrames as preloadRunwayFrames_02,
  preloadRemainingFrames as preloadRemainingFrames_02,
  preloadSurroundingFrames as preloadSurroundingFrames_02,
  getNearestLoadedFrame as getNearestLoadedFrame_02,
  getCachedFrame as getCachedFrame_02,
  loadFrame as loadFrame_02,
} from "@/lib/frame-sequence-02";
import { FRAME_COUNT as FRAME_COUNT_01, getFrameUrl as getFrameUrl_01 } from "@/lib/frame-sequence";
import { getMaxDpr, prefersReducedMotion } from "@/lib/performance";

const STORY_LINES = [
  "Design should be",
  "easy to",
  "understand",
  "because",
  "simple",
  "ideas",
  "are quicker to",
  "grasp.",
] as const;

// ---------------------------------------------------------------------------
// Scroll reveal timing configuration
// ---------------------------------------------------------------------------
// All lines are HIDDEN until 8% of the section has been scrolled (= ~22vh of
// scrolling past the section top). This guarantees that when Scene 02 first
// enters the viewport, every line is at opacity:0.
//
// Each line's reveal window spans 14% of the total scroll range so the
// animation feels unhurried and editorial. Lines stagger at 9% intervals.
// ---------------------------------------------------------------------------
const REVEAL_START = 0.08;   // nothing visible before 8% scroll progress
const REVEAL_END   = 0.88;   // all lines done by 88%
const N = STORY_LINES.length;
const LINE_SPACING = (REVEAL_END - REVEAL_START) / (N + 1); // ≈ 8.9 % per line
const LINE_WINDOW  = LINE_SPACING * 1.6;                     // each line's ease window

function getLineWindow(i: number): [number, number] {
  const start = REVEAL_START + i * LINE_SPACING;
  return [start, start + LINE_WINDOW];
}

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tickingRef = useRef<boolean>(false);
  const readyRef = useRef(false); // transitions only activate after first scroll paint
  const reducedMotion = prefersReducedMotion();

  // Performance & state refs for Scene 02 (NO React state on scroll ticks)
  const loadedIndicesRef_02 = useRef<Set<number>>(new Set());
  const currentFrameIndexRef_02 = useRef<number>(0);
  const drawnFrameIndexRef_02 = useRef<number>(-1);
  const firstFrameRenderedRef_02 = useRef<boolean>(false);

  // For Scene 01 final frame hold during transition
  const scene01FinalFrameRef = useRef<HTMLImageElement | null>(null);
  const scene01FinalFrameLoadedRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(0); // 0 to 1 during transition period

  // UI state for initial mount and text entrance timing
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  // ---------------------------------------------------------------------------
  // Canvas cover-fit renderer for Scene 02 frames with Scene 01 transition
  // ---------------------------------------------------------------------------
  const renderFrameToCanvas = useCallback((targetIndex_02: number, transitionAlpha: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true, // Need alpha for blending
      desynchronized: true,
    });
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply DPR scaling
    const dpr = getMaxDpr();
    ctx.scale(dpr, dpr);

    // Get viewport dimensions (in CSS pixels)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Function to draw a frame at given alpha
    const drawFrame = (img: HTMLImageElement | null, alpha: number) => {
      if (!img || !img.complete || img.naturalWidth === 0 || alpha <= 0) {
        return;
      }

      const imageRatio = img.naturalWidth / img.naturalHeight;
      const viewportRatio = viewportWidth / viewportHeight;

      let drawWidth = viewportWidth;
      let drawHeight = viewportHeight;

      if (viewportRatio > imageRatio) {
        drawHeight = viewportWidth / imageRatio;
      } else {
        drawWidth = viewportHeight * imageRatio;
      }

      // Intelligent mobile framing: subtle 1.1x zoom on mobile portrait
      const isMobilePortrait = viewportWidth <= 768 && viewportHeight > viewportWidth;
      if (isMobilePortrait) {
        drawWidth *= 1.1;
        drawHeight *= 1.1;
      }

      const cropX = (viewportWidth - drawWidth) * 0.5;
      const cropY = (viewportHeight - drawHeight) * 0.5;

      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, cropX, cropY, drawWidth, drawHeight);
      ctx.globalAlpha = 1; // Reset
    };

    // Determine what to draw based on transition state
    if (transitionAlpha < 1 && scene01FinalFrameRef.current) {
      // During transition: blend Scene 01 final frame with Scene 02 current frame
      const resolvedIndex_02 = getNearestLoadedFrame_02(targetIndex_02, loadedIndicesRef_02.current);
      const img_02 = getCachedFrame_02(resolvedIndex_02) || null;
      
      // Draw Scene 01 final frame (fading out)
      drawFrame(scene01FinalFrameRef.current, 1 - transitionAlpha);
      // Draw Scene 02 current frame (fading in)
      drawFrame(img_02, transitionAlpha);
    } else {
      // Normal operation: just draw Scene 02 frame
      const loadedSet_02 = loadedIndicesRef_02.current;
      const resolvedIndex_02 = getNearestLoadedFrame_02(targetIndex_02, loadedSet_02);
      const img_02 = getCachedFrame_02(resolvedIndex_02) || null;
      drawFrame(img_02, 1);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // DPR-aware canvas resize handler
  // ---------------------------------------------------------------------------
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = getMaxDpr();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const pixelWidth = Math.max(1, Math.round(width * dpr));
    const pixelHeight = Math.max(1, Math.round(height * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Force redraw after resize
    drawnFrameIndexRef_02.current = -1;
    renderFrameToCanvas(currentFrameIndexRef_02.current, 1);
  }, [renderFrameToCanvas]);

  // ---------------------------------------------------------------------------
  // Load Scene 01's final frame for transition hold
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const loadScene01FinalFrame = async () => {
      try {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          scene01FinalFrameRef.current = img;
          scene01FinalFrameLoadedRef.current = true;
        };
        img.onerror = () => {
          console.warn("Failed to load Scene 01 final frame for transition");
        };
        img.src = getFrameUrl_01(FRAME_COUNT_01 - 1); // frame_0097 (index 96)
      } catch (error) {
        console.error("Error loading Scene 01 final frame:", error);
      }
    };

    loadScene01FinalFrame();
  }, []);

  // ---------------------------------------------------------------------------
  // PHASE 3 & 4: Priority Preloading & First Paint for Scene 02
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    // P0: Load Frame 0001 first with highest priority
    preloadFirstFrame_02()
      .then((img) => {
        if (cancelled) return;
        loadedIndicesRef_02.current.add(0);
        firstFrameRenderedRef_02.current = true;
        setFirstFrameReady(true);

        // Immediate first paint
        updateCanvasDimensions();
        renderFrameToCanvas(0, 1);

        // P1: Preload frames 0002-0010 immediately after frame 0001
        void preloadRunwayFrames_02().then(() => {
          if (cancelled) return;
          for (let i = 1; i < 10; i++) {
            if (getCachedFrame_02(i)) loadedIndicesRef_02.current.add(i);
          }
        });

        // P3: Preload remaining frames in parallel non-blocking background chunks
        const cancelRemaining = preloadRemainingFrames_02((loadedIndex) => {
          if (cancelled) return;
          loadedIndicesRef_02.current.add(loadedIndex);
        });

        return () => {
          cancelRemaining();
        };
      })
      .catch(() => {
        // Fallback: try loading frame 0 again
        void loadFrame_02(0).then((img) => {
          if (!cancelled && img) {
            loadedIndicesRef_02.current.add(0);
            updateCanvasDimensions();
            renderFrameToCanvas(0, 1);
          }
        });
      });

    return () => {
      cancelled = true;
    };
  }, [renderFrameToCanvas, updateCanvasDimensions]);

  // ---------------------------------------------------------------------------
  // Scene 02 Typography Choreography (~500ms after first frame appears)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!firstFrameReady) return;

    const timer = setTimeout(() => {
      setTextVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [firstFrameReady]);

  // ---------------------------------------------------------------------------
  // Scroll mapping & RAF throttling with Scene 01→02 transition
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          tickingRef.current = false;
          return;
        }

        const rect = section.getBoundingClientRect();
        const scrollableDistance = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));

        // Map progress 0 -> 1 to frame 0 -> 96 for Scene 02's 97-frame sequence
        const targetFrameIndex_02 = Math.min(FRAME_COUNT_02 - 1, Math.max(0, Math.round(progress * (FRAME_COUNT_02 - 1))));

        // Calculate transition alpha for Scene 01→02 handoff
        // Transition occurs during first 10% of Scene 02's scroll range
        const transitionProgress = Math.min(1, progress / 0.1);
        transitionProgressRef.current = transitionProgress;

if (targetFrameIndex_02 !== currentFrameIndexRef_02.current) {
           currentFrameIndexRef_02.current = targetFrameIndex_02;
           renderFrameToCanvas(targetFrameIndex_02, transitionProgress);
           // Preload surrounding frames dynamically around target
           preloadSurroundingFrames_02(targetFrameIndex_02, 4);
         }

        // Direct DOM choreography for text fade-in during Scene 02
        // Text begins to appear after transition completes (after 10% progress)
        if (sectionRef.current) {
          const textProgress = Math.max(0, (progress - 0.1) / 0.05); // Start fading in at 10%, complete by 15%
          const textOpacity = Math.min(1, Math.max(0, textProgress));
          
          // Apply to all text lines
          lineRefs.current.forEach((el) => {
            if (!el) return;
            el.style.opacity = String(textOpacity);
            el.style.filter = `blur(${(1 - textOpacity) * 10}px)`;
            el.style.transform = `translateY(${(1 - textOpacity) * 20}%)`;
          });
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateCanvasDimensions);

    // Initial position check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, [renderFrameToCanvas, updateCanvasDimensions]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative w-full"
      style={{ height: "280vh" }}
    >
      {/* Sticky viewport */}
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #0f0d0a 100%)",
        }}
      >
        {/* Scene 01 → 02 continuity gradient */}
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #050505, transparent)" }}
        />

        {/* Cinematic Canvas for Scene 02 with Scene 01 transition */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full object-cover"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
          aria-hidden="true"
        />

        {/* Main editorial text */}
        <div className="section-container relative z-10 text-left max-w-3xl">
          <p
            className="eyebrow text-zinc-700 mb-10 md:mb-14"
            style={{ letterSpacing: "0.25em" }}
          >
            Scene 02 · Narrative
          </p>

          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {STORY_LINES.map((line, i) => {
              const isSmall = ["because", "simple", "ideas"].includes(line);
              const isLarge = ["understand", "grasp."].includes(line);
              const isUnderstand = line.toLowerCase() === "understand";

              return (
                <div key={i} className="overflow-visible">
                  <span
                    ref={(el) => {
                      lineRefs.current[i] = el;
                    }}
                    className={`inline-block select-none ${
                      isUnderstand
                        ? "text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.04em] bg-gradient-to-r from-[#ff7a18] via-white to-[#38bdf8] bg-clip-text text-transparent pb-1"
                        : isLarge
                        ? "text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-[-0.04em] text-white"
                        : isSmall
                        ? "text-2xl sm:text-3xl md:text-4xl font-light tracking-[-0.02em] text-zinc-500"
                        : "text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.03em] text-zinc-300"
                    }`}
                    style={{
                      // Initial state will be set by scroll handler
                      opacity: 0,
                      filter: "blur(10px)",
                      transform: "translateY(20%)",
                      transition:
                        "opacity 0.7s cubic-bezier(0.16,1,0.3,1), " +
                        "filter 0.7s cubic-bezier(0.16,1,0.3,1), " +
                        "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom fade into next scene */}
        <div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0a0a0f, transparent)" }}
        />
      </div>
    </section>
  );
}