/**
 * One rAF loop for the whole page, split into a read phase and a write phase.
 *
 * Before this, every scroll-driven component ran its own loop and did
 * `getBoundingClientRect()` immediately before writing a style. Five of those
 * interleaved per frame means five forced layouts per frame: the browser has
 * to flush pending style changes to answer each read. Measured at 5.0 rects
 * and ~2.5 style recalcs per frame.
 *
 * Batching all reads before any write means the layout is computed once and
 * every subscriber reads the same clean frame.
 */
type Sub = {
  order: number;
  read?: (t: number) => void;
  write?: (t: number) => void;
};

const subs: Sub[] = [];
let raf = 0;
let running = false;

function frame(t: number) {
  raf = requestAnimationFrame(frame);
  if (document.hidden) return;
  for (let i = 0; i < subs.length; i++) subs[i].read?.(t);
  for (let i = 0; i < subs.length; i++) subs[i].write?.(t);
}

/** Lower `order` runs first. Lenis is 0 so scroll position settles before any read. */
export function onTick(sub: Sub): () => void {
  subs.push(sub);
  subs.sort((a, b) => a.order - b.order);
  if (!running) {
    running = true;
    raf = requestAnimationFrame(frame);
  }
  return () => {
    const i = subs.indexOf(sub);
    if (i >= 0) subs.splice(i, 1);
    if (subs.length === 0) {
      cancelAnimationFrame(raf);
      running = false;
    }
  };
}

export const ORDER = {
  scroll: 0,
  film: 10,
  scene: 20,
  track: 30,
} as const;
