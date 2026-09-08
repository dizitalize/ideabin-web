"use client";

import { useEffect, useState } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hydration-safe React hook for prefers-reduced-motion.
 * Always initializes to false on server and during initial client render,
 * then updates after mount to prevent SSR hydration mismatches.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

export function getMaxDpr(): number {
  if (typeof window === "undefined") return 1;
  if (prefersReducedMotion() || isMobileDevice()) return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

export function shouldUseSmoothScroll(): boolean {
  return !prefersReducedMotion() && !isMobileDevice();
}

export function shouldUseHeavyEffects(): boolean {
  return isFinePointer() && !prefersReducedMotion();
}
