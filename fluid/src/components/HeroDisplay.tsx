import React from 'react';
import { ColorMode } from '../types';
import { PRESETS } from '../lib/presets';
import { Sparkles, Zap, Sliders, Maximize2, Minimize2 } from 'lucide-react';

interface HeroDisplayProps {
  currentColorMode: ColorMode;
  onSelectPreset: (mode: ColorMode) => void;
  onTriggerBurst: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  textColor: string;
}

export const HeroDisplay: React.FC<HeroDisplayProps> = ({
  currentColorMode,
  onSelectPreset,
  onTriggerBurst,
  isZenMode,
  onToggleZenMode,
  textColor,
}) => {
  return (
    <div
      id="hero-section"
      className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-between p-6 sm:p-10 pointer-events-none select-none transition-opacity duration-500 ${
        isZenMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'
      }`}
    >
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          <span className="text-xs tracking-wider uppercase font-mono font-medium text-neutral-400">
            WebGL Fluid Simulation <span className="text-neutral-500">v2.0</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="zen-mode-toggle-btn"
            onClick={onToggleZenMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Mode (Hide UI)'}
          >
            {isZenMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" /> <span>Normal</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" /> <span>Zen Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Center Content (Exact Poppins 72px / 62px / 52px typography from fluidcursorv2.framer.website) */}
      <main className="my-auto flex flex-col items-center text-center max-w-3xl px-4">
        {/* Subtitle tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/50 border border-neutral-800/80 backdrop-blur-md mb-6 text-xs text-neutral-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time Navier-Stokes GPU Physics</span>
        </div>

        {/* Hero Title */}
        <h1
          id="hero-title"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-semibold tracking-tight text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: textColor,
          }}
        >
          Fluid Cursor
        </h1>

        {/* Prompt description */}
        <p className="mt-5 text-sm sm:text-base text-neutral-400 max-w-md font-normal leading-relaxed">
          Move your cursor to paint organic ribbons of liquid light. Click anywhere to ignite high-velocity shockwaves.
        </p>

        {/* Quick Presets Ribbon */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 pointer-events-auto max-w-xl">
          {PRESETS.map((preset) => {
            const isSelected = currentColorMode === preset.id;
            return (
              <button
                key={preset.id}
                id={`quick-preset-${preset.id}`}
                onClick={() => onSelectPreset(preset.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] border-white'
                    : 'bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/80'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ background: preset.previewGradient }}
                />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Burst Trigger Pill */}
        <div className="mt-5 pointer-events-auto">
          <button
            id="center-burst-btn"
            onClick={onTriggerBurst}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-neutral-900/70 hover:bg-neutral-800 text-white border border-neutral-700/80 backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer hover:border-neutral-500"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Click for Fluid Fireworks</span>
          </button>
        </div>
      </main>

      {/* Bottom Hint */}
      <footer className="w-full max-w-5xl flex items-center justify-between text-[11px] text-neutral-500 font-mono pointer-events-auto">
        <div>GPU-Accelerated 60 FPS Fluid Engine</div>
        <div className="hidden sm:block">Inspired by Fluid Cursor v2 for Framer</div>
      </footer>
    </div>
  );
};
