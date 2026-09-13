import React, { useState, useRef, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MarqueeColumn } from './marquee-column';
import { MarqueeGridLines } from './marquee-grid-line';
import { X } from './icons';
import { CAROUSEL_VIDEOS, FRAMER_MEDIA } from '../data/mediaData';

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

export const DEFAULT_MARQUEE_MEDIA: string[] = [
  ...CAROUSEL_VIDEOS,
  'https://framerusercontent.com/images/FoyA9guBxpmhcqDLHhVuq1MKg.jpeg?width=1792&height=2400',
  'https://images.unsplash.com/photo-1608248597359-25f0a8d46158?q=80&w=1792&auto=format&fit=crop',
  'https://framerusercontent.com/images/jFKA626JR3qumtUOVF1bcDhoKtU.jpeg?width=1792&height=2400',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1792&auto=format&fit=crop',
  'https://framerusercontent.com/images/D6nJ6lPFbF30aB3djXQhFXXA.jpeg?width=1792&height=2400',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1792&auto=format&fit=crop',
  'https://framerusercontent.com/images/zpSB8VO8tkc3tcRFU9zLGP3pNs.jpeg?width=1792&height=2400',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1792&auto=format&fit=crop',
  'https://framerusercontent.com/images/qRdKj75WgpZO8ehkpmFb3y9R7XQ.jpeg?width=1792&height=2400',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1792&auto=format&fit=crop',
];

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
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let activeRotX = rotX;
  const activeRotY = rotY;
  let activeRotZ = rotZ;
  let activeScale = zoomScale;
  let activeTranslateZ = 0;
  let activeOpacity = 1;
  let activeBlur = 0;

  if (t > 0) {
    // Continuous cinematic forward dive-through motion:
    // Camera dives through marquee cards as they level out, expand past the screen edges, and gently blur past
    activeRotX = rotX + (10 - rotX) * ease;
    activeRotZ = rotZ + (0 - rotZ) * ease;
    activeScale = zoomScale * (1 + 0.95 * ease);
    activeTranslateZ = 1250 * ease;
    activeBlur = ease * 6;

    // Smoothstep crossfade: stays full until t=0.15, dissolves smoothly to 0 by t=0.82
    const fadeT = Math.max(0, Math.min(1, (t - 0.15) / 0.67));
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
        className="relative w-[3000px] h-[3000px] xl:w-[3600px] xl:h-[3600px] 2xl:w-[4000px] 2xl:h-[4000px] flex shrink-0 items-center justify-center will-change-transform preserve-3d"
        style={{
          transform: `rotateX(${activeRotX}deg) rotateY(${activeRotY}deg) rotateZ(${activeRotZ}deg) translateZ(${activeTranslateZ}px) scale(${activeScale})`,
          transformOrigin: 'center center',
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
