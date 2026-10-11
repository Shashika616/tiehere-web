import { rand } from "./scroll";

export type Vec = { x: number; y: number; z: number };
export type RGB = [number, number, number];

export type Formation = {
  /** Where particle i sits, in a normalised space: x,y roughly -1.6..1.6, z -1..1. */
  place: (i: number, n: number, out: Vec) => void;
  /** Particle i's colour in this formation. */
  color: (i: number, n: number) => RGB;
  /** Ground colour behind the film while this formation holds. */
  bg: RGB;
  /** 0 = every particle solid, 1 = almost all faded out. */
  thin: number;
  /** Drift amplitude multiplier. 0 = dead still. */
  life: number;
};

const TAU = Math.PI * 2;

const WHITE: RGB = [236, 241, 247];
const GREY: RGB = [122, 136, 150];
const BLUE: RGB = [0, 117, 246];
const GREEN: RGB = [52, 194, 76];
const INK: RGB = [7, 9, 12];
const PAPER: RGB = [243, 246, 249];

/** A handful of particles always carry brand colour so blue/green never arrive from nowhere. */
function seeded(i: number, blueShare: number, greenShare: number): RGB {
  const r = rand(i + 91);
  if (r < blueShare) return BLUE;
  if (r < blueShare + greenShare) return GREEN;
  return rand(i + 42) > 0.72 ? GREY : WHITE;
}

/**
 * CHAPTER 1, a thousand people, scattered.
 * A loose volumetric cloud. No order, no connection, constant drift.
 */
const cloud: Formation = {
  place: (i, _n, o) => {
    o.x = (rand(i) - 0.5) * 3.1;
    o.y = (rand(i + 17) - 0.5) * 1.9;
    o.z = (rand(i + 33) - 0.5) * 2;
  },
  color: (i) => seeded(i, 0.035, 0.03),
  bg: INK,
  thin: 0.06,
  life: 1,
};

/**
 * CHAPTER 2, you've actually met forty.
 * Same cloud, but ~85% of it is thrown out past the frame edge. What is left
 * is the honest number, and the emptiness is the argument.
 */
const sparse: Formation = {
  place: (i, _n, o) => {
    cloud.place(i, _n, o);
    const keep = rand(i + 5) < 0.16;
    if (!keep) {
      const push = 2.4 + rand(i + 61) * 1.8;
      o.x *= push;
      o.y *= push;
    } else {
      o.x *= 0.72;
      o.y *= 0.72;
    }
  },
  color: (i) => seeded(i, 0.06, 0.05),
  bg: INK,
  thin: 0.78,
  life: 0.55,
};

/**
 * CHAPTER 3, here is a place.
 * The cloud falls onto a ground plane and becomes a city seen at a low angle:
 * a lit grid running to the horizon, a few towers standing out of it.
 */
const city: Formation = {
  place: (i, n, o) => {
    const cols = 54;
    const rows = Math.max(1, Math.ceil(n / cols));
    const col = i % cols;
    const row = Math.floor(i / cols) % rows;
    const jx = (rand(i + 3) - 0.5) * 0.045;
    const jz = (rand(i + 9) - 0.5) * 0.04;

    o.x = (col / (cols - 1) - 0.5) * 3.4 + jx;
    o.z = (row / Math.max(1, rows - 1) - 0.5) * 2.2 + jz;

    // ~8% of the grid rises into towers.
    const tower = rand(i + 77);
    o.y = tower > 0.92 ? 0.52 - rand(i + 101) * 0.62 : 0.52 + (rand(i + 13) - 0.5) * 0.02;
  },
  color: (i) => seeded(i, 0.07, 0.055),
  bg: [9, 12, 17],
  thin: 0.1,
  life: 0.35,
};

/**
 * CHAPTER 4, seven reasons to meet.
 * Seven arms spiral out of one centre: the intents. One arm per intent, so the
 * count is readable without a label.
 */
const fan: Formation = {
  place: (i, n, o) => {
    const arm = i % 7;
    const t = (i / n) * 0.999;
    const r = 0.18 + t * 1.22;
    const a = (arm / 7) * TAU + t * 1.15;
    o.x = Math.cos(a) * r * 1.45;
    o.y = Math.sin(a) * r * 0.92;
    o.z = (rand(i + 23) - 0.5) * 0.6;
  },
  color: (i) => seeded(i, 0.1, 0.08),
  bg: [8, 11, 16],
  thin: 0.08,
  life: 0.6,
};

/**
 * CHAPTER 5, the trust ladder.
 * Four stacked bands, 0 at the bottom in grey, 3 at the top in green. The
 * climb is the colour change, so the graphic says what the copy says.
 */
const ladder: Formation = {
  place: (i, _n, o) => {
    const band = i % 4;
    o.x = (rand(i + 7) - 0.5) * 3.0;
    o.y = 0.74 - band * 0.46 + (rand(i + 29) - 0.5) * 0.07;
    o.z = (rand(i + 47) - 0.5) * 1.3;
  },
  color: (i) => {
    const band = i % 4;
    if (band === 0) return [86, 97, 110];
    if (band === 1) return [150, 164, 178];
    if (band === 2) return BLUE;
    return GREEN;
  },
  bg: [8, 11, 16],
  thin: 0.14,
  life: 0.45,
};

/**
 * CHAPTER 6, safety. The film stops.
 * Ground goes to paper, particles sink to a faint, nearly motionless horizon.
 * This is the only still moment on the page and it is the point.
 */
const quiet: Formation = {
  place: (i, _n, o) => {
    o.x = (rand(i + 11) - 0.5) * 3.6;
    o.y = (rand(i + 19) - 0.5) * 0.42;
    o.z = (rand(i + 37) - 0.5) * 1.8;
  },
  color: (i) => (rand(i + 5) > 0.88 ? [168, 182, 196] : [205, 215, 224]),
  bg: PAPER,
  thin: 0.72,
  life: 0.07,
};

/**
 * CHAPTER 6b, back to ground.
 * Without this the page would cross-dissolve paper → ink straight across the
 * FAQ, washing it to mid-grey and dropping the type below AA. The film comes
 * back to dark BEFORE the questions start, and holds there.
 */
const settle: Formation = {
  place: (i, _n, o) => {
    o.x = (rand(i + 11) - 0.5) * 3.4;
    o.y = (rand(i + 19) - 0.5) * 1.5;
    o.z = (rand(i + 37) - 0.5) * 1.8;
  },
  color: (i) => seeded(i, 0.09, 0.08),
  bg: INK,
  thin: 0.5,
  life: 0.3,
};

/**
 * CHAPTER 7, the tie.
 * Every particle lands on the lemniscate the mark is built from: one lobe
 * blue, one lobe green, two heads above. The whole scroll has been walking
 * toward this shape.
 */
const knot: Formation = {
  place: (i, n, o) => {
    const headCount = Math.floor(n * 0.07);

    if (i < headCount) {
      // The two dots above the knot, as on the mark.
      const left = i % 2 === 0;
      const a = rand(i + 2) * TAU;
      const r = Math.sqrt(rand(i + 4)) * 0.17;
      o.x = (left ? -0.46 : 0.42) + Math.cos(a) * r;
      o.y = -0.72 + Math.sin(a) * r;
      o.z = (rand(i + 6) - 0.5) * 0.12;
      return;
    }

    const k = (i - headCount) / Math.max(1, n - headCount);
    const t = k * TAU;
    const d = 1 + Math.sin(t) * Math.sin(t);
    const thickness = (rand(i + 15) - 0.5) * 0.12;
    const nx = Math.cos(t) / d;
    const ny = (Math.sin(t) * Math.cos(t)) / d;

    o.x = nx * 1.32 + thickness * 0.5;
    o.y = ny * 1.32 + thickness + 0.18;
    o.z = (rand(i + 21) - 0.5) * 0.22;
  },
  color: (i, n) => {
    const headCount = Math.floor(n * 0.07);
    if (i < headCount) return i % 2 === 0 ? BLUE : GREEN;
    const k = (i - headCount) / Math.max(1, n - headCount);
    return k < 0.5 ? BLUE : GREEN;
  },
  bg: INK,
  thin: 0.03,
  life: 0.3,
};

export const FORMATIONS: Record<string, Formation> = {
  cloud,
  sparse,
  city,
  fan,
  ladder,
  quiet,
  settle,
  knot,
};

export const DEFAULT_FORMATION = "cloud";
