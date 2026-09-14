import React from 'react';

interface TapeProps {
  variant?: 'light' | 'dark';
  tilt?: number;
  width?: string;
  className?: string;
}

export const Tape: React.FC<TapeProps> = ({
  variant = 'light',
  tilt = 0.5,
  width = '84px',
  className = '',
}) => {
  const isLight = variant === 'light';

  return (
    <div
      className={`absolute z-20 pointer-events-none -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center ${className}`}
      style={{
        width,
        height: '24px',
        transform: `translateX(-50%) rotate(${tilt}deg)`,
      }}
    >
      {/* Tape Shadow */}
      <div
        className="absolute inset-0 rounded-[1px] opacity-40 blur-[2px]"
        style={{
          background: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.55)',
          transform: 'translateY(2px)',
        }}
      />

      {/* Main Tape Body with frosted texture and torn edges */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          background: isLight
            ? 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(245,245,235,0.48) 50%, rgba(240,240,225,0.62) 100%)'
            : 'linear-gradient(180deg, rgba(35,35,40,0.78) 0%, rgba(25,25,30,0.55) 50%, rgba(20,20,25,0.72) 100%)',
          backdropFilter: 'blur(2px)',
          clipPath:
            'polygon(0% 12%, 3% 0%, 97% 2%, 100% 14%, 99% 88%, 96% 100%, 4% 98%, 0% 86%)',
          boxShadow: isLight
            ? 'inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.1)'
            : 'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.4)',
        }}
      >
        {/* Subtle tape wrinkles and air bubbles */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `repeating-linear-gradient(
              75deg,
              transparent,
              transparent 12px,
              ${isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.15)'} 13px,
              transparent 14px
            )`,
          }}
        />

        {/* Specular sheen down the tape */}
        <div
          className="absolute top-0 left-1/4 w-1/2 h-full opacity-35"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          }}
        />

        {/* Torn left and right fiber marks */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-[3px]"
          style={{
            background: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
          }}
        />
      </div>
    </div>
  );
};
