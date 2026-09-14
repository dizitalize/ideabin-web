import React from 'react';

interface PushPinProps {
  color: 'purple' | 'green' | 'red';
  className?: string;
}

export const PushPin: React.FC<PushPinProps> = ({ color, className = '' }) => {
  // Pin color palettes for ultra-realistic physical rendering
  const colorMap = {
    purple: {
      headGrad1: '#b07cf7',
      headGrad2: '#7938e2',
      headGrad3: '#4c1d95',
      rimGrad: '#c49dfa',
      specular: '#e9d5ff',
      shadowColor: 'rgba(50, 16, 110, 0.65)',
    },
    green: {
      headGrad1: '#2ea879',
      headGrad2: '#166542',
      headGrad3: '#083321',
      rimGrad: '#5eead4',
      specular: '#ccfbf1',
      shadowColor: 'rgba(8, 51, 33, 0.7)',
    },
    red: {
      headGrad1: '#f87171',
      headGrad2: '#dc2626',
      headGrad3: '#7f1d1d',
      rimGrad: '#fca5a5',
      specular: '#fee2e2',
      shadowColor: 'rgba(80, 15, 15, 0.7)',
    },
  };

  const c = colorMap[color] || colorMap.purple;

  return (
    <div
      className={`absolute z-30 pointer-events-none -top-3.5 left-1/2 -translate-x-1/2 ${className}`}
      style={{ width: '28px', height: '32px' }}
    >
      <svg
        viewBox="0 0 40 46"
        className="w-full h-full filter drop-shadow-[0_8px_6px_rgba(0,0,0,0.7)]"
      >
        <defs>
          {/* Ambient directional shadow under pin head */}
          <radialGradient id={`pin-shadow-${color}`} cx="45%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.85)" />
            <stop offset="60%" stopColor={c.shadowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* 3D Top Dome Gradient */}
          <radialGradient id={`pin-dome-${color}`} cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor={c.specular} />
            <stop offset="25%" stopColor={c.headGrad1} />
            <stop offset="70%" stopColor={c.headGrad2} />
            <stop offset="100%" stopColor={c.headGrad3} />
          </radialGradient>

          {/* Pin Rim Gradient */}
          <linearGradient id={`pin-rim-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.rimGrad} />
            <stop offset="50%" stopColor={c.headGrad2} />
            <stop offset="100%" stopColor={c.headGrad3} />
          </linearGradient>

          {/* Metal point specular */}
          <linearGradient id="needle-metal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#71717a" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#27272a" />
          </linearGradient>
        </defs>

        {/* Ground shadow cast by pin */}
        <ellipse cx="23" cy="38" rx="9" ry="4.5" fill={`url(#pin-shadow-${color})`} />

        {/* Tiny metal needle entering paper */}
        <polygon points="19,30 21,30 20.5,36 19.5,36" fill="url(#needle-metal)" />

        {/* Pin Stem Base */}
        <path
          d="M 16 22 C 16 28, 24 28, 24 22 Z"
          fill={`url(#pin-rim-${color})`}
        />

        {/* Middle Collar Rim */}
        <ellipse cx="20" cy="20" rx="6.5" ry="3" fill={`url(#pin-rim-${color})`} />

        {/* Spherical / Conical Pin Head */}
        <circle cx="20" cy="13" r="10.5" fill={`url(#pin-dome-${color})`} />

        {/* Specular Highlight on Glassy / Glossy Pin Head */}
        <ellipse
          cx="17"
          cy="9.5"
          rx="3.2"
          ry="2"
          fill="#ffffff"
          opacity="0.85"
          transform="rotate(-20 17 9.5)"
        />
        <circle cx="16" cy="14" r="1.2" fill="#ffffff" opacity="0.45" />
      </svg>
    </div>
  );
};
