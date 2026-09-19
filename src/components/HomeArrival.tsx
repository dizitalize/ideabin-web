"use client";

import { useEffect } from "react";
import {
  arriveAt,
  consumePendingSection,
  resolveSectionScrollY,
} from "@/lib/hero-scroll";

const SCROLL_KEY = "home-scroll-y";

/**
 * Mounted before the hero so its effect runs (and its scroll restore lands)
 * before the hero engine reads the scroll position for the first time.
 * Order of arrivals: pending section nav > URL hash > last stored position.
 */
export default function HomeArrival() {
  useEffect(() => {
    let cancelled = false;
    let userInterrupted = false;
    const timers: number[] = [];

    const markInterrupted = () => {
      userInterrupted = true;
    };
    window.addEventListener("wheel", markInterrupted, { passive: true });
    window.addEventListener("touchstart", markInterrupted, { passive: true });
    window.addEventListener("keydown", markInterrupted);

    const pending = consumePendingSection();
    const hashId = window.location.hash.replace(/^#/, "");

    if (pending) {
      const y = resolveSectionScrollY(pending);
      if (y !== null) arriveAt(y, { mode: "mount" });
    } else if (hashId) {
      const el = document.getElementById(hashId);
      if (el) {
        arriveAt(el.getBoundingClientRect().top + window.scrollY, { mode: "mount" });
      } else {
        // Element can appear late (lazy mount); retry twice.
        const retry = (delay: number, attempt: number) => {
          timers.push(
            window.setTimeout(() => {
              if (cancelled || userInterrupted) return;
              const target = document.getElementById(hashId);
              if (!target) {
                if (attempt < 2) retry(delay * 2, attempt + 1);
                return;
              }
              arriveAt(target.getBoundingClientRect().top + window.scrollY, { mode: "mount" });
            }, delay)
          );
        };
        retry(350, 0);
      }
    } else {
      let saved = 0;
      try {
        saved = Number(sessionStorage.getItem(SCROLL_KEY) ?? "0");
      } catch {
        saved = 0;
      }
      if (Number.isFinite(saved) && saved > 2) {
        arriveAt(saved, { mode: "mount" });
      }
    }

    // Continuously remember where the user left off on the home page.
    let rafId = 0;
    let lastSaved = -1;
    const record = () => {
      rafId = 0;
      const y = window.scrollY;
      if (Math.abs(y - lastSaved) < 1) return;
      lastSaved = y;
      try {
        sessionStorage.setItem(SCROLL_KEY, String(y));
      } catch {
        /* storage unavailable — position memory is best-effort */
      }
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(record);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    record();

    return () => {
      cancelled = true;
      window.removeEventListener("wheel", markInterrupted);
      window.removeEventListener("touchstart", markInterrupted);
      window.removeEventListener("keydown", markInterrupted);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return null;
}
