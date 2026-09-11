import React, { useState } from 'react';
import { FluidConfig } from '../types';
import { Check, Copy, X, Sparkles, Code } from 'lucide-react';

interface FramerExportModalProps {
  config: FluidConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const FramerExportModal: React.FC<FramerExportModalProps> = ({ config, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const framerPropsCode = `// Framer Component Properties for FluidCursor
<FluidCursor
  coverage="fullscreen"
  simResolution={${config.simResolution}}
  dyeResolution={${config.dyeResolution}}
  densityDissipation={${config.densityDissipation}}
  velocityDissipation={${config.velocityDissipation}}
  pressure={${config.pressure}}
  pressureIterations={${config.pressureIterations}}
  curl={${config.curl}}
  splatRadius={${config.splatRadius}}
  splatForce={${config.splatForce}}
  shading={${config.shading}}
  colorUpdateSpeed={${config.colorUpdateSpeed}}
  hoverSplat={${config.hoverSplat}}
  clickSplat={${config.clickSplat}}
  transparent={${config.transparent}}
  backgroundColor="${config.backgroundColor}"
  colorMode="${config.colorMode}"
/>`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(framerPropsCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Ignore clipboard API rejection and try legacy fallback
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = framerPropsCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy fallback failed:', err);
    }
  };

  return (
    <div
      id="framer-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-neutral-900/95 border border-neutral-800 text-neutral-100 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-800 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">Framer Component Props</h3>
              <p className="text-xs text-neutral-400">Export current fluid simulation configuration</p>
            </div>
          </div>
          <button
            id="close-export-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-mono">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-neutral-400" /> JSX / Framer Props
            </span>
            <span className="text-neutral-500">Preset: {config.colorMode}</span>
          </div>

          <div className="relative rounded-xl bg-neutral-950/90 border border-neutral-800 p-4 font-mono text-xs text-neutral-300 overflow-x-auto max-h-72">
            <pre className="leading-relaxed">{framerPropsCode}</pre>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            id="cancel-export-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
          <button
            id="copy-framer-code-btn"
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Props Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
