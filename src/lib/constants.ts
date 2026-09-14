// Layout constants for service section
export const LAYOUT_CONSTANTS = {
  // Service section pill dimensions
  PILL: {
    WIDTH: 48,
    HEIGHT_DESKTOP: 28,
    HEIGHT_MOBILE: 24,
    PAD_X: 16,
    PAD_Y_MOBILE: 4,
  } as const,

  // Service section sticky offsets (mobile, tablet, desktop)
  STICKY_OFFSETS: [
    { mobile: 0, tablet: 0, desktop: 0 },
    { mobile: 67, tablet: 86, desktop: 86 },
    { mobile: 134, tablet: 172, desktop: 172 },
    { mobile: 201, tablet: 258, desktop: 258 },
  ] as const,
};