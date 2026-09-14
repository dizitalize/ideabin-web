export interface AnnotationConfig {
  text: string;
  subtext?: string;
  arrowPath?: string;
  arrowHeadPath?: string;
  arrowDirection?: 'down-right' | 'down-left' | 'up-right' | 'up-left';
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  targetNoteId: string;
  doodles?: Array<{
    type: 'star' | 'heart' | 'spark' | 'smiley' | 'underline';
    x: number;
    y: number;
  }>;
}

export interface CrypticSecret {
  code: string;
  message: string;
  doodle: 'illuminati' | 'key' | 'coffee' | 'diamond' | 'hourglass' | 'rabbit' | 'star' | 'zap';
  authorNote: string;
  badge?: string;
}

export interface StickyTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  color: {
    bg: string;
    text: string;
    subtext: string;
    nameText: string;
    shadowClass: string;
    accentGlow: string;
  };
  fastener: 'tape-light' | 'tape-dark' | 'pin-purple' | 'pin-green' | 'pin-red';
  baseRotation: number;
  hasFoldedCorner?: boolean;
  position: {
    desktop: { top: string; left: string; width: string };
  };
  hiddenUnderId?: string; // If this note is initially tucked behind another note
  coversNoteId?: string; // The note this one initially obscures
  isRevealed?: boolean;
  tags?: string[];
  crypticSecret?: CrypticSecret;
}
