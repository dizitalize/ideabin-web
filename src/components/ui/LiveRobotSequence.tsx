"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFrame, type FrameSequence } from "@/lib/frameLoader";
import { getMaxDpr, prefersReducedMotion } from "@/lib/performance";

interface LiveRobotSequenceProps {
  startFrame?: number;
  endFrame?: number;
  sequenceType?: FrameSequence;
  fps?: number;
  autoPlay?: boolean;
  scrubOnScroll?: boolean;
  className?: string;
}

export default function LiveRobotSequence({
  startFrame = 1,
  endFrame = 40,
  sequenceType = "hero",
  fps = 24,
  autoPlay = true,
  scrubOnScroll = false,
  className = "relative h-full w-full",
}: LiveRobotSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const animIdRef = useRef<number | null>(null);
  const isInViewRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const totalFrames = Math.max(1, endFrame - startFrame + 1);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    let cancelled = false;

    const needed: (HTMLImageElement | undefined)[] = new Array(totalFrames);
    const promises: Promise<void>[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const idx = startFrame + i;
      const p = getFrame(idx, sequenceType)
        .then((img) => {
          if (cancelled) return;
          needed[i] = img;
        })
        .catch(() => {
          /* ignore */
        });
      promises.push(p);
    }

    Promise.all(promises).then(() => {
      if (cancelled) return;
      imagesRef.current = needed as HTMLImageElement[];
      if (needed.every((img) => img && img.complete)) setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [startFrame, endFrame, sequenceType, totalFrames]);

  const drawFrame = useCallback(
    (frameIdx: number) => {
      const canvas = canvasRef.current;
      const images = imagesRef.current;
      if (!canvas || images.length === 0) return;

      const clampedIdx = Math.max(0, Math.min(images.length - 1, frameIdx));
      const img = images[clampedIdx];
      if (!img || !img.complete || !img.naturalWidth) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = getMaxDpr();
      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW: number;
      let drawH: number;

      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }

      ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
    },
    [],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = getMaxDpr();
    const rect = container.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 400;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = performance.now();
    const frameInterval = 1000 / fps;

    const tick = (now: number) => {
      if (isInViewRef.current && autoPlay && !scrubOnScroll && !reduced) {
        const delta = now - lastTime;
        if (delta >= frameInterval) {
          lastTime = now - (delta % frameInterval);
          currentFrameRef.current = (currentFrameRef.current + 1) % totalFrames;
          drawFrame(currentFrameRef.current);
        }
      }
      animIdRef.current = requestAnimationFrame(tick);
    };

    if (autoPlay && !scrubOnScroll) {
      animIdRef.current = requestAnimationFrame(tick);
    }

    const handleScroll = () => {
      if (!scrubOnScroll || !containerRef.current || !isInViewRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (winH - rect.top) / (winH + rect.height)));
      const frameIdx = Math.floor(progress * (totalFrames - 1));
      if (frameIdx !== currentFrameRef.current) {
        currentFrameRef.current = frameIdx;
        drawFrame(frameIdx);
      }
    };

    if (scrubOnScroll) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loaded, autoPlay, scrubOnScroll, fps, totalFrames, drawFrame, resizeCanvas, reduced]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40" aria-hidden>
          <div className="h-2 w-2 animate-ping rounded-full bg-[#417B5A]" />
        </div>
      )}
    </div>
  );
}