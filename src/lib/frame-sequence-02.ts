/**
 * 3D Cinematic Scroll Frame Sequence Engine for Scene 02
 * Manages caching, priority-tiered preloading, and nearest-loaded fallback
 * for the 97-frame sequence in /page2/frame_0001.webp - frame_0097.webp.
 */

export const FRAME_COUNT = 97;
export const FRAME_PATH = "/page2/frame_";
export const EXTENSION = ".webp";

export function formatFrameNumber(index: number): string {
  // index is 0-based (0 -> "0001", 96 -> "0097")
  const frameNum = Math.max(1, Math.min(FRAME_COUNT, index + 1));
  return String(frameNum).padStart(4, "0");
}

export function getFrameUrl(index: number): string {
  return `${FRAME_PATH}${formatFrameNumber(index)}${EXTENSION}`;
}

const frameCache = new Map<number, HTMLImageElement>();
const inflightPromises = new Map<number, Promise<HTMLImageElement>>();

/**
 * Loads a single frame into memory with caching and in-flight deduplication.
 */
export function loadFrame(index: number): Promise<HTMLImageElement> {
  const clampedIndex = Math.max(0, Math.min(FRAME_COUNT - 1, index));

  const cached = frameCache.get(clampedIndex);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  const inflight = inflightPromises.get(clampedIndex);
  if (inflight) {
    return inflight;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";

    img.onload = () => {
      frameCache.set(clampedIndex, img);
      inflightPromises.delete(clampedIndex);
      resolve(img);
    };

    img.onerror = () => {
      inflightPromises.delete(clampedIndex);
      reject(new Error(`Failed to load frame ${clampedIndex} at ${img.src}`));
    };

    img.src = getFrameUrl(clampedIndex);
  });

  inflightPromises.set(clampedIndex, promise);
  return promise;
}

/**
 * P0: Loads frame_0001.webp immediately for First Paint.
 */
export function preloadFirstFrame(): Promise<HTMLImageElement> {
  return loadFrame(0);
}

/**
 * P1: Loads frames 0002 to 0010 (indices 1 to 9) for initial scroll runway.
 */
export function preloadRunwayFrames(): Promise<void> {
  const runwayIndices: number[] = [];
  for (let i = 1; i < Math.min(10, FRAME_COUNT); i++) {
    runwayIndices.push(i);
  }
  return Promise.allSettled(runwayIndices.map((i) => loadFrame(i))).then(() => undefined);
}

/**
 * P2: Preload frames around current scrub position to ensure stutter-free scrubbing.
 */
export function preloadSurroundingFrames(centerIndex: number, windowRadius = 4): void {
  const start = Math.max(0, centerIndex - windowRadius);
  const end = Math.min(FRAME_COUNT - 1, centerIndex + windowRadius);
  for (let i = start; i <= end; i++) {
    if (!frameCache.has(i) && !inflightPromises.has(i)) {
      void loadFrame(i).catch(() => {
        /* silent fallback */
      });
    }
  }
}

/**
 * P3: Progressively preloads all remaining frames in non-blocking background batches.
 * Returns a cleanup/cancellation function.
 */
export function preloadRemainingFrames(
  onFrameLoaded?: (index: number, totalLoaded: number, totalFrames: number) => void
): () => void {
  let cancelled = false;

  const remainingIndices: number[] = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    if (!frameCache.has(i)) {
      remainingIndices.push(i);
    }
  }

  const batchSize = 4;
  let currentIndex = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  function loadNextBatch() {
    if (cancelled || currentIndex >= remainingIndices.length) {
      return;
    }

    const batch = remainingIndices.slice(currentIndex, currentIndex + batchSize);
    currentIndex += batchSize;

    Promise.allSettled(
      batch.map(async (idx) => {
        try {
          await loadFrame(idx);
          if (!cancelled) {
            onFrameLoaded?.(idx, frameCache.size, FRAME_COUNT);
          }
        } catch {
          // ignore individual failures, fallback will handle
        }
      })
    ).then(() => {
      if (!cancelled && currentIndex < remainingIndices.length) {
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

/**
 * Returns the nearest loaded frame index if requested index hasn't finished loading.
 * Guarantees that the canvas will NEVER render blank or flash.
 */
export function getNearestLoadedFrame(
  targetIndex: number,
  loadedIndices: Set<number>
): number {
  if (loadedIndices.has(targetIndex)) {
    return targetIndex;
  }

  // Search outward symmetrically
  for (let offset = 1; offset < FRAME_COUNT; offset++) {
    const prev = targetIndex - offset;
    if (prev >= 0 && loadedIndices.has(prev)) {
      return prev;
    }
    const next = targetIndex + offset;
    if (next < FRAME_COUNT && loadedIndices.has(next)) {
      return next;
    }
  }

  return 0;
}

export function getCachedFrame(index: number): HTMLImageElement | undefined {
  return frameCache.get(index);
}