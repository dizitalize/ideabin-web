"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TransitionPhase =
  | "idle"
  | "expanding"
  | "holding"
  | "contracting"
  | "done";

interface CenterTransitionContextValue {
  /** Call this to trigger the circle-expand → route → circle-contract sequence */
  trigger: (href: string) => void;
}

const CenterTransitionContext = createContext<CenterTransitionContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook for consuming components
// ---------------------------------------------------------------------------

export function useCenterTransition(): CenterTransitionContextValue {
  const ctx = useContext(CenterTransitionContext);
  if (!ctx) {
    throw new Error("useCenterTransition must be used inside <CenterTransitionProvider>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider + Overlay
// ---------------------------------------------------------------------------

interface Props {
  children: ReactNode;
}

// Initial circle diameter in CSS px (tiny)
const INITIAL_CIRCLE_DIAMETER = 6;

export function CenterTransitionProvider({ children }: Props) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<TransitionPhase>("idle");
  const pendingHrefRef = useRef<string>("");
  const failsafeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [overlayActive, setOverlayActive] = useState(false);

  // Calculates the scale needed to make the circle cover the entire viewport from center
  const calculateCoverScale = (): number => {
    const r = INITIAL_CIRCLE_DIAMETER / 2;
    const diagonal = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);
    // Extra 1.08 safety factor to guarantee corners are always covered
    return (diagonal / r) * 1.08;
  };

  const resetOverlay = useCallback(() => {
    const circle = circleRef.current;
    const overlay = overlayRef.current;
    if (!circle || !overlay) return;

    circle.style.transition = "none";
    circle.style.transform = "translate(-50%, -50%) scale(1)";
    circle.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    phaseRef.current = "idle";
    setOverlayActive(false);

    if (failsafeTimerRef.current) {
      clearTimeout(failsafeTimerRef.current);
      failsafeTimerRef.current = null;
    }
  }, []);

  const trigger = useCallback((href: string) => {
    if (phaseRef.current !== "idle") return;

    pendingHrefRef.current = href;
    phaseRef.current = "expanding";

    const circle = circleRef.current;
    const overlay = overlayRef.current;
    if (!circle || !overlay) {
      // Fallback: navigate directly if overlay not ready
      router.push(href);
      return;
    }

    const scale = calculateCoverScale();

    // Activate overlay to intercept interaction
    overlay.style.pointerEvents = "auto";
    setOverlayActive(true);

    // Start from invisible tiny dot at center
    circle.style.transition = "none";
    circle.style.opacity = "1";
    circle.style.transform = "translate(-50%, -50%) scale(1)";

    // Force layout flush before applying transition
    circle.getBoundingClientRect();

    // Expand: cubic-bezier(0.76, 0, 0.24, 1) — quick acceleration, controlled expansion
    circle.style.transition = `transform 800ms cubic-bezier(0.76, 0, 0.24, 1), opacity 120ms ease`;
    circle.style.transform = `translate(-50%, -50%) scale(${scale})`;

    // Failsafe: always reset after 2000ms to never leave overlay stuck
    failsafeTimerRef.current = setTimeout(() => {
      console.warn("[CenterTransition] Failsafe triggered — resetting overlay");
      resetOverlay();
    }, 2000);

    // After expansion completes → navigate → start contraction
    const onExpanded = () => {
      circle.removeEventListener("transitionend", onExpanded);

      if (phaseRef.current !== "expanding") return;
      phaseRef.current = "holding";

      // Navigate while screen is fully covered
      router.push(pendingHrefRef.current);

      // Brief hold so new page can mount
      setTimeout(() => {
        if (phaseRef.current !== "holding") return;
        phaseRef.current = "contracting";

        circle.style.transition = `transform 700ms cubic-bezier(0.76, 0, 0.24, 1), opacity 200ms ease 500ms`;
        circle.style.transform = "translate(-50%, -50%) scale(1)";

        const onContracted = () => {
          circle.removeEventListener("transitionend", onContracted);
          circle.style.opacity = "0";
          overlay.style.pointerEvents = "none";
          phaseRef.current = "done";
          setOverlayActive(false);

          if (failsafeTimerRef.current) {
            clearTimeout(failsafeTimerRef.current);
            failsafeTimerRef.current = null;
          }

          // Short delay then mark as truly idle
          setTimeout(() => {
            phaseRef.current = "idle";
          }, 100);
        };

        circle.addEventListener("transitionend", onContracted, { once: true });
      }, 200);
    };

    circle.addEventListener("transitionend", onExpanded, { once: true });
  }, [router, resetOverlay]);

  // Handle browser back/forward — reset overlay if a popstate fires while transitioning
  useEffect(() => {
    const handlePopstate = () => {
      if (phaseRef.current !== "idle") {
        resetOverlay();
      }
    };
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [resetOverlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
    };
  }, []);

  return (
    <CenterTransitionContext.Provider value={{ trigger }}>
      {children}

      {/* ----------------------------------------------------------------- */}
      {/* Fixed Transition Overlay                                           */}
      {/* ----------------------------------------------------------------- */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9999] overflow-hidden"
        style={{ pointerEvents: overlayActive ? "auto" : "none" }}
      >
        {/* The expanding circle — starts at dead-center of viewport */}
        <div
          ref={circleRef}
          className="absolute rounded-full"
          style={{
            width: `${INITIAL_CIRCLE_DIAMETER}px`,
            height: `${INITIAL_CIRCLE_DIAMETER}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) scale(1)",
            transformOrigin: "50% 50%",
            background: "#0a0a0a",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      </div>
    </CenterTransitionContext.Provider>
  );
}
