/**
 * Tactile Web Audio synthesizer for physical paper interactions.
 * Synthesizes organic paper rustle and soft tap sound effects without external audio files.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function toggleAudio(enabled?: boolean): boolean {
  if (enabled !== undefined) {
    soundEnabled = enabled;
  } else {
    soundEnabled = !soundEnabled;
  }
  return soundEnabled;
}

export function isAudioEnabled(): boolean {
  return soundEnabled;
}

/**
 * Plays a realistic soft paper rustle sound when picking up or moving a sticky note
 */
export function playPaperRustle(intensity = 1): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink-ish noise filter
      lastOut = (lastOut * 0.94) + (white * 0.06);
      // Fade out envelope
      const env = Math.exp(-i / (ctx.sampleRate * 0.035));
      data[i] = lastOut * env * 0.25 * intensity;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for crisp paper friction
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1400;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 3200;
    bandpass.Q.value = 1.2;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.3 * intensity, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
  } catch {
    // Graceful silent fallback if AudioContext is prevented by browser policy
  }
}

/**
 * Plays a subtle tactile tap when placing or clicking a push pin / tape
 */
export function playTactileTap(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // silent fallback
  }
}

/**
 * Synthesizes an authentic, tactile paper ripping/tearing sound effect
 * with distinct fibrous fiber-snap transients and frequency sweep.
 */
export function playPaperRip(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = 0.42;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastNoise = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const progress = t / duration;

      // Micro-tears (fibers giving way in irregular bursts)
      const fiberTension = Math.sin(progress * Math.PI * 18) > 0.3 ? 1.4 : 0.6;
      const microRip = Math.sin(progress * 120) * 0.3 + 0.7;

      const white = Math.random() * 2 - 1;
      lastNoise = (lastNoise * 0.82) + (white * 0.18);

      // Envelope: initial snag, rising tear intensity, fast release
      let env = 1.0;
      if (progress < 0.1) {
        env = progress / 0.1;
      } else if (progress > 0.75) {
        env = Math.max(0, (1 - progress) / 0.25);
      }

      data[i] = lastNoise * env * fiberTension * microRip * 0.45;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Sweeping bandpass filter: simulates paper fibers snapping progressively
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + duration);
    filter.Q.value = 1.8;

    // Highpass to eliminate unnatural low mud
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(800, ctx.currentTime);

    // Subtle paper pop at the final sever
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, ctx.currentTime + 0.28);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + duration);
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.28);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(hp);
    hp.connect(masterGain);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    masterGain.connect(ctx.destination);

    source.start();
    osc.start(ctx.currentTime + 0.28);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // silent fallback
  }
}

