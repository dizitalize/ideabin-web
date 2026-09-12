import React from 'react';
import { cn } from '@/lib/utils';
import { MarqueeCard } from './marquee-card';

export interface MarqueeColumnProps {
  images: string[];
  direction?: 'up' | 'down';
  duration?: number;
  gap?: number;
  hoverLift?: number;
  cardClassName?: string;
  className?: string;
  onCardClick?: (index: number, image: string) => void;
  columnIndex?: number;
}

export const MarqueeColumn: React.FC<MarqueeColumnProps> = ({
  images,
  direction = 'up',
  duration = 42,
  gap = 24,
  hoverLift = 12,
  cardClassName = '',
  className = '',
  onCardClick,
  columnIndex = 0,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div
      className={cn(
        'relative flex-1 min-w-[320px] sm:min-w-[380px] md:min-w-[460px] lg:min-w-[540px] xl:min-w-[620px] max-w-[760px] h-full overflow-visible preserve-3d',
        className
      )}
    >
      <div
        className={cn(
          'w-full flex flex-col preserve-3d will-change-transform',
          direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down'
        )}
        style={{
          ['--marquee-duration' as any]: `${duration}s`,
        }}
      >
        <div
          className="w-full flex flex-col shrink-0 preserve-3d"
          style={{
            gap: `${gap}px`,
            paddingBottom: `${gap}px`,
          }}
        >
          {images.map((src, idx) => (
            <MarqueeCard
              key={`col-${columnIndex}-item-${idx}`}
              src={src}
              hoverLift={hoverLift}
              className={cardClassName}
              onClick={onCardClick ? () => onCardClick(idx, src) : undefined}
              index={idx}
            />
          ))}
        </div>

        <div
          aria-hidden="true"
          className="w-full flex flex-col shrink-0 preserve-3d"
          style={{
            gap: `${gap}px`,
            paddingBottom: `${gap}px`,
          }}
        >
          {images.map((src, idx) => (
            <MarqueeCard
              key={`col-${columnIndex}-dup-${idx}`}
              src={src}
              hoverLift={hoverLift}
              className={cardClassName}
              onClick={onCardClick ? () => onCardClick(idx, src) : undefined}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
