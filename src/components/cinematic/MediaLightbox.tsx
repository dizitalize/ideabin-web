import React, { useEffect, useRef, useState, RefObject } from 'react';
import { MediaItem } from './types';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from './ui/icons';
import { useFocusTrap } from '@/lib/performance';

interface MediaLightboxProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalItems: number;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
   item,
   isOpen,
   onClose,
   onPrev,
   onNext,
   currentIndex,
   totalItems,
 }) => {
const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { containerRef, setEnabled: setModalEnabled } = useFocusTrap();
    const modalRef = containerRef as RefObject<HTMLDivElement | null>;

useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if (!isOpen) return;
       if (e.key === 'Escape') onClose();
       if (e.key === 'ArrowLeft') onPrev();
       if (e.key === 'ArrowRight') onNext();
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, onClose, onPrev, onNext]);

   // Enable focus trap when modal is open
   useEffect(() => {
     setModalEnabled(isOpen);
   }, [isOpen, setModalEnabled]);

  if (!isOpen || !item) return null;

  return (
    <div
      id="media-lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="media-lightbox-modal"
        ref={modalRef}
        className="relative w-[92vw] max-w-4xl max-h-[90vh] bg-zinc-950/90 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px] md:min-h-[540px]">
          {item.mediaType === 'video' && item.video ? (
            <div className="relative w-full h-full flex items-center justify-center group">
              <video
                ref={videoRef}
                src={item.video}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className="max-h-[82vh] w-full object-contain"
              />
              <button
                id="lightbox-mute-toggle"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 backdrop-blur-md border border-white/10 transition cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
) : (
             <img
               src={item.image}
               alt={item.title}
               loading="lazy"
               className="max-h-[82vh] w-full object-contain select-none"
             />
           )}

          <button
            id="lightbox-prev-btn"
            onClick={onPrev}
            aria-label="Previous media"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white/90 backdrop-blur-md border border-white/10 transition hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="lightbox-next-btn"
            onClick={onNext}
            aria-label="Next media"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white/90 backdrop-blur-md border border-white/10 transition hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-800/80 bg-zinc-950">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
              </span>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {item.subtitle || 'Architectural study of curved volume and typography choreography.'}
            </p>

            {item.tag && (
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 text-zinc-200 border border-white/10">
                {item.tag}
              </span>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-900 text-xs text-zinc-400 flex items-center justify-between font-mono">
            <span>KEYBOARD: ← → ESC</span>
            <span className="text-orange-400 font-medium">3D CYLINDER</span>
          </div>
        </div>
      </div>
    </div>
  );
};
