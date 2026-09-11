/**
 * Procedural cinematic sound design engine using Web Audio API.
 * Synthesizes deep sub-bass impacts, pneumatic shutter snaps, slice glitch clicks,
 * geometric collapse suctions, and minimal crystal brand chimes.
 */

export class CinematicSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneSubOsc: OscillatorNode | null = null;
  private isDroneRunning: boolean = false;

  constructor() {
    // Lazy initialized on user gesture
  }

  public initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.65, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public startAmbientDrone() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.isDroneRunning) return;

    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      } catch {}
    }
    if (this.droneSubOsc) {
      try {
        this.droneSubOsc.stop();
        this.droneSubOsc.disconnect();
      } catch {}
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(43.65, t);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(21.83, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(110, t);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 1.2);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    subOsc.start();

    this.droneOsc = osc;
    this.droneSubOsc = subOsc;
    this.droneGain = gain;
    this.isDroneRunning = true;
  }

  public stopAmbientDrone() {
    if (this.droneGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.droneGain.gain.setTargetAtTime(0.0001, t, 0.4);
    }
    this.isDroneRunning = false;
  }

  public playWordSlam(pitchMod: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110 * pitchMod, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.18);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.24);
  }

  public playBrandReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const freqs = [440, 659.25, 880];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.03);

      gain.gain.setValueAtTime(0.18 / (idx + 1), t + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.03);
      osc.stop(t + 1.7);
    });
  }

  public playBarTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.03);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.04);
  }
}

/**
 * Kinetic typography mathematical interpolation helpers.
 */

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function getProgress(t: number, start: number, end: number): number {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return (t - start) / (end - start);
}

function solveCubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const oneMinusT = 1 - t;
  return (
    Math.pow(oneMinusT, 3) * p0 +
    3 * Math.pow(oneMinusT, 2) * t * p1 +
    3 * oneMinusT * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
}

export function cubicEase(progress: number, x1: number, y1: number, x2: number, y2: number): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  let t = progress;
  for (let i = 0; i < 6; i++) {
    const currentX = solveCubicBezier(0, x1, x2, 1, t);
    const derivative = 3 * Math.pow(1 - t, 2) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * Math.pow(t, 2) * (1 - x2);
    if (Math.abs(currentX - progress) < 1e-4 || Math.abs(derivative) < 1e-6) break;
    t -= (currentX - progress) / derivative;
    t = clamp(t, 0, 1);
  }
  return solveCubicBezier(0, y1, y2, 1, t);
}

export function easeCinematic(t: number, start: number, end: number): number {
  const p = getProgress(t, start, end);
  return cubicEase(p, 0.16, 1, 0.3, 1);
}

export function easeBrand(t: number, start: number, end: number): number {
  const p = getProgress(t, start, end);
  return cubicEase(p, 0.22, 1, 0.36, 1);
}

export function lerp(a: number, b: number, factor: number): number {
  return a + (b - a) * factor;
}

export const soundEngine = new CinematicSoundEngine();
