import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { VIDEO_POSTERS } from '../data/mediaData';

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
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo =
    src.endsWith('.mp4') ||
    src.endsWith('.webm') ||
    src.includes('/carouselvideos/') ||
    src.includes('.mp4?');

  // Find paired poster image for video or use src directly
  const posterSrc = isVideo
    ? VIDEO_POSTERS[src] ||
      'https://images.unsplash.com/photo-1608248597359-25f0a8d46158?q=75&w=640&auto=format&fit=crop'
    : src;

  return (
    <div
      ref={cardRef}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group relative w-full aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer select-none',
        'bg-neutral-950 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.85)] ring-1 ring-white/10',
        'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:shadow-[0_24px_50px_-8px_rgba(0,0,0,0.95)] hover:ring-white/30',
        'will-change-transform preserve-3d',
        className
      )}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '300px 187px',
      }}
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

        {/* Lightweight crisp poster image rendered by default for 60fps opening */}
        <img
          src={posterSrc}
          alt={alt || `Gallery visual ${index + 1}`}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-90',
            isVideo && isHovered ? 'opacity-0' : 'opacity-100'
          )}
        />

        {/* Video mounted and streamed ONLY on hover to avoid hardware decoder starvation */}
        {isVideo && isHovered && (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-200"
          />
        )}

        {/* Sleek video badge indicator */}
        {isVideo && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1.5 pointer-events-none transition-all duration-200 group-hover:border-orange-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
            <span className="text-[9px] font-mono tracking-wider uppercase text-white/90">3D</span>
          </div>
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
