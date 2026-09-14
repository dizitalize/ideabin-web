import React from 'react';

interface CinematicViewportProps {
  children: React.ReactNode;
  isDark?: boolean;
}

export const CinematicViewport: React.FC<CinematicViewportProps> = ({
  children,
  isDark = true,
}) => {
  return (
    <div
      id="cinematic-viewport-root"
      className="relative w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <div
        id="viewport-obsidian-layer"
        className="absolute inset-0 pointer-events-none will-change-opacity transition-all duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.35) 100%)'
            : 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 0%, rgba(237, 234, 227, 0.35) 100%)',
        }}
      />

<div
         className="film-grain pointer-events-none absolute inset-0 opacity-25" aria-hidden="true"
       />

      <div
        id="cinema-canvas"
        className="relative w-full h-full bg-transparent overflow-hidden flex items-center justify-center z-10"
      >
        {children}
      </div>
    </div>
  );
};
