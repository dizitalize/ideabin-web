"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PhoneMockup } from './PhoneMockup';
import { HeroShowreel } from './HeroShowreel';
import { QuestionsStatementStage } from './QuestionsStatementStage';

interface RadialPhoneData {
  id: string;
  image: string;
}

const PHONES_DATA: RadialPhoneData[] = [
  {
    id: 'kanso',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'velour',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'aethel',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'strata',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'form',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'apex',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
  },
];

interface RadialPhoneExperienceProps {
  onComplete?: () => void;
  onRestartAll?: () => void;
  className?: string;
  isDark?: boolean;
}

export const RadialPhoneExperience: React.FC<RadialPhoneExperienceProps> = ({
  onComplete,
  onRestartAll,
  className = '',
  isDark = true,
}) => {
  const deviceCount = 6;
  const [manualProgress, setManualProgress] = useState<number | null>(null);
  const [liveProgress] = useState<number>(0.0);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(true);
  const [orbitAngle, setOrbitAngle] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [showQuestionsStage, setShowQuestionsStage] = useState<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobileScreen(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeProgress = manualProgress !== null ? manualProgress : liveProgress;
  const allPhonesDeparted = activeProgress >= 0.94;

  const handleScrollToSeeMore = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' });
    }
    if (onComplete) {
      onComplete();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (showQuestionsStage) {
      if (e.deltaY > 15) {
        handleScrollToSeeMore();
      }
      return;
    }
    if (allPhonesDeparted && e.deltaY > 0) return;
    setIsPlayingSequence(false);
    const delta = e.deltaY * 0.0006;
    setManualProgress((prev) => {
      const curr = prev !== null ? prev : liveProgress;
      const next = Math.min(1, Math.max(0, curr + delta));
      return next;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartYRef.current - currentY;
    if (showQuestionsStage) {
      if (deltaY > 25) {
        handleScrollToSeeMore();
      }
      return;
    }
    if (allPhonesDeparted) return;
    setIsPlayingSequence(false);
    const scrollDelta = deltaY * 0.002;
    touchStartYRef.current = currentY;
    setManualProgress((prev) => {
      const curr = prev !== null ? prev : 0;
      const next = Math.min(1, Math.max(0, curr + scrollDelta));
      return next;
    });
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !allPhonesDeparted) {
        e.preventDefault();
        setIsPlayingSequence((p) => !p);
      } else if (e.code === 'Enter') {
        if (!allPhonesDeparted) {
          setIsPlayingSequence(false);
          setManualProgress(1);
        } else if (!showQuestionsStage) {
          setShowQuestionsStage(true);
        } else {
          handleScrollToSeeMore();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allPhonesDeparted, showQuestionsStage]);

  const handleShowreelComplete = useCallback(() => {
    setShowQuestionsStage(true);
  }, []);

  useEffect(() => {
    if (allPhonesDeparted) return;
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setOrbitAngle((prev) => (prev + delta * 9) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [allPhonesDeparted]);

  useEffect(() => {
    if (!isPlayingSequence) return;
    let animId: number;
    let lastTime = performance.now();
    const duration = 8.5;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setManualProgress((prev) => {
        const curr = prev !== null ? prev : 0;
        const next = curr + delta / duration;
        if (next >= 1) {
          setIsPlayingSequence(false);
          return 1;
        }
        return next;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlayingSequence]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX / innerWidth - 0.5) * 2;
    const normY = (e.clientY / innerHeight - 0.5) * 2;
    setMousePos({ x: normX * 10, y: -normY * 10 });
  };

  const currentPhones = useMemo(() => {
    return PHONES_DATA.slice(0, deviceCount);
  }, [deviceCount]);

  const maxRadius = isMobileScreen ? 145 : 310;
  const mobileScaleMultiplier = isMobileScreen ? 0.65 : 1.0;

  // "WHAT WE BUILD" motion calculations: appears while opening and holds in center before devices depart
  let whatWeBuildOpacity = 0;
  let whatWeBuildScale = 0.90;
  let whatWeBuildLetterSpacing = '0.30em';

  if (activeProgress >= 0.36 && activeProgress < 0.94) {
    if (activeProgress < 0.48) {
      // Unveils as devices open to left and right (Phase 3)
      const t = (activeProgress - 0.36) / 0.12;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      whatWeBuildOpacity = ease;
      whatWeBuildScale = 0.90 + 0.10 * ease;
      whatWeBuildLetterSpacing = `${(0.30 - 0.08 * ease).toFixed(2)}em`;
    } else if (activeProgress <= 0.74) {
      // Steady hold while 3 devices are on left and 3 on right (Phase 4 - 2 seconds)
      whatWeBuildOpacity = 1;
      whatWeBuildScale = 1;
      whatWeBuildLetterSpacing = '0.22em';
    } else {
      // Dissolves gracefully as devices exit offscreen (Phase 5)
      const t = (activeProgress - 0.74) / 0.18;
      const ease = t * t;
      whatWeBuildOpacity = Math.max(0, 1 - ease * 1.35);
      whatWeBuildScale = 1 + ease * 0.06;
      whatWeBuildLetterSpacing = `${(0.22 + 0.08 * ease).toFixed(2)}em`;
    }
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full min-h-screen bg-transparent ${isDark ? 'text-white selection:bg-white selection:text-black' : 'text-neutral-900 selection:bg-black selection:text-white'
        } overflow-hidden select-none flex items-center justify-center transition-colors duration-500 ${className}`}
      style={{
        backgroundColor: 'transparent',
        background: isDark
          ? 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(13, 13, 20, 0.25) 0%, rgba(0, 0, 0, 0.50) 100%)'
          : 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(250, 249, 245, 0.35) 0%, rgba(237, 234, 227, 0.50) 100%)',
      }}
    >
      <div className="fixed inset-0 pointer-events-none film-grain z-40 opacity-20" />
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.45) 100%)'
            : 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(230, 227, 220, 0.40) 100%)',
        }}
      />

      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden perspective-[1400px] pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-50"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(13,13,20,0.5) 45%, transparent 70%)'
                : 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(230,225,215,0.5) 45%, transparent 70%)',
            }}
          />
        </div>

        <motion.div
          animate={{
            rotateX: mousePos.y,
            rotateY: mousePos.x,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 80 }}
          className="relative w-full h-full flex items-center justify-center preserve-3d"
        >
          <div className="relative flex items-center justify-center preserve-3d">
            {/* Center "WHAT WE BUILD" typography: Unveils while opening and holds between devices before they depart */}
            {whatWeBuildOpacity > 0.01 && (
              <div
                id="what-we-build-stage"
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
                style={{
                  opacity: whatWeBuildOpacity,
                  transform: `scale(${whatWeBuildScale})`,
                  willChange: 'opacity, transform',
                }}
              >
                <h2
                  className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase font-display leading-none text-center px-4 ${isDark ? 'text-white' : 'text-neutral-950'
                    }`}
                  style={{
                    letterSpacing: whatWeBuildLetterSpacing,
                  }}
                >
                  WHAT WE BUILD
                </h2>
              </div>
            )}

            {currentPhones.map((phone, i) => {
              const isLeft = i < 3;
              const groupIndex = isLeft ? i : i - 3; // 0, 1, 2

              // Configuration when all together in center (Phase 2)
              const centerX = 0;
              const centerY = (i - 2.5) * 2;
              const centerRot = (i - 2.5) * 2.5;
              const centerRotY = 0;
              const centerScale = 0.58 * mobileScaleMultiplier;
              const centerZIndex = 20 + i;

              // Configuration when split to Left (3) & Right (3) (Phase 3 & 4)
              const baseDist = isMobileScreen ? 140 : 330;
              const spreadX = isMobileScreen ? 26 : 52;
              const spreadY = isMobileScreen ? 12 : 22;

              let targetX = 0;
              let targetY = 0;
              let targetRot = 0;
              let targetRotY = 0;
              let targetScale = 0;
              let targetZIndex = 20;

              if (isLeft) {
                targetX = -baseDist + (groupIndex - 1) * spreadX;
                targetY = (groupIndex - 1) * spreadY;
                targetRot = (groupIndex - 1) * 3 - 2;
                targetRotY = 14 - groupIndex * 4;
                targetScale = (0.54 + groupIndex * 0.03) * mobileScaleMultiplier;
                targetZIndex = 20 + groupIndex;
              } else {
                targetX = baseDist + (groupIndex - 1) * spreadX;
                targetY = -(groupIndex - 1) * spreadY;
                targetRot = (groupIndex - 1) * 3 + 2;
                targetRotY = -(14 - groupIndex * 4);
                targetScale = (0.54 + (2 - groupIndex) * 0.03) * mobileScaleMultiplier;
                targetZIndex = 20 + (2 - groupIndex);
              }

              // Radial initial orbit calculations
              const baseAngleRad = (i * 2 * Math.PI) / deviceCount;
              const currentAngleRad = baseAngleRad + (orbitAngle * Math.PI) / 180;
              const radialTargetDeg = (currentAngleRad * 180) / Math.PI + 90;
              const radialX = Math.cos(currentAngleRad) * maxRadius;
              const radialY = Math.sin(currentAngleRad) * maxRadius;

              let finalX = 0;
              let finalY = 0;
              let finalRotate = 0;
              let finalRotateY = 0;
              let finalScale = centerScale;
              let finalOpacity = 1;
              let finalZIndex = targetZIndex;

              if (activeProgress <= 0.28) {
                // Phase 1: Orbiting radial phones collapse into center stack
                const t = Math.min(1, Math.max(0, activeProgress / 0.28));
                const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                const radialFactor = 1 - ease;

                finalX = radialX * radialFactor + centerX * (1 - radialFactor);
                finalY = radialY * radialFactor + centerY * (1 - radialFactor);
                finalRotate = radialTargetDeg * radialFactor + centerRot * (1 - radialFactor);
                finalRotateY = 0;
                finalScale = (0.58 * (1 - radialFactor) + 0.72 * radialFactor) * mobileScaleMultiplier;
                finalOpacity = 1;
                finalZIndex = centerZIndex;
              } else if (activeProgress <= 0.38) {
                // Phase 2: All 6 devices gathered together in one place at center
                finalX = centerX;
                finalY = centerY;
                finalRotate = centerRot;
                finalRotateY = centerRotY;
                finalScale = centerScale;
                finalOpacity = 1;
                finalZIndex = centerZIndex;
              } else if (activeProgress <= 0.50) {
                // Phase 3: Split into 3 devices on Left and 3 devices on Right
                const t = (activeProgress - 0.38) / 0.12;
                const ease = 0.5 - 0.5 * Math.cos(Math.PI * t);

                finalX = centerX * (1 - ease) + targetX * ease;
                finalY = centerY * (1 - ease) + targetY * ease;
                finalRotate = centerRot * (1 - ease) + targetRot * ease;
                finalRotateY = centerRotY * (1 - ease) + targetRotY * ease;
                finalScale = centerScale * (1 - ease) + targetScale * ease;
                finalOpacity = 1;
                finalZIndex = targetZIndex;
              } else if (activeProgress <= 0.74) {
                // Phase 4: Settle and hold in place on Left and Right for ~2 seconds
                finalX = targetX;
                finalY = targetY;
                finalRotate = targetRot;
                finalRotateY = targetRotY;
                finalScale = targetScale;
                finalOpacity = 1;
                finalZIndex = targetZIndex;
              } else {
                // Phase 5: Left 3 mobiles exit offscreen left; Right 3 mobiles exit offscreen right
                const t = Math.min(1, Math.max(0, (activeProgress - 0.74) / 0.20));
                const ease = t * t;
                const exitDistance = isMobileScreen ? 550 : 1200;

                if (isLeft) {
                  finalX = targetX - ease * exitDistance;
                  finalRotate = targetRot - ease * 12;
                  finalRotateY = targetRotY - ease * 35;
                } else {
                  finalX = targetX + ease * exitDistance;
                  finalRotate = targetRot + ease * 12;
                  finalRotateY = targetRotY + ease * 35;
                }

                finalY = targetY;
                finalScale = targetScale * (1 + ease * 0.12);
                finalOpacity = Math.max(0, 1 - ease * 1.5);
                finalZIndex = targetZIndex;

                if (finalOpacity <= 0.005) {
                  return null;
                }
              }

              return (
                <motion.div
                  key={phone.id}
                  style={{
                    x: finalX,
                    y: finalY,
                    rotate: finalRotate,
                    rotateY: finalRotateY,
                    scale: finalScale,
                    opacity: finalOpacity,
                    zIndex: finalZIndex,
                  }}
                  className="absolute pointer-events-none select-none transition-shadow"
                >
                  <div className="relative shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
                    <PhoneMockup>
                      <div className="relative w-full h-full bg-black overflow-hidden">
                        <img
                          src={phone.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
                      </div>
                    </PhoneMockup>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Design & Dev Typography Showreel: Follows after mobile phone slices hide */}
      {allPhonesDeparted && !showQuestionsStage && (
        <motion.div
          key="design-dev-text-stage"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto"
        >
          <HeroShowreel
            transparentBg={true}
            isDark={isDark}
            onComplete={handleShowreelComplete}
          />
        </motion.div>
      )}

      {/* Stage 3: The Questions Statement Stage ("WE DON'T START WITH ANSWERS...") with Scroll to see more button */}
      {showQuestionsStage && (
        <motion.div
          key="questions-statement-stage"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto"
        >
          <QuestionsStatementStage
            isDark={isDark}
            onScrollToSeeMore={handleScrollToSeeMore}
          />
        </motion.div>
      )}
    </div>
  );
};
