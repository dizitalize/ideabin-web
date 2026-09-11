import React, { useEffect, useRef } from 'react';
import { FluidSimulation } from '../lib/fluidSimulation';
import { FluidConfig } from '../types';

interface FluidCanvasProps {
  config: FluidConfig;
  simulationRef?: React.MutableRefObject<FluidSimulation | null>;
}

export const FluidCanvas: React.FC<FluidCanvasProps> = ({ config, simulationRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simInstanceRef = useRef<FluidSimulation | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas pixel dimensions safely
    const width = Math.max(window.innerWidth || 300, 1);
    const height = Math.max(window.innerHeight || 300, 1);
    canvas.width = width;
    canvas.height = height;

    try {
      const simulation = new FluidSimulation(canvas, config);
      simInstanceRef.current = simulation;
      if (simulationRef) {
        simulationRef.current = simulation;
      }
    } catch (err) {
      console.error('Failed to initialize WebGL Fluid Simulation:', err);
    }

    const handleResize = () => {
      if (simInstanceRef.current) {
        simInstanceRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (simInstanceRef.current) {
        simInstanceRef.current.destroy();
        simInstanceRef.current = null;
      }
      if (simulationRef) {
        simulationRef.current = null;
      }
    };
  }, []);

  // Update configuration dynamically
  useEffect(() => {
    const sim = simInstanceRef.current;
    if (!sim) return;

    const prevConfig = sim.config;
    sim.config = config;

    if (prevConfig.shading !== config.shading) {
      sim.updateKeywords();
    }

    if (
      prevConfig.simResolution !== config.simResolution ||
      prevConfig.dyeResolution !== config.dyeResolution
    ) {
      sim.initFramebuffers();
    }
  }, [config]);

  return (
    <div
      id="fluid-canvas-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        backgroundColor: config.transparent ? 'transparent' : config.backgroundColor,
      }}
    >
      <canvas
        ref={canvasRef}
        id="fluid-webgl-canvas"
        className="w-full h-full block bg-transparent"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};
