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
  totalColumns?: number;
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
  totalColumns = 4,
}) => {
  if (!images || images.length === 0) return null;

  // Responsive column sizing calibrated for 4 columns so all columns fit within the 3D viewport
  const columnWidthClass =
    totalColumns === 4
      ? 'w-[200px] sm:w-[240px] md:w-[270px] lg:w-[300px] xl:w-[330px] max-w-[360px] flex-1 shrink-0'
      : totalColumns <= 2
        ? 'w-[320px] sm:w-[380px] md:w-[460px] lg:w-[540px] max-w-[620px] flex-1 shrink-0'
        : 'w-[220px] sm:w-[260px] md:w-[290px] lg:w-[320px] max-w-[350px] flex-1 shrink-0';

  return (
    <div
      className={cn(
        'relative h-full overflow-visible preserve-3d',
        columnWidthClass,
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
