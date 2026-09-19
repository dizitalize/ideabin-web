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
import CinematicPage from "@/components/cinematic/CinematicPage";

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
  const cinematicContainerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const bottomVignetteRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const [isCinematicActive, setIsCinematicActive] = useState(false);
  const [cinematicKey, setCinematicKey] = useState(0);
  const cinematicZoneRef = useRef<"above" | "inside" | "below">("above");

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

      if (P <= 0.45) {
        // PHASE 01: Page 1 Frames 1 -> 97
        activePage = 1;
        const p1 = P / 0.45;
        activeFrame = Math.min(PAGE1_FRAME_COUNT - 1, Math.max(0, Math.round(p1 * (PAGE1_FRAME_COUNT - 1))));
        cameraScale = 1.0;
        preloadSurroundingPage1(activeFrame, 4);
      } else {
        // PHASE 02+: Hold Frame 97 stable while story text reveals and transition plays
        activePage = 1;
        activeFrame = PAGE1_FRAME_COUNT - 1; // frame_0097.webp

        // Optional camera push to keep the background dynamic during the transition
        if (P <= 0.58) {
          cameraScale = 1.0;
        } else {
          const pPush = Math.min(1, (P - 0.58) / 0.08);
          cameraScale = 1.0 + 0.28 * pPush;
        }
      }

      // Render canvas only when on Page 1 / Page 2
      if (P < 0.65) {
        renderCanvas(activePage, activeFrame, cameraScale);
      }

      // Hide canvas and atmospheric overlays smoothly and completely before Page 3 appears
      if (canvasRef.current) {
        if (P >= 0.65) {
          canvasRef.current.style.opacity = "0";
          canvasRef.current.style.display = "none";
        } else if (P >= 0.62) {
          canvasRef.current.style.display = "block";
          canvasRef.current.style.opacity = String(Math.max(0, 1 - (P - 0.62) / 0.03));
        } else {
          canvasRef.current.style.display = "block";
          canvasRef.current.style.opacity = "1";
        }
      }

      if (scrimRef.current) {
        if (P >= 0.65) {
          scrimRef.current.style.opacity = "0";
          scrimRef.current.style.display = "none";
        } else if (P >= 0.62) {
          scrimRef.current.style.display = "block";
          scrimRef.current.style.opacity = String(Math.max(0, 1 - (P - 0.62) / 0.03));
        } else {
          scrimRef.current.style.display = "block";
          scrimRef.current.style.opacity = "1";
        }
      }

      if (bottomVignetteRef.current) {
        if (P >= 0.62) {
          bottomVignetteRef.current.style.opacity = "0";
          bottomVignetteRef.current.style.display = "none";
        } else {
          bottomVignetteRef.current.style.display = "block";
          bottomVignetteRef.current.style.opacity = "1";
        }
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
      // Appears during Frame 97 Hold (P = 0.44 -> 0.64), cleanly hidden before Page 3
      if (storyContainerRef.current) {
        const inRange = P >= 0.44 && P < 0.65;
        storyContainerRef.current.style.display = inRange ? "flex" : "none";

        if (inRange) {
          // Text entrance: P = 0.45 -> 0.52
          // Text hold: P = 0.52 -> 0.58
          // Text exit: P = 0.58 -> 0.64 (completely 0 before 0.65)
          let masterAlpha = 1.0;
          let exitFactor = 0;
          if (P < 0.52) {
            masterAlpha = Math.max(0, (P - 0.45) / 0.07);
          } else if (P > 0.58) {
            exitFactor = Math.min(1, Math.max(0, (P - 0.58) / 0.06));
            masterAlpha = Math.max(0, 1 - exitFactor);
          }

          storyContainerRef.current.style.opacity = String(masterAlpha);

          // Staggered line animations
          const totalLines = storyLineRefs.current.length;
          storyLineRefs.current.forEach((lineEl, idx) => {
            if (!lineEl) return;
            const lineThreshold = 0.45 + (idx / totalLines) * 0.05;
            const lineP = Math.min(1, Math.max(0, (P - lineThreshold) / 0.03));

            const lineOpacity = lineP * masterAlpha;
            const lineBlur = (1 - lineP) * 8 + exitFactor * 12;
            const lineTranslateY = (1 - lineP) * 20 - exitFactor * 14;

            lineEl.style.opacity = String(lineOpacity);
            lineEl.style.filter = `blur(${lineBlur}px)`;
            lineEl.style.transform = `translate3d(0, ${lineTranslateY}px, 0)`;
          });
        }
      }

      // 4. SCENE 03: CINEMATIC 3RD PAGE TRANSFORMATION (P >= 0.64)
      // Solid opaque overlay with zero bleed or ghosting of canvas/story text
      if (cinematicContainerRef.current) {
        const inRange = P >= 0.64;
        cinematicContainerRef.current.style.display = inRange ? "block" : "none";

        if (inRange) {
          const pReveal = Math.min(1, Math.max(0, (P - 0.64) / 0.03));
          cinematicContainerRef.current.style.opacity = String(pReveal);
          cinematicContainerRef.current.style.pointerEvents = pReveal >= 0.8 ? "auto" : "none";
        }
      }
    };

    // -----------------------------------------------------------------------
    // Snap state for automatic Page 1 ↔ Page 2 transitions
    // -----------------------------------------------------------------------
    // Page 1 animation lives at P = 0.00 → 0.40
    // Page 2 editorial text lives at P = 0.44 → 0.64
    // Snap thresholds: scrolling DOWN past P > 0.38 → snap to P = 0.44
    //                  scrolling UP   past P < 0.46 → snap to P = 0.00
    const SNAP_DOWN_THRESHOLD = 0.38;   // When scrolling down past this P, snap forward
    const SNAP_DOWN_TARGET = 0.44;      // Snap destination (start of Page 2 / story text)
    const SNAP_UP_THRESHOLD = 0.46;     // When scrolling up below this P, snap back
    const SNAP_UP_TARGET = 0.0;         // Snap destination (top of Page 1)

    let isSnapping = false;
    let snapAnimationId: number | null = null;
    let lastScrollP = 0;
    let snapCooldownTimer: ReturnType<typeof setTimeout> | null = null;

    const scrollToP = (targetP: number, duration: number = 800) => {
      const section = sectionRef.current;
      if (!section || isSnapping) return;

      isSnapping = true;

      const scrollableDist = Math.max(1, section.offsetHeight - window.innerHeight);
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const targetScroll = sectionTop + targetP * scrollableDist;
      const startScroll = window.scrollY;
      const distance = targetScroll - startScroll;

      if (Math.abs(distance) < 2) {
        isSnapping = false;
        return;
      }

      const startTime = performance.now();

      // Cubic bezier easing for cinematic feel
      const easeInOutCubic = (t: number): number => {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);

        window.scrollTo(0, startScroll + distance * eased);

        if (progress < 1) {
          snapAnimationId = requestAnimationFrame(animate);
        } else {
          // Snap complete — hold the lock briefly to absorb trackpad momentum
          snapAnimationId = null;
          snapCooldownTimer = setTimeout(() => {
            isSnapping = false;
            snapCooldownTimer = null;
          }, 300);
        }
      };

      snapAnimationId = requestAnimationFrame(animate);
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
        const rawScrollP = -rect.top / scrollableDist;
        const scrollP = Math.min(1, Math.max(0, rawScrollP));

        // Determine which section zone the user is currently in:
        // - "above": Page 1 or Page 2 (rawScrollP < 0.62)
        // - "inside": Page 3 / Cinematic 3rd Page (0.64 <= rawScrollP <= 0.96)
        // - "below": Page 4 / ServicesSection & onwards (rawScrollP > 0.98 or rect.bottom <= window.innerHeight + 40)
        let targetZone: "above" | "inside" | "below" = cinematicZoneRef.current;
        const isPastBottom = rawScrollP > 0.98 || rect.bottom <= window.innerHeight + 40;

        if (rawScrollP < 0.62) {
          targetZone = "above";
        } else if (isPastBottom) {
          targetZone = "below";
        } else if (rawScrollP >= 0.64 && rawScrollP <= 0.96) {
          targetZone = "inside";
        }

        const prevZone = cinematicZoneRef.current;
        if (targetZone === "inside" && prevZone !== "inside") {
          setCinematicKey((k) => k + 1);
          setIsCinematicActive(true);
        } else if (targetZone !== "inside" && prevZone === "inside") {
          setIsCinematicActive(false);
        }

        cinematicZoneRef.current = targetZone;

        const P = scrollP;

        updateVisuals(P);

        // -----------------------------------------------------------------
        // Auto-snap logic: detect transition threshold crossings
        // -----------------------------------------------------------------
        if (!isSnapping) {
          const scrollingDown = P > lastScrollP;
          const scrollingUp = P < lastScrollP;

          // Scrolling DOWN: crossed the end-of-Page-1 threshold → snap to Page 2 start
          if (scrollingDown && P > SNAP_DOWN_THRESHOLD && lastScrollP <= SNAP_DOWN_THRESHOLD) {
            scrollToP(SNAP_DOWN_TARGET, 700);
          }
          // Scrolling UP: dropped below Page 2 start threshold → snap back to Page 1 top
          else if (scrollingUp && P < SNAP_UP_THRESHOLD && lastScrollP >= SNAP_UP_THRESHOLD) {
            scrollToP(SNAP_UP_TARGET, 700);
          }
        }

        lastScrollP = P;
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
      if (snapAnimationId !== null) cancelAnimationFrame(snapAnimationId);
      if (snapCooldownTimer !== null) clearTimeout(snapCooldownTimer);
    };
  }, [renderCanvas, updateCanvasDimensions]);

  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="hero-cinematic"
      className="relative w-full bg-transparent"
      style={{ height: "350vh" }}
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
          className="absolute inset-0 block h-full w-full object-cover bg-[#050505]"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
          aria-hidden="true"
        />

        {/* Atmospheric Left Scrim to guarantee 100% text readability over bright robot highlights & flames */}
        <div
          ref={scrimRef}
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
          {/* Top spacer */}
          <div className="pt-20 md:pt-24" />

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
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 2. PHASE 02: EDITORIAL NARRATIVE STORY TEXT (Frame 97 Hold)        */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={storyContainerRef}
          className="absolute inset-0 z-20 hidden items-center justify-start p-6 md:p-16 lg:p-24 pointer-events-none"
        >
          <div className="max-w-2xl text-left">
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
                        ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.3)] pb-1"
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
        {/* 3. SCENE 03: CINEMATIC 3RD PAGE (Kinetic Typography & 3D WebGL)    */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={cinematicContainerRef}
          className="absolute inset-0 z-30 hidden will-change-opacity pointer-events-auto"
          style={{ opacity: 0 }}
        >
          <CinematicPage
            key={`cinematic-page-${cinematicKey}`}
            isActive={isCinematicActive}
          />
        </div>

        {/* Ambient bottom vignette for smooth transition into next section */}
        <div
          ref={bottomVignetteRef}
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, #0a0a0f, transparent)" }}
        />
      </div>
    </section>
  );
}