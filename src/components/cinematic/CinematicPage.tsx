"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CinematicViewport } from './CinematicViewport';
import { SceneIntro } from './SceneIntro';
import { SceneGlitchTransition } from './SceneGlitchTransition';
import { SceneRecomposition } from './SceneRecomposition';
import { SceneAboxTransition } from './SceneAboxTransition';
import { CurvedCarouselSection } from './CurvedCarouselSection';
import { HeroShowreel } from './HeroShowreel';
import { RadialPhoneExperience } from './RadialPhoneExperience';
import { QuestionsStatementStage } from './QuestionsStatementStage';
import { clamp } from './utils/interpolation';
import { useTheme } from '@/components/providers/ThemeProvider';

const APERTURE_START = 7.90;
const APERTURE_SETTLED = 8.60;
const CAROUSEL_START = 11.60;
const CAROUSEL_SETTLED = 13.00;
const CAROUSEL_DISPLAY_TIME = 5.0;
const TEXT_TRANSITION_START = CAROUSEL_SETTLED + CAROUSEL_DISPLAY_TIME; // 18.00s
const COLOR_TRANSITION_DURATION = 1.60;
const SEQUENCE_END = TEXT_TRANSITION_START + COLOR_TRANSITION_DURATION + 0.50; // 20.10s

interface CinematicPageProps {
  isActive?: boolean;
  onComplete?: () => void;
  className?: string;
}

export default function CinematicPage({
  isActive = true,
  onComplete,
  className = '',
}: CinematicPageProps) {
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [time, setTime] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [sequenceCycle, setSequenceCycle] = useState<number>(0);
  const [showRadialPhones, setShowRadialPhones] = useState<boolean>(false);
  const [showDesignDevText, setShowDesignDevText] = useState<boolean>(false);
  const [showQuestionsStage, setShowQuestionsStage] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [transitionType] = useState<'zoom-in' | 'zoom-out'>('zoom-in');

  const statement1 = ['DESIGN', 'THAT', 'DEMAND', 'ATTENTION'];
  const statement2Line1 = 'UNCOMMON IDEAS.';
  const statement2Line2 = 'UNMATCHED RESULTS.';

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0.0);
  const touchStartYRef = useRef<number | null>(null);
  const hasTransitionedToRadialRef = useRef<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Restarts from Scene 01 Intro (time 0.0)
  const handleRestartSequence = useCallback(() => {
    setIsFadingOut(true);
    window.setTimeout(() => {
      setShowRadialPhones(false);
      setShowDesignDevText(false);
      setShowQuestionsStage(false);
      hasTransitionedToRadialRef.current = false;
      setTime(0.0);
      timeRef.current = 0.0;
      lastTimestampRef.current = null;
      setSequenceCycle((c) => c + 1);
      setIsPlaying(false);
      window.setTimeout(() => {
        setIsPlaying(true);
        setIsFadingOut(false);
      }, 50);
    }, 450);
  }, []);

  // When Radial Phones & Design/Dev text sequence completes
  const handleRadialComplete = useCallback(() => {
    if (onComplete) onComplete();
    else {
      handleRestartSequence();
    }
  }, [onComplete, handleRestartSequence]);

  // When Design & Development Showreel completes
  const handleShowreelComplete = useCallback(() => {
    setShowQuestionsStage(true);
  }, []);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  // When page becomes inactive (scrolled away to Page 2 or Page 4), cleanly reset all animation states
  useEffect(() => {
    if (!isActive) {
      setTime(0.0);
      timeRef.current = 0.0;
      lastTimestampRef.current = null;
      setShowRadialPhones(false);
      setShowDesignDevText(false);
      hasTransitionedToRadialRef.current = false;
      setIsPlaying(true);
      setIsFadingOut(false);
    }
  }, [isActive]);

  // Master cinematic animation loop
  useEffect(() => {
    if (!isActive || !isPlaying || showRadialPhones || showDesignDevText) {
      lastTimestampRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const prevTime = timeRef.current;
      let nextTime = prevTime + delta;

      // When carousel display ends, transition into Radial Phone Experience (ORDER: Mobile Radial BEFORE Design & Dev text)
      if (nextTime >= TEXT_TRANSITION_START && !hasTransitionedToRadialRef.current) {
        hasTransitionedToRadialRef.current = true;
        setTime(TEXT_TRANSITION_START);
        timeRef.current = TEXT_TRANSITION_START;
        setIsFadingOut(true);
        window.setTimeout(() => {
          setShowRadialPhones(true);
          setIsFadingOut(false);
        }, 400);
        return;
      }

      if (nextTime >= SEQUENCE_END) {
        nextTime = SEQUENCE_END;
        setIsPlaying(false);
      }

      setTime(nextTime);
      timeRef.current = nextTime;

      if (nextTime < SEQUENCE_END && !hasTransitionedToRadialRef.current) {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isPlaying, showRadialPhones, showDesignDevText]);

  // Scroll / Wheel-linked scrub: advances timeline until reaching Carousel stage
  const handleWheel = (e: React.WheelEvent) => {
    if (time >= CAROUSEL_START || showRadialPhones || showDesignDevText) return;
    const delta = e.deltaY * 0.0025;
    setTime((prev) => {
      const next = Math.max(0, Math.min(SEQUENCE_END, prev + delta));
      timeRef.current = next;
      if (next >= TEXT_TRANSITION_START && !hasTransitionedToRadialRef.current) {
        hasTransitionedToRadialRef.current = true;
        setIsFadingOut(true);
        window.setTimeout(() => {
          setShowRadialPhones(true);
          setIsFadingOut(false);
        }, 400);
      }
      return next;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (time >= CAROUSEL_START || showRadialPhones || showDesignDevText) return;
    if (touchStartYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = (touchStartYRef.current - currentY) * 0.004;
    touchStartYRef.current = currentY;
    setTime((prev) => {
      const next = Math.max(0, Math.min(SEQUENCE_END, prev + deltaY));
      timeRef.current = next;
      if (next >= TEXT_TRANSITION_START && !hasTransitionedToRadialRef.current) {
        hasTransitionedToRadialRef.current = true;
        setIsFadingOut(true);
        window.setTimeout(() => {
          setShowRadialPhones(true);
          setIsFadingOut(false);
        }, 400);
      }
      return next;
    });
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
  };

  // Keyboard controls
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyR') {
        handleRestartSequence();
      } else if (e.code === 'KeyP') {
        // Jump directly to Radial Phones
        setShowDesignDevText(false);
        setShowRadialPhones((prev) => !prev);
      } else if (e.code === 'KeyD') {
        // Jump directly to Design & Development text
        setShowRadialPhones(false);
        setShowDesignDevText((prev) => !prev);
      } else if (e.code === 'KeyM') {
        // Jump directly to 3D Marquee aperture stage
        setShowRadialPhones(false);
        setShowDesignDevText(false);
        setShowQuestionsStage(false);
        setTime(9.20);
        timeRef.current = 9.20;
      } else if (e.code === 'KeyT') {
        // Toggle dark and white theme
        toggleTheme();
      } else if (e.code === 'Space' && !showRadialPhones && !showDesignDevText && time < TEXT_TRANSITION_START) {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, time, showRadialPhones, showDesignDevText, handleRestartSequence, toggleTheme]);

  const transitionProgress = clamp(
    (time - CAROUSEL_START) / (CAROUSEL_SETTLED - CAROUSEL_START),
    0,
    1
  );

  const carouselEnterProgress = clamp((transitionProgress - 0.08) / 0.72, 0, 1);
  const carouselStageOpacity =
    time >= CAROUSEL_SETTLED
      ? 1
      : carouselEnterProgress * carouselEnterProgress * (3 - 2 * carouselEnterProgress);

  const apertureProgress = clamp(
    (time - APERTURE_START) / (APERTURE_SETTLED - APERTURE_START),
    0,
    1
  );

  const showreelProgress = clamp(
    (time - TEXT_TRANSITION_START) / COLOR_TRANSITION_DURATION,
    0,
    1
  );
  const showreelEase =
    showreelProgress < 0.5
      ? 4 * showreelProgress * showreelProgress * showreelProgress
      : 1 - Math.pow(-2 * showreelProgress + 2, 3) / 2;

  const whiteStudioOpacity = 0;
  const obsidianThemeOpacity = 1;

  const isAtCarousel = time >= CAROUSEL_START && time < TEXT_TRANSITION_START;

  return (
    <div
      id="cinematic-3rd-page"
      onWheel={!showRadialPhones && !showDesignDevText ? handleWheel : undefined}
      onTouchStart={!showRadialPhones && !showDesignDevText ? handleTouchStart : undefined}
      onTouchMove={!showRadialPhones && !showDesignDevText ? handleTouchMove : undefined}
      onTouchEnd={!showRadialPhones && !showDesignDevText ? handleTouchEnd : undefined}
      className={`relative w-full h-full min-h-screen overflow-hidden bg-transparent ${isDark ? 'text-white' : 'text-neutral-900'
        } select-none cursor-default transition-colors duration-500 ${className}`}
      style={{
        backgroundColor: 'transparent',
        color: isDark ? '#ffffff' : '#0a0a0a',
      }}
    >
      {showRadialPhones ? (
        <RadialPhoneExperience
          onComplete={handleRadialComplete}
          onRestartAll={handleRestartSequence}
          isDark={isDark}
        />
      ) : showQuestionsStage ? (
        <QuestionsStatementStage
          isDark={isDark}
          onScrollToSeeMore={() => {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' });
            }
            if (onComplete) onComplete();
          }}
        />
      ) : showDesignDevText ? (
        <div
          id="hero-showreel-container"
          className={`absolute inset-0 w-full h-full z-30 flex items-center justify-center transition-colors duration-500 bg-transparent ${isDark ? 'text-white' : 'text-neutral-900'
            }`}
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(13, 13, 20, 0.25) 0%, rgba(0, 0, 0, 0.55) 100%)'
              : 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(250, 249, 245, 0.35) 0%, rgba(237, 234, 227, 0.60) 100%)',
          }}
        >
          <div className="fixed inset-0 pointer-events-none film-grain z-40 opacity-20" aria-hidden="true" />
          <div
            className="fixed inset-0 pointer-events-none z-30"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.50) 100%)'
                : 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(230, 227, 220, 0.40) 100%)',
            }}
          />
          <HeroShowreel
            key={`showreel-${sequenceCycle}-${theme}`}
            onComplete={handleShowreelComplete}
            transparentBg={true}
            isDark={isDark}
          />
        </div>
      ) : (
        <CinematicViewport
          isDark={isDark}
        >
          {time < 4.45 && (
            <div
              key="kinetic-typography-stage"
              id="kinetic-typography-stage"
              className="relative w-full h-full flex flex-col justify-center items-center pointer-events-none will-change-transform"
              style={{
                transform: 'scale(0.85)',
                transformOrigin: 'center center',
              }}
            >
              <SceneIntro time={time} words={statement1} />
              <SceneGlitchTransition
                time={time}
                statement1={statement1}
                statement2Line1={statement2Line1}
                statement2Line2={statement2Line2}
              />
              <SceneRecomposition
                time={time}
                line1={statement2Line1}
                line2={statement2Line2}
              />
            </div>
          )}

          {time >= 4.40 && time < CAROUSEL_SETTLED + 0.35 && (
            <SceneAboxTransition
              key="scene-abox-transition"
              time={time}
              transitionType={transitionType}
              transitionProgress={transitionProgress}
              isDark={isDark}
            />
          )}

          {time >= 8.60 && (
            <div
              key="curved-carousel-stage"
              id="curved-carousel-stage"
              className="absolute inset-0 w-full h-full z-10 will-change-opacity"
              style={{
                opacity: carouselStageOpacity,
                pointerEvents: carouselStageOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <CurvedCarouselSection
                transitionProgress={transitionProgress}
                transitionType={transitionType}
                isDark={isDark}
              />
            </div>
          )}
        </CinematicViewport>
      )}

      <div
        id="sequence-loop-blackout"
        className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-400 ease-in-out ${isDark ? 'bg-black' : 'bg-white'
          } ${isFadingOut ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
