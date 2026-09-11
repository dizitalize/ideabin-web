import React from 'react';
import { MaskedWord } from './MaskedWord';
import { easeCinematic, lerp, clamp } from './utils/interpolation';

interface SceneRecompositionProps {
  time: number;
  line1?: string;
  line2?: string;
  className?: string;
}

export const SceneRecomposition: React.FC<SceneRecompositionProps> = ({
  time,
  line1 = 'UNCOMMON IDEAS.',
  line2 = 'UNMATCHED RESULTS.',
  className = '',
}) => {
  if (time < 2.70 || time > 4.40) return null;

  const wordsLine1 = line1.split(' ');
  const wordsLine2 = line2.split(' ');
  const word1 = wordsLine1[0] || 'UNCOMMON';
  const word2 = wordsLine1.slice(1).join(' ') || 'IDEAS.';
  const word3 = wordsLine2[0] || 'UNMATCHED';
  const word4 = wordsLine2.slice(1).join(' ') || 'RESULTS.';

  const enterLine1 = easeCinematic(time, 2.70, 3.02);
  const enterLine2 = easeCinematic(time, 2.80, 3.12);

  const w1X = lerp(-40, 0, enterLine1);
  const w1Y = lerp(-12, 0, enterLine1);
  const w1Scale = lerp(1.04, 1.0, enterLine1);
  const w1Opacity = clamp((time - 2.70) / 0.10, 0, 1);

  const w2X = lerp(45, 0, enterLine1);
  const w2Y = lerp(10, 0, enterLine1);
  const w2Scale = lerp(1.03, 1.0, enterLine1);
  const w2Opacity = clamp((time - 2.73) / 0.10, 0, 1);

  const w3X = lerp(-45, 0, enterLine2);
  const w3Y = lerp(14, 0, enterLine2);
  const w3Scale = lerp(1.04, 1.0, enterLine2);
  const w3Opacity = clamp((time - 2.80) / 0.10, 0, 1);

  const w4X = lerp(50, 0, enterLine2);
  const w4Y = lerp(-10, 0, enterLine2);
  const w4Scale = lerp(1.03, 1.0, enterLine2);
  const w4Opacity = clamp((time - 2.83) / 0.10, 0, 1);

  const holdProgress = clamp((time - 3.12) / 0.88, 0, 1);
  const cameraDriftScale = time >= 3.12 && time < 4.00 ? lerp(1.0, 1.022, holdProgress) : 1.0;
  const cameraDriftX = time >= 3.12 && time < 4.00 ? lerp(0, 6, holdProgress) : 0;
  const cameraDriftY = time >= 3.12 && time < 4.00 ? lerp(0, -4, holdProgress) : 0;

  const isCollapsing = time >= 4.00;
  const collapseProgress = clamp((time - 4.00) / 0.35, 0, 1);
  const collapseEase = Math.pow(collapseProgress, 2.2);

  const collapseScaleY = isCollapsing ? lerp(1.0, 0.02, collapseEase) : 1.0;
  const collapseScaleX = isCollapsing ? lerp(1.0, 0.18, collapseEase) : 1.0;
  const clipInsetY = isCollapsing ? lerp(0, 49, collapseEase) : 0;
  const clipInsetX = isCollapsing ? lerp(0, 42, collapseEase) : 0;
  const line1CollapseX = isCollapsing ? lerp(0, -90, collapseEase) : 0;
  const line2CollapseX = isCollapsing ? lerp(0, 110, collapseEase) : 0;
  const collapseOpacity = collapseProgress > 0.92 ? 0 : 1;

  return (
    <div
      id="scene-02-recomposition"
      className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-18 lg:px-24 ${isCollapsing ? 'overflow-hidden' : 'overflow-visible'} pointer-events-none select-none ${className}`}
      style={{
        transform: `translate3d(${cameraDriftX}px, ${cameraDriftY}px, 0) scale(${cameraDriftScale})`,
        transformOrigin: 'center center',
        opacity: collapseOpacity,
        clipPath: isCollapsing
          ? `inset(${clipInsetY}% ${clipInsetX}% ${clipInsetY}% ${clipInsetX}%)`
          : undefined,
      }}
    >
      <div
        className="w-full max-w-[1750px] mx-auto flex flex-col justify-center will-change-transform overflow-visible"
        style={{
          transform: `scale(${collapseScaleX}, ${collapseScaleY})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="w-full flex items-baseline gap-x-4 sm:gap-x-8 md:gap-x-12 leading-[0.84] pl-2 sm:pl-4 md:pl-6 will-change-transform overflow-visible"
          style={{
            transform: `translate3d(${line1CollapseX}px, 0, 0)`,
          }}
        >
          <MaskedWord
            id="word-uncommon"
            word={word1}
            xPx={w1X}
            yPx={w1Y}
            scale={w1Scale}
            opacity={w1Opacity}
            overflowVisible={true}
            className="py-1 overflow-visible"
            textClassName="text-[9vw] sm:text-[9.5vw] md:text-[9vw] lg:text-[8.5vw] font-black font-display tracking-[-0.05em] text-white pr-2"
          />

          <MaskedWord
            id="word-ideas"
            word={word2}
            xPx={w2X}
            yPx={w2Y}
            scale={w2Scale}
            opacity={w2Opacity}
            overflowVisible={true}
            className="py-1 overflow-visible"
            textClassName="text-[9vw] sm:text-[9.5vw] md:text-[9vw] lg:text-[8.5vw] font-black font-display tracking-[-0.05em] text-neutral-300 pr-2"
          />
        </div>

        <div
          className="w-full flex items-baseline justify-end gap-x-4 sm:gap-x-8 md:gap-x-12 leading-[0.84] -mt-2 sm:-mt-4 md:-mt-6 pr-2 sm:pr-4 md:pr-6 will-change-transform overflow-visible"
          style={{
            transform: `translate3d(${line2CollapseX}px, 0, 0)`,
          }}
        >
          <MaskedWord
            id="word-unmatched"
            word={word3}
            xPx={w3X}
            yPx={w3Y}
            scale={w3Scale}
            opacity={w3Opacity}
            overflowVisible={true}
            className="py-1 overflow-visible"
            textClassName="text-[9vw] sm:text-[9.5vw] md:text-[9vw] lg:text-[8.5vw] font-black font-display tracking-[-0.05em] text-neutral-300 pr-2"
          />

          <MaskedWord
            id="word-results"
            word={word4}
            xPx={w4X}
            yPx={w4Y}
            scale={w4Scale}
            opacity={w4Opacity}
            overflowVisible={true}
            className="py-1 overflow-visible"
            textClassName="text-[9vw] sm:text-[9.5vw] md:text-[9vw] lg:text-[8.5vw] font-black font-display tracking-[-0.06em] text-white pr-2"
          />
        </div>
      </div>
    </div>
  );
};
