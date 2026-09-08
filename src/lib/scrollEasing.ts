/** Maps scroll progress (0–1) within the frame zone to frame index progress with 1:1 responsive speed. */
export function mapScrollProgress(raw: number): number {
  return Math.min(1, Math.max(0, raw));
}

/** Frames finish at FRAME_ZONE; after that the last frame is held for text reveals. */
export const FRAME_ZONE = 0.68;

export function progressToFrame(progress: number, frameCount: number): number {
  if (progress >= FRAME_ZONE) return frameCount - 1;

  const scaled = progress / FRAME_ZONE;
  const mapped = mapScrollProgress(scaled);
  return Math.min(frameCount - 1, Math.floor(mapped * frameCount));
}
