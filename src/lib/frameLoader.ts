export type FrameSequence = "hero" | "page2";

export const FILM_PART1_COUNT = 97;
export const FILM_PART2_COUNT = 97;
/** Single continuous film: part 1 (frames 1–97) + part 2 (continues from frame 97). */
export const FRAME_COUNT = FILM_PART1_COUNT + FILM_PART2_COUNT;

export const FRAME_SEQUENCES = {
  hero: { count: FILM_PART1_COUNT, basePath: "/frames" },
  page2: { count: FILM_PART2_COUNT, basePath: "/frames/page2" },
} as const;

export function resolveFilmFrame(globalIndex: number): {
  sequence: FrameSequence;
  localIndex: number;
} {
  if (globalIndex < FILM_PART1_COUNT) {
    return { sequence: "hero", localIndex: globalIndex };
  }
  return { sequence: "page2", localIndex: globalIndex - FILM_PART1_COUNT };
}

function frameUrl(index: number, sequence: FrameSequence): string {
  const meta = FRAME_SEQUENCES[sequence];
  if (!meta) throw new Error(`Unknown frame sequence: ${String(sequence)}`);
  const num = String(index + 1).padStart(4, "0");
  const base = meta.basePath;
  return sequence === "page2"
    ? `${base}/frame_${num}.jpg`
    : `${base}/webp/frame_${num}.webp`;
}

export function filmFrameUrl(globalIndex: number): string {
  const { sequence, localIndex } = resolveFilmFrame(globalIndex);
  return frameUrl(localIndex, sequence);
}

export function sequenceFrameUrl(
  index: number,
  sequence: FrameSequence = "hero",
): string {
  return frameUrl(index, sequence);
}

/** Critical indices that must be loaded before the hero can render.
 * Frame 0 = opening; the last 4 frames of each part anchor the transition
 * between Part 1 and Part 2 and the final reveal. */
export function getCriticalFilmFrameIndices(): number[] {
  const indices = new Set<number>();
  indices.add(0);
  indices.add(FILM_PART1_COUNT - 1);
  for (let i = FILM_PART1_COUNT - 4; i < FILM_PART1_COUNT + 4; i++) {
    if (i >= 0 && i < FRAME_COUNT) indices.add(i);
  }
  for (let i = Math.max(0, FRAME_COUNT - 6); i < FRAME_COUNT; i++) {
    indices.add(i);
  }
  return [...indices].sort((a, b) => a - b);
}

export function getRemainingFilmFrameIndices(): number[] {
  const critical = new Set(getCriticalFilmFrameIndices());
  return Array.from({ length: FRAME_COUNT }, (_, i) => i).filter(
    (i) => !critical.has(i),
  );
}

export function nearestLoadedFrame(
  target: number,
  loaded: Set<number>,
  count: number = FRAME_COUNT,
): number {
  if (loaded.has(target)) return target;
  for (let offset = 1; offset < count; offset++) {
    if (target - offset >= 0 && loaded.has(target - offset)) return target - offset;
    if (target + offset < count && loaded.has(target + offset)) return target + offset;
  }
  return 0;
}

/** Cache key — always keyed by the resolved (sequence, localIndex) pair so
 * page2 frames aren't mistakenly looked up under the hero sequence. */
const frameCache: Map<string, HTMLImageElement> = new Map();
const inflight: Map<string, Promise<HTMLImageElement>> = new Map();

function cacheKey(globalIndex: number, sequence: FrameSequence): string {
  const localIndex =
    sequence === "hero" ? globalIndex : globalIndex - FILM_PART1_COUNT;
  return `${sequence}:${localIndex}`;
}

function resolveAndKey(
  index: number,
  sequence: FrameSequence | "film",
): { sequence: FrameSequence; localIndex: number; key: string; url: string } {
  const resolved =
    sequence === "film"
      ? resolveFilmFrame(index)
      : { sequence, localIndex: index };
  return {
    sequence: resolved.sequence,
    localIndex: resolved.localIndex,
    key: cacheKey(index, resolved.sequence),
    url: frameUrl(resolved.localIndex, resolved.sequence),
  };
}

/** Fetch a frame by global film index (0..193). Auto-routes to the right
 * sequence — first 97 from `/frames/webp/`, the next 96 from `/frames/page2/`. */
export function getFilmFrame(globalIndex: number): Promise<HTMLImageElement> {
  return fetchFrame(globalIndex, "film");
}

/** Fetch a frame from a specific sequence by its local index. */
export function getFrame(
  index: number,
  sequence: FrameSequence = "hero",
): Promise<HTMLImageElement> {
  return fetchFrame(index, sequence);
}

function fetchFrame(
  index: number,
  sequence: FrameSequence | "film",
): Promise<HTMLImageElement> {
  const { key, url } = resolveAndKey(index, sequence);

  const cached = frameCache.get(key);
  if (cached) return Promise.resolve(cached);

  const pending = inflight.get(key);
  if (pending) return pending;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      frameCache.set(key, img);
      inflight.delete(key);
      resolve(img);
    };
    img.onerror = () => {
      inflight.delete(key);
      reject(new Error(`Failed to load frame ${key}`));
    };
    img.src = url;
  });

  inflight.set(key, promise);
  return promise;
}

export function getCachedFilmFrame(globalIndex: number): HTMLImageElement | undefined {
  return frameCache.get(cacheKey(globalIndex, resolveFilmFrame(globalIndex).sequence));
}

export function getCachedFrame(
  index: number,
  sequence: FrameSequence = "hero",
): HTMLImageElement | undefined {
  if (index >= FILM_PART1_COUNT) return undefined;
  return frameCache.get(cacheKey(index, sequence));
}

/** Preload a subset of film frames in parallel. */
export function preloadCriticalFrames(indices: number[]): Promise<void> {
  return Promise.all(indices.map((i) => getFilmFrame(i).catch(() => undefined))).then(
    () => undefined,
  );
}

export interface ProgressiveLoadOptions {
  onProgress?: (loaded: number, total: number) => void;
  onReady?: (frames: HTMLImageElement[], loadedSet: Set<number>) => void;
  batchSize?: number;
}

/** Loads the hero film progressively: critical frames first, then the rest
 * in small batches so the browser never blocks. */
export async function loadFilmFramesProgressive(
  options: ProgressiveLoadOptions = {},
): Promise<{
  frames: HTMLImageElement[];
  loadedSet: Set<number>;
}> {
  const { onProgress, onReady, batchSize } = options;

  const critical = getCriticalFilmFrameIndices();
  const total = FRAME_COUNT;
  const frames: HTMLImageElement[] = new Array(total);
  const loadedSet = new Set<number>();
  let loadedCount = 0;

  const report = () => onProgress?.(loadedCount, total);

  await Promise.all(
    critical.map(async (i) => {
      try {
        const img = await getFilmFrame(i);
        frames[i] = img;
        loadedSet.add(i);
        loadedCount++;
        report();
      } catch {
        /* swallow individual frame failures; canvas will use nearest loaded */
      }
    }),
  );

  onReady?.(frames, loadedSet);

  const remaining = getRemainingFilmFrameIndices();
  const size =
    batchSize ??
    (typeof window !== "undefined" && window.innerWidth <= 768 ? 3 : 5);

  for (let i = 0; i < remaining.length; i += size) {
    const batch = remaining.slice(i, i + size);
    await Promise.all(
      batch.map(async (idx) => {
        try {
          const img = await getFilmFrame(idx);
          frames[idx] = img;
          loadedSet.add(idx);
          loadedCount++;
          report();
        } catch {
          /* ignore */
        }
      }),
    );
  }

  return { frames, loadedSet };
}