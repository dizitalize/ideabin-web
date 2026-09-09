"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  PAGE1_FRAME_COUNT,
  PAGE2_START_FRAME,
  PAGE2_END_FRAME,
  preloadFirstFrame,
  preloadRunwayFrames,
  preloadTransitionRunway,
  preloadAllSequences,
  preloadSurroundingPage1,
  preloadSurroundingPage2,
  getNearestLoadedPage1,
  getNearestLoadedPage2,
  getCachedPage1Frame,
  getCachedPage2Frame,
  loadPage1Frame,
} from "@/lib/frame-sequence";
import { getMaxDpr, usePrefersReducedMotion } from "@/lib/performance";

const STORY_LINES = [
  { text: "Design should be", emphasis: false },
  { text: "easy to", emphasis: false },
  { text: "understand", emphasis: "large" },
  { text: "because", emphasis: "small" },
  { text: "simple ideas", emphasis: "small" },
  { text: "are quicker to", emphasis: false },
  { text: "grasp.", emphasis: "large" },
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay DOM refs (direct manipulation for 60fps scroll)
  const heroTextRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const storyLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ideabinContainerRef = useRef<HTMLDivElement>(null);
  const ideabinTextRef = useRef<HTMLDivElement>(null);
  const blackCircleRef = useRef<HTMLDivElement>(null);
  const ideabinWordmarkRef = useRef<HTMLSpanElement>(null);
  const agencyLabelRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const autoPlayRef = useRef<{
    active: boolean;
    progress: number;
    startTime: number;
    rafId: number | null;
  }>({
    active: false,
    progress: 0,
    startTime: 0,
    rafId: null,
  });

  // Animation state refs (NO React state on scroll ticks)
  const loadedPage1Ref = useRef<Set<number>>(new Set());
  const loadedPage2Ref = useRef<Set<number>>(new Set());
  const tickingRef = useRef<boolean>(false);
  const currentRenderStateRef = useRef<{
    page: 1 | 2;
    frameId: number;
    scale: number;
    focalX: number;
    focalY: number;
  }>({
    page: 1,
    frameId: 0,
    scale: 1,
    focalX: 0.76,
    focalY: 0.60,
  });

  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [heroInitialAnim, setHeroInitialAnim] = useState(false);

  // ---------------------------------------------------------------------------
  // Canvas cover-fit renderer with camera scale & focal point transform
  // ---------------------------------------------------------------------------
  const renderCanvas = useCallback(
    (page: 1 | 2, targetFrame: number, cameraScale: number = 1.0) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
      if (!ctx) return;

      let img: HTMLImageElement | undefined;
      let resolvedIndex = targetFrame;

      if (page === 1) {
        resolvedIndex = getNearestLoadedPage1(targetFrame, loadedPage1Ref.current);
        img = getCachedPage1Frame(resolvedIndex);
      } else {
        resolvedIndex = getNearestLoadedPage2(targetFrame, loadedPage2Ref.current);
        img = getCachedPage2Frame(resolvedIndex);
      }

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const dpr = getMaxDpr();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Reset transform to identity with DPR scale
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const imageRatio = img.naturalWidth / img.naturalHeight;
      const viewportRatio = viewportWidth / viewportHeight;

      let drawWidth = viewportWidth;
      let drawHeight = viewportHeight;

      if (viewportRatio > imageRatio) {
        drawHeight = viewportWidth / imageRatio;
      } else {
        drawWidth = viewportHeight * imageRatio;
      }

      // Mobile portrait intelligent framing
      const isMobilePortrait = viewportWidth <= 768 && viewportHeight > viewportWidth;
      if (isMobilePortrait) {
        drawWidth *= 1.1;
        drawHeight *= 1.1;
      }

      const cropX = (viewportWidth - drawWidth) * 0.5;
      const cropY = (viewportHeight - drawHeight) * 0.5;

      // Focal point for camera push (centered on robot's glowing chest/energy)
      const focalNormX = 0.76;
      const focalNormY = 0.60;
      const focalPxX = cropX + drawWidth * focalNormX;
      const focalPxY = cropY + drawHeight * focalNormY;

      // Clear rect before drawing
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, viewportWidth, viewportHeight);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Apply camera zoom towards focal point
      if (Math.abs(cameraScale - 1.0) > 0.001) {
        ctx.save();
        ctx.translate(focalPxX, focalPxY);
        ctx.scale(cameraScale, cameraScale);
        ctx.translate(-focalPxX, -focalPxY);
        ctx.drawImage(img, cropX, cropY, drawWidth, drawHeight);
        ctx.restore();
      } else {
        ctx.drawImage(img, cropX, cropY, drawWidth, drawHeight);
      }

      currentRenderStateRef.current = {
        page,
        frameId: resolvedIndex,
        scale: cameraScale,
        focalX: focalNormX,
        focalY: focalNormY,
      };
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Canvas resize handler with DPR scaling
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

    const state = currentRenderStateRef.current;
    renderCanvas(state.page, state.frameId, state.scale);
  }, [renderCanvas]);

  // ---------------------------------------------------------------------------
  // Priority Preloading Lifecycle
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    // P0: Load Page 1 Frame 0001 immediately for first paint
    preloadFirstFrame()
      .then((img) => {
        if (cancelled) return;
        loadedPage1Ref.current.add(0);
        setFirstFrameReady(true);

        updateCanvasDimensions();
        renderCanvas(1, 0, 1.0);

        // P1: Runway frames (0002 to 0012)
        void preloadRunwayFrames().then(() => {
          if (cancelled) return;
          for (let i = 1; i <= 12; i++) {
            if (getCachedPage1Frame(i)) loadedPage1Ref.current.add(i);
          }
        });

        // Preload transition runway in advance
        preloadTransitionRunway();

        // P3: Background progressive caching
        const cancelAll = preloadAllSequences((page, id) => {
          if (cancelled) return;
          if (page === 1) loadedPage1Ref.current.add(id);
          else loadedPage2Ref.current.add(id);
        });

        return () => {
          cancelAll();
        };
      })
      .catch(() => {
        void loadPage1Frame(0).then((img) => {
          if (!cancelled && img) {
            loadedPage1Ref.current.add(0);
            updateCanvasDimensions();
            renderCanvas(1, 0, 1.0);
          }
        });
      });

    return () => {
      cancelled = true;
    };
  }, [renderCanvas, updateCanvasDimensions]);

  // Trigger hero text entrance 400ms after first frame
  useEffect(() => {
    if (!firstFrameReady) return;
    const timer = setTimeout(() => {
      setHeroInitialAnim(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [firstFrameReady]);

  // ---------------------------------------------------------------------------
  // Master Scroll Timeline Choreography (Unified 60fps RAF scrub)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const updateVisuals = (P: number) => {
      // =====================================================================
      // TIMELINE PHASE BREAKDOWN:
      // P in [0.00, 0.40]: PHASE 01 — Page 1 Frames (1 -> 97)
      // P in [0.40, 0.52]: PHASE 02 — Hold Frame 97 & Editorial Narrative Text
      // P in [0.52, 0.65]: PHASE 03 — 25-Image Sequence (Page 2 Frames 2 -> 25)
      // P in [0.65, 0.76]: PHASE 04 — Transition Image Dominance & Camera Push
      // P in [0.67, 0.79]: PHASE 05 — "ideabin" Automatic Text Zoom
      // P in [0.74, 0.82]: PHASE 06 — Focal Mask Iris Expansion
      // P in [0.80, 1.00]: PHASE 07/08 — Page 2 Continuous Frames (26 -> 97)
      // =====================================================================

      let activePage: 1 | 2 = 1;
      let activeFrame = 0;
      let cameraScale = 1.0;

      if (P <= 0.40) {
        // PHASE 01: Page 1 Frames 1 -> 97
        activePage = 1;
        const p1 = P / 0.40;
        activeFrame = Math.min(PAGE1_FRAME_COUNT - 1, Math.max(0, Math.round(p1 * (PAGE1_FRAME_COUNT - 1))));
        cameraScale = 1.0;
        preloadSurroundingPage1(activeFrame, 4);
      } else {
        // PHASE 02+: Hold Frame 97 stable while story text reveals and transition plays
        activePage = 1;
        activeFrame = PAGE1_FRAME_COUNT - 1; // frame_0097.webp
        
        // Optional camera push to keep the background dynamic during the transition
        if (P <= 0.52) {
          cameraScale = 1.0;
        } else {
          const pPush = Math.min(1, (P - 0.52) / 0.17);
          cameraScale = 1.0 + 0.28 * pPush;
        }
      }

      // Render canvas
      renderCanvas(activePage, activeFrame, cameraScale);

      // Hide canvas fully behind the completely expanded black circle
      if (canvasRef.current) {
        canvasRef.current.style.opacity = P >= 0.97 ? "0" : "1";
      }

      // ---------------------------------------------------------------------
      // DOM OVERLAYS (Choreographed purely by scroll progress P)
      // ---------------------------------------------------------------------

      // 1. Initial Hero Typography (Fades out over P = 0.00 -> 0.08)
      if (heroTextRef.current) {
        const fadeP = Math.min(1, P / 0.08);
        const opacity = Math.max(0, 1 - fadeP);
        const translateY = -fadeP * 28;
        heroTextRef.current.style.opacity = String(opacity);
        heroTextRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
        heroTextRef.current.style.pointerEvents = opacity <= 0.02 ? "none" : "auto";
      }

      // 2. Scroll Prompt Cue (Fades out over P = 0.00 -> 0.04)
      if (scrollCueRef.current) {
        const cueP = Math.min(1, P / 0.04);
        scrollCueRef.current.style.opacity = String(Math.max(0, 1 - cueP));
      }

      // 3. Editorial Narrative Text ("Design should be easy to understand...")
      // Appears during Frame 97 Hold (P = 0.40 -> 0.52)
      if (storyContainerRef.current) {
        const inRange = P >= 0.38 && P <= 0.54;
        storyContainerRef.current.style.display = inRange ? "flex" : "none";

        if (inRange) {
          // Text entrance: P = 0.40 -> 0.47
          // Text hold: P = 0.47 -> 0.49
          // Text exit: P = 0.49 -> 0.52
          let masterAlpha = 1.0;
          if (P < 0.47) {
            masterAlpha = Math.max(0, (P - 0.40) / 0.07);
          } else if (P > 0.49) {
            masterAlpha = Math.max(0, 1 - (P - 0.49) / 0.03);
          }

          storyContainerRef.current.style.opacity = String(masterAlpha);

          // Staggered line animations
          const totalLines = storyLineRefs.current.length;
          storyLineRefs.current.forEach((lineEl, idx) => {
            if (!lineEl) return;
            const lineThreshold = 0.40 + (idx / totalLines) * 0.06;
            const lineP = Math.min(1, Math.max(0, (P - lineThreshold) / 0.025));

            const lineOpacity = lineP * masterAlpha;
            const lineBlur = (1 - lineP) * 8;
            const lineTranslateY = (1 - lineP) * 20;

            lineEl.style.opacity = String(lineOpacity);
            lineEl.style.filter = `blur(${lineBlur}px)`;
            lineEl.style.transform = `translate3d(0, ${lineTranslateY}px, 0)`;
          });
        }
      }

      // 4. SCENE 03: IDEABIN CINEMATIC REVEAL (P = 0.52 -> 1.00)
      if (ideabinContainerRef.current) {
        // Show container slightly before and hide slightly after the range to prevent clipping
        const inRange = P >= 0.51 && P <= 1.0;
        ideabinContainerRef.current.style.display = inRange ? "flex" : "none";

        if (inRange) {
          // Normalize P to the 0.52 -> 1.0 range
          const pReveal = Math.min(1, Math.max(0, (P - 0.52) / (1.0 - 0.52)));

          let circleRadius = 0;
          let fontSize = 6;
          let textOpacity = 0;
          let labelOpacity = 0;
          let labelTranslateY = 8;
          let letterSpacing = -0.02;

          // PHASE A: 0.52 -> 0.60 (Mapped to 0.0 -> 0.166 of pReveal)
          // PHASE B: 0.60 -> 0.70 (Mapped to 0.166 -> 0.375 of pReveal)
          // PHASE C: 0.70 -> 0.80 (Mapped to 0.375 -> 0.583 of pReveal)
          // PHASE D: 0.80 -> 0.90 (Mapped to 0.583 -> 0.791 of pReveal)
          // PHASE E: 0.90 -> 0.97 (Mapped to 0.791 -> 0.937 of pReveal)
          // PHASE F: 0.97 -> 1.00 (Mapped to 0.937 -> 1.0 of pReveal)

          if (pReveal <= 0.166) {
            // PHASE A: The Seed
            const pPhase = pReveal / 0.166;
            circleRadius = 6 + (20 - 6) * pPhase;
            textOpacity = 0.25 * pPhase;
            fontSize = 6;
          } else if (pReveal <= 0.375) {
            // PHASE B: Recognition
            const pPhase = (pReveal - 0.166) / (0.375 - 0.166);
            circleRadius = 20 + (80 - 20) * pPhase;
            textOpacity = 0.25 + 0.25 * pPhase;
            fontSize = 6 + (10 - 6) * pPhase;
            letterSpacing = -0.02 - 0.01 * pPhase; // -0.02 to -0.03
          } else if (pReveal <= 0.583) {
            // PHASE C: Importance
            const pPhase = (pReveal - 0.375) / (0.583 - 0.375);
            circleRadius = 80 + (250 - 80) * pPhase;
            textOpacity = 0.5 + 0.25 * pPhase;
            fontSize = 10 + (16 - 10) * pPhase;
            letterSpacing = -0.03 - 0.01 * pPhase; // -0.03 to -0.04
          } else if (pReveal <= 0.791) {
            // PHASE D: Focal Point
            const pPhase = (pReveal - 0.583) / (0.791 - 0.583);
            circleRadius = 250 + (700 - 250) * pPhase;
            textOpacity = 0.75 + 0.25 * pPhase;
            fontSize = 16 + (22 - 16) * pPhase;
            letterSpacing = -0.04 - 0.005 * pPhase; // -0.04 to -0.045
          } else if (pReveal <= 0.937) {
            // PHASE E: Full Coverage
            const pPhase = (pReveal - 0.791) / (0.937 - 0.791);
            // Dynamic max radius to ensure full coverage on any screen
            const maxDim = Math.max(window.innerWidth, window.innerHeight);
            const maxRadius = Math.ceil(maxDim * 0.8); // Enough to cover corners
            circleRadius = 700 + (maxRadius - 700) * pPhase;
            textOpacity = 1.0;
            fontSize = 22 + (28 - 22) * pPhase;
            letterSpacing = -0.045 - 0.005 * pPhase; // -0.045 to -0.05
          } else {
            // PHASE F: Established (Hold + Label Reveal)
            const pPhase = (pReveal - 0.937) / (1.0 - 0.937);
            const maxDim = Math.max(window.innerWidth, window.innerHeight);
            circleRadius = Math.ceil(maxDim * 0.8);
            textOpacity = 1.0;
            fontSize = 28;
            letterSpacing = -0.05;
            
            labelOpacity = pPhase;
            labelTranslateY = 8 * (1 - pPhase);
          }

          // Apply Circle Expansion
          if (blackCircleRef.current) {
            // If radius is effectively 0, clip to 0, otherwise clip to radius
            blackCircleRef.current.style.clipPath = `circle(${circleRadius}px at 50% 50%)`;
          }

          // Apply Wordmark Evolution
          if (ideabinWordmarkRef.current) {
            ideabinWordmarkRef.current.style.opacity = String(textOpacity);
            ideabinWordmarkRef.current.style.fontSize = `${fontSize}px`;
            ideabinWordmarkRef.current.style.letterSpacing = `${letterSpacing}em`;
          }

          // Apply Agency Label Reveal
          if (agencyLabelRef.current) {
            agencyLabelRef.current.style.opacity = String(labelOpacity);
            agencyLabelRef.current.style.transform = `translateY(${labelTranslateY}px)`;
          }
        }
      }
    };

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
        const scrollableDist = Math.max(1, section.offsetHeight - window.innerHeight);
        const scrollP = Math.min(1, Math.max(0, -rect.top / scrollableDist));

        // Auto-play trigger: when Scene 2 text finishes exiting (P >= 0.52)
        if (scrollP >= 0.52 && scrollP < 1.0) {
          if (!autoPlayRef.current.active && autoPlayRef.current.progress === 0) {
            autoPlayRef.current.active = true;
            autoPlayRef.current.startTime = performance.now();
            autoPlayRef.current.progress = 0.52;
            
            const DURATION = 3500; // 3.5 seconds to play the rest like a video
            
            const tick = (now: number) => {
              if (!autoPlayRef.current.active) return;
              const elapsed = now - autoPlayRef.current.startTime;
              const autoP = Math.min(1.0, 0.52 + (elapsed / DURATION) * 0.48);
              autoPlayRef.current.progress = autoP;
              
              updateVisuals(autoP);
              
              if (autoP < 1.0) {
                autoPlayRef.current.rafId = requestAnimationFrame(tick);
              } else {
                autoPlayRef.current.active = false;
              }
            };
            autoPlayRef.current.rafId = requestAnimationFrame(tick);
          }
        } else if (scrollP < 0.45) {
          // Reset auto-play if user scrolls back up
          if (autoPlayRef.current.active || autoPlayRef.current.progress > 0) {
            if (autoPlayRef.current.rafId) cancelAnimationFrame(autoPlayRef.current.rafId);
            autoPlayRef.current.active = false;
            autoPlayRef.current.progress = 0;
            autoPlayRef.current.startTime = 0;
          }
        }

        // Determine final P to render
        let P = scrollP;
        if (autoPlayRef.current.progress > 0) {
          // Yield to manual back-scroll if user scrolls backwards beyond the auto-play progress
          if (scrollP < autoPlayRef.current.progress - 0.05) {
            if (autoPlayRef.current.active) {
              if (autoPlayRef.current.rafId) cancelAnimationFrame(autoPlayRef.current.rafId);
              autoPlayRef.current.active = false;
            }
            autoPlayRef.current.progress = 0;
            P = scrollP;
          } else {
            P = Math.max(scrollP, autoPlayRef.current.progress);
          }
        }

        updateVisuals(P);
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateCanvasDimensions);

    // Initial evaluation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, [renderCanvas, updateCanvasDimensions]);

  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="hero-cinematic"
      className="relative w-full bg-[#050505]"
      style={{ height: "750vh" }}
      aria-label="3D Cinematic Experience"
    >
      {/* Pinned Sticky Viewport (100vh) */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden select-none"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
        {/* Master Continuous Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full object-cover"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
          aria-hidden="true"
        />

        {/* Atmospheric Left Scrim to guarantee 100% text readability over bright robot highlights & flames */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 95% 75% at 15% 50%, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 45%, rgba(5,5,5,0.2) 75%, transparent 100%), linear-gradient(to bottom, rgba(5,5,5,0.75) 0%, transparent 22%), linear-gradient(to top, rgba(5,5,5,0.82) 0%, transparent 26%)",
          }}
          aria-hidden="true"
        />



        {/* ----------------------------------------------------------------- */}
        {/* 1. HERO EDITORIAL TYPOGRAPHY                                      */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 lg:p-16 pointer-events-none"
        >
          {/* Top metadata */}
          <div className="pt-20 md:pt-24 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] font-medium">
            {/* <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-zinc-200 shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out"
              style={{
                opacity: heroInitialAnim || reducedMotion ? 0.95 : 0,
                transform: heroInitialAnim || reducedMotion ? "translateY(0)" : "translateY(8px)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
              Volume 01 · 3D Scroll Journey
            </span> */}
            {/* <span
                className="hidden sm:inline-block px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-zinc-300 shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-all duration-700 delay-100 ease-out"
                style={{
                  opacity: heroInitialAnim || reducedMotion ? 0.85 : 0,
                  transform: heroInitialAnim || reducedMotion ? "translateY(0)" : "translateY(8px)",
                }}
              >
                Sequence 001–097 → Scene 02
              </span> */}
          </div>

          {/* Main Headline (positioned compactly on left so robot face remains visible & clear) */}
          <div className="my-auto max-w-xl lg:max-w-2xl relative z-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-white leading-[0.98] text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,1)] drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
              <span className="block overflow-hidden pb-1">
                <span
                  className="block transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: heroInitialAnim || reducedMotion ? 1 : 0,
                    transform:
                      heroInitialAnim || reducedMotion
                        ? "translateY(0%) scale(1)"
                        : "translateY(110%) scale(0.985)",
                    clipPath:
                      heroInitialAnim || reducedMotion
                        ? "inset(0% 0 0 0)"
                        : "inset(100% 0 0 0)",
                  }}
                >
                  How We craft
                </span>
              </span>

              <span className="block overflow-hidden">
                <span
                  className="block transition-all duration-1000 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] text-zinc-100 drop-shadow-[0_4px_24px_rgba(0,0,0,1)]"
                  style={{
                    opacity: heroInitialAnim || reducedMotion ? 1 : 0,
                    transform:
                      heroInitialAnim || reducedMotion
                        ? "translateY(0%) scale(1)"
                        : "translateY(110%) scale(0.985)",
                    clipPath:
                      heroInitialAnim || reducedMotion
                        ? "inset(0% 0 0 0)"
                        : "inset(100% 0 0 0)",
                  }}
                >
                  digital experiences
                </span>
              </span>
            </h1>

            <p
              className="mt-6 sm:mt-8 max-w-lg text-base sm:text-lg text-zinc-100 font-normal leading-relaxed tracking-tight transition-all duration-1000 delay-200 ease-out drop-shadow-[0_2px_12px_rgba(0,0,0,1)]"
              style={{
                opacity: heroInitialAnim || reducedMotion ? 0.92 : 0,
                transform:
                  heroInitialAnim || reducedMotion
                    ? "translateY(0)"
                    : "translateY(16px)",
              }}
            >
              We choreograph spatial interactions, realistic 3D product motion, and architectural web engineering for visionary brands.
            </p>
          </div>

          {/* Bottom scroll prompt with glassmorphic backing */}
          <div
            ref={scrollCueRef}
            className="pb-4 flex items-center justify-between text-xs text-zinc-200 tracking-wider uppercase font-medium"
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              <div className="relative w-4 h-7 rounded-full border border-zinc-500/80 flex items-start justify-center p-1">
                <div className="w-1 h-2 rounded-full bg-white animate-bounce shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
              </div>
              <span className="text-[11px] tracking-[0.2em] text-zinc-200 font-medium">Scroll to scrub sequence</span>
            </div>
            {/* <span className="font-mono text-[11px] text-zinc-300 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              01 / 05
            </span> */}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 2. PHASE 02: EDITORIAL NARRATIVE STORY TEXT (Frame 97 Hold)        */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={storyContainerRef}
          className="absolute inset-0 z-20 hidden items-center justify-start p-6 md:p-16 lg:p-24 pointer-events-none"
        >
          <div className="max-w-2xl text-left p-6 sm:p-10 rounded-3xl bg-black/60 backdrop-blur-md shadow-[0_24px_64px_rgba(0,0,0,0.9)]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-orange-400 font-semibold mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              Scene 02 · Narrative
            </p>

            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              {STORY_LINES.map((line, i) => {
                const isLarge = line.emphasis === "large";
                const isSmall = line.emphasis === "small";
                const isUnderstand = line.text.toLowerCase() === "understand";

                return (
                  <div key={i} className="overflow-visible">
                    <span
                      ref={(el) => {
                        storyLineRefs.current[i] = el;
                      }}
                      className={`inline-block select-none transition-none ${isUnderstand
                        ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] bg-gradient-to-r from-[#ff7a18] via-white to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(255,122,24,0.35)] pb-1"
                        : isLarge
                          ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.04em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)]"
                          : isSmall
                            ? "text-xl sm:text-2xl md:text-3xl font-light tracking-[-0.02em] text-zinc-400 drop-shadow-[0_2px_12px_rgba(0,0,0,1)]"
                            : "text-2xl sm:text-4xl md:text-5xl font-normal tracking-[-0.03em] text-zinc-200 drop-shadow-[0_2px_12px_rgba(0,0,0,1)]"
                        }`}
                      style={{
                        opacity: 0,
                        transform: "translate3d(0, 20px, 0)",
                        filter: "blur(8px)",
                      }}
                    >
                      {line.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 3. SCENE 03: IDEABIN CINEMATIC REVEAL (P = 0.52 -> 1.00)           */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={ideabinContainerRef}
          className="absolute inset-0 z-25 hidden items-center justify-center pointer-events-none"
        >
          {/* Expanding Black Circle Portal (using clip-path) */}
          <div
            ref={blackCircleRef}
            className="absolute inset-0 bg-black will-change-transform"
            style={{
              clipPath: "circle(0px at 50% 50%)",
            }}
            aria-hidden="true"
          />
          {/* Evolving Wordmark and Agency Label */}
          <div
            ref={ideabinTextRef}
            className="text-center will-change-transform relative z-10 flex flex-col items-center justify-center"
          >
            <span
              ref={ideabinWordmarkRef}
              className="block font-medium tracking-[-0.02em] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              style={{ fontSize: "6px" }}
            >
              ideabin
            </span>
            <div
              ref={agencyLabelRef}
              className="absolute top-full mt-4 text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-medium whitespace-nowrap"
              style={{ opacity: 0, transform: "translateY(8px)" }}
            >
              Creative Digital Agency
            </div>
          </div>
        </div>

        {/* Ambient bottom vignette for smooth transition into next section */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, #0a0a0f, transparent)" }}
        />
      </div>
    </section>
  );
}