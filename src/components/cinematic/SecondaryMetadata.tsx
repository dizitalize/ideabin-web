import React, { useState, useEffect } from 'react';
import { easeCinematic, clamp, lerp } from './utils/interpolation';

interface SecondaryMetadataProps {
  time: number;
  isDark?: boolean;
  className?: string;
}

export const SecondaryMetadata: React.FC<SecondaryMetadataProps> = ({ time, isDark = true, className = '' }) => {
  const [terminalHex, setTerminalHex] = useState('0x4F1A');
  const [terminalByte, setTerminalByte] = useState('8B');
  const [randomFlickerMod, setRandomFlickerMod] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
        setTerminalHex(`0x${hex}`);
      }
      if (Math.random() > 0.5) {
        const byte = Math.floor(Math.random() * 0xff).toString(16).toUpperCase().padStart(2, '0');
        setTerminalByte(byte);
      }
      if (Math.random() > 0.7) {
        setRandomFlickerMod(0.35 + Math.random() * 0.65);
      } else {
        setRandomFlickerMod(1);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const isStatement1 = time >= 0.75 && time < 2.05;
  const isStatement2 = time >= 2.85 && time < 4.00;

  if (!isStatement1 && !isStatement2) return null;

  const s1Progress = isStatement1 ? easeCinematic(time, 0.75, 1.1) : 0;
  const s1FadeOut = time > 1.95 && time < 2.05 ? clamp(1 - (time - 1.95) / 0.1, 0, 1) : 1;
  const s1FinalOpacity = s1Progress * s1FadeOut;

  const s2Progress = isStatement2 ? easeCinematic(time, 2.85, 3.2) : 0;
  const s2FadeOut = time > 3.90 && time < 4.00 ? clamp(1 - (time - 3.90) / 0.1, 0, 1) : 1;
  const s2FinalOpacity = s2Progress * s2FadeOut;

  return (
    <div
      id="secondary-metadata-terminal"
      className={`absolute inset-0 pointer-events-none z-30 font-mono text-[9px] sm:text-[10px] tracking-[0.24em] text-neutral-400 select-none overflow-hidden ${className}`}
    >
      {isStatement1 && (
        <>
          <div
            className="absolute top-10 left-10 md:top-14 md:left-16 flex flex-col gap-1.5 will-change-transform"
            style={{
              opacity: s1FinalOpacity * randomFlickerMod,
              transform: `translateY(${lerp(8, 0, s1Progress)}px)`,
            }}
          >
            <div className={`flex items-center gap-2 ${isDark ? 'text-white/90' : 'text-neutral-700'}`}>
              <span className={`inline-block w-1.5 h-1.5 animate-pulse ${isDark ? 'bg-white' : 'bg-neutral-700'}`} />
              <span
                className={`font-medium tracking-widest uppercase ${isDark ? 'text-white' : 'text-neutral-800'}`}
                style={{ animation: 'terminal-flicker-a 2.1s infinite' }}
              >
                BRANDING DESIGN
              </span>
              <span className="text-[8px] text-neutral-400 tracking-normal">[{terminalHex}]</span>
            </div>
            <div
              className="text-neutral-400 pl-3.5"
              style={{ animation: 'terminal-flicker-b 2.7s infinite' }}
            >
              CREATIVE DIRECTION // DEV.01
            </div>
            <div
              className="text-neutral-400 pl-3.5 text-[8.5px]"
              style={{ animation: 'terminal-flicker-c 1.9s infinite' }}
            >
              SYS.TERM // RECV {terminalByte} BYTES
            </div>
          </div>

          <div
            className="absolute top-10 right-10 md:top-14 md:right-16 text-right flex flex-col gap-1.5 will-change-transform"
            style={{
              opacity: s1FinalOpacity * randomFlickerMod,
              transform: `translateY(${lerp(8, 0, s1Progress)}px)`,
            }}
          >
            <div
              className={`font-medium tracking-widest uppercase ${isDark ? 'text-white/90' : 'text-neutral-700'}`}
              style={{ animation: 'terminal-flicker-b 2.4s infinite' }}
            >
              USER EXPERIENCE
            </div>
            <div
              className="text-neutral-400"
              style={{ animation: 'terminal-flicker-a 1.8s infinite' }}
            >
              MOTION SYSTEM // ARCHITECTURAL
            </div>
            <div className="text-neutral-400 text-[8.5px] tracking-widest">
              LATENCY: 0.12MS // BUFFER OK
            </div>
          </div>

          <div
            className="absolute bottom-12 left-10 md:bottom-16 md:left-16 flex flex-col gap-1 will-change-transform"
            style={{
              opacity: s1FinalOpacity * randomFlickerMod,
              transform: `translateY(${lerp(-8, 0, s1Progress)}px)`,
            }}
          >
            <div
              className={`font-medium tracking-widest uppercase ${isDark ? 'text-white/90' : 'text-neutral-700'}`}
              style={{ animation: 'terminal-flicker-c 2.3s infinite' }}
            >
              3D VISUALIZATION
            </div>
            <div
              className="text-neutral-400 text-[8.5px]"
              style={{ animation: 'terminal-flicker-a 2.6s infinite' }}
            >
              AUTOMATION // KINETIC ENGINE
            </div>
          </div>

          <div
            className="absolute bottom-12 right-10 md:bottom-16 md:right-16 text-right flex flex-col gap-1 will-change-transform"
            style={{
              opacity: s1FinalOpacity * randomFlickerMod,
              transform: `translateY(${lerp(-8, 0, s1Progress)}px)`,
            }}
          >
            <div
              className={`font-medium tracking-widest uppercase ${isDark ? 'text-white/90' : 'text-neutral-700'}`}
              style={{ animation: 'terminal-flicker-b 2.2s infinite' }}
            >
              DIGITAL SYSTEMS
            </div>
            <div
              className="text-neutral-400 text-[8.5px]"
              style={{ animation: 'terminal-flicker-c 3.1s infinite' }}
            >
              CHOREOGRAPHY: CUBIC [0.16, 1.0, 0.30, 1.0]
            </div>
          </div>
        </>
      )}

      {isStatement2 && (
        <div
          className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center will-change-transform"
          style={{
            opacity: s2FinalOpacity * randomFlickerMod,
            transform: `translate(-50%, ${lerp(6, 0, s2Progress)}px)`,
          }}
        >
          <div
            className="tracking-[0.35em] text-[9px] text-neutral-400 uppercase flex items-center justify-center gap-2"
            style={{ animation: 'terminal-flicker-a 1.6s infinite' }}
          >
            <span className="inline-block w-1.5 h-1.5 bg-neutral-400 rounded-full" />
            <span>TERMINAL PULL: UNCOMMON SPECIFICATION // {terminalHex}</span>
          </div>
        </div>
      )}
    </div>
  );
};
