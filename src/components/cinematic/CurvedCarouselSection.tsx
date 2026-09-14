"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ThreeCarousel } from './ThreeCarousel';
import { MediaLightbox } from './MediaLightbox';
import {
  FRAMER_MEDIA,
  DEFAULT_CAROUSEL_CONFIG,
  DEFAULT_INTERACTION_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_STYLE_CONFIG,
} from './data/mediaData';
import { MediaItem } from './types';

interface CurvedCarouselSectionProps {
  className?: string;
  transitionProgress?: number;
  transitionType?: 'zoom-in' | 'zoom-out';
  isDark?: boolean;
}

export const CurvedCarouselSection: React.FC<CurvedCarouselSectionProps> = ({
  className = '',
  transitionProgress = 1,
  transitionType = 'zoom-in',
  isDark = true,
}) => {
  const [media] = useState<MediaItem[]>(FRAMER_MEDIA);
  const [carouselConfig] = useState(DEFAULT_CAROUSEL_CONFIG);
  
  const [interactionConfig, setInteractionConfig] = useState({
    ...DEFAULT_INTERACTION_CONFIG,
    autoPlay: true,
    speed: 0.15,
  });
  
  const [layoutConfig] = useState(DEFAULT_LAYOUT_CONFIG);
  
  const styleConfig = React.useMemo(() => ({
    ...DEFAULT_STYLE_CONFIG,
    backgroundColor: isDark ? '#000000' : '#ffffff',
    fogColor: isDark ? '#000000' : '#ffffff',
    transparentBg: true,
  }), [isDark]);

  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [, setActiveIndex] = useState<number>(0);

  const handleToggleAutoPlay = useCallback(() => {
    setInteractionConfig((prev) => ({
      ...prev,
      autoPlay: !prev.autoPlay,
    }));
  }, []);

  const handleSelectMedia = useCallback((item: MediaItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
  }, []);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePrevMedia = useCallback(() => {
    const total = media.length;
    const nextIdx = (selectedIndex - 1 + total) % total;
    setSelectedIndex(nextIdx);
    setSelectedItem(media[nextIdx]);
  }, [selectedIndex, media]);

  const handleNextMedia = useCallback(() => {
    const total = media.length;
    const nextIdx = (selectedIndex + 1) % total;
    setSelectedIndex(nextIdx);
    setSelectedItem(media[nextIdx]);
  }, [selectedIndex, media]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleAutoPlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, handleToggleAutoPlay]);

  return (
    <section
      id="curved-carousel-section"
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-500 ${className}`}
      style={{
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.40)' : 'rgba(255, 255, 255, 0.50)',
        background: isDark
          ? 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(13, 13, 20, 0.3) 0%, rgba(0, 0, 0, 0.65) 100%)'
          : 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(250, 249, 245, 0.4) 0%, rgba(237, 234, 227, 0.70) 100%)',
      }}
    >
      <div className="fixed inset-0 pointer-events-none film-grain z-40 opacity-25" aria-hidden="true" />
      <div
        className="fixed inset-0 pointer-events-none z-30 transition-all duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.85) 100%)'
            : 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(240, 238, 230, 0.6) 100%)',
        }}
      />

      <div className="absolute inset-0 w-full h-full">
        <ThreeCarousel
          media={media}
          carouselConfig={carouselConfig}
          interactionConfig={interactionConfig}
          layoutConfig={layoutConfig}
          styleConfig={styleConfig}
          onSelectMedia={handleSelectMedia}
          onActiveIndexChange={handleActiveIndexChange}
          isDarkTheme={isDark}
          transitionProgress={transitionProgress}
          transitionType={transitionType}
        />
      </div>

      <MediaLightbox
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onPrev={handlePrevMedia}
        onNext={handleNextMedia}
        currentIndex={selectedIndex}
        totalItems={media.length}
      />
    </section>
  );
};
