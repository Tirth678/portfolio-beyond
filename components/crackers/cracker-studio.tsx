'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CRACKERS, Fireworks, type CrackerId } from './fireworks';
import {
  HAND_CONNECTIONS,
  HANDS_CDN,
  PinchTracker,
  coverRect,
  dist,
  landmarkToScreen,
  loadHandsModule,
  type HandsInstance,
  type HandsResults,
  type Pt,
} from './hand-tracking';
import { CrackerSound } from './sound';

type Phase = 'intro' | 'starting' | 'live' | 'no-camera';
type TrackingState = 'off' | 'loading' | 'on' | 'failed';

interface TrackedHand {
  pts: Pt[];
  pinched: boolean;
}

const HAND_COLORS: Record<string, string> = {
  Left: '#ffd166',
  Right: '#4cc9f0',
};
const DOUBLE_TAP_MS = 550;
const DOUBLE_TAP_RADIUS = 140;

/**
 * Diwali cracker studio. The visitor's camera is shown full screen, hands are
 * tracked with MediaPipe, and the crackers are played on top of the camera.
 *
 * Controls:
 * - Single pinch-tap (thumb + index, quick) on a cracker in the tray → select it.
 * - Double pinch-tap anywhere on screen → fire the selected cracker there.
 * - Mouse/touch work the same way (click = tap, two clicks = double tap).
 * - Keys 1–5 select, Space fires at the centre, M mutes.
 */
export function CrackerStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trayRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<HandsInstance | null>(null);
  const busyRef = useRef(false);
  const startRef = useRef<(() => void) | null>(null);
  const cameraOnRef = useRef(false);
  const startingRef = useRef(false);
  const handsDrawRef = useRef<Record<string, TrackedHand>>({});
  const trackersRef = useRef<Record<string, PinchTracker>>({});
  const selectedRef = useRef<CrackerId | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const lastTapRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const handCountRef = useRef(0);

  const [phase, setPhase] = useState<Phase>('intro');
  const [tracking, setTracking] = useState<TrackingState>('off');
  const [handCount, setHandCount] = useState(0);
  const [selected, setSelected] = useState<CrackerId | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [message, setMessage] = useState(
    'Start the camera, then pinch a cracker in the tray to pick it.',
  );
  const [muted, setMuted] = useState(false);
  const [fired, setFired] = useState(0);
  const mutedRef = useRef(false);
  const soundRef = useRef<CrackerSound | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sound = new CrackerSound();
    soundRef.current = sound;
    const fx = new Fireworks(sound);
    let dpr = window.devicePixelRatio || 1;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let raf = 0;
    let last = performance.now();
    let lastVideoTime = -1;
    let disposed = false;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      fx.resize(W, H);
    };
    resize();
    window.addEventListener('resize', resize);

    // ---- tap handling ----------------------------------------------------

    const trayIndexAt = (x: number, y: number) => {
      for (let i = 0; i < trayRefs.current.length; i++) {
        const el = trayRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 8 && y <= r.bottom + 8) return i;
      }
      return -1;
    };

    const selectCracker = (index: number) => {
      const def = CRACKERS[index];
      selectedRef.current = def.id;
      setSelected(def.id);
      sound.click();
      setMessage(`${def.name} selected. Double-tap anywhere on the screen to fire it.`);
    };

    const handleTap = (x: number, y: number) => {
      const index = trayIndexAt(x, y);
      if (index >= 0) {
        lastTapRef.current = null;
        selectCracker(index);
        return;
      }

      const now = performance.now();
      const prev = lastTapRef.current;
      const isDouble =
        prev !== null &&
        now - prev.t < DOUBLE_TAP_MS &&
        Math.hypot(prev.x - x, prev.y - y) < DOUBLE_TAP_RADIUS * fx.s;

      if (!isDouble) {
        lastTapRef.current = { x, y, t: now };
        return;
      }

      lastTapRef.current = null;
      const chosen = selectedRef.current;
      if (!chosen) {
        setMessage('Single-tap a cracker in the tray first, then double-tap to fire.');
        return;
      }
      const def = CRACKERS.find((c) => c.id === chosen);
      fx.fire(chosen, x, y);
      setFired((n) => n + 1);
      setMessage(`${def?.name ?? 'Cracker'} fired. Double-tap again for another burst.`);
    };

    // Mouse / touch fallback: a short, still press counts as a tap.
    let down: { x: number; y: number; t: number } | null = null;
    const isUiTarget = (target: EventTarget | null) => {
      const el = (target as HTMLElement | null)?.closest?.('[data-ui]');
      return !!el && !el.hasAttribute('data-tray');
    };
    const onPointerDown = (e: PointerEvent) => {
      if (isUiTarget(e.target)) return;
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!down) return;
      const d = down;
      down = null;
      if (isUiTarget(e.target)) return;
      const quick = performance.now() - d.t < 400;
      const still = Math.hypot(e.clientX - d.x, e.clientY - d.y) < 14;
      if (quick && still) handleTap(e.clientX, e.clientY);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const idx = CRACKERS.findIndex((c) => c.key === e.key);
      if (idx >= 0) {
        selectCracker(idx);
      } else if (e.key === ' ' && selectedRef.current) {
        e.preventDefault();
        fx.fire(selectedRef.current, W / 2, H / 2);
        setFired((n) => n + 1);
      } else if (e.key.toLowerCase() === 'm') {
        mutedRef.current = !mutedRef.current;
        sound.setMuted(mutedRef.current);
        setMuted(mutedRef.current);
      }
    };
    window.addEventListener('keydown', onKey);

    // ---- hand results ----------------------------------------------------

    const onHandsResults = (r: HandsResults) => {
      if (disposed) return;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;
      const now = performance.now();
      const landmarks = r.multiHandLandmarks ?? [];
      const handedness = r.multiHandedness ?? [];
      const seen = new Set<string>();

      landmarks.forEach((lm, i) => {
        let label = handedness[i]?.label ?? `Hand${i}`;
        if (seen.has(label)) label = `${label}${i}`;
        seen.add(label);

        const pts = lm.map((p) => landmarkToScreen(p, W, H, vw, vh));
        const tracker = (trackersRef.current[label] ??= new PinchTracker());
        const tap = tracker.update(
          { thumb: pts[4], index: pts[8], wrist: pts[0], middle: pts[9] },
          now,
        );
        handsDrawRef.current[label] = { pts, pinched: tracker.pinched };
        if (tap) {
          fx.ripple(tap.x, tap.y);
          handleTap(tap.x, tap.y);
        }
      });

      for (const key of Object.keys(handsDrawRef.current)) {
        if (!seen.has(key)) {
          delete handsDrawRef.current[key];
          trackersRef.current[key]?.reset();
        }
      }
      if (seen.size !== handCountRef.current) {
        handCountRef.current = seen.size;
        setHandCount(seen.size);
      }
    };

    // ---- camera + model startup -----------------------------------------

    startRef.current = async () => {
      if (cameraOnRef.current || startingRef.current) return;
      startingRef.current = true;
      setPhase('starting');
      sound.unlock();
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access needs a secure (HTTPS) page in a modern browser.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (disposed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        video.srcObject = stream;
        await video.play();
        cameraOnRef.current = true;
        setPhase('live');
        setMessage('Camera on. Pinch a cracker in the tray to select it, then double-tap to fire.');
      } catch (err) {
        const reason = err instanceof Error ? err.message : 'unknown error';
        startingRef.current = false;
        setPhase('intro');
        setMessage(`Camera unavailable (${reason}). You can still play with a mouse or keyboard.`);
        return;
      }

      setTracking('loading');
      try {
        const Hands = await loadHandsModule();
        const hands = new Hands({ locateFile: (file) => `${HANDS_CDN}/${file}` });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
          selfieMode: false,
        });
        hands.onResults(onHandsResults);
        handsRef.current = hands;
        setTracking('on');
      } catch {
        setTracking('failed');
        setMessage('Hand tracking could not load. Use the mouse or keyboard; the camera is still on.');
      }
    };

    // ---- render loop -----------------------------------------------------

    const pump = () => {
      const hands = handsRef.current;
      if (!hands || busyRef.current || video.readyState < 2) return;
      if (video.currentTime === lastVideoTime) return;
      lastVideoTime = video.currentTime;
      busyRef.current = true;
      hands
        .send({ image: video })
        .catch(() => undefined)
        .finally(() => {
          busyRef.current = false;
        });
    };

    const drawBackdrop = () => {
      const v = video;
      if (cameraOnRef.current && v.readyState >= 2 && v.videoWidth) {
        const { dx, dy, dw, dh } = coverRect(W, H, v.videoWidth, v.videoHeight);
        ctx.save();
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(v, dx, dy, dw, dh);
        ctx.restore();
        ctx.fillStyle = 'rgba(8, 4, 12, 0.3)';
        ctx.fillRect(0, 0, W, H);
      } else {
        const g = ctx.createRadialGradient(W / 2, H * 0.9, 0, W / 2, H / 2, Math.max(W, H));
        g.addColorStop(0, '#2a1606');
        g.addColorStop(0.6, '#0d0604');
        g.addColorStop(1, '#050303');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      // Vignette keeps the edges dark so the crackers pop.
      const v2 = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.75);
      v2.addColorStop(0, 'rgba(0,0,0,0)');
      v2.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = v2;
      ctx.fillRect(0, 0, W, H);
    };

    const drawHands = () => {
      for (const [label, hand] of Object.entries(handsDrawRef.current)) {
        const color = HAND_COLORS[label] ?? '#ffffff';
        const pts = hand.pts;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        for (const [a, b] of HAND_CONNECTIONS) {
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        for (const p of pts) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        // Cursor on the index fingertip.
        const tip = pts[8];
        const size = 22 * fx.s;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, size, 0, Math.PI * 2);
        ctx.stroke();
        if (hand.pinched) {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, size * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    const updateHover = () => {
      let found: number | null = null;
      for (const hand of Object.values(handsDrawRef.current)) {
        const idx = trayIndexAt(hand.pts[8].x, hand.pts[8].y);
        if (idx >= 0) {
          found = idx;
          break;
        }
      }
      if (found !== hoveredRef.current) {
        hoveredRef.current = found;
        setHovered(found);
      }
    };

    const frame = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      pump();
      fx.update(dt);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save();
      if (fx.shake > 0) {
        const amp = fx.shake * 14 * fx.s;
        ctx.translate((Math.random() - 0.5) * amp, (Math.random() - 0.5) * amp);
      }
      drawBackdrop();
      fx.draw(ctx);
      ctx.restore();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHands();
      updateHover();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKey);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      void handsRef.current?.close();
      handsRef.current = null;
      sound.dispose();
      startRef.current = null;
    };
    // The studio is one imperative canvas session, so the effect runs once.
  }, []);

  const startWithCamera = () => startRef.current?.();
  const playWithoutCamera = () => {
    soundRef.current?.unlock();
    setPhase('no-camera');
    setMessage('No camera: click or tap a cracker to select it, then double-click the screen to fire.');
  };
  const toggleMute = () => {
    const next = !muted;
    mutedRef.current = next;
    soundRef.current?.setMuted(next);
    setMuted(next);
  };

  const selectedDef = CRACKERS.find((c) => c.id === selected) ?? null;
  const showIntro = phase === 'intro' || phase === 'starting';
  const cameraLabel =
    phase === 'live'
      ? 'Camera on'
      : phase === 'no-camera'
        ? 'Mouse mode'
        : phase === 'starting'
          ? 'Starting camera…'
          : 'Camera off';
  const trackingLabel =
    tracking === 'on'
      ? `Hands tracked: ${handCount}`
      : tracking === 'loading'
        ? 'Loading hand model…'
        : tracking === 'failed'
          ? 'Hand tracking off'
          : 'Hand tracking idle';

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-black text-paper select-none touch-none">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-hidden="true"
      />
      <canvas ref={canvasRef} className="absolute inset-0 block" aria-label="Cracker stage" />

      {/* Top HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto" data-ui>
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.18em] text-paper/70 uppercase transition-colors hover:text-paper"
          >
            ← Portfolio
          </Link>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] leading-none tracking-[-0.02em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Diwali <em className="text-accent">crackers</em>
          </h1>
          <ul className="mt-3 hidden space-y-1 font-mono text-[11px] text-paper/80 sm:block">
            <li>• Pinch-tap a cracker in the tray to select it</li>
            <li>• Double pinch-tap anywhere to fire it</li>
            <li>• Keys 1–5 select · Space fires · M mutes</li>
          </ul>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-2" data-ui>
          <div className="flex flex-wrap justify-end gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
            <span className="rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">{cameraLabel}</span>
            <span className="rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">{trackingLabel}</span>
            <span className="rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">Fired: {fired}</span>
          </div>
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-full border border-paper/25 bg-black/55 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            {muted ? 'Sound off' : 'Sound on'}
          </button>
        </div>
      </div>

      {/* Status line + tray */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-4 pb-5 sm:p-6">
        <p
          aria-live="polite"
          className="max-w-xl rounded-full bg-black/60 px-4 py-2 text-center text-sm text-paper/90 backdrop-blur"
        >
          {selectedDef ? (
            <>
              <span className="text-accent">{selectedDef.name}</span> ready · {message}
            </>
          ) : (
            message
          )}
        </p>

        <div className="pointer-events-auto flex w-full flex-wrap justify-center gap-2 sm:gap-3" data-ui>
          {CRACKERS.map((c, i) => {
            const isSelected = selected === c.id;
            const isHover = hovered === i;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  trayRefs.current[i] = el;
                }}
                type="button"
                data-tray
                aria-pressed={isSelected}
                className={[
                  'flex w-[30%] min-w-[110px] max-w-[170px] flex-col items-center gap-1 rounded-2xl border px-3 py-3 backdrop-blur transition-all duration-200 sm:w-auto sm:flex-1',
                  isSelected
                    ? 'scale-105 border-accent bg-accent/25 shadow-[0_0_28px_rgba(212,175,55,0.55)]'
                    : 'border-paper/20 bg-black/55',
                  isHover && !isSelected ? 'scale-[1.04] border-paper/70 bg-paper/15' : '',
                ].join(' ')}
              >
                <span className="text-3xl leading-none" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="font-display text-lg leading-tight">{c.name}</span>
                <span className="font-mono text-[9px] tracking-[0.14em] text-paper/60 uppercase">
                  {c.hint} · key {c.key}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start card */}
      {showIntro && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm" data-ui>
          <div className="w-full max-w-md rounded-3xl border border-paper/15 bg-ink/90 p-7 text-center shadow-2xl">
            <p className="section-label">Diwali · Hand studio</p>
            <h2 className="mt-4 font-display text-4xl leading-none">
              Light them with <em className="text-accent">your hands</em>
            </h2>
            <p className="mt-4 text-sm leading-6 text-paper/65">
              Allow camera access. Both hands are tracked on your device; nothing is uploaded.
              Pinch-tap a cracker to pick it, then double pinch-tap the stage to fire it.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={startWithCamera}
                disabled={phase === 'starting'}
                className="rounded-full bg-accent px-6 py-3 font-mono text-[11px] tracking-[0.16em] text-ink uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {phase === 'starting' ? 'Starting…' : 'Start camera'}
              </button>
              <button
                type="button"
                onClick={playWithoutCamera}
                className="rounded-full border border-paper/25 px-6 py-3 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
              >
                Play without camera
              </button>
            </div>
            <p className="mt-5 font-mono text-[10px] tracking-[0.1em] text-paper/40">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
