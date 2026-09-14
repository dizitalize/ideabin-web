import React from 'react';
import { cubicEase, easeCinematic, lerp, clamp, getProgress } from './utils/interpolation';
import { ThreeDMarquee } from './ThreeDMarquee';
import { CAROUSEL_VIDEOS } from './data/mediaData';

interface SceneAboxTransitionProps {
  time: number;
  className?: string;
  transitionType?: 'zoom-in' | 'zoom-out';
  transitionProgress?: number;
  isDark?: boolean;
}

export const SceneAboxTransition: React.FC<SceneAboxTransitionProps> = ({
  time,
  className = '',
  transitionType = 'zoom-in',
  transitionProgress,
  isDark = true,
}) => {
  const textRef = React.useRef<HTMLHeadingElement>(null);
  const [textHalfWidth, setTextHalfWidth] = React.useState<number>(140);

  React.useEffect(() => {
    const updateSize = () => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setTextHalfWidth(rect.width / 2 + 8);
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const activeTransitionProgress = transitionProgress !== undefined
    ? transitionProgress
    : clamp((time - 11.60) / 1.40, 0, 1);

  // Smoothstep container exit fade between activeTransitionProgress = 0.45 and 0.90
  const exitT = clamp((activeTransitionProgress - 0.45) / 0.45, 0, 1);
  const exitOpacity = 1 - (exitT * exitT * (3 - 2 * exitT));

  if (time < 4.40 || (activeTransitionProgress >= 0.98 && exitOpacity <= 0.01)) return null;

  const appearProgress = easeCinematic(time, 4.55, 5.40);
  const appearOpacity = appearProgress;
  const appearTranslateY = lerp(12, 0, appearProgress);

  const isAboxVisible = time >= 4.50 && time < 7.30;

  const collapseRawProgress = getProgress(time, 5.80, 7.30);
  const collapseEase = cubicEase(collapseRawProgress, 0.22, 1, 0.36, 1);

  // Vertical lines start flanking the "Ideabin" text (not screen edges)
  let currentLineOffsetPx = textHalfWidth;
  let textClipPercent = 0;
  if (time < 5.80) {
    currentLineOffsetPx = textHalfWidth;
    textClipPercent = 0;
  } else if (time < 7.30) {
    currentLineOffsetPx = lerp(textHalfWidth, 0, collapseEase);
    textClipPercent = collapseEase * 50;
  } else {
    currentLineOffsetPx = 0;
    textClipPercent = 50;
  }

  const linesIntroOpacity = easeCinematic(time, 5.60, 5.80);
  const isLinesActive = time >= 5.60;

  // Boundary lines dissolve away gracefully as transition begins, opening up the screen for the 3D carousel
  const linesTransitionFade = activeTransitionProgress > 0.02
    ? clamp(1 - (activeTransitionProgress - 0.02) / 0.45, 0, 1)
    : 1;
  const currentLinesOpacity = linesIntroOpacity * linesTransitionFade;

  const INITIAL_LINE_HEIGHT_PX = 72;

  const OPEN_START_TIME = 7.90;
  const OPEN_END_TIME = 10.60;
  const isExpanding = time >= OPEN_START_TIME;

  const phaseProgress = getProgress(time, OPEN_START_TIME, OPEN_END_TIME);

  const VERTICAL_EXPANSION_START = 0.02;
  const VERTICAL_EXPANSION_END = 0.35;

  const hEase = cubicEase(phaseProgress, 0.22, 1, 0.36, 1);

  // Expansion opens from center (0%) outward to screen edges (50% each side)
  const openPercent = isExpanding ? lerp(0, 50, hEase) : 0;
  const apertureInsetPercent = 50 - openPercent;

  let windowProgress = 0;
  if (phaseProgress < VERTICAL_EXPANSION_START) {
    windowProgress = 0;
  } else if (phaseProgress <= VERTICAL_EXPANSION_END) {
    const rawV = (phaseProgress - VERTICAL_EXPANSION_START) / (VERTICAL_EXPANSION_END - VERTICAL_EXPANSION_START);
    windowProgress = cubicEase(rawV, 0.25, 1, 0.35, 1);
  } else {
    windowProgress = 1;
  }

  const currentHeightCss =
    phaseProgress < VERTICAL_EXPANSION_START
      ? `${INITIAL_LINE_HEIGHT_PX}px`
      : phaseProgress >= VERTICAL_EXPANSION_END
        ? '100vh'
        : `calc(${Math.round(INITIAL_LINE_HEIGHT_PX * (1 - windowProgress) * 100) / 100}px + ${Math.round(windowProgress * 10000) / 100}vh)`;

  let whiteLightOpacity = 0;
  if (phaseProgress < VERTICAL_EXPANSION_START) {
    whiteLightOpacity = Math.max(0, phaseProgress / VERTICAL_EXPANSION_START) * 0.15;
  } else if (phaseProgress <= VERTICAL_EXPANSION_END) {
    whiteLightOpacity = lerp(0.15, 1.0, windowProgress);
  } else {
    whiteLightOpacity = 1.0;
  }

  const isOpening = phaseProgress >= VERTICAL_EXPANSION_START;
  const hRevealFactor = clamp((phaseProgress - VERTICAL_EXPANSION_START) / (VERTICAL_EXPANSION_END - VERTICAL_EXPANSION_START), 0, 1);
  const hRevealEase = cubicEase(hRevealFactor, 0.22, 1, 0.36, 1);

  const apertureProgress = clamp(windowProgress * 0.70 + hRevealEase * 0.30, 0, 1);
  const textRevealEase = cubicEase(apertureProgress, 0.22, 1, 0.36, 1);
  const textRevealOpacity = isOpening ? textRevealEase : 0;

  return (
    <div
      id="scene-ideabin-transition"
      className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-opacity ${className}`}
      style={{
        opacity: exitOpacity,
      }}
    >
      {isAboxVisible && (
        <div className="relative flex items-center justify-center">
          <div
            id="ideabin-typography-mask"
            className="relative h-[72px] flex items-center justify-center overflow-hidden will-change-transform px-3"
            style={{
              clipPath: `inset(0% ${textClipPercent}% 0% ${textClipPercent}%)`,
              opacity: appearOpacity,
            }}
          >
            <div
              id="ideabin-typography-stationary-glyph"
              className="whitespace-nowrap flex items-center justify-center will-change-transform"
              style={{
                transform: `translate3d(0, ${appearTranslateY}px, 0)`,
              }}
            >
              <h1
                ref={textRef}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white tracking-[0.22em] uppercase select-none leading-none px-2"
              >
                Ideabin
              </h1>
            </div>
          </div>
        </div>
      )}

      {time >= 7.90 && (
        <div
          id="cinematic-window-aperture"
          className="absolute overflow-hidden will-change-transform z-10"
          style={{
            left: `${apertureInsetPercent}%`,
            right: `${apertureInsetPercent}%`,
            top: '50%',
            height: currentHeightCss,
            transform: 'translateY(-50%)',
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.55)'
              : `rgba(255, 255, 255, ${whiteLightOpacity * 0.7})`,
          }}
        >
<div
             className="absolute inset-0 pointer-events-none opacity-10"
             aria-hidden="true"
             style={{
               backgroundImage: isDark
                 ? 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)'
                 : 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
               backgroundSize: '40px 40px',
             }}
           />

          {isOpening && (
            <div
              id="aperture-3d-marquee-layer"
              className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center z-5 pointer-events-auto"
              style={{
                opacity: textRevealOpacity,
              }}
            >
              <ThreeDMarquee
                height="100%"
                columns={4}
                gap={24}
                scale={1.02}
                rotation={{ x: 48, y: 0, z: -28 }}
                showGridLines={true}
                interactive={true}
                hoverLift={14}
                animation={{
                  duration: 28,
                  reverse: false,
                }}
                transitionProgress={activeTransitionProgress}
                transitionType={transitionType}
                isDark={isDark}
              />
            </div>
          )}

<div
             id="white-window-scanlines-overlay"
             className="absolute inset-0 pointer-events-none select-none z-20 overflow-hidden"
             aria-hidden="true"
             style={{
               opacity: Math.min(1, whiteLightOpacity * (isDark ? 0.45 : 0.75)) * (1 - clamp((activeTransitionProgress - 0.05) / 0.50, 0, 1)),
             }}
           >
<div
               className="terminal-scanlines-pattern absolute inset-0 opacity-30 will-change-transform"
               aria-hidden="true"
               style={{
                 animation: 'scanline-texture-drift 8s linear infinite',
               }}
             />

<div
               className="absolute inset-x-0 h-28 pointer-events-none will-change-transform opacity-40"
               aria-hidden="true"
               style={{
                 top: 0,
                 background: isDark
                   ? 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.02) 40%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.02) 60%, transparent)'
                   : 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.03) 40%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.03) 60%, transparent)',
                 animation: 'scanline-sweep 7.5s linear infinite',
               }}
             />
          </div>
        </div>
      )}

      {isLinesActive && (
        <div
          id="architectural-boundaries-container"
          className="absolute inset-0 pointer-events-none z-20"
        >
          <div
            id="left-boundary-line"
            className="absolute w-[3px] bg-white will-change-transform z-20"
            style={{
              left: isExpanding ? `${apertureInsetPercent}%` : `calc(50% - ${currentLineOffsetPx}px)`,
              opacity: currentLinesOpacity,
              top: '50%',
              height: currentHeightCss,
              transform: 'translate(-100%, -50%)',
            }}
          />

          <div
            id="right-boundary-line"
            className="absolute w-[3px] bg-white will-change-transform z-20"
            style={{
              left: isExpanding ? undefined : `calc(50% + ${currentLineOffsetPx}px)`,
              right: isExpanding ? `${apertureInsetPercent}%` : undefined,
              opacity: currentLinesOpacity,
              top: '50%',
              height: currentHeightCss,
              transform: isExpanding ? 'translate(100%, -50%)' : 'translate(0, -50%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
