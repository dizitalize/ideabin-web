export type ColorMode =
  | 'rainbow'
  | 'neon'
  | 'chrome'
  | 'cosmic'
  | 'fire'
  | 'emerald'
  | 'smoke'
  | 'custom';

export interface FluidConfig {
  simResolution: number;
  dyeResolution: number;
  densityDissipation: number; // Smoke fade
  velocityDissipation: number; // Motion fade
  pressure: number;
  pressureIterations: number;
  curl: number; // Swirl
  splatRadius: number;
  splatForce: number;
  shading: boolean; // 3D lit look
  colorUpdateSpeed: number;
  hoverSplat: boolean;
  clickSplat: boolean;
  backgroundColor: string;
  transparent: boolean;
  colorMode: ColorMode;
  customColor: string;
  ambientMotion: boolean;
  bloomEffect: boolean;
}

export interface Preset {
  id: ColorMode;
  name: string;
  description: string;
  badge: string;
  config: Partial<FluidConfig>;
  previewGradient: string;
}

export interface PointerData {
  id: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  dx: number;
  dy: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
}
