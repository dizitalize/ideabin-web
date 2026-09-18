import React from 'react';

interface MaskedWordProps {
  id?: string;
  word: string;
  xPercent?: number;
  yPercent?: number;
  xPx?: number;
  yPx?: number;
  scale?: number;
  opacity?: number;
  maskClipPath?: string;
  textClipPath?: string;
  overflowVisible?: boolean;
  className?: string;
  textClassName?: string;
  style?: React.CSSProperties;
}

export const MaskedWord: React.FC<MaskedWordProps> = ({
  id,
  word,
  xPercent = 0,
  yPercent = 0,
  xPx = 0,
  yPx = 0,
  scale = 1,
  opacity = 1,
  maskClipPath,
  textClipPath,
  overflowVisible = false,
  className = '',
  textClassName = '',
  style = {},
}) => {
  const isOverflowVisible = overflowVisible || className.includes('overflow-visible');

  return (
    <div
      id={id ? `mask-${id}` : undefined}
      className={`relative inline-block leading-none select-none ${
        isOverflowVisible ? 'overflow-visible' : 'overflow-hidden'
      } ${className}`}
      style={{
        clipPath: maskClipPath,
        ...style,
      }}
    >
      <div
        id={id ? `text-${id}` : undefined}
        className={`whitespace-nowrap font-display uppercase tracking-tighter will-change-transform ${textClassName}`}
        style={{
          transform: `translate3d(calc(${xPercent}% + ${xPx}px), calc(${yPercent}% + ${yPx}px), 0) scale(${scale})`,
          transformOrigin: 'left center',
          opacity,
          clipPath: textClipPath,
        }}
      >
        {word}
      </div>
    </div>
  );
};
