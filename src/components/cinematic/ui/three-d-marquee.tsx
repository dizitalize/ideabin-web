import React, { useState, useRef, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MarqueeColumn } from './marquee-column';
import { MarqueeGridLines } from './marquee-grid-line';
import { X } from './icons';
import { CAROUSEL_VIDEOS, FRAMER_MEDIA, OPTIMIZED_MARQUEE_MEDIA } from '../data/mediaData';

export interface ThreeDMarqueeProps {
  images?: string[];
  columns?: number;
  className?: string;
  cardClassName?: string;
  height?: string;
  gap?: number;
  perspective?: number;
  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };
  scale?: number;
  animation?: {
    distance?: number;
    duration?: number;
    reverse?: boolean;
  };
  hoverLift?: number;
  showGridLines?: boolean;
  autoScroll?: boolean;
  interactive?: boolean;
  onCardClick?: (index: number, image: string) => void;
  transitionProgress?: number;
  transitionType?: 'zoom-in' | 'zoom-out';
  isDark?: boolean;
}

export const DEFAULT_MARQUEE_MEDIA: string[] = OPTIMIZED_MARQUEE_MEDIA;
export const DEFAULT_MARQUEE_VIDEOS: string[] = DEFAULT_MARQUEE_MEDIA;

export const ThreeDMarquee: React.FC<ThreeDMarqueeProps> = ({
  images = DEFAULT_MARQUEE_MEDIA,
  columns = 4,
  className = '',
  cardClassName = '',
  height = '100%',
  gap = 24,
  perspective = 1100,
  rotation = { x: 48, y: 0, z: -28 },
  scale = 1.02,
  animation = {
    duration: 28,
    reverse: false,
  },
  hoverLift = 14,
  showGridLines = true,
  interactive = true,
  onCardClick,
  transitionProgress = 0,
  transitionType = 'zoom-out',
  isDark = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [rotX, setRotX] = useState<number>(rotation.x ?? 48);
  const [rotY, setRotY] = useState<number>(rotation.y ?? 0);
  const [rotZ, setRotZ] = useState<number>(rotation.z ?? -28);
  const [zoomScale, setZoomScale] = useState<number>(scale);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, startRotX: 48, startRotZ: -28 });
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  useEffect(() => {
    if (rotation.x !== undefined) setRotX(rotation.x);
    if (rotation.y !== undefined) setRotY(rotation.y);
    if (rotation.z !== undefined) setRotZ(rotation.z);
  }, [rotation.x, rotation.y, rotation.z]);

  useEffect(() => {
    if (scale !== undefined) setZoomScale(scale);
  }, [scale]);

  const columnData = useMemo(() => {
    const list = images.length > 0 ? images : DEFAULT_MARQUEE_VIDEOS;
    const colCount = Math.max(1, columns);
    const cols: string[][] = Array.from({ length: colCount }, () => []);

    // 5 cards per column (10 total when duplicated in marquee-column)
    // covers 3200px+ height effortlessly while avoiding browser video thread congestion
    const minCardsPerColumn = 5;
    const totalSlots = Math.max(list.length, colCount * minCardsPerColumn);

    for (let i = 0; i < totalSlots; i++) {
      const colIdx = i % colCount;
      const imgIdx = (i * 2 + colIdx * 3) % list.length;
      cols[colIdx].push(list[imgIdx]);
    }

    // Guarantee minimum length per column
    cols.forEach((col, cIdx) => {
      while (col.length < minCardsPerColumn) {
        const offset = (cIdx * 3 + col.length) % list.length;
        col.push(list[offset]);
      }
    });

    const baseDur = animation.duration ?? 28;
    const variations = [0, 4, -3, 5, 2, -4, 3, -2];

    return cols.map((colImages, idx) => {
      const isEven = idx % 2 === 0;
      const initialDirection: 'up' | 'down' = isEven ? 'up' : 'down';
      const direction = animation.reverse ? (initialDirection === 'up' ? 'down' : 'up') : initialDirection;
      const duration = Math.max(18, baseDur + (variations[idx % variations.length] || 3));

      return {
        images: colImages,
        direction,
        duration,
      };
    });
  }, [images, columns, animation.duration, animation.reverse]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      startRotX: rotX,
      startRotZ: rotZ,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    const deltaX = (e.clientX - dragStart.x) * 0.35;
    const deltaY = (e.clientY - dragStart.y) * 0.35;

    setRotZ(dragStart.startRotZ + deltaX);
    setRotX(Math.max(20, Math.min(80, dragStart.startRotX - deltaY)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (idx: number, src: string) => {
    if (onCardClick) {
      onCardClick(idx, src);
    } else {
      setActiveModalImage(src);
    }
  };

const t = Math.max(0, Math.min(1, transitionProgress));
   // Improved easing for more natural motion
   const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

   // Determine direction based on transitionType
   const isZoomIn = transitionType === 'zoom-in';
   const zoomDirection = isZoomIn ? 1 : -1;
   const rotationDirection = isZoomIn ? 1 : -1;

   let activeRotX = rotX;
   const activeRotY = rotY;
   let activeRotZ = rotZ;
   let activeScale = zoomScale;
   let activeTranslateZ = 0;
   let activeOpacity = 1;
   let activeBlur = 0;

   if (t > 0) {
     // Refined cinematic motion based on transition type:
     // zoom-in: starts farther out, moves inward
     // zoom-out: starts closer, moves outward
     const baseRotX = isZoomIn ? 58 : 38;  // Different starting rotations
     const baseRotZ = isZoomIn ? -18 : -38; // Different starting Z rotations
     const baseScale = isZoomIn ? 0.7 : 1.2; // Different starting scales
     const baseTranslateZ = isZoomIn ? 1500 : 300; // Different starting Z positions
     
     activeRotX = baseRotX + (rotX - baseRotX) * ease;
     activeRotZ = baseRotZ + (rotZ - baseRotZ) * ease * 0.8;
     activeScale = baseScale + (zoomScale - baseScale) * ease;
     activeTranslateZ = baseTranslateZ + (0 - baseTranslateZ) * ease;
     activeBlur = ease * 3 * (isZoomIn ? 1 : 0.5); // Less blur for zoom-out

     // Improved crossfade: longer visibility period with smoother transition
     const fadeStart = isZoomIn ? 0.05 : 0.1;
     const fadeDuration = isZoomIn ? 0.8 : 0.7;
     const fadeT = Math.max(0, Math.min(1, (t - fadeStart) / fadeDuration));
     const smoothFade = fadeT * fadeT * (3 - 2 * fadeT);
     activeOpacity = Math.max(0, 1 - smoothFade);
   }

  return (
    <div
      ref={containerRef}
      id="three-d-marquee-viewport"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn(
        'relative w-full overflow-hidden flex items-center justify-center select-none',
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-neutral-900',
        isDragging ? 'cursor-grabbing' : interactive ? 'cursor-grab' : 'cursor-default',
        className
      )}
      style={{
        height,
        perspective: `${perspective}px`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 96% 92% at 50% 50%, transparent 72%, rgba(0, 0, 0, 0.7) 100%)`
            : `radial-gradient(ellipse 96% 92% at 50% 50%, transparent 72%, rgba(249, 250, 251, 0.7) 100%)`,
        }}
      />

      <div
        id="three-d-marquee-world"
        className="relative w-[2200px] h-[2200px] sm:w-[2500px] sm:h-[2500px] xl:w-[2800px] xl:h-[2800px] flex shrink-0 items-center justify-center will-change-transform preserve-3d"
        style={{
          transform: `rotateX(${activeRotX}deg) rotateY(${activeRotY}deg) rotateZ(${activeRotZ}deg) translateZ(${activeTranslateZ}px) scale(${activeScale})`,
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          opacity: activeOpacity,
          filter: activeBlur > 0.05 ? `blur(${activeBlur.toFixed(1)}px)` : undefined,
          pointerEvents: activeOpacity < 0.05 ? 'none' : undefined,
          transition: isDragging || t > 0 ? 'none' : 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {showGridLines && <MarqueeGridLines isDark={isDark} columns={columns} gap={gap} />}

        <div
          id="three-d-marquee-columns-container"
          className="relative w-full h-full flex items-center justify-center overflow-visible z-1 preserve-3d"
          style={{
            gap: `${gap}px`,
          }}
        >
          {columnData.map((col, cIdx) => (
            <MarqueeColumn
              key={`marquee-col-${cIdx}`}
              columnIndex={cIdx}
              totalColumns={columnData.length}
              images={col.images}
              direction={col.direction}
              duration={col.duration}
              gap={gap}
              hoverLift={hoverLift}
              cardClassName={cardClassName}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {activeModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[85vh] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => setActiveModalImage(null)}
                className="p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {activeModalImage.endsWith('.mp4') || activeModalImage.includes('/carouselvideos/') ? (
              <video
                src={activeModalImage}
                autoPlay
                loop
                controls
                playsInline
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl bg-black"
              />
            ) : (
              <img
                src={activeModalImage}
                alt="Inspected visual"
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl bg-neutral-900"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
