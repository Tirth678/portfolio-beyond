import type { CrackerSound } from './sound';

export type CrackerId = 'anar' | 'chakri' | 'rocket' | 'phooljhadi' | 'laxmi';

export interface CrackerDef {
  id: CrackerId;
  name: string;
  emoji: string;
  hint: string;
  key: string;
}

export const CRACKERS: CrackerDef[] = [
  { id: 'anar', name: 'Anar', emoji: '🎇', hint: 'Ground fountain', key: '1' },
  { id: 'chakri', name: 'Chakri', emoji: '🌀', hint: 'Spinning wheel', key: '2' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', hint: 'Sky burst', key: '3' },
  { id: 'phooljhadi', name: 'Phooljhadi', emoji: '✨', hint: 'Sparkler shower', key: '4' },
  { id: 'laxmi', name: 'Laxmi Bomb', emoji: '🧨', hint: 'Thunder flash', key: '5' },
];

type Kind = 'spark' | 'glow' | 'ring' | 'smoke';

interface Particle {
  kind: Kind;
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  /** radius for glow/ring/smoke, line width for sparks */
  size: number;
  grow: number;
  color: string;
  gravity: number;
  damp: number;
}

interface Task {
  age: number;
  duration: number;
  onFrame?: (dt: number, age: number) => void;
  onEnd?: () => void;
}

/** Colour pairs: [core, halo]. */
const PALETTES: [string, string][] = [
  ['#ffb347', '#ffe08a'],
  ['#ff5e7e', '#ffb3c1'],
  ['#7fd8ff', '#d7f4ff'],
  ['#b2ff7a', '#eaffc2'],
  ['#ffd700', '#fff6b0'],
  ['#ff8fe0', '#ffd1f5'],
];

const MAX_PARTICLES = 2400;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]): T => arr[(Math.random() * arr.length) | 0];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * A small particle engine drawn onto the camera canvas. Each cracker is a recipe
 * of particles, glows, rings and timed tasks, so the animations stay
 * independent of the hand tracking.
 */
export class Fireworks {
  particles: Particle[] = [];
  private tasks: Task[] = [];
  flash = 0;
  shake = 0;
  /** Scale factor from viewport size, so effects look right on any screen. */
  s = 1;
  w = 0;
  h = 0;

  constructor(private sound: CrackerSound) {}

  resize(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.s = clamp(Math.min(w, h) / 850, 0.55, 1.6);
  }

  fire(id: CrackerId, x: number, y: number) {
    switch (id) {
      case 'anar':
        return this.anar(x, y);
      case 'chakri':
        return this.chakri(x, y);
      case 'rocket':
        return this.rocket(x, y);
      case 'phooljhadi':
        return this.phooljhadi(x, y);
      case 'laxmi':
        return this.laxmi(x, y);
    }
  }

  /** Small expanding ring that confirms a tap landed. */
  ripple(x: number, y: number) {
    this.add({ kind: 'ring', x, y, size: 8 * this.s, grow: 90 * this.s, life: 0.35, color: '#ffe9a6' });
  }

  update(dt: number) {
    const current = this.tasks;
    this.tasks = [];
    const alive: Task[] = [];
    const ending: Task[] = [];
    for (const t of current) {
      t.age += dt;
      t.onFrame?.(dt, t.age);
      if (t.age >= t.duration) ending.push(t);
      else alive.push(t);
    }
    this.tasks = [...alive, ...this.tasks];
    for (const t of ending) t.onEnd?.();

    for (const p of this.particles) {
      p.age += dt;
      p.px = p.x;
      p.py = p.y;
      p.vy += p.gravity * dt;
      const f = Math.exp(-p.damp * dt);
      p.vx *= f;
      p.vy *= f;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.size += p.grow * dt;
    }
    this.particles = this.particles.filter((p) => p.age < p.life && p.size > 0.05);

    this.flash = Math.max(0, this.flash - dt * 3.2);
    this.shake = Math.max(0, this.shake - dt * 1.8);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255, 248, 230, ${this.flash * 0.55})`;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    // Smoke is drawn with normal blending so it reads as haze, not light.
    ctx.globalCompositeOperation = 'source-over';
    for (const p of this.particles) {
      if (p.kind !== 'smoke') continue;
      const a = (1 - p.age / p.life) * 0.28;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'lighter';
    for (const p of this.particles) {
      if (p.kind === 'smoke') continue;
      const t = p.age / p.life;
      const a = 1 - t;
      if (p.kind === 'spark') {
        ctx.globalAlpha = a;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(0.6, p.size);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else if (p.kind === 'glow') {
        const r = Math.max(0.5, p.size);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, p.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = a;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'ring') {
        ctx.globalAlpha = a * 0.9;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1 + 3 * this.s * a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  get count() {
    return this.particles.length;
  }

  // ---- internals -------------------------------------------------------

  private add(p: Partial<Particle> & Pick<Particle, 'kind' | 'x' | 'y'>) {
    this.particles.push({
      px: p.x,
      py: p.y,
      vx: 0,
      vy: 0,
      age: 0,
      life: 1,
      size: 2,
      grow: 0,
      color: '#ffffff',
      gravity: 0,
      damp: 0,
      ...p,
    });
    if (this.particles.length > MAX_PARTICLES) {
      this.particles.splice(0, this.particles.length - MAX_PARTICLES);
    }
  }

  private over(duration: number, onFrame: (dt: number, age: number) => void, onEnd?: () => void) {
    this.tasks.push({ age: 0, duration, onFrame, onEnd });
  }

  private after(delay: number, fn: () => void) {
    this.tasks.push({ age: 0, duration: delay, onEnd: fn });
  }

  /** Anar: a fountain of sparks that sprays upward and falls back down. */
  private anar(x: number, y: number) {
    const s = this.s;
    const colors = ['#ffd27a', '#ff9f43', '#fff1b8', '#ff7a1a', '#ffffff'];
    this.add({ kind: 'glow', x, y, size: 40 * s, grow: 60 * s, life: 0.5, color: '#ffb347' });
    this.sound.boom(0.25);
    this.over(3.2, (dt, age) => {
      const fade = age > 2.6 ? 1 - (age - 2.6) / 0.6 : 1;
      const n = Math.max(1, Math.round(dt * 170 * fade));
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + rnd(-0.42, 0.42);
        const sp = rnd(220, 460) * s;
        this.add({
          kind: 'spark',
          x: x + rnd(-6, 6) * s,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: rnd(0.7, 1.5),
          size: rnd(1.2, 2.6) * s,
          color: pick(colors),
          gravity: 420 * s,
          damp: 0.9,
        });
      }
      if (Math.random() < dt * 6) this.sound.crackle(0.5);
    });
  }

  /** Chakri: a spinning wheel whose three arms throw sparks tangentially. */
  private chakri(x: number, y: number) {
    const s = this.s;
    const R = 34 * s;
    const omega = 7;
    this.sound.whoosh();
    this.over(3.6, (dt, age) => {
      const theta = age * omega;
      const fade = age > 3 ? 1 - (age - 3) / 0.6 : 1;
      this.add({ kind: 'glow', x, y, size: 26 * s, life: 0.09, color: '#ffb84d' });
      for (let arm = 0; arm < 3; arm++) {
        const a = theta + (arm * Math.PI * 2) / 3;
        const px = x + Math.cos(a) * R;
        const py = y + Math.sin(a) * R;
        const n = Math.max(1, Math.round(dt * 120 * fade));
        for (let k = 0; k < n; k++) {
          const tang = omega * R * 0.8;
          this.add({
            kind: 'spark',
            x: px,
            y: py,
            px,
            py,
            vx: -Math.sin(a) * tang + Math.cos(a) * 60 * s + rnd(-30, 30) * s,
            vy: Math.cos(a) * tang + Math.sin(a) * 60 * s + rnd(-30, 30) * s,
            life: rnd(0.5, 1.0),
            size: rnd(1, 2.2) * s,
            color: pick(['#ffd27a', '#ff6a3d', '#fff7d1']),
            gravity: 80 * s,
            damp: 1.4,
          });
        }
      }
      if (Math.random() < dt * 5) this.sound.crackle(0.35);
    });
  }

  /** Rocket: climbs from the bottom of the screen, then bursts at the target. */
  private rocket(x: number, y: number) {
    const s = this.s;
    const startY = this.h + 30 * s;
    const travel = 0.95;
    const palette = pick(PALETTES);
    this.sound.whoosh();
    this.over(
      travel,
      (dt, age) => {
        const t = Math.min(1, age / travel);
        const e = 1 - Math.pow(1 - t, 3);
        const hy = startY + (y - startY) * e;
        this.add({ kind: 'glow', x, y: hy, size: 12 * s, life: 0.06, color: '#ffe1a1' });
        for (let k = 0; k < Math.max(1, Math.round(dt * 110)); k++) {
          this.add({
            kind: 'spark',
            x: x + rnd(-2, 2),
            y: hy,
            vx: rnd(-25, 25) * s,
            vy: rnd(40, 110) * s,
            life: rnd(0.35, 0.7),
            size: 1.5 * s,
            color: '#ffd9a0',
            gravity: 60 * s,
            damp: 3,
          });
        }
        this.add({
          kind: 'smoke',
          x: x + rnd(-4, 4) * s,
          y: hy + 6 * s,
          size: 6 * s,
          grow: 14 * s,
          life: 0.9,
          color: 'rgb(200,200,210)',
          damp: 2,
        });
      },
      () => this.burst(x, y, palette, 1),
    );
  }

  /** Shared star burst used by the rocket. */
  private burst(x: number, y: number, palette: [string, string], power: number) {
    const s = this.s;
    this.add({ kind: 'glow', x, y, size: 30 * s * power, grow: 150 * s * power, life: 0.45, color: palette[1] });
    this.add({ kind: 'ring', x, y, size: 6 * s, grow: 260 * s * power, life: 0.6, color: palette[0] });
    this.flash = Math.max(this.flash, 0.35 * power);
    this.sound.boom(0.5 * power);

    const count = Math.round(150 * power);
    for (let i = 0; i < count; i++) {
      const a = rnd(0, Math.PI * 2);
      const sp = rnd(160, 380) * s * rnd(0.6, 1);
      this.add({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rnd(1.1, 2.1),
        size: rnd(1.2, 2.4) * s,
        color: Math.random() < 0.8 ? pick(palette) : '#ffffff',
        gravity: 150 * s,
        damp: 1.1,
      });
    }

    // A second, softer glitter fade after the main burst.
    this.after(0.4, () => {
      for (let i = 0; i < 50; i++) {
        const a = rnd(0, Math.PI * 2);
        const sp = rnd(60, 150) * s;
        this.add({
          kind: 'spark',
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: rnd(0.8, 1.4),
          size: 1 * s,
          color: '#fff6d6',
          gravity: 120 * s,
          damp: 1.2,
        });
      }
    });
  }

  /** Phooljhadi: a sparkler that keeps throwing bright, drifting sparks. */
  private phooljhadi(x: number, y: number) {
    const s = this.s;
    this.add({ kind: 'glow', x, y, size: 22 * s, grow: 30 * s, life: 0.4, color: '#fff2b0' });
    this.over(
      4.5,
      (dt, age) => {
        const fade = age > 3.8 ? 1 - (age - 3.8) / 0.7 : 1;
        this.add({ kind: 'glow', x, y, size: 10 * s, life: 0.1, color: '#fff2b0' });
        const n = Math.max(1, Math.round(dt * 130 * fade));
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + rnd(-1.2, 1.2);
          const sp = rnd(40, 140) * s;
          this.add({
            kind: 'spark',
            x: x + rnd(-4, 4) * s,
            y: y + rnd(-4, 4) * s,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            life: rnd(0.6, 1.5),
            size: rnd(0.8, 1.8) * s,
            color: pick(['#ffffff', '#fff3b0', '#ffe066', '#ffd6a5']),
            gravity: 110 * s,
            damp: 1.1,
          });
        }
        if (Math.random() < dt * 3) this.sound.crackle(0.2);
      },
      () => this.sound.crackle(0.3),
    );
  }

  /** Laxmi Bomb: white flash, shockwave, debris, smoke and repeated bangs. */
  private laxmi(x: number, y: number) {
    const s = this.s;
    this.flash = 1;
    this.shake = 1;
    this.sound.boom(1);
    this.add({ kind: 'ring', x, y, size: 10 * s, grow: 380 * s, life: 0.7, color: '#ffffff' });
    this.add({ kind: 'glow', x, y, size: 60 * s, grow: 160 * s, life: 0.5, color: '#fff6d0' });

    for (let i = 0; i < 28; i++) {
      const a = rnd(0, Math.PI * 2);
      const sp = rnd(30, 140) * s;
      this.add({
        kind: 'smoke',
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 10 * s,
        size: rnd(24, 44) * s,
        grow: rnd(30, 60) * s,
        life: rnd(2, 3.2),
        color: 'rgb(190,190,200)',
        damp: 1.6,
      });
    }

    for (let i = 0; i < 90; i++) {
      const a = rnd(0, Math.PI * 2);
      const sp = rnd(300, 620) * s;
      this.add({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rnd(0.5, 1.0),
        size: rnd(1.5, 3) * s,
        color: pick(['#ffffff', '#ffd54a', '#ff5e5e']),
        gravity: 260 * s,
        damp: 2.6,
      });
    }

    [0.14, 0.3, 0.46].forEach((delay, idx) => {
      this.after(delay, () => {
        this.sound.boom(0.35);
        this.sound.crackle(1);
        const ox = rnd(-70, 70) * s;
        const oy = rnd(-50, 50) * s;
        this.add({ kind: 'ring', x: x + ox, y: y + oy, size: 4 * s, grow: 180 * s, life: 0.5, color: '#ffe9a6' });
        for (let i = 0; i < 22 + idx * 6; i++) {
          const a = rnd(0, Math.PI * 2);
          const sp = rnd(120, 260) * s;
          this.add({
            kind: 'spark',
            x: x + ox,
            y: y + oy,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            life: rnd(0.5, 0.9),
            size: rnd(1.2, 2.2) * s,
            color: pick(['#ffffff', '#ffe066', '#ff9f43']),
            gravity: 200 * s,
            damp: 2,
          });
        }
      });
    });
  }
}
