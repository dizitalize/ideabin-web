import React from 'react';
import { MaskedWord } from './MaskedWord';
import { easeCinematic, lerp, clamp } from './utils/interpolation';

interface SceneIntroProps {
  time: number;
  words?: string[];
  className?: string;
}

export const SceneIntro: React.FC<SceneIntroProps> = ({
  time,
  words = ['DESIGN', 'THAT', 'DEMAND', 'ATTENTION'],
  className = '',
}) => {
  if (time > 2.25) return null;

  const isIntroFragment = time < 0.25;
  const fragmentProgress = clamp((time - 0.06) / 0.16, 0, 1);
  const fragmentVisible = time >= 0.06 && time < 0.25;

  const w1Ease = easeCinematic(time, 0.25, 0.52);
  const w1Y = lerp(-115, 0, w1Ease);
  const w1Scale = lerp(1.08, 1.0, w1Ease);

  const w2Ease = easeCinematic(time, 0.36, 0.62);
  const w2X = lerp(-125, 0, w2Ease);
  const w2Scale = lerp(1.06, 1.0, w2Ease);

  const w3Ease = easeCinematic(time, 0.48, 0.74);
  const w3Y = lerp(125, 0, w3Ease);
  const w3Scale = lerp(1.05, 1.0, w3Ease);

  const w4Ease = easeCinematic(time, 0.58, 0.85);
  const w4X = lerp(110, 0, w4Ease);
  const w4Scale = lerp(1.07, 1.0, w4Ease);

  const driftProgress = clamp((time - 0.85) / 1.2, 0, 1);
  const cameraScale = time >= 0.85 ? lerp(1.0, 1.025, driftProgress) : 1.0;
  const cameraX = time >= 0.85 ? lerp(0, -8, driftProgress) : 0;
  const cameraY = time >= 0.85 ? lerp(0, 5, driftProgress) : 0;

  const exitOpacity = time > 2.05 ? clamp(1 - (time - 2.05) / 0.18, 0, 1) : 1;

  return (
    <div
      id="scene-01-container"
      className={`absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-14 lg:px-20 overflow-visible pointer-events-none select-none ${className}`}
      style={{
        opacity: exitOpacity,
        transform: `translate3d(${cameraX}px, ${cameraY}px, 0) scale(${cameraScale})`,
        transformOrigin: 'center center',
      }}
    >
      {isIntroFragment && fragmentVisible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-48 h-1.5 bg-white/90 overflow-hidden relative"
            style={{
              opacity: fragmentProgress < 0.5 ? fragmentProgress * 2 : 2 - fragmentProgress * 2,
              transform: `scaleX(${lerp(0.2, 1.4, fragmentProgress)})`,
            }}
          >
            <span className="absolute -top-12 -left-6 font-display text-9xl font-black text-white tracking-tighter">
              D
            </span>
          </div>

          <div
            className="absolute top-1/3 right-1/4 w-1 h-12 bg-white/70"
            style={{
              opacity: clamp((time - 0.12) / 0.08, 0, 1) * (time > 0.22 ? 0 : 1),
            }}
          />
        </div>
      )}

      {time >= 0.25 && (
        <div className="relative w-full max-w-[1700px] mx-auto flex flex-col items-start gap-0 md:gap-1">
          <div className="w-full flex justify-start items-baseline">
            <MaskedWord
              id="word-design"
              word={words[0] || 'DESIGN'}
              yPercent={w1Y}
              scale={w1Scale}
              className="py-1"
              textClassName="text-[6.5vw] sm:text-[7vw] md:text-[6.5vw] lg:text-[6vw] font-black leading-[0.85] tracking-[-0.04em] text-white"
            />
          </div>

          <div className="w-full flex flex-wrap items-baseline justify-between gap-4 -mt-1 sm:-mt-2 md:-mt-3">
            <MaskedWord
              id="word-that"
              word={words[1] || 'THAT'}
              xPercent={w2X}
              scale={w2Scale}
              className="py-1"
              textClassName="text-[5.5vw] sm:text-[6vw] md:text-[5.5vw] lg:text-[5vw] font-black leading-[0.85] tracking-[-0.035em] text-neutral-200"
            />

            <MaskedWord
              id="word-demand"
              word={words[2] || 'DEMAND'}
              yPercent={w3Y}
              scale={w3Scale}
              className="py-1"
              textClassName="text-[6vw] sm:text-[6.5vw] md:text-[6vw] lg:text-[5.5vw] font-black leading-[0.85] tracking-[-0.04em] text-white"
            />
          </div>

          <div className="w-full flex justify-end items-baseline -mt-1 sm:-mt-2 md:-mt-3">
            <MaskedWord
              id="word-attention"
              word={words[3] || 'ATTENTION'}
              xPercent={w4X}
              scale={w4Scale}
              className="py-1 overflow-visible"
              textClassName="text-[7vw] sm:text-[7.5vw] md:text-[7vw] lg:text-[6.5vw] font-black leading-[0.85] tracking-[-0.05em] text-white pr-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};
