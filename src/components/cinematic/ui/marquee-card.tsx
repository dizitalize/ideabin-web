import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface MarqueeCardProps {
  src: string;
  alt?: string;
  className?: string;
  hoverLift?: number;
  onClick?: () => void;
  index?: number;
}

export const MarqueeCard: React.FC<MarqueeCardProps> = ({
  src,
  alt = 'Gallery item',
  className = '',
  hoverLift = 12,
  onClick,
  index = 0,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  const isVideo =
    src.endsWith('.mp4') ||
    src.endsWith('.webm') ||
    src.includes('/carouselvideos/') ||
    src.includes('.mp4?');

  useEffect(() => {
    if (!isVideo) return;
    const cardEl = cardRef.current;
    if (!cardEl) return;

    // Viewport-aware observer: pause videos that scroll out of view,
    // only play those near/in viewport. This avoids exceeding hardware video decoders and fixes hanging.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => { });
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0.05 }
    );

    observer.observe(cardEl);
    return () => {
      observer.disconnect();
    };
  }, [isVideo]);

  return (
    <div
      ref={cardRef}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group relative w-full aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer select-none',
        'bg-neutral-950 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.85)] ring-1 ring-white/10',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:shadow-[0_24px_50px_-8px_rgba(0,0,0,0.95)] hover:ring-white/30',
        'will-change-transform preserve-3d',
        className
      )}
    >
      <div
        className="w-full h-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
        )}

        {isVideo ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onLoadedMetadata={() => setIsLoaded(true)}
            onLoadedData={() => setIsLoaded(true)}
            onCanPlay={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              'w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-90'
            )}
          />
        ) : (
          <img
            src={src}
            alt={alt || `Gallery visual ${index + 1}`}
            loading="eager"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              'w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-90'
            )}
          />
        )}

        {hasError && (
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
            <span className="text-xs text-neutral-500 font-mono">Media Asset</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.08] rounded-2xl pointer-events-none" />
      </div>
    </div>
  );
};
