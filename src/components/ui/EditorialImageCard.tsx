import React, { useId } from "react";
import type { CSSProperties } from "react";

export type TextPosition = "bottom-left" | "bottom-right" | "lower-center";
export type TextAlign = "left" | "right" | "center";
export type BadgeKind = "none" | "flame" | "star" | "sparkle" | "plus" | "arrow";
export type BadgePosition = "top-left" | "top-right" | "center-left" | "center-right";

export interface EditorialCardConfig {
  /** CSS object-position — controls subject placement within the frame. */
  imagePosition: string;
  textPosition: TextPosition;
  /** Panel width as a CSS percentage (45%–75%). */
  textWidth: string;
  textAlign: TextAlign;
  cutout: CutoutId;
  badge: BadgeKind;
  badgePosition: BadgePosition;
  /** Card border-radius, e.g. "32px" or "48px 24px 32px 60px". */
  cornerRadius: string;
  /** Headline shaping: max width in ch — smaller value → more lines. */
  headlineMaxChars: number;
}

export type CutoutId =
  | "organic-hill"
  | "s-curve"
  | "big-bulge"
  | "quarter-scoop"
  | "diagonal-sweep"
  | "wave"
  | "blob"
  | "stepped"
  | "concave-double"
  | "notch";

/**
 * Organic white cutouts. Each path fills a 200x50 viewBox from an irregular
 * top edge down to the flat bottom; rendered with preserveAspectRatio="none"
 * directly above the text panel so the white appears to grow out of the photo.
 * The panel itself is a plain rect — the cap supplies all the sculpture.
 */
const CUTOUTS: Record<CutoutId, { path: string; capHeight: number }> = {
  "organic-hill": {
    path: "M0 50 L0 34 Q30 12 70 22 T130 14 Q170 8 200 30 L200 50 Z",
    capHeight: 40,
  },
  "s-curve": {
    path: "M0 50 L0 26 C36 4 66 46 104 28 C142 10 172 36 200 20 L200 50 Z",
    capHeight: 46,
  },
  "big-bulge": {
    path: "M0 50 L0 36 Q44 36 66 14 Q92 0 118 12 Q140 32 200 30 L200 50 Z",
    capHeight: 52,
  },
  "quarter-scoop": {
    path: "M0 50 L0 16 Q0 4 14 4 L146 4 Q200 4 200 46 L200 50 Z",
    capHeight: 36,
  },
  "diagonal-sweep": {
    path: "M0 50 L0 6 Q64 2 124 18 Q170 30 200 42 L200 50 Z",
    capHeight: 48,
  },
  wave: {
    path: "M0 50 L0 30 Q26 10 52 26 T104 24 T156 28 T200 22 L200 50 Z",
    capHeight: 38,
  },
  blob: {
    path: "M0 50 L0 28 Q8 8 32 14 Q52 2 74 16 Q96 28 118 12 Q146 0 168 18 Q186 32 200 24 L200 50 Z",
    capHeight: 50,
  },
  stepped: {
    path: "M0 50 L0 40 Q0 32 8 32 L50 32 Q58 32 58 24 L58 14 Q58 6 66 6 L142 6 Q150 6 150 14 L150 20 Q150 26 158 26 L200 26 L200 50 Z",
    capHeight: 34,
  },
  "concave-double": {
    path: "M0 50 L0 16 Q50 44 100 24 Q150 2 200 28 L200 50 Z",
    capHeight: 42,
  },
  notch: {
    path: "M0 50 L0 30 L52 30 Q60 30 60 22 L60 14 Q60 6 70 6 L200 6 L200 50 Z",
    capHeight: 30,
  },
};

/**
 * Curated art direction. imagePosition and textPosition are always paired so
 * the cutout sits on the image's negative space, never over the subject.
 */
export const EDITORIAL_CONFIGS: EditorialCardConfig[] = [
  { imagePosition: "70% center", textPosition: "bottom-left", textWidth: "62%", textAlign: "left", cutout: "organic-hill", badge: "flame", badgePosition: "top-left", cornerRadius: "32px", headlineMaxChars: 14 },
  { imagePosition: "25% center", textPosition: "bottom-right", textWidth: "58%", textAlign: "right", cutout: "s-curve", badge: "none", badgePosition: "top-left", cornerRadius: "36px 36px 20px 48px", headlineMaxChars: 12 },
  { imagePosition: "center 25%", textPosition: "lower-center", textWidth: "66%", textAlign: "center", cutout: "big-bulge", badge: "star", badgePosition: "top-right", cornerRadius: "40px", headlineMaxChars: 16 },
  { imagePosition: "left center", textPosition: "bottom-right", textWidth: "52%", textAlign: "right", cutout: "quarter-scoop", badge: "none", badgePosition: "top-left", cornerRadius: "48px 24px 32px 60px", headlineMaxChars: 11 },
  { imagePosition: "right center", textPosition: "bottom-left", textWidth: "70%", textAlign: "left", cutout: "diagonal-sweep", badge: "sparkle", badgePosition: "center-right", cornerRadius: "32px 32px 48px 20px", headlineMaxChars: 15 },
  { imagePosition: "center", textPosition: "bottom-left", textWidth: "48%", textAlign: "left", cutout: "wave", badge: "plus", badgePosition: "top-left", cornerRadius: "28px", headlineMaxChars: 10 },
  { imagePosition: "60% 35%", textPosition: "bottom-right", textWidth: "64%", textAlign: "right", cutout: "blob", badge: "none", badgePosition: "top-right", cornerRadius: "36px", headlineMaxChars: 13 },
  { imagePosition: "40% 60%", textPosition: "bottom-left", textWidth: "56%", textAlign: "left", cutout: "stepped", badge: "arrow", badgePosition: "center-left", cornerRadius: "24px 48px 36px 32px", headlineMaxChars: 12 },
  { imagePosition: "center 20%", textPosition: "lower-center", textWidth: "72%", textAlign: "center", cutout: "concave-double", badge: "star", badgePosition: "top-left", cornerRadius: "44px 44px 28px 28px", headlineMaxChars: 17 },
  { imagePosition: "80% center", textPosition: "bottom-left", textWidth: "50%", textAlign: "left", cutout: "notch", badge: "none", badgePosition: "top-right", cornerRadius: "32px 60px 32px 24px", headlineMaxChars: 10 },
  { imagePosition: "20% center", textPosition: "bottom-right", textWidth: "68%", textAlign: "right", cutout: "organic-hill", badge: "flame", badgePosition: "top-right", cornerRadius: "40px", headlineMaxChars: 14 },
  { imagePosition: "center 70%", textPosition: "bottom-left", textWidth: "60%", textAlign: "left", cutout: "s-curve", badge: "sparkle", badgePosition: "top-left", cornerRadius: "28px 28px 52px 36px", headlineMaxChars: 12 },
  { imagePosition: "65% 30%", textPosition: "bottom-right", textWidth: "46%", textAlign: "right", cutout: "big-bulge", badge: "plus", badgePosition: "center-right", cornerRadius: "56px 32px 40px 24px", headlineMaxChars: 9 },
  { imagePosition: "35% 65%", textPosition: "bottom-left", textWidth: "74%", textAlign: "left", cutout: "quarter-scoop", badge: "none", badgePosition: "top-left", cornerRadius: "32px", headlineMaxChars: 18 },
];

function hashSeed(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (Math.imul(h, 31) + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Resolved config index for a seed — lets callers coordinate adjacent cards. */
export function editorialConfigIndex(seed: string, avoidIndex = -1): number {
  let idx = hashSeed(seed) % EDITORIAL_CONFIGS.length;
  if (idx === avoidIndex) idx = (idx + 1) % EDITORIAL_CONFIGS.length;
  return idx;
}

const TEXT_POSITION_STYLES: Record<TextPosition, CSSProperties> = {
  "bottom-left": { left: 0, bottom: 0 },
  "bottom-right": { right: 0, bottom: 0 },
  "lower-center": { left: "50%", bottom: 0, transform: "translateX(-50%)" },
};

const BADGE_POSITION_CLASSES: Record<BadgePosition, string> = {
  "top-left": "left-4 top-4",
  "top-right": "right-4 top-4",
  "center-left": "left-4 top-[42%] -translate-y-1/2",
  "center-right": "right-4 top-[42%] -translate-y-1/2",
};

const TEXT_ALIGN_CLASSES: Record<TextAlign, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

const HEADLINE_JUSTIFY: Record<TextAlign, string> = {
  left: "",
  right: "ml-auto",
  center: "mx-auto",
};

const SIZE_CLASSES = {
  lg: {
    headline: "text-[1.7rem] sm:text-4xl lg:text-[2.5rem]",
    meta: "text-[11px] sm:text-xs",
    panel: "px-5 sm:px-7 pb-5 sm:pb-7",
  },
  md: {
    headline: "text-lg sm:text-xl lg:text-2xl",
    meta: "text-[10px] sm:text-[11px]",
    panel: "px-4 sm:px-5 pb-4 sm:pb-5",
  },
} as const;

function BadgeIcon({ kind }: { kind: Exclude<BadgeKind, "none"> }) {
  const common = "w-5 h-5";
  switch (kind) {
    case "flame":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M12 2c.6 3.2-.9 5.1-2.5 7C7.9 10.9 6 13 6 16a6 6 0 0 0 12 0c0-1.6-.6-2.9-1.4-4-.3 1-1 1.8-1.9 2.2.3-3.4-1-6.9-2.7-9.2-.1-.5-.6-1-1-3Zm0 20a4 4 0 0 1-4-4c0-2 1.3-3.5 2.7-5 .8-.9 1.6-1.8 2.1-2.8 1 1.7 1.8 3.6 1.9 5.5l-.2 1.5 1.3-.9c.4 1.5.2 2.6.2 2.7a4 4 0 0 1-4 4Z" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.6 1-4.8 4.6 1.1 6.6L12 17.8 6.2 20.5l1.1-6.6L2.5 9.3l6.6-1L12 2z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M12 2c.7 4.8 3.5 7.6 8.3 8.3-4.8.7-7.6 3.5-8.3 8.3-.7-4.8-3.5-7.6-8.3-8.3C8.5 9.6 11.3 6.8 12 2zM19 15c.3 2 1.5 3.2 3.5 3.5-2 .3-3.2 1.5-3.5 3.5-.3-2-1.5-3.2-3.5-3.5 2-.3 3.2-1.5 3.5-3.5z" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={common} aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={common} aria-hidden="true">
          <path d="M7 17L17 7M8 7h9v9" />
        </svg>
      );
  }
}

const BADGE_ICON_COLORS: Record<Exclude<BadgeKind, "none">, string> = {
  flame: "text-orange-500",
  star: "text-neutral-900",
  sparkle: "text-neutral-900",
  plus: "text-neutral-900",
  arrow: "text-neutral-900",
};

export interface EditorialImageCardProps {
  /** "random" picks a curated config from the seed; every field overridable via `config`. */
  variant?: "random";
  seed?: string;
  /** Skip this config index so adjacent cards never repeat the same design. */
  avoidIndex?: number;
  config?: Partial<EditorialCardConfig>;
  image: string;
  title: string;
  category: string;
  date: string;
  size?: keyof typeof SIZE_CLASSES;
  priority?: boolean;
  /** Rendered above the photo, below the text panel (play buttons, chips...). */
  mediaOverlay?: React.ReactNode;
  className?: string;
}

export default function EditorialImageCard({
  seed,
  avoidIndex = -1,
  config,
  image,
  title,
  category,
  date,
  size = "lg",
  priority = false,
  mediaOverlay,
  className = "",
}: EditorialImageCardProps) {
  const autoSeed = useId();
  const picked = EDITORIAL_CONFIGS[editorialConfigIndex(seed ?? autoSeed, avoidIndex)];
  const cfg: EditorialCardConfig = { ...picked, ...config };
  const cutout = CUTOUTS[cfg.cutout];
  const sizes = SIZE_CLASSES[size];

  const panelStyle: CSSProperties = {
    ...TEXT_POSITION_STYLES[cfg.textPosition],
    width: cfg.textWidth,
  };

  return (
    <article
      aria-label={title}
      className={`relative w-full h-full overflow-hidden bg-white ${className}`}
      style={{ borderRadius: cfg.cornerRadius }}
    >
      <img
        src={image}
        alt={title}
        loading={priority ? "eager" : "lazy"}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: cfg.imagePosition }}
      />

      {mediaOverlay && <div className="absolute inset-0 z-10 pointer-events-none">{mediaOverlay}</div>}

      {cfg.badge !== "none" && (
        <span
          aria-hidden="true"
          className={`absolute z-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md shadow-sm ${BADGE_POSITION_CLASSES[cfg.badgePosition]}`}
          style={{ width: 40, height: 40 }}
        >
          <span className={BADGE_ICON_COLORS[cfg.badge]}>
            <BadgeIcon kind={cfg.badge} />
          </span>
        </span>
      )}

      {/* Text panel + organic cutout cap */}
      <div className="absolute z-20" style={panelStyle}>
        <svg
          aria-hidden="true"
          className="absolute bottom-full left-0 block w-full"
          style={{ height: cutout.capHeight }}
          viewBox="0 0 200 50"
          preserveAspectRatio="none"
        >
          <path d={cutout.path} fill="#ffffff" />
        </svg>
        <div className={`bg-white ${TEXT_ALIGN_CLASSES[cfg.textAlign]} ${sizes.panel}`}>
          <div className={`flex items-center gap-2 font-bold text-neutral-950 ${sizes.meta} ${cfg.textAlign !== "left" ? "justify-center" : ""}`}>
            <span className="uppercase tracking-wide">Category · {category}</span>
            <span className="text-neutral-300">|</span>
            <span className="font-semibold text-neutral-500">{date}</span>
          </div>
          <h3
            className={`font-sora font-extrabold uppercase text-neutral-950 leading-[0.95] tracking-tight mt-1.5 ${HEADLINE_JUSTIFY[cfg.textAlign]} ${sizes.headline}`}
            style={{ maxWidth: `${cfg.headlineMaxChars}ch` }}
          >
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
}
