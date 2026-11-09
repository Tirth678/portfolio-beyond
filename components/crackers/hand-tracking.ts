/**
 * MediaPipe Hands helpers. The model runs in the visitor's browser; the
 * runtime and model files are fetched from jsDelivr, so nothing is bundled
 * into the repository.
 */
export const HANDS_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240';

export interface Pt {
  x: number;
  y: number;
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandsResults {
  multiHandLandmarks?: NormalizedLandmark[][];
  multiHandedness?: { label: string }[];
}

export interface HandsInstance {
  setOptions(options: Record<string, unknown>): void;
  onResults(callback: (results: HandsResults) => void): void;
  send(input: { image: HTMLVideoElement }): Promise<void>;
  close(): Promise<void> | void;
}

export type HandsConstructor = new (config: { locateFile: (file: string) => string }) => HandsInstance;

/** Standard 21-point hand skeleton. */
export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
];

export function loadHandsModule(): Promise<HandsConstructor> {
  const w = window as unknown as { Hands?: HandsConstructor };
  if (w.Hands) return Promise.resolve(w.Hands);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-mediapipe-hands]');
    const script = existing ?? document.createElement('script');
    if (!existing) {
      script.src = `${HANDS_CDN}/hands.js`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.mediapipeHands = 'true';
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => {
      if (w.Hands) resolve(w.Hands);
      else reject(new Error('MediaPipe Hands did not initialise'));
    });
    script.addEventListener('error', () => reject(new Error('Could not download MediaPipe Hands')));
  });
}

/** Cover-fit rectangle that places the camera frame over the full viewport. */
export function coverRect(W: number, H: number, vw: number, vh: number) {
  const s = Math.max(W / vw, H / vh);
  const dw = vw * s;
  const dh = vh * s;
  return { dx: (W - dw) / 2, dy: (H - dh) / 2, dw, dh };
}

/**
 * Maps a normalised landmark to canvas pixels. The frame is mirrored (selfie
 * view) and cover-fitted, matching how the video is drawn.
 */
export function landmarkToScreen(
  lm: NormalizedLandmark,
  W: number,
  H: number,
  vw: number,
  vh: number,
): Pt {
  const { dx, dy, dw, dh } = coverRect(W, H, vw, vh);
  return { x: dx + (1 - lm.x) * dw, y: dy + lm.y * dh };
}

export function dist(a: Pt, b: Pt) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const PINCH_ON = 0.32;
const PINCH_OFF = 0.5;
const MAX_TAP_MS = 450;
const MAX_TAP_DRIFT = 0.6;
const RETRIGGER_MS = 180;

/**
 * Turns a thumb-index pinch into a tap. A pinch that closes and opens again
 * quickly, without the hand drifting far, counts as one tap at the pinch point.
 * Thresholds are relative to hand size, so distance from the camera does not
 * matter.
 */
export class PinchTracker {
  pinched = false;
  private downAt = 0;
  private downPt: Pt = { x: 0, y: 0 };
  private maxDrift = 0;
  private lastTapAt = -Infinity;

  update(p: { thumb: Pt; index: Pt; wrist: Pt; middle: Pt }, now: number): Pt | null {
    const handSize = dist(p.wrist, p.middle) || 1;
    const ratio = dist(p.thumb, p.index) / handSize;
    const mid = { x: (p.thumb.x + p.index.x) / 2, y: (p.thumb.y + p.index.y) / 2 };

    if (!this.pinched) {
      if (ratio < PINCH_ON && now - this.lastTapAt > RETRIGGER_MS) {
        this.pinched = true;
        this.downAt = now;
        this.downPt = mid;
        this.maxDrift = 0;
      }
      return null;
    }

    this.maxDrift = Math.max(this.maxDrift, dist(mid, this.downPt));
    if (ratio > PINCH_OFF) {
      this.pinched = false;
      const quick = now - this.downAt < MAX_TAP_MS;
      const steady = this.maxDrift < handSize * MAX_TAP_DRIFT;
      if (quick && steady) {
        this.lastTapAt = now;
        return this.downPt;
      }
    }
    return null;
  }

  reset() {
    this.pinched = false;
  }
}
