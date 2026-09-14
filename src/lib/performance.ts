"use client";

import { useEffect, useRef, useState } from "react";

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

/**
 * Focus trap utility for modals
 * Returns an object with refs and handlers to trap focus within an element
 */
export function useFocusTrap() {
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

// Save previously focused element
        previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    // Get all focusable elements within the container
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(',');
    
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors);
    focusableElementsRef.current = Array.from(focusableElements).filter(
      el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
    );

    // Focus the first element if any exist
    if (focusableElementsRef.current.length > 0) {
      focusableElementsRef.current[0].focus();
    }

    // Handle keydown events to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (focusableElementsRef.current.length === 0) {
        e.preventDefault();
        return;
      }

      const isShiftPressed = e.shiftKey;
      const focusedIndex = focusableElementsRef.current.indexOf(
        document.activeElement as HTMLElement
      );

      if (focusedIndex === -1) {
        focusableElementsRef.current[0].focus();
        e.preventDefault();
        return;
      }

      if (isShiftPressed && focusedIndex === 0) {
        focusableElementsRef.current[
          focusableElementsRef.current.length - 1
        ].focus();
        e.preventDefault();
      } else if (!isShiftPressed && focusedIndex === focusableElementsRef.current.length - 1) {
        focusableElementsRef.current[0].focus();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [enabled, containerRef]);

  return { containerRef, setEnabled: setEnabled };
}
