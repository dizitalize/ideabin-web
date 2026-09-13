"use client";

import React, { useEffect, useRef, useState } from "react";
import { FluidSimulation } from "@/lib/fluid/fluidSimulation";
import { FluidConfig } from "@/lib/fluid/types";
import { DEFAULT_CONFIG } from "@/lib/fluid/presets";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function FluidBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simInstanceRef = useRef<FluidSimulation | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Theme-tailored fluid configuration
  const config: FluidConfig = {
    ...DEFAULT_CONFIG,
    transparent: true,
    backgroundColor: isDark ? "#000000" : "#ffffff",
    colorMode: "fire",
    densityDissipation: isDark ? 2.2 : 2.8,
    velocityDissipation: 1.8,
    curl: 34,
    splatRadius: 0.26,
    splatForce: 6000,
    shading: true,
    hoverSplat: true,
    clickSplat: true,
    ambientMotion: true,
    bloomEffect: true,
  };

  // Visibility observation: active starting from the 3rd page and through all subsequent sections
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero-cinematic");
      if (!heroEl) {
        setIsVisible(true);
        return;
      }
      const heroRect = heroEl.getBoundingClientRect();
      const scrollableDist = Math.max(1, heroEl.offsetHeight - window.innerHeight);
      const rawScrollP = -heroRect.top / scrollableDist;

      // Active starting from 3rd page (rawScrollP >= 0.48) and continuing through Services, FAQ, and Footer
      const shouldShow = rawScrollP >= 0.48 || heroRect.bottom <= window.innerHeight * 1.5;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize WebGL Fluid Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = Math.max(window.innerWidth || 300, 1);
    const height = Math.max(window.innerHeight || 300, 1);
    canvas.width = width;
    canvas.height = height;

    try {
      const simulation = new FluidSimulation(canvas, config);
      simInstanceRef.current = simulation;
    } catch (err) {
      console.warn("WebGL Fluid Simulation initialization skipped:", err);
    }

    const handleResize = () => {
      if (simInstanceRef.current) {
        simInstanceRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (simInstanceRef.current) {
        simInstanceRef.current.destroy();
        simInstanceRef.current = null;
      }
    };
  }, []);

  // Dynamically update config on theme change
  useEffect(() => {
    const sim = simInstanceRef.current;
    if (!sim) return;

    sim.config = config;
    sim.updateKeywords();
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      id="fluid-interactive-overlay"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ease-out"
      style={{
        opacity: isVisible ? (isDark ? 0.95 : 0.75) : 0,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-transparent"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
