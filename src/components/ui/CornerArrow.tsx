"use client";

import React, { useId } from "react";
import type { CSSProperties } from "react";

export type CornerArrowShape =
  | "circle"
  | "blob"
  | "rounded"
  | "starburst"
  | "flower"
  | "diamond"
  | "wavy"
  | "asymmetric";

export type CornerArrowColor =
  | "lime"
  | "yellow"
  | "lavender"
  | "blue"
  | "pink"
  | "mint"
  | "peach";

export type CornerArrowPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "right-edge"
  | "left-edge";

export type CornerArrowDirection =
  | "right"
  | "up-right"
  | "up-left"
  | "down-right"
  | "down-left"
  | "up"
  | "down";

const PASTELS: Record<CornerArrowColor, string> = {
  lime: "#E8F7B0",
  yellow: "#FFE76A",
  lavender: "#D9B8F4",
  blue: "#C6E4F5",
  pink: "#F5C6DD",
  mint: "#CBEECF",
  peach: "#F7C7A8",
};

const POSITION_STYLES: Record<CornerArrowPosition, CSSProperties> = {
  "top-right": { top: -12, right: -12 },
  "top-left": { top: -12, left: -12 },
  "bottom-right": { bottom: -12, right: -12 },
  "bottom-left": { bottom: -12, left: -12 },
  "right-edge": { right: -12, top: "50%", transform: "translateY(-50%)" },
  "left-edge": { left: -12, top: "50%", transform: "translateY(-50%)" },
};

const ARROW_PATHS: Record<CornerArrowDirection, string> = {
  right: "M4 12h16M13 5l7 7-7 7",
  "up-right": "M6 18L18 6M9 6h9v9",
  "up-left": "M18 18L6 6M6 15V6h9",
  "down-right": "M6 6l12 12M9 18h9V9",
  "down-left": "M18 6L6 18M6 9v9h9",
  up: "M12 20V4M5 11l7-7 7 7",
  down: "M12 4v16M5 13l7 7 7-7",
};

/** Irregular organic silhouettes, all authored in a 0 0 100 100 viewBox. */
const SHAPES: Record<CornerArrowShape, React.ReactNode> = {
  circle: <circle cx="50" cy="50" r="46" />,
  blob: (
    <path d="M50 6C68 2 88 16 91 38 94 60 84 84 58 91 34 97 12 82 8 58 4 34 24 12 50 6Z" />
  ),
  rounded: <rect x="10" y="10" width="80" height="80" rx="26" />,
  starburst: (
    <polygon points="50,2 59.3,15.2 74,8.4 75.5,24.5 91.6,26 84.8,40.7 98,50 84.8,59.3 91.6,74 75.5,75.5 74,91.6 59.3,84.8 50,98 40.7,84.8 26,91.6 24.5,75.5 8.4,74 15.2,59.3 2,50 15.2,40.7 8.4,26 24.5,24.5 26,8.4 40.7,15.2" />
  ),
  flower: (
    <>
      <circle cx="50" cy="50" r="24" />
      <circle cx="50" cy="24" r="22" />
      <circle cx="72.5" cy="37" r="22" />
      <circle cx="72.5" cy="63" r="22" />
      <circle cx="50" cy="76" r="22" />
      <circle cx="27.5" cy="63" r="22" />
      <circle cx="27.5" cy="37" r="22" />
    </>
  ),
  diamond: (
    <path d="M50 2Q54 2 57 5L95 43Q98 50 95 57L57 95Q50 98 43 95L5 57Q2 50 5 43L43 5Q46 2 50 2Z" />
  ),
  wavy: (
    <polygon points="50,4 62,12.9 77,12.8 81.6,27.1 93.7,35.8 89,50 93.7,64.2 81.6,72.9 77,87.2 62,87.1 50,96 38,87.1 23,87.2 18.4,72.9 6.3,64.2 11,50 6.3,35.8 18.4,27.1 23,12.8 38,12.9" />
  ),
  asymmetric: (
    <path d="M62 8C82 10 94 30 90 52 86 76 70 94 46 92 22 90 6 72 8 48 10 26 34 6 62 8Z" />
  ),
};

interface Combo {
  shape: CornerArrowShape;
  color: CornerArrowColor;
  position: CornerArrowPosition;
  direction: CornerArrowDirection;
  rotation: number;
}

/**
 * Curated combinations — the "controlled randomness" pool. Every entry is a
 * vetted shape/color/corner/direction/rotation pairing so random picks always
 * look intentional and stay inside the same design system.
 */
const COMBOS: Combo[] = [
  { shape: "blob", color: "lime", position: "top-right", direction: "up-right", rotation: -5 },
  { shape: "starburst", color: "yellow", position: "bottom-right", direction: "right", rotation: 6 },
  { shape: "blob", color: "lavender", position: "top-left", direction: "up-left", rotation: -8 },
  { shape: "diamond", color: "blue", position: "bottom-left", direction: "down-left", rotation: 4 },
  { shape: "rounded", color: "pink", position: "right-edge", direction: "right", rotation: -4 },
  { shape: "flower", color: "mint", position: "top-right", direction: "down-right", rotation: 7 },
  { shape: "wavy", color: "peach", position: "bottom-left", direction: "down", rotation: -6 },
  { shape: "asymmetric", color: "lavender", position: "right-edge", direction: "up", rotation: 5 },
  { shape: "circle", color: "blue", position: "top-left", direction: "up-left", rotation: -3 },
  { shape: "wavy", color: "mint", position: "bottom-right", direction: "right", rotation: 8 },
  { shape: "starburst", color: "peach", position: "top-right", direction: "up", rotation: -9 },
  { shape: "flower", color: "pink", position: "bottom-right", direction: "down-right", rotation: 3 },
];

const FALLBACK: Combo = {
  shape: "blob",
  color: "lime",
  position: "top-right",
  direction: "up-right",
  rotation: -4,
};

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export interface CornerArrowProps {
  /**
   * "random" — pick a curated combo deterministically from `seed`.
   * "custom" — resolve every "auto"/omitted field from the combo pool and
   *            apply explicit props on top.
   */
  variant?: "random" | "custom";
  /** Stable selector for the random combo (string/number). Defaults to useId. */
  seed?: string | number;
  shape?: CornerArrowShape;
  color?: CornerArrowColor;
  position?: CornerArrowPosition | "auto";
  direction?: CornerArrowDirection | "auto";
  /** Degrees, -12..12. */
  rotation?: number | "auto";
  className?: string;
}

/**
 * Editorial corner ornament: pastel organic shape → white circular button →
 * black arrow, partially escaping the host card's boundary. The host element
 * must be `relative` (and not clip overflow) for the escape to show.
 */
export default function CornerArrow({
  variant = "random",
  seed,
  shape,
  color,
  position = "auto",
  direction = "auto",
  rotation = "auto",
  className = "",
}: CornerArrowProps) {
  const reactId = useId();
  const seedValue = seed !== undefined ? String(seed) : reactId;
  const combo = variant === "random" ? COMBOS[hashSeed(seedValue) % COMBOS.length] : FALLBACK;

  const resolvedShape = shape ?? combo.shape;
  const resolvedColor = color ?? combo.color;
  const resolvedPosition: CornerArrowPosition =
    position === "auto" ? combo.position : position;
  const resolvedDirection: CornerArrowDirection =
    direction === "auto" ? combo.direction : direction;
  const resolvedRotation = rotation === "auto" ? combo.rotation : rotation;

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-30 ${className}`}
      style={POSITION_STYLES[resolvedPosition]}
    >
      <span className="relative block">
        {/* Layer 1 — outer organic shape, only layer that rotates */}
        <svg
          viewBox="0 0 100 100"
          className="block h-[52px] w-[52px] sm:h-[60px] sm:w-[60px] md:h-[76px] md:w-[76px]"
          style={{ transform: `rotate(${resolvedRotation}deg)` }}
        >
          <g fill={PASTELS[resolvedColor]}>{SHAPES[resolvedShape]}</g>
        </svg>

        {/* Layer 2 — inner white circle */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11 md:h-14 md:w-14">
            {/* Layer 3 — arrow */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-neutral-950 sm:h-5 sm:w-5 md:h-6 md:w-6"
            >
              <path d={ARROW_PATHS[resolvedDirection]} />
            </svg>
          </span>
        </span>
      </span>
    </span>
  );
}
