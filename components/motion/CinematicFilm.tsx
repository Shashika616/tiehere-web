"use client";

import { useEffect, useRef } from "react";
import {
  FORMATIONS,
  DEFAULT_FORMATION,
  markLayout,
  palette,
  type Vec,
  type RGB,
} from "@/lib/formations";
import { scrollState, clamp, lerp, smoothstep, rand } from "@/lib/scroll";
import { onTick, ORDER } from "@/lib/ticker";

type Anchor = { key: string; p: number };

/** Alpha is quantised so particles can be batched. 12 steps is below the eye's threshold here. */
const ALPHA_STEPS = 12;

/**
 * The film.
 *
 * One fixed canvas behind the entire document, playing a single continuous
 * shot that is scrubbed by scroll: a thousand scattered people become a city,
 * become seven reasons to meet, become a trust ladder, go still for safety,
 * and finally lock into the TieHere mark. There is no video file. Every frame
 * is generated, which is why it weighs nothing and never buffers.
 *
 * Chapters are not hardcoded to scroll percentages. Each section carries a
 * `data-film="<formation>"` attribute and the film measures where those
 * sections actually are, so editing copy can never desync the picture from
 * the words.
 *
 * Three things keep it cheap, all of them measured rather than assumed:
 *   - particles are drawn in buckets of shared colour and quantised alpha,
 *     so a frame costs tens of fill() calls instead of 1180;
 *   - the bloom and vignette gradients are built once per resize, not per
 *     frame, and tinted with globalAlpha;
 *   - the bloom and vignette are pre-rendered bitmaps blitted into place,
 *     not radial gradients re-evaluated across three million pixels twice a
 *     frame, and the backing store is capped at 1.25x device pixels.
 */
export default function CinematicFilm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mqSmall = window.matchMedia("(max-width: 768px)");

    let w = 0;
    let h = 0;
    let count = 0;

    /* ---- particle buffers (flat arrays, no per-frame allocation) ---- */
    let ax = new Float32Array(0), ay = new Float32Array(0), az = new Float32Array(0);
    let bx = new Float32Array(0), by = new Float32Array(0), bz = new Float32Array(0);
    let pairOf = new Int32Array(0);
    let thinSeed = new Float32Array(0);
    let driftSeed = new Float32Array(0);
    let sizeSeed = new Float32Array(0);
    /* Each particle's phase, precomputed as sin/cos pairs. Expanding
       sin(wt + d) into sinWt*cosD + cosWt*sinD turns four trig calls per
       particle per frame into ten for the whole frame, which is what makes a
       livelier field free rather than expensive. */
    let sinD = new Float32Array(0);
    let cosD = new Float32Array(0);
    let sinD2 = new Float32Array(0);
    let cosD2 = new Float32Array(0);

    /* ---- the distinct colour transitions in the current chapter pair ---- */
    let pairCount = 0;
    const pairA: number[][] = [];
    const pairB: number[][] = [];

    /* ---- scratch for the bucketed draw (counting sort, zero allocation) ---- */
    let sx = new Float32Array(0), sy = new Float32Array(0), sr = new Float32Array(0);
    let sBucket = new Int32Array(0);
    let order = new Int32Array(0);
    let bucketStart = new Int32Array(0);
    let bucketFill = new Int32Array(0);

    let anchors: Anchor[] = [];
    let cachedPair = "";
    const tmp: Vec = { x: 0, y: 0, z: 0 };

    /* ---- pre-rendered atmosphere, rebuilt only on resize ----
       A radial gradient fillRect has to evaluate the ramp per pixel, and two
       of them across a full viewport was the most expensive thing in the
       frame. Baked into bitmaps once, they become blits. ---- */
    let bloomBmp: HTMLCanvasElement | null = null;
    let vignetteBmp: HTMLCanvasElement | null = null;
    let bloomRadius = 0;

    const readTheme = () => {
      palette.dark = document.documentElement.dataset.theme !== "light";
    };
    readTheme();

    const allocate = () => {
      readTheme();
      // The hero's empty space moves with the viewport: the headline owns the
      // left on a wide screen and the bottom on a phone.
      // The mark fills the hero rather than sitting in a corner. It bleeds off
      // the sides on a phone, which is what a background should do.
      // Sized so the loops are inside the frame. Past about 0.85 the lobes
      // fall off both edges and all that is left on screen is the diffuse
      // middle, which reads as noise rather than as the mark.
      // The heads sit roughly a full radius above the loops, so the whole
      // shape has to hang low enough that they clear the header instead of
      // being cropped off the top of the frame.
      if (mqSmall.matches) {
        markLayout.x = 0;
        markLayout.y = -0.2;
        markLayout.scale = 0.6;
      } else {
        markLayout.x = 0.08;
        markLayout.y = 0.18;
        markLayout.scale = 0.8;
      }

      // Denser, because a rope and an ambient field both need bodies.
      count = mqSmall.matches ? 700 : 1400;
      const f = () => new Float32Array(count);
      ax = f(); ay = f(); az = f();
      bx = f(); by = f(); bz = f();
      pairOf = new Int32Array(count);
      thinSeed = f(); driftSeed = f(); sizeSeed = f();
      sinD = f(); cosD = f(); sinD2 = f(); cosD2 = f();
      sx = f(); sy = f(); sr = f();
      sBucket = new Int32Array(count);
      order = new Int32Array(count);
      for (let i = 0; i < count; i++) {
        thinSeed[i] = rand(i + 300);
        driftSeed[i] = rand(i + 500) * Math.PI * 2;
        sizeSeed[i] = 0.55 + rand(i + 700) * 0.95;
        const d = driftSeed[i];
        sinD[i] = Math.sin(d);
        cosD[i] = Math.cos(d);
        sinD2[i] = Math.sin(d * 2.3);
        cosD2[i] = Math.cos(d * 2.3);
      }
      cachedPair = "";
    };

    /** Bake both ends of the current transition once, then only lerp per frame. */
    const bake = (keyA: string, keyB: string) => {
      const pair = keyA + ">" + keyB;
      if (pair === cachedPair) return;
      cachedPair = pair;

      const A = FORMATIONS[keyA] ?? FORMATIONS[DEFAULT_FORMATION];
      const B = FORMATIONS[keyB] ?? FORMATIONS[DEFAULT_FORMATION];

      pairA.length = 0;
      pairB.length = 0;
      const lookup = new Map<string, number>();

      for (let i = 0; i < count; i++) {
        A.place(i, count, tmp);
        ax[i] = tmp.x; ay[i] = tmp.y; az[i] = tmp.z;
        B.place(i, count, tmp);
        bx[i] = tmp.x; by[i] = tmp.y; bz[i] = tmp.z;

        const ca: RGB = A.color(i, count);
        const cb: RGB = B.color(i, count);
        // Formations draw from a handful of colours, so the set of distinct
        // start/end pairs is tiny. That set is what makes batching possible.
        const key = `${ca[0]},${ca[1]},${ca[2]}|${cb[0]},${cb[1]},${cb[2]}`;
        let idx = lookup.get(key);
        if (idx === undefined) {
          idx = pairA.length;
          lookup.set(key, idx);
          pairA.push(ca);
          pairB.push(cb);
        }
        pairOf[i] = idx;
      }

      pairCount = pairA.length;
      const buckets = pairCount * ALPHA_STEPS;
      if (bucketStart.length < buckets + 1) {
        bucketStart = new Int32Array(buckets + 1);
        bucketFill = new Int32Array(buckets + 1);
      }
    };

    const bake2d = (cw: number, ch: number, paint: (c: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.ceil(cw));
      c.height = Math.max(1, Math.ceil(ch));
      const cc = c.getContext("2d");
      if (cc) paint(cc);
      return c;
    };

    const buildGradients = () => {
      // The bloom is baked at half resolution and blitted back up: it is a
      // soft blur, so nothing in it survives to the pixel anyway.
      bloomRadius = Math.hypot(w, h) * 0.55;
      const bs = Math.ceil(bloomRadius);
      bloomBmp = bake2d(bs, bs, (c) => {
        const g = c.createRadialGradient(bs / 2, bs / 2, 0, bs / 2, bs / 2, bs / 2);
        g.addColorStop(0, "rgba(0, 117, 246, 1)");
        g.addColorStop(0.45, "rgba(52, 194, 76, 0.35)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, bs, bs);
      });

      const vw = Math.ceil(w / 2);
      const vh2 = Math.ceil(h / 2);
      const vr = Math.hypot(vw, vh2) * 0.62;
      // The vignette is the ground darkened, so on paper it has to lighten
      // instead or it rings the frame in soot.
      const v = palette.dark ? "7,9,12" : "214,221,228";
      vignetteBmp = bake2d(vw, vh2, (c) => {
        const g = c.createRadialGradient(vw / 2, vh2 / 2, vr * 0.28, vw / 2, vh2 / 2, vr);
        g.addColorStop(0, `rgba(${v},0)`);
        g.addColorStop(1, `rgba(${v},0.72)`);
        c.fillStyle = g;
        c.fillRect(0, 0, vw, vh2);
      });
    };

    const measure = () => {
      // Soft dots and gradients: 1.25x is indistinguishable from 2x here and
      // is 60% fewer pixels to fill every frame.
      const dpr = Math.min(1.25, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGradients();
    };

    /** Read where each chapter actually lives in the document. */
    const measureAnchors = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-film]"));
      anchors = nodes.map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const centre = top + rect.height / 2 - window.innerHeight / 2;
        return { key: el.dataset.film || DEFAULT_FORMATION, p: max > 0 ? clamp(centre / max) : 0 };
      });
      if (anchors.length === 0) anchors = [{ key: DEFAULT_FORMATION, p: 0 }];
    };

    const onResize = () => {
      allocate();
      measure();
      measureAnchors();
    };

    /* ---- pointer parallax: the camera, not the particles ---- */
    let mx = 0, my = 0, cmx = 0, cmy = 0;
    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    /* ---- luminance flag so fixed UI can invert over the light chapter ---- */
    let lightNow = false;
    const setLight = (isLight: boolean) => {
      if (isLight === lightNow) return;
      lightNow = isLight;
      document.documentElement.dataset.filmLight = isLight ? "1" : "0";
    };

    // Exposed for the local probes in scripts/. Read-only state, no behaviour.
    (window as unknown as { __film?: unknown }).__film = {
      state: scrollState,
      anchors: () => anchors,
    };

    const t0 = performance.now();

    const draw = (now: number) => {
      // Nothing to draw while an opaque section covers the whole viewport.
      if (scrollState.covered) return;

      const time = (now - t0) / 1000;

      // Filmic lag. The picture trails the scrubber slightly, which is most of
      // why it reads as footage rather than as a slider.
      scrollState.smooth = reduced
        ? scrollState.raw
        : lerp(scrollState.smooth, scrollState.raw, 0.075);
      const p = scrollState.smooth;

      /* --- which two chapters are we between --- */
      let i0 = 0;
      while (i0 < anchors.length - 2 && p > anchors[i0 + 1].p) i0++;
      const a0 = anchors[i0];
      const a1 = anchors[Math.min(i0 + 1, anchors.length - 1)];
      const span = Math.max(1e-4, a1.p - a0.p);
      const t = smoothstep(clamp((p - a0.p) / span));

      bake(a0.key, a1.key);
      const FA = FORMATIONS[a0.key] ?? FORMATIONS[DEFAULT_FORMATION];
      const FB = FORMATIONS[a1.key] ?? FORMATIONS[DEFAULT_FORMATION];

      const thin = lerp(FA.thin, FB.thin, t);
      const life = reduced ? 0 : lerp(FA.life, FB.life, t);
      const weight = lerp(FA.weight ?? 1, FB.weight ?? 1, t);

      /* --- ground --- */
      const gr = lerp(FA.bg[0], FB.bg[0], t);
      const gg = lerp(FA.bg[1], FB.bg[1], t);
      const gb = lerp(FA.bg[2], FB.bg[2], t);
      ctx.fillStyle = `rgb(${gr | 0},${gg | 0},${gb | 0})`;
      ctx.fillRect(0, 0, w, h);

      const luminance = (0.2126 * gr + 0.7152 * gg + 0.0722 * gb) / 255;
      setLight(luminance > 0.5);
      const dark = luminance < 0.5;

      /* --- atmosphere: one soft brand-tinted bloom, drifting --- */
      if (dark === palette.dark && bloomBmp) {
        const bx0 = w * (0.5 + Math.sin(time * 0.14) * 0.17 + cmx * 0.04);
        const by0 = h * (0.46 + Math.cos(time * 0.105) * 0.14);
        const d = bloomRadius * 2;
        ctx.globalAlpha = 0.055 + 0.035 * Math.sin(time * 0.19);
        ctx.drawImage(bloomBmp, bx0 - bloomRadius, by0 - bloomRadius, d, d);
        ctx.globalAlpha = 1;
      }

      /* --- camera --- */
      cmx = lerp(cmx, mx, 0.045);
      cmy = lerp(cmy, my, 0.045);
      const cx = w / 2 + cmx * 22;
      const cy = h / 2 + cmy * 16;
      // The whole field breathes, very slowly. Small enough that you never
      // catch it moving, large enough that the frame is never quite still.
      const breath = reduced ? 1 : 1 + 0.014 * Math.sin(time * 0.21);
      const S = Math.hypot(w, h) * 0.255 * breath;

      // Two octaves of drift plus a twinkle, evaluated once for the frame.
      const s1 = Math.sin(time * 0.38), c1 = Math.cos(time * 0.38);
      const s2 = Math.sin(time * 0.31), c2 = Math.cos(time * 0.31);
      const s3 = Math.sin(time * 1.27), c3 = Math.cos(time * 1.27);
      const s4 = Math.sin(time * 1.43), c4 = Math.cos(time * 1.43);
      const s5 = Math.sin(time * 1.65), c5 = Math.cos(time * 1.65);
      // A brightness shimmer is not travel, so a gentle one survives reduced
      // motion: the field still feels awake without anything moving.
      const twk = reduced ? 0.09 : 0.3;

      // A slow swirl of the whole field. Rotation is rigid, so it gives the
      // background a constant sense of travel without smearing any of the
      // shapes the chapters are made of, which is what raising the per-particle
      // drift does instead.
      const ang = reduced ? 0 : 0.085 * Math.sin(time * 0.085) + 0.03 * Math.sin(time * 0.21);
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const focal = 2.75;
      const buckets = pairCount * ALPHA_STEPS;

      /* --- pass 1: project, and tally how many land in each colour bucket --- */
      bucketFill.fill(0, 0, buckets + 1);
      let visible = 0;

      for (let i = 0; i < count; i++) {
        const keep = clamp((thinSeed[i] - thin) / 0.14);
        if (keep <= 0.001) continue;

        let x = lerp(ax[i], bx[i], t);
        let y = lerp(ay[i], by[i], t);
        const z = lerp(az[i], bz[i], t);

        if (life > 0) {
          const sd = sinD[i], cd = cosD[i], sd2 = sinD2[i], cd2 = cosD2[i];
          // Slow wander, plus a faster shimmer so individual dots visibly move
          // rather than the whole field creeping as one.
          x += ((s1 * cd + c1 * sd) * 0.044 + (s3 * cd2 + c3 * sd2) * 0.016) * life;
          y += ((c2 * cd - s2 * sd) * 0.039 + (c4 * cd2 - s4 * sd2) * 0.014) * life;
        }

        const s = focal / (focal + z + cmy * 0.05);
        if (s <= 0) continue;

        const rx = x * ca - y * sa;
        const ry = x * sa + y * ca;
        const px = cx + rx * s * S;
        const py = cy + ry * s * S;
        if (px < -60 || px > w + 60 || py < -60 || py > h + 60) continue;

        const depth = clamp((s - 0.55) / 0.95);
        const twinkle = 1 + twk * (s5 * cosD2[i] + c5 * sinD2[i]);
        const alpha = keep * (0.12 + depth * 0.58) * twinkle;
        let step = (alpha * ALPHA_STEPS) | 0;
        if (step > ALPHA_STEPS - 1) step = ALPHA_STEPS - 1;
        if (step >= ALPHA_STEPS) step = ALPHA_STEPS - 1;
        if (step < 0) step = 0;

        sx[visible] = px;
        sy[visible] = py;
        sr[visible] = sizeSeed[i] * (0.75 + depth * 1.45) * weight;
        const bucket = pairOf[i] * ALPHA_STEPS + step;
        sBucket[visible] = bucket;
        bucketFill[bucket]++;
        visible++;
      }

      /* --- pass 2: prefix sums, then scatter into bucket order --- */
      let running = 0;
      for (let bI = 0; bI <= buckets; bI++) {
        bucketStart[bI] = running;
        running += bucketFill[bI];
        bucketFill[bI] = bucketStart[bI];
      }
      for (let i = 0; i < visible; i++) order[bucketFill[sBucket[i]]++] = i;

      /* --- pass 3: one path and one fill per bucket --- */
      for (let bI = 0; bI < buckets; bI++) {
        const from = bucketStart[bI];
        const to = bucketFill[bI];
        if (to <= from) continue;

        const pi = (bI / ALPHA_STEPS) | 0;
        const step = bI - pi * ALPHA_STEPS;
        const ca = pairA[pi];
        const cb = pairB[pi];
        const r = lerp(ca[0], cb[0], t) | 0;
        const g = lerp(ca[1], cb[1], t) | 0;
        const b2 = lerp(ca[2], cb[2], t) | 0;
        const a = (step + 0.5) / ALPHA_STEPS;

        ctx.fillStyle = `rgba(${r},${g},${b2},${a.toFixed(3)})`;
        ctx.beginPath();
        for (let k = from; k < to; k++) {
          const i = order[k];
          const rad = sr[i];
          ctx.moveTo(sx[i] + rad, sy[i]);
          ctx.arc(sx[i], sy[i], rad, 0, 6.2832);
        }
        ctx.fill();
      }

      /* --- vignette: keeps the frame cinematic and keeps particles from
             competing with type at the edges --- */
      if (vignetteBmp && dark === palette.dark) {
        ctx.drawImage(vignetteBmp, 0, 0, w, h);
      }
    };

    allocate();
    measure();
    measureAnchors();

    // Anchors are positions in a document whose height keeps changing: fonts
    // swap, images decode, sticky sections resolve. Measuring once on mount
    // and hoping is how the film ended up painting the paper-white safety
    // chapter behind the footer, because every stored position was stale by a
    // thousand pixels. A ResizeObserver on the body catches every growth.
    let pending = 0;
    const remeasure = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        measureAnchors();
      });
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);

    const onResume = () => {
      if (!document.hidden) remeasure();
    };
    document.addEventListener("visibilitychange", onResume);
    window.addEventListener("pageshow", onResume);

    const settle = window.setTimeout(measureAnchors, 600);
    const settle2 = window.setTimeout(measureAnchors, 1800);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    // The theme can change at any moment, and every particle's colour and
    // every ground depends on it, so the whole thing is re-baked rather than
    // patched.
    const themeWatch = new MutationObserver(() => {
      readTheme();
      cachedPair = "";
      buildGradients();
    });
    themeWatch.observe(document.documentElement, { attributeFilter: ["data-theme"] });

    const stop = onTick({ order: ORDER.film, write: draw });

    return () => {
      stop();
      themeWatch.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onResume);
      window.removeEventListener("pageshow", onResume);
      if (pending) cancelAnimationFrame(pending);
      window.clearTimeout(settle);
      window.clearTimeout(settle2);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 block"
    />
  );
}
