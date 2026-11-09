/**
 * Synthesised firecracker audio built with the Web Audio API, so the feature
 * ships without any sound files. Nothing plays until `unlock()` runs from a
 * user gesture, which browsers require before audio can start.
 */
export class CrackerSound {
  private ctx: AudioContext | null = null;
  private noise: AudioBuffer | null = null;
  private muted = false;
  private lastCrackle = 0;

  unlock() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.ctx = ctx;
      this.noise = buf;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  dispose() {
    void this.ctx?.close();
    this.ctx = null;
  }

  private live(): AudioContext | null {
    if (!this.ctx || !this.noise || this.muted || this.ctx.state !== 'running') return null;
    return this.ctx;
  }

  /** Plays a short band-filtered noise burst with an exponential envelope. */
  private noiseBurst(
    ctx: AudioContext,
    opts: {
      duration: number;
      gain: number;
      filter: BiquadFilterType;
      freqFrom: number;
      freqTo: number;
      q?: number;
    },
  ) {
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.start(now, Math.random() * 1.5, opts.duration + 0.05);

    const filter = ctx.createBiquadFilter();
    filter.type = opts.filter;
    filter.Q.value = opts.q ?? 0.8;
    filter.frequency.setValueAtTime(opts.freqFrom, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(20, opts.freqTo), now + opts.duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(opts.gain, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);

    src.connect(filter).connect(gain).connect(ctx.destination);
  }

  click() {
    const ctx = this.live();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1100;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  whoosh() {
    const ctx = this.live();
    if (!ctx) return;
    this.noiseBurst(ctx, {
      duration: 0.9,
      gain: 0.22,
      filter: 'bandpass',
      freqFrom: 300,
      freqTo: 2400,
      q: 1.2,
    });
  }

  /** A single tiny pop, throttled so dense sparks do not stack into noise. */
  crackle(intensity = 0.5) {
    const ctx = this.live();
    if (!ctx) return;
    const now = performance.now();
    if (now - this.lastCrackle < 30) return;
    this.lastCrackle = now;
    this.noiseBurst(ctx, {
      duration: 0.04,
      gain: 0.12 * intensity + 0.02,
      filter: 'highpass',
      freqFrom: 1800 + Math.random() * 1200,
      freqTo: 1500,
    });
  }

  boom(intensity = 1) {
    const ctx = this.live();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.noiseBurst(ctx, {
      duration: 1.1,
      gain: 0.85 * intensity,
      filter: 'lowpass',
      freqFrom: 500,
      freqTo: 60,
      q: 0.7,
    });

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);
    gain.gain.setValueAtTime(0.5 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.75);
  }
}
