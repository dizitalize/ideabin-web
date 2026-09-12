import React from 'react';
import { clamp } from './utils/interpolation';

interface SceneGlitchTransitionProps {
  time: number;
  statement1?: string[];
  statement2Line1?: string;
  statement2Line2?: string;
}

export const SceneGlitchTransition: React.FC<SceneGlitchTransitionProps> = ({
  time,
  statement1 = ['DESIGN', 'THAT', 'DEMAND', 'ATTENTION'],
}) => {
  if (time < 2.02 || time > 2.85) return null;

  const progress = clamp((time - 2.05) / 0.70, 0, 1);

  const slices = [
    { id: 0, clip: 'polygon(0% 0%, 100% 0%, 100% 21%, 0% 21%)', dir: -1, mag: 24, decay: 0.85 },
    { id: 1, clip: 'polygon(0% 21%, 100% 21%, 100% 41%, 0% 41%)', dir: -1, mag: 30, decay: 0.9 },
    { id: 2, clip: 'polygon(0% 41%, 100% 41%, 100% 61%, 0% 61%)', dir: 1, mag: 28, decay: 0.95 },
    { id: 3, clip: 'polygon(0% 61%, 100% 61%, 100% 81%, 0% 81%)', dir: 1, mag: 26, decay: 0.8 },
    { id: 4, clip: 'polygon(0% 81%, 100% 81%, 100% 100%, 0% 100%)', dir: -1, mag: 22, decay: 0.75 },
  ];

  const envelope = progress < 0.4
    ? progress / 0.4
    : Math.max(0, 1 - (progress - 0.4) / 0.6);

  const outOpacity = progress < 0.55 ? clamp(1 - (progress / 0.55), 0, 1) : 0;
  const inOpacity = progress > 0.35 ? clamp((progress - 0.35) / 0.45, 0, 1) : 0;

  return (
    <div
      id="scene-glitch-collision"
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden select-none"
    >
      {slices.map((slice, idx) => {
        const stepPulse = Math.sin((time * 38) + idx * 1.7);
        const shiftX = slice.dir * slice.mag * envelope * (0.6 + 0.4 * stepPulse);

        return (
          <div
            key={slice.id}
            id={`slice-${slice.id}`}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{
              clipPath: slice.clip,
              transform: `translate3d(${shiftX}px, 0, 0)`,
            }}
          >
            {outOpacity > 0 && (
              <div
                className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-14 lg:px-20"
                style={{ opacity: outOpacity }}
              >
                <div className="w-full max-w-[1700px] mx-auto flex flex-col items-start leading-[0.85]">
                  <span className="text-[6.5vw] sm:text-[7vw] md:text-[6.5vw] lg:text-[6vw] font-black font-display tracking-[-0.04em] text-white">
                    {statement1[0]}
                  </span>
                  <div className="w-full flex justify-between gap-4 -mt-1 sm:-mt-2 md:-mt-3">
                    <span className="text-[5.5vw] sm:text-[6vw] md:text-[5.5vw] lg:text-[5vw] font-black font-display tracking-[-0.035em] text-neutral-300">
                      {statement1[1]}
                    </span>
                    <span className="text-[6vw] sm:text-[6.5vw] md:text-[6vw] lg:text-[5.5vw] font-black font-display tracking-[-0.04em] text-white">
                      {statement1[2]}
                    </span>
                  </div>
                  <div className="w-full flex justify-end -mt-1 sm:-mt-2 md:-mt-3">
                    <span className="text-[7vw] sm:text-[7.5vw] md:text-[7vw] lg:text-[6.5vw] font-black font-display tracking-[-0.05em] text-white">
                      {statement1[3]}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {inOpacity > 0 && (
              <div
                className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-18 lg:px-24 overflow-visible pointer-events-none"
                style={{ opacity: inOpacity }}
              >
                <div className="w-full max-w-[1700px] mx-auto flex flex-col items-start leading-[0.85] overflow-visible">
                  <div className="w-full flex items-baseline gap-x-3 sm:gap-x-5 md:gap-x-7 overflow-visible">
                    <span className="text-[5vw] sm:text-[5.2vw] md:text-[4.8vw] lg:text-[4.4vw] font-black font-display tracking-[-0.04em] text-white">
                      UNCOMMON
                    </span>
                    <span className="text-[5vw] sm:text-[5.2vw] md:text-[4.8vw] lg:text-[4.4vw] font-black font-display tracking-[-0.04em] text-neutral-300">
                      IDEAS.
                    </span>
                  </div>
                  <div className="w-full flex justify-end items-baseline gap-x-3 sm:gap-x-5 md:gap-x-7 -mt-1 sm:-mt-2 md:-mt-3 overflow-visible">
                    <span className="text-[5vw] sm:text-[5.2vw] md:text-[4.8vw] lg:text-[4.4vw] font-black font-display tracking-[-0.04em] text-neutral-300">
                      UNMATCHED
                    </span>
                    <span className="text-[5vw] sm:text-[5.2vw] md:text-[4.8vw] lg:text-[4.4vw] font-black font-display tracking-[-0.05em] text-white">
                      RESULTS.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div
              className="absolute w-full h-[1px] bg-white/20 pointer-events-none"
              style={{
                top: `${(idx + 1) * 20}%`,
                opacity: envelope * 0.4,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
