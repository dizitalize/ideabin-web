import React from 'react';
import { cn } from '@/lib/utils';

export interface MarqueeGridLinesProps {
  className?: string;
  columns?: number;
  gap?: number;
  isDark?: boolean;
}

export const MarqueeGridLines: React.FC<MarqueeGridLinesProps> = ({
  className = '',
  isDark = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0 pointer-events-none select-none z-0 overflow-hidden',
        className
      )}
    >
      <div
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0, 0, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `
            : `
            linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '160px 160px',
        }}
      />
      <div
        className={cn(
          'absolute inset-2 rounded-3xl border',
          isDark ? 'border-white/[0.08]' : 'border-black/[0.04]'
        )}
      />
    </div>
  );
};
