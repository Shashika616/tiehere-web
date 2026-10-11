/**
 * One mutable progress singleton, written by the scroll provider and read by
 * the canvas every frame. Deliberately not React state: the film repaints at
 * 60fps and must never cause a render.
 *
 *  raw   , 0..1 document scroll progress, set on every scroll event
 *  smooth, raw, damped. This is what the film actually reads, and the damping
 *           is why it feels like footage rather than a scrubber.
 */
export const scrollState = {
  raw: 0,
  smooth: 0,
  velocity: 0,
  reduced: false,
};

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Normalised progress through [from, to], clamped to 0..1. */
export const range = (v: number, from: number, to: number) =>
  clamp((v - from) / (to - from));

/** Smoothstep, the curve the whole film eases formations with. */
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** cubic-bezier(0.22, 1, 0.36, 1) approximated for canvas use. */
export const easeOutSoft = (t: number) => 1 - Math.pow(1 - t, 3);

/** Deterministic pseudo-random so the film renders identically every load. */
export function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
