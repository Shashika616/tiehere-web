"use client";

import { useEffect, useRef } from "react";
import { FORMATIONS, DEFAULT_FORMATION, type Vec, type RGB } from "@/lib/formations";
import { scrollState, clamp, lerp, smoothstep, rand } from "@/lib/scroll";

type Anchor = { key: string; p: number };

/**
 * The film.
 *
 * One fixed canvas behind the entire document, playing a single continuous
 * shot that is scrubbed by scroll: a thousand scattered people become a city,
 * become seven reasons to meet, become a trust ladder, go still for safety,
 * and finally lock into the TieHere mark. There is no video file, every
 * frame is generated, which is why it weighs nothing and never buffers.
 *
 * Chapters are not hardcoded to scroll percentages. Each section carries a
 * `data-film="<formation>"` attribute and the film measures where those
 * sections actually are, so editing copy can never desync the picture from
 * the words.
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
    let dpr = 1;
    let count = 0;

    /* ---- particle buffers (flat arrays, no per-frame allocation) ---- */
    let ax = new Float32Array(0); // formation A position
    let ay = new Float32Array(0);
    let az = new Float32Array(0);
    let bx = new Float32Array(0); // formation B position
    let by = new Float32Array(0);
    let bz = new Float32Array(0);
    let ar = new Float32Array(0); // formation A colour
    let ag = new Float32Array(0);
    let ab = new Float32Array(0);
    let br = new Float32Array(0); // formation B colour
    let bg2 = new Float32Array(0);
    let bb = new Float32Array(0);
    let thinSeed = new Float32Array(0);
    let driftSeed = new Float32Array(0);
    let sizeSeed = new Float32Array(0);

    let anchors: Anchor[] = [];
    let cachedPair = "";

    const tmp: Vec = { x: 0, y: 0, z: 0 };

    const allocate = () => {
      count = mqSmall.matches ? 560 : 1180;
      const f = () => new Float32Array(count);
      ax = f(); ay = f(); az = f();
      bx = f(); by = f(); bz = f();
      ar = f(); ag = f(); ab = f();
      br = f(); bg2 = f(); bb = f();
      thinSeed = f(); driftSeed = f(); sizeSeed = f();
      for (let i = 0; i < count; i++) {
        thinSeed[i] = rand(i + 300);
        driftSeed[i] = rand(i + 500) * Math.PI * 2;
        sizeSeed[i] = 0.55 + rand(i + 700) * 0.95;
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

      for (let i = 0; i < count; i++) {
        A.place(i, count, tmp);
        ax[i] = tmp.x; ay[i] = tmp.y; az[i] = tmp.z;
        B.place(i, count, tmp);
        bx[i] = tmp.x; by[i] = tmp.y; bz[i] = tmp.z;

        const ca: RGB = A.color(i, count);
        ar[i] = ca[0]; ag[i] = ca[1]; ab[i] = ca[2];
        const cb: RGB = B.color(i, count);
        br[i] = cb[0]; bg2[i] = cb[1]; bb[i] = cb[2];
      }
    };

    const measure = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    let mx = 0;
    let my = 0;
    let cmx = 0;
    let cmy = 0;
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

    let raf = 0;
    let running = true;
    let t0 = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;

      const time = (now - t0) / 1000;

      // Filmic lag. The picture trails the scrubber slightly, this single
      // line is most of why it reads as footage rather than as a slider.
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
      const tRaw = clamp((p - a0.p) / span);
      const t = smoothstep(tRaw);

      bake(a0.key, a1.key);
      const FA = FORMATIONS[a0.key] ?? FORMATIONS[DEFAULT_FORMATION];
      const FB = FORMATIONS[a1.key] ?? FORMATIONS[DEFAULT_FORMATION];

      const thin = lerp(FA.thin, FB.thin, t);
      const life = reduced ? 0 : lerp(FA.life, FB.life, t);

      /* --- ground --- */
      const gr = lerp(FA.bg[0], FB.bg[0], t);
      const gg = lerp(FA.bg[1], FB.bg[1], t);
      const gb = lerp(FA.bg[2], FB.bg[2], t);
      ctx.fillStyle = `rgb(${gr | 0},${gg | 0},${gb | 0})`;
      ctx.fillRect(0, 0, w, h);

      const luminance = (0.2126 * gr + 0.7152 * gg + 0.0722 * gb) / 255;
      setLight(luminance > 0.5);

      /* --- atmosphere: one soft brand-tinted bloom, drifting --- */
      if (luminance < 0.5) {
        const bloomX = w * (0.5 + Math.sin(time * 0.08) * 0.12 + cmx * 0.04);
        const bloomY = h * (0.46 + Math.cos(time * 0.062) * 0.1);
        const rad = Math.hypot(w, h) * 0.55;
        const g = ctx.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, rad);
        const warm = 0.055 + 0.03 * Math.sin(time * 0.11);
        g.addColorStop(0, `rgba(0, 117, 246, ${warm})`);
        g.addColorStop(0.45, `rgba(52, 194, 76, ${warm * 0.35})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      /* --- camera --- */
      cmx = lerp(cmx, mx, 0.045);
      cmy = lerp(cmy, my, 0.045);
      const cx = w / 2 + cmx * 22;
      const cy = h / 2 + cmy * 16;
      const S = Math.hypot(w, h) * 0.255;
      const focal = 2.75;

      /* --- particles --- */
      for (let i = 0; i < count; i++) {
        // fade-out dissolve, soft-edged so chapters cross-dissolve
        const keep = clamp((thinSeed[i] - thin) / 0.14);
        if (keep <= 0.001) continue;

        let x = lerp(ax[i], bx[i], t);
        let y = lerp(ay[i], by[i], t);
        const z = lerp(az[i], bz[i], t);

        if (life > 0) {
          const d = driftSeed[i];
          x += Math.sin(time * 0.33 + d) * 0.035 * life;
          y += Math.cos(time * 0.27 + d * 1.7) * 0.03 * life;
        }

        const s = focal / (focal + z + cmy * 0.05);
        if (s <= 0) continue;

        const sx = cx + x * s * S;
        const sy = cy + y * s * S;
        if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue;

        const depth = clamp((s - 0.55) / 0.95);
        const r = lerp(ar[i], br[i], t);
        const g2 = lerp(ag[i], bg2[i], t);
        const b2 = lerp(ab[i], bb[i], t);
        const alpha = keep * (0.12 + depth * 0.58);
        const size = sizeSeed[i] * (0.75 + depth * 1.45);

        ctx.fillStyle = `rgba(${r | 0},${g2 | 0},${b2 | 0},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, 6.2832);
        ctx.fill();
      }

      /* --- vignette: keeps the frame cinematic and, more usefully, keeps
             particles from competing with type at the edges of the shot --- */
      if (luminance < 0.5) {
        const vr = Math.hypot(w, h) * 0.62;
        const v = ctx.createRadialGradient(w / 2, h / 2, vr * 0.28, w / 2, h / 2, vr);
        v.addColorStop(0, "rgba(7,9,12,0)");
        v.addColorStop(1, "rgba(7,9,12,0.72)");
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, w, h);
      }
    };

    allocate();
    measure();
    measureAnchors();
    // Re-measure once layout has settled (fonts, images, late hydration).
    const settle = window.setTimeout(measureAnchors, 600);
    const settle2 = window.setTimeout(measureAnchors, 1800);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    const onVis = () => {
      running = !document.hidden;
      t0 = performance.now() - 1000;
    };
    document.addEventListener("visibilitychange", onVis);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.clearTimeout(settle2);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
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
