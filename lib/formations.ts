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
  /** Particle radius multiplier. Cheaper than more particles when a chapter
   *  needs to read as solid rather than as a dusting. Defaults to 1. */
  weight?: number;
};

const TAU = Math.PI * 2;

const WHITE: RGB = [236, 241, 247];
const GREY: RGB = [122, 136, 150];
const BLUE: RGB = [0, 117, 246];
const GREEN: RGB = [52, 194, 76];
const INK: RGB = [7, 9, 12];
const PAPER: RGB = [243, 246, 249];
const PAPER_BG: RGB = [244, 247, 250];
const INK_FG: RGB = [22, 28, 36];
const INK_FG_2: RGB = [92, 103, 116];

/**
 * Which way round the film is painting. The two brand colours never move, but
 * the neutrals have to: white specks on a paper ground are invisible, and so
 * are dark ones on ink. Set by the film from `data-theme`, which also forces a
 * re-bake so every particle picks up the new palette.
 */
export const palette = { dark: true };

const neutral = (): RGB => (palette.dark ? WHITE : INK_FG);
const neutralDim = (): RGB => (palette.dark ? GREY : INK_FG_2);
/** The page ground, and its opposite for the chapter that runs against it. */
const ground = (): RGB => (palette.dark ? INK : PAPER_BG);
const groundAlt = (): RGB => (palette.dark ? PAPER : INK);

/** A handful of particles always carry brand colour so blue/green never arrive from nowhere. */
function seeded(i: number, blueShare: number, greenShare: number): RGB {
  const r = rand(i + 91);
  if (r < blueShare) return BLUE;
  if (r < blueShare + greenShare) return GREEN;
  return rand(i + 42) > 0.72 ? neutralDim() : neutral();
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
  get bg() {
    return ground();
  },
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
  get bg() {
    return ground();
  },
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
  get bg() {
    return ground();
  },
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
  get bg() {
    return ground();
  },
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
  get bg() {
    return ground();
  },
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
  // The quiet chapter sits on the opposite ground, so its neutrals invert
  // against everything else.
  color: (i) =>
    palette.dark
      ? rand(i + 5) > 0.88
        ? [168, 182, 196]
        : [205, 215, 224]
      : rand(i + 5) > 0.88
        ? [92, 103, 116]
        : [58, 68, 80],
  get bg() {
    return groundAlt();
  },
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
  get bg() {
    return ground();
  },
  thin: 0.5,
  life: 0.3,
};

/**
 * The mark, as particles. Shared by the opening chapter and the finale so the
 * two cannot drift apart.
 *
 * Proportions come from the drawn logo rather than from eyeballing: there, the
 * heads sit at about 63% of the knot's half-width and a little above its top,
 * and each head's radius is about 15% of the knot's full width. Built to those
 * numbers it reads as the mark; built by eye it reads as an infinity symbol
 * with two specks over it.
 *
 * A bare lemniscate is only 0.35 tall against 1.0 wide, so jitter thick enough
 * to look like a rope is half the curve's own height and smears the loops
 * shut. Stretching it vertically first gives the jitter somewhere to live.
 */
const MARK_Y_STRETCH = 1.55;
const MARK_JITTER = 0.1;
/** Of the particles on the mark, the share forming the two heads. At a tenth
 *  they were too sparse to resolve at any size. */
const HEAD_SHARE = 0.24;
/** Of all particles, the share held back to fill the frame around the shape. */
const AMBIENT_SHARE = 0.3;

type MarkOpts = { scale: number; dx: number; dy: number };

function placeMark(i: number, n: number, o: Vec, k: MarkOpts) {
  const onMark = Math.floor(n * (1 - AMBIENT_SHARE));

  if (i >= onMark) {
    // A bold shape in an otherwise empty frame reads as a shape floating in
    // a void, so a third of the particles stay behind to fill it.
    o.x = (rand(i + 211) - 0.5) * 3.7;
    o.y = (rand(i + 307) - 0.5) * 2.3;
    o.z = (rand(i + 401) - 0.5) * 2;
    return;
  }

  const heads = Math.floor(onMark * HEAD_SHARE);
  const S = k.scale;

  if (i < heads) {
    const left = i % 2 === 0;
    const a = rand(i + 2) * TAU;
    const r = Math.sqrt(rand(i + 4)) * 0.3;
    o.x = ((left ? -0.85 : 0.8) + Math.cos(a) * r) * S + k.dx;
    o.y = (-0.95 + Math.sin(a) * r) * S + k.dy;
    o.z = (rand(i + 6) - 0.5) * 0.3;
    return;
  }

  const t = ((i - heads) / Math.max(1, onMark - heads)) * TAU;
  const d = 1 + Math.sin(t) * Math.sin(t);
  const nx = Math.cos(t) / d;
  const ny = ((Math.sin(t) * Math.cos(t)) / d) * MARK_Y_STRETCH;

  // A disc of jitter around the curve is what turns a line into a rope.
  const a = rand(i + 15) * TAU;
  const r = Math.sqrt(rand(i + 23)) * MARK_JITTER;

  o.x = (nx * 1.32 + Math.cos(a) * r) * S + k.dx;
  o.y = (ny * 1.32 + Math.sin(a) * r) * S + k.dy + 0.18 * S;
  o.z = (rand(i + 31) - 0.5) * 0.55;
}

function markColor(i: number, n: number): RGB {
  const onMark = Math.floor(n * (1 - AMBIENT_SHARE));
  if (i >= onMark) return rand(i + 77) > 0.8 ? neutralDim() : neutral();

  const heads = Math.floor(onMark * HEAD_SHARE);
  if (i < heads) return i % 2 === 0 ? BLUE : GREEN;

  // By which lobe, not how far along the path: the lemniscate crosses its own
  // centre, so splitting the parameter in half gives two bicoloured loops.
  const t = ((i - heads) / Math.max(1, onMark - heads)) * TAU;
  return Math.cos(t) < 0 ? BLUE : GREEN;
}

/**
 * Where the opening mark sits. The hero's free space is not in the same place
 * on every viewport, so the film sets this on allocate and on resize.
 */
export const markLayout = { x: 0.08, y: -0.1, scale: 0.8 };

/**
 * CHAPTER 0 - the mark.
 * The film opens on it and disperses it within the first half-screen, which
 * makes the finale a return rather than a reveal.
 */
const mark: Formation = {
  place: (i, n, o) =>
    placeMark(i, n, o, { scale: markLayout.scale, dx: markLayout.x, dy: markLayout.y }),
  color: markColor,
  get bg() {
    return ground();
  },
  thin: 0.04,
  life: 0.5,
  // Heavier bodies rather than more of them: radius is free, count is not.
  weight: 1.75,
};

/**
 * CHAPTER 7 - the tie.
 * The same mark, centred and at full size. Every particle has been walking
 * back toward this shape since the first screen.
 */
const knot: Formation = {
  place: (i, n, o) => placeMark(i, n, o, { scale: 0.92, dx: 0, dy: -0.04 }),
  color: markColor,
  get bg() {
    return ground();
  },
  thin: 0.03,
  life: 0.3,
  weight: 1.75,
};

export const FORMATIONS: Record<string, Formation> = {
  mark,
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
