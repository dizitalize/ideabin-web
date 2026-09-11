import React, { useState, useRef, useCallback } from 'react';
import { FluidCanvas } from './components/FluidCanvas';
import { HeroDisplay } from './components/HeroDisplay';
import { ControlsPanel } from './components/ControlsPanel';
import { FramerExportModal } from './components/FramerExportModal';
import { DEFAULT_CONFIG, PRESETS } from './lib/presets';
import { FluidConfig, ColorMode } from './types';
import { FluidSimulation } from './lib/fluidSimulation';

export default function App() {
  const [config, setConfig] = useState<FluidConfig>(DEFAULT_CONFIG);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  const simulationRef = useRef<FluidSimulation | null>(null);

  const handleSelectPreset = useCallback((presetId: ColorMode) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setConfig((prev) => ({
      ...prev,
      ...preset.config,
      colorMode: presetId,
    }));
  }, []);

  const handleTriggerBurst = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.triggerBurst(6);
    }
  }, []);

  const handleClear = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.clear();
    }
  }, []);

  const handleResetDefaults = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  // Compute text contrast based on background color
  const isLightBg = config.backgroundColor === '#ffffff';
  const textColor = isLightBg ? '#0a0a0a' : '#ffffff';

  return (
    <div
      id="app-root"
      className="relative w-screen h-screen overflow-hidden select-none transition-colors duration-300"
      style={{
        backgroundColor: config.backgroundColor,
      }}
    >
      {/* 1. Fullscreen WebGL Fluid Canvas */}
      <FluidCanvas config={config} simulationRef={simulationRef} />

      {/* 2. Hero Headline and Quick Presets matching fluidcursorv2.framer.website */}
      <HeroDisplay
        currentColorMode={config.colorMode}
        onSelectPreset={handleSelectPreset}
        onTriggerBurst={handleTriggerBurst}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode((prev) => !prev)}
        textColor={textColor}
      />

      {/* 3. Floating Customization HUD / Drawer */}
      {!isZenMode && (
        <ControlsPanel
          config={config}
          onChangeConfig={setConfig}
          onTriggerBurst={handleTriggerBurst}
          onClear={handleClear}
          onOpenExport={() => setIsExportOpen(true)}
          onResetDefaults={handleResetDefaults}
        />
      )}

      {/* 4. Framer Props / Code Export Modal */}
      <FramerExportModal
        config={config}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
