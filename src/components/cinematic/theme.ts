import type { CSSProperties } from 'react';

export type ThemeMode = 'obsidian' | 'alabaster' | 'studio';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  label: string;
  bgClass: string;
  bgStyle?: CSSProperties;
  prefixTextClass: string;
  suffixTextClass: string;
  metaTextClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  timelineActive: string;
  timelineInactive: string;
  accentGlow?: string;
  cardBg: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian',
    label: 'Dark Agency',
    bgClass: 'bg-[#050505] text-white',
    bgStyle: {
      background: 'radial-gradient(ellipse 85% 70% at 50% 50%, #0d0d11 0%, #050505 100%)',
    },
    prefixTextClass: 'text-neutral-400 font-normal',
    suffixTextClass: 'text-white font-bold',
    metaTextClass: 'text-neutral-500 hover:text-neutral-300',
    borderClass: 'border-white/10',
    badgeBg: 'bg-white text-black hover:bg-neutral-200',
    badgeText: 'text-black',
    timelineActive: 'bg-white text-black shadow-sm',
    timelineInactive: 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white',
    cardBg: 'bg-neutral-900/80',
  },
  alabaster: {
    id: 'alabaster',
    name: 'Alabaster',
    label: 'Editorial Warm',
    bgClass: 'bg-[#f5f4ef] text-neutral-900',
    bgStyle: {
      background: 'radial-gradient(ellipse 85% 70% at 50% 50%, #faf9f5 0%, #edeae3 100%)',
    },
    prefixTextClass: 'text-neutral-500 font-normal',
    suffixTextClass: 'text-neutral-950 font-bold',
    metaTextClass: 'text-neutral-600 hover:text-neutral-900',
    borderClass: 'border-black/10',
    badgeBg: 'bg-neutral-900 text-white hover:bg-neutral-800',
    badgeText: 'text-white',
    timelineActive: 'bg-neutral-950 text-white shadow-sm',
    timelineInactive: 'bg-black/8 text-neutral-600 hover:bg-black/15 hover:text-neutral-950',
    cardBg: 'bg-white/80',
  },
  studio: {
    id: 'studio',
    name: 'Studio',
    label: 'Midnight Cyan',
    bgClass: 'bg-[#080c14] text-sky-50',
    bgStyle: {
      background: 'radial-gradient(ellipse 85% 70% at 50% 50%, #0f172a 0%, #060910 100%)',
    },
    prefixTextClass: 'text-slate-400 font-normal',
    suffixTextClass: 'text-sky-50 font-bold',
    metaTextClass: 'text-slate-500 hover:text-slate-300',
    borderClass: 'border-sky-500/20',
    badgeBg: 'bg-sky-400 text-slate-950 hover:bg-sky-300',
    badgeText: 'text-slate-950',
    timelineActive: 'bg-sky-400 text-slate-950 shadow-sm shadow-sky-500/20',
    timelineInactive: 'bg-sky-950/40 text-sky-300/50 hover:bg-sky-900/50 hover:text-sky-200',
    cardBg: 'bg-slate-900/80',
  },
};
