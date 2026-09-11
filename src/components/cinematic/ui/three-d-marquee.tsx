import React, { useState, useRef, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MarqueeColumn } from './marquee-column';
import { MarqueeGridLines } from './marquee-grid-line';
import { X } from './icons';

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

export const DEFAULT_MARQUEE_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
];

export const ThreeDMarquee: React.FC<ThreeDMarqueeProps> = ({
  images = DEFAULT_MARQUEE_IMAGES,
  columns = 7,
  className = '',
  cardClassName = '',
  height = '100%',
  gap = 20,
  perspective = 1200,
  rotation = { x: 55, y: 0, z: -45 },
  scale = 1.05,
  animation = {
    duration: 26,
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

  const [rotX, setRotX] = useState<number>(rotation.x ?? 55);
  const [rotY, setRotY] = useState<number>(rotation.y ?? 0);
  const [rotZ, setRotZ] = useState<number>(rotation.z ?? -45);
  const [zoomScale, setZoomScale] = useState<number>(scale);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, startRotX: 55, startRotZ: -45 });
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
    const list = images.length > 0 ? images : DEFAULT_MARQUEE_IMAGES;
    const colCount = Math.max(1, columns);
    const cols: string[][] = Array.from({ length: colCount }, () => []);

    // Ensure each column has at least 8 tiles before duplication (16 tiles total per column)
    // so columns cover the extended vertical canvas completely without any voids
    const minCardsPerColumn = 8;
    const totalSlots = Math.max(list.length, colCount * minCardsPerColumn);

    for (let i = 0; i < totalSlots; i++) {
      const colIdx = i % colCount;
      // Stagger index so adjacent columns don't display the identical row sequences
      const imgIdx = (i * 3 + colIdx * 5) % list.length;
      cols[colIdx].push(list[imgIdx]);
    }

    // Guarantee minimum length per column
    cols.forEach((col, cIdx) => {
      while (col.length < minCardsPerColumn) {
        const offset = (cIdx * 7 + col.length) % list.length;
        col.push(list[offset]);
      }
    });

    const baseDur = animation.duration ?? 26;
    const variations = [0, 5, -3, 6, 2, -4, 4, -2];

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
    const deltaX = (e.clientX - dragStart.x) * 0.25;
    const deltaY = (e.clientY - dragStart.y) * 0.25;

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
        className="relative w-[2400px] h-[2400px] xl:w-[2800px] xl:h-[2800px] flex shrink-0 items-center justify-center will-change-transform preserve-3d"
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
            className="relative max-w-4xl w-full max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-2"
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
            <img
              src={activeModalImage}
              alt="Inspected visual"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl bg-neutral-900"
            />
          </div>
        </div>
      )}
    </div>
  );
};
