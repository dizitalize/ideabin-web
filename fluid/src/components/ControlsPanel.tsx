import React, { useState } from 'react';
import { FluidConfig, ColorMode } from '../types';
import { PRESETS } from '../lib/presets';
import {
  Sliders,
  Sparkles,
  Zap,
  Trash2,
  Share2,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCcw,
  SunMedium,
  Wind,
  Layers,
  Palette,
} from 'lucide-react';

interface ControlsPanelProps {
  config: FluidConfig;
  onChangeConfig: (newConfig: FluidConfig) => void;
  onTriggerBurst: () => void;
  onClear: () => void;
  onOpenExport: () => void;
  onResetDefaults: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChangeConfig,
  onTriggerBurst,
  onClear,
  onOpenExport,
  onResetDefaults,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'physics' | 'appearance'>('presets');

  const handleSelectPreset = (presetId: ColorMode) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onChangeConfig({
      ...config,
      ...preset.config,
      colorMode: presetId,
    });
  };

  const updateField = <K extends keyof FluidConfig>(key: K, value: FluidConfig[K]) => {
    onChangeConfig({
      ...config,
      [key]: value,
    });
  };

  return (
    <>
      {/* Minimized bottom floating pill */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          <button
            id="quick-burst-btn"
            onClick={onTriggerBurst}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 backdrop-blur-md text-xs font-medium text-white shadow-xl transition-all active:scale-95 cursor-pointer"
            title="Burst colorful fluid fireworks"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>Burst</span>
          </button>

          <button
            id="open-controls-pill"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 backdrop-blur-md text-xs font-medium text-white shadow-xl transition-all active:scale-95 cursor-pointer group"
          >
            <Sliders className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            <span>Customize Fluid</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      )}

      {/* Expanded Control Drawer / Panel */}
      {isOpen && (
        <div
          id="fluid-controls-panel"
          className="fixed bottom-6 right-6 z-40 w-88 max-w-[calc(100vw-2rem)] bg-neutral-950/92 backdrop-blur-xl border border-neutral-800/80 rounded-2xl shadow-2xl text-neutral-200 overflow-hidden animate-fade-in flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-800/80 bg-neutral-900/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold tracking-wide uppercase text-white">Fluid Inspector</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                v2.0
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="reset-fluid-btn"
                onClick={onResetDefaults}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                id="close-controls-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
                title="Collapse panel"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 p-1.5 bg-neutral-900/50 border-b border-neutral-800/60 text-xs">
            <button
              id="tab-presets"
              onClick={() => setActiveTab('presets')}
              className={`py-1.5 text-center font-medium rounded-lg transition-all ${
                activeTab === 'presets'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Presets
            </button>
            <button
              id="tab-physics"
              onClick={() => setActiveTab('physics')}
              className={`py-1.5 text-center font-medium rounded-lg transition-all ${
                activeTab === 'physics'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Physics
            </button>
            <button
              id="tab-appearance"
              onClick={() => setActiveTab('appearance')}
              className={`py-1.5 text-center font-medium rounded-lg transition-all ${
                activeTab === 'appearance'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Look & Feel
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-4 overflow-y-auto space-y-4 text-xs font-normal flex-1">
            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
                  Select Visual Style
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {PRESETS.map((p) => {
                    const isSelected = config.colorMode === p.id;
                    return (
                      <button
                        key={p.id}
                        id={`preset-btn-${p.id}`}
                        onClick={() => handleSelectPreset(p.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-white/50 bg-neutral-800/80 shadow-md'
                            : 'border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-800/40 hover:border-neutral-700'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-lg shrink-0 shadow-inner border border-white/20"
                          style={{ background: p.previewGradient }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white truncate">{p.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-800/80">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">{p.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Physics Tab */}
            {activeTab === 'physics' && (
              <div className="space-y-4">
                {/* Smoke Dissipation */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-neutral-400" /> Smoke Fade
                    </span>
                    <span className="font-mono text-neutral-400">{config.densityDissipation.toFixed(1)}</span>
                  </div>
                  <input
                    id="slider-density-dissipation"
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.1"
                    value={config.densityDissipation}
                    onChange={(e) => updateField('densityDissipation', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                    <span>Persistent trails</span>
                    <span>Fast dissolve</span>
                  </div>
                </div>

                {/* Motion Fade */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-400" /> Motion Fade (Velocity)
                    </span>
                    <span className="font-mono text-neutral-400">{config.velocityDissipation.toFixed(1)}</span>
                  </div>
                  <input
                    id="slider-velocity-dissipation"
                    type="range"
                    min="0.2"
                    max="6.0"
                    step="0.1"
                    value={config.velocityDissipation}
                    onChange={(e) => updateField('velocityDissipation', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Swirl / Curl */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-400" /> Swirl (Vorticity)
                    </span>
                    <span className="font-mono text-neutral-400">{config.curl}</span>
                  </div>
                  <input
                    id="slider-curl"
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={config.curl}
                    onChange={(e) => updateField('curl', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Splat Force */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-neutral-400" /> Splat Force
                    </span>
                    <span className="font-mono text-neutral-400">{config.splatForce}</span>
                  </div>
                  <input
                    id="slider-splat-force"
                    type="range"
                    min="1000"
                    max="12000"
                    step="500"
                    value={config.splatForce}
                    onChange={(e) => updateField('splatForce', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Splat Size */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-neutral-300">
                    <span className="text-neutral-300">Splat Radius</span>
                    <span className="font-mono text-neutral-400">{config.splatRadius.toFixed(2)}</span>
                  </div>
                  <input
                    id="slider-splat-radius"
                    type="range"
                    min="0.05"
                    max="0.6"
                    step="0.01"
                    value={config.splatRadius}
                    onChange={(e) => updateField('splatRadius', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Pressure Iterations */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-neutral-300">
                    <span className="text-neutral-300">Pressure Solver Steps</span>
                    <span className="font-mono text-neutral-400">{config.pressureIterations}</span>
                  </div>
                  <input
                    id="slider-pressure-iterations"
                    type="range"
                    min="5"
                    max="35"
                    step="1"
                    value={config.pressureIterations}
                    onChange={(e) => updateField('pressureIterations', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Look & Feel Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-4">
                {/* 3D Shading Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/80">
                  <div>
                    <div className="font-medium text-white">3D Surface Shading</div>
                    <div className="text-[11px] text-neutral-400">Glossy normal lighting & specular relief</div>
                  </div>
                  <button
                    id="toggle-shading-btn"
                    onClick={() => updateField('shading', !config.shading)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      config.shading ? 'bg-white' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        config.shading ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Ambient Motion Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/80">
                  <div>
                    <div className="font-medium text-white">Ambient Liquid Flow</div>
                    <div className="text-[11px] text-neutral-400">Gentle procedural ripples when idle</div>
                  </div>
                  <button
                    id="toggle-ambient-btn"
                    onClick={() => updateField('ambientMotion', !config.ambientMotion)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      config.ambientMotion ? 'bg-white' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                        config.ambientMotion ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Background Canvas Color */}
                <div>
                  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
                    Background Color
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Pitch Black', value: '#000000' },
                      { name: 'Obsidian', value: '#070a14' },
                      { name: 'Velvet', value: '#121118' },
                      { name: 'Clean White', value: '#ffffff' },
                    ].map((bg) => (
                      <button
                        key={bg.value}
                        id={`bg-color-${bg.name.toLowerCase().replace(' ', '-')}`}
                        onClick={() => {
                          onChangeConfig({
                            ...config,
                            backgroundColor: bg.value,
                            transparent: false,
                          });
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          config.backgroundColor === bg.value
                            ? 'border-white bg-neutral-800'
                            : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-neutral-700 shadow-sm"
                          style={{ backgroundColor: bg.value }}
                        />
                        <span className="text-[10px] text-neutral-300 font-medium truncate w-full text-center">
                          {bg.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Cycle Speed */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-neutral-300">
                    <span className="text-neutral-300">Color Shift Speed</span>
                    <span className="font-mono text-neutral-400">{config.colorUpdateSpeed}</span>
                  </div>
                  <input
                    id="slider-color-speed"
                    type="range"
                    min="1"
                    max="25"
                    step="1"
                    value={config.colorUpdateSpeed}
                    onChange={(e) => updateField('colorUpdateSpeed', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Footer */}
          <div className="p-3 bg-neutral-900/80 border-t border-neutral-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                id="trigger-burst-btn"
                onClick={onTriggerBurst}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
                title="Ignite burst explosion"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> Burst
              </button>
              <button
                id="clear-canvas-btn"
                onClick={onClear}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Clear fluid smoke"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              id="export-framer-btn"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Copy Code
            </button>
          </div>
        </div>
      )}
    </>
  );
};
