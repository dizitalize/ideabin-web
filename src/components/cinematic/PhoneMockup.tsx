import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'dark' | 'light';
  notch?: boolean;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  className = '',
  notch = true,
}) => {
  return (
    <div
      className={`relative w-[280px] sm:w-[310px] h-[580px] sm:h-[640px] rounded-[46px] p-3 bg-gradient-to-b from-[#1c1c20] via-[#101013] to-[#070709] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12)] select-none shrink-0 ${className}`}
    >
      <div className="absolute inset-0 rounded-[46px] border border-white/15 pointer-events-none" />

      <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-black flex flex-col">
        {notch && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5 border border-white/10 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#1b2a4a]" />
            </div>
            <div className="w-2 h-2 rounded-full bg-orange-500/80 animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
          </div>
        )}

        <div className="relative flex-1 w-full h-full overflow-hidden">
          {children}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-40" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] mix-blend-overlay" />
      </div>
    </div>
  );
};
