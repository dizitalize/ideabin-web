/**
 * 3D Cinematic Scroll Frame Sequence Engine
 * Manages dual-sequence caching, priority preloading, and nearest-loaded fallback
 * for Page 1 (/page1/frame_0001.webp - frame_0097.webp) and
 * Page 2 (/page2/frame_0002.webp - frame_0097.webp).
 */

export const PAGE1_FRAME_COUNT = 97;
export const PAGE1_PATH = "/page1/frame_";

export const PAGE2_START_FRAME = 2; // Page 2 starts at frame_0002.webp
export const PAGE2_END_FRAME = 97;
export const PAGE2_FRAME_COUNT = 96; // 96 frames from 0002 to 0097
export const PAGE2_PATH = "/page2/frame_";

export const EXTENSION = ".webp";

// Backwards-compatibility aliases
export const FRAME_COUNT = PAGE1_FRAME_COUNT;

export function formatNumber(num: number): string {
  return String(num).padStart(4, "0");
}

export function formatFrameNumber(index: number): string {
  const frameNum = Math.max(1, Math.min(PAGE1_FRAME_COUNT, index + 1));
  return formatNumber(frameNum);
}

export function getPage1Url(index: number): string {
  // index is 0-based: 0 -> frame_0001.webp, 96 -> frame_0097.webp
  const frameNum = Math.max(1, Math.min(PAGE1_FRAME_COUNT, index + 1));
  return `${PAGE1_PATH}${formatNumber(frameNum)}${EXTENSION}`;
}

export const getFrameUrl = getPage1Url;

export function getPage2Url(frameNumber: number): string {
  // frameNumber is 2-based: 2 -> frame_0002.webp, 97 -> frame_0097.webp
  const frameNum = Math.max(PAGE2_START_FRAME, Math.min(PAGE2_END_FRAME, frameNumber));
  return `${PAGE2_PATH}${formatNumber(frameNum)}${EXTENSION}`;
}

// Caches for Page 1 and Page 2
const page1Cache = new Map<number, HTMLImageElement>();
const page1Inflight = new Map<number, Promise<HTMLImageElement>>();

const page2Cache = new Map<number, HTMLImageElement>();
const page2Inflight = new Map<number, Promise<HTMLImageElement>>();

/**
 * Loads a single Page 1 frame (index 0 to 96)
 */
export function loadPage1Frame(index: number): Promise<HTMLImageElement> {
  const clamped = Math.max(0, Math.min(PAGE1_FRAME_COUNT - 1, index));

  const cached = page1Cache.get(clamped);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  const inflight = page1Inflight.get(clamped);
  if (inflight) return inflight;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      page1Cache.set(clamped, img);
      page1Inflight.delete(clamped);
      resolve(img);
    };
    img.onerror = () => {
      page1Inflight.delete(clamped);
      reject(new Error(`Failed to load page 1 frame ${clamped}`));
    };
    img.src = getPage1Url(clamped);
  });

  page1Inflight.set(clamped, promise);
  return promise;
}

export const loadFrame = loadPage1Frame;

/**
 * Loads a single Page 2 frame (frameNumber 2 to 97)
 */
export function loadPage2Frame(frameNumber: number): Promise<HTMLImageElement> {
  const clamped = Math.max(PAGE2_START_FRAME, Math.min(PAGE2_END_FRAME, frameNumber));

  const cached = page2Cache.get(clamped);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  const inflight = page2Inflight.get(clamped);
  if (inflight) return inflight;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      page2Cache.set(clamped, img);
      page2Inflight.delete(clamped);
      resolve(img);
    };
    img.onerror = () => {
      page2Inflight.delete(clamped);
      reject(new Error(`Failed to load page 2 frame ${clamped}`));
    };
    img.src = getPage2Url(clamped);
  });

  page2Inflight.set(clamped, promise);
  return promise;
}

export function getCachedPage1Frame(index: number): HTMLImageElement | undefined {
  return page1Cache.get(index);
}

export const getCachedFrame = getCachedPage1Frame;

export function getCachedPage2Frame(frameNumber: number): HTMLImageElement | undefined {
  return page2Cache.get(frameNumber);
}

/**
 * P0: Loads Page 1 frame_0001.webp immediately for First Paint.
 */
export function preloadFirstFrame(): Promise<HTMLImageElement> {
  return loadPage1Frame(0);
}

/**
 * P1: Loads Page 1 frames 0002 to 0012 for initial scroll runway.
 */
export function preloadRunwayFrames(): Promise<void> {
  const promises: Promise<HTMLImageElement>[] = [];
  for (let i = 1; i < Math.min(12, PAGE1_FRAME_COUNT); i++) {
    promises.push(loadPage1Frame(i));
  }
  return Promise.allSettled(promises).then(() => undefined);
}

/**
 * Preload surrounding frames dynamically around target
 */
export function preloadSurroundingPage1(centerIndex: number, radius = 5): void {
  const start = Math.max(0, centerIndex - radius);
  const end = Math.min(PAGE1_FRAME_COUNT - 1, centerIndex + radius);
  for (let i = start; i <= end; i++) {
    if (!page1Cache.has(i) && !page1Inflight.has(i)) {
      void loadPage1Frame(i).catch(() => {});
    }
  }
}

export const preloadSurroundingFrames = preloadSurroundingPage1;

export function preloadSurroundingPage2(centerFrame: number, radius = 5): void {
  const start = Math.max(PAGE2_START_FRAME, centerFrame - radius);
  const end = Math.min(PAGE2_END_FRAME, centerFrame + radius);
  for (let i = start; i <= end; i++) {
    if (!page2Cache.has(i) && !page2Inflight.has(i)) {
      void loadPage2Frame(i).catch(() => {});
    }
  }
}

/**
 * Preload the transition critical frames (Page 1 end + Page 2 beginning)
 */
export function preloadTransitionRunway(): void {
  // Page 1 final frames 90–96
  for (let i = 90; i < PAGE1_FRAME_COUNT; i++) {
    if (!page1Cache.has(i) && !page1Inflight.has(i)) {
      void loadPage1Frame(i).catch(() => {});
    }
  }
  // Page 2 transition frames 2–28
  for (let f = PAGE2_START_FRAME; f <= 28; f++) {
    if (!page2Cache.has(f) && !page2Inflight.has(f)) {
      void loadPage2Frame(f).catch(() => {});
    }
  }
}

/**
 * Progressively preloads all remaining frames in non-blocking idle chunks
 */
export function preloadAllSequences(
  onLoaded?: (page: 1 | 2, id: number) => void
): () => void {
  let cancelled = false;

  const queue: { page: 1 | 2; id: number }[] = [];

  for (let i = 0; i < PAGE1_FRAME_COUNT; i++) {
    if (!page1Cache.has(i)) queue.push({ page: 1, id: i });
  }

  for (let f = PAGE2_START_FRAME; f <= 28; f++) {
    if (!page2Cache.has(f)) queue.push({ page: 2, id: f });
  }

  for (let f = 29; f <= PAGE2_END_FRAME; f++) {
    if (!page2Cache.has(f)) queue.push({ page: 2, id: f });
  }

  const batchSize = 4;
  let currentIndex = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  function loadNextBatch() {
    if (cancelled || currentIndex >= queue.length) return;

    const batch = queue.slice(currentIndex, currentIndex + batchSize);
    currentIndex += batchSize;

    Promise.allSettled(
      batch.map(async (item) => {
        try {
          if (item.page === 1) {
            await loadPage1Frame(item.id);
          } else {
            await loadPage2Frame(item.id);
          }
          if (!cancelled) onLoaded?.(item.page, item.id);
        } catch {
          // ignore individual failures
        }
      })
    ).then(() => {
      if (!cancelled && currentIndex < queue.length) {
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNextBatch);
        } else {
          timerId = setTimeout(loadNextBatch, 25);
        }
      }
    });
  }

  loadNextBatch();

  return () => {
    cancelled = true;
    if (timerId) clearTimeout(timerId);
  };
}

export const preloadRemainingFrames = preloadAllSequences;

/**
 * Returns nearest loaded frame for Page 1 (index 0 to 96)
 */
export function getNearestLoadedPage1(target: number, loaded: Set<number>): number {
  if (loaded.has(target)) return target;
  for (let offset = 1; offset < PAGE1_FRAME_COUNT; offset++) {
    const prev = target - offset;
    if (prev >= 0 && loaded.has(prev)) return prev;
    const next = target + offset;
    if (next < PAGE1_FRAME_COUNT && loaded.has(next)) return next;
  }
  return 0;
}

export const getNearestLoadedFrame = getNearestLoadedPage1;

/**
 * Returns nearest loaded frame for Page 2 (frame 2 to 97)
 */
export function getNearestLoadedPage2(target: number, loaded: Set<number>): number {
  if (loaded.has(target)) return target;
  for (let offset = 1; offset <= PAGE2_FRAME_COUNT; offset++) {
    const prev = target - offset;
    if (prev >= PAGE2_START_FRAME && loaded.has(prev)) return prev;
    const next = target + offset;
    if (next <= PAGE2_END_FRAME && loaded.has(next)) return next;
  }
  return PAGE2_START_FRAME;
}
