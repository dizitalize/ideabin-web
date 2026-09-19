/**
 * Snap-safe scroll helpers for the home page hero.
 *
 * The hero engine (src/components/sections/Hero.tsx) treats ANY jump into
 * P > 0.38 (P = -rect.top / (sectionHeight - viewportHeight)) as a page-flip
 * while scrolling down, and animates back to P = 0.44. Long programmatic
 * jumps therefore get captured and pulled back to 0.44 * dist.
 *
 * The fix: "anchor-first" arrivals. We first land exactly on P = 0.44 (the
 * engine's own snap target, where its snap becomes a no-op because the
 * distance is < 2px), wait for the engine's rAF read to observe that
 * position, and only then move to the real target — which the engine now
 * sees as an ordinary scroll starting from 0.44, not a page-flip.
 *
 * 0.38 / 0.44 are duplicated from Hero.tsx because its constants are local
 * to a useEffect and cannot be imported. Keep in sync manually.
 */

const SNAP_DOWN_THRESHOLD_P = 0.38;
const SNAP_DOWN_TARGET_P = 0.44;

export interface ArriveOptions {
  /** Animate the final leg (used for on-page nav clicks). Default: instant. */
  smooth?: boolean;
  /**
   * "mount" — arriving right after a page mount, before the hero engine has
   *           read the scroll position (or when the browser restored one).
   * "interactive" — the engine is already tracking scroll (on-page clicks).
   */
  mode?: "mount" | "interactive";
}

export function getHeroScrollDistance(): number {
  if (typeof document === "undefined") return 0;
  const hero = document.getElementById("hero-cinematic");
  if (!hero) return 0;
  const dist = hero.offsetHeight - window.innerHeight;
  return dist > 1 ? dist : 0;
}

/**
 * Resolves a section nav href ("#services", ...) to an absolute scroll target.
 * Returns null when the element is missing and no fallback applies.
 * Mirrors the resolution logic previously inlined in Navbar.handleNavClick.
 */
export function resolveSectionScrollY(href: string): number | null {
  const id = href.replace(/^#/, "");
  let el: HTMLElement | null = null;

  if (id === "projects") {
    el =
      document.getElementById("curved-carousel-section") ||
      document.getElementById("cinematic-3rd-page") ||
      document.getElementById("hero-cinematic");
    if (!el) return window.innerHeight * 1.5;
  } else {
    el = document.getElementById(id);
  }

  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

export function arriveAt(targetY: number, options: ArriveOptions = {}): void {
  const { smooth = false, mode = "interactive" } = options;
  const behavior: ScrollBehavior = smooth ? "smooth" : "auto";

  const dist = getHeroScrollDistance();
  if (dist === 0) {
    window.scrollTo({ top: targetY, behavior });
    return;
  }

  const threshold = dist * SNAP_DOWN_THRESHOLD_P;
  const anchorY = dist * SNAP_DOWN_TARGET_P;
  const currentY = window.scrollY;

  const needsAnchor =
    targetY > threshold &&
    (mode === "mount"
      ? Math.max(currentY, targetY) > threshold
      : currentY <= threshold);

  if (!needsAnchor) {
    window.scrollTo({ top: targetY, behavior });
    return;
  }

  // Step 1: land on the engine's no-op snap target so its next read is a no-crossing read.
  window.scrollTo(0, anchorY);
  // Step 2: skip one frame (the engine's rAF read) before travelling to the real target.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior });
    });
  });
}

// ---------------------------------------------------------------------------
// One-shot pending-section handoff between Navbar (other routes) and the
// home page mount (HomeArrival). Module state survives client-side navigation.
// ---------------------------------------------------------------------------

let pendingSectionHref: string | null = null;

export function setPendingSection(href: string): void {
  pendingSectionHref = href.startsWith("#") ? href : `#${href}`;
}

export function consumePendingSection(): string | null {
  const href = pendingSectionHref;
  pendingSectionHref = null;
  return href;
}
