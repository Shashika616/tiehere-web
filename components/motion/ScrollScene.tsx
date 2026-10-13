"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { clamp, lerp } from "@/lib/scroll";
import { onTick, ORDER } from "@/lib/ticker";

/**
 * A photographic cut in the film.
 *
 * The canvas film stays the page's background; these are framed insets that
 * the film plays around, so photography arrives without ever replacing the
 * thing that gives the site its identity. Each one is scrubbed by scroll:
 * the frame widens as it enters, and the picture inside it drifts slower than
 * the page, which is what makes a still photograph read as footage.
 *
 * Same engine as everything else here: one rAF loop reading the element's own
 * bounding rect, damped. No scroll library, nothing to desync.
 */
export default function ScrollScene({
  id,
  src,
  alt,
  caption,
  height = "72vh",
  priority = false,
}: {
  id?: string;
  src: string;
  alt: string;
  caption?: string;
  height?: string;
  priority?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const f = frame.current;
    const im = inner.current;
    if (!f || !im) return;

    if (reduced) {
      f.style.transform = "none";
      f.style.opacity = "1";
      im.style.transform = "none";
      return;
    }

    let shownNow = 0;
    let driftNow = 0;
    let shownTarget = 0;
    let driftTarget = 0;
    // Last values written, so an unchanged frame costs no style recalc.
    let lastScale = -1;
    let lastOpacity = -1;
    let lastDrift = -1;

    return onTick({
      order: ORDER.scene,
      read: () => {
        const r = f.getBoundingClientRect();
        const vh = window.innerHeight;
        // Cheap cull: nowhere near the viewport means nothing to animate.
        if (r.bottom < -vh || r.top > vh * 2) {
          shownTarget = r.top > 0 ? 0 : 1;
          driftTarget = r.top > 0 ? 1 : -1;
          return;
        }
        shownTarget = clamp((vh * 0.96 - r.top) / (vh * 0.62));
        driftTarget = clamp((r.top + r.height / 2) / vh, 0, 1) * 2 - 1;
      },
      write: () => {
        shownNow = lerp(shownNow, shownTarget, 0.16);
        driftNow = lerp(driftNow, driftTarget, 0.16);

        const scale = Math.round((0.94 + shownNow * 0.06) * 10000) / 10000;
        const opacity = Math.round((0.25 + shownNow * 0.75) * 1000) / 1000;
        const drift = Math.round(driftNow * 7 * 100) / 100;

        if (scale !== lastScale) {
          f.style.transform = `scale(${scale})`;
          lastScale = scale;
        }
        if (opacity !== lastOpacity) {
          f.style.opacity = String(opacity);
          lastOpacity = opacity;
        }
        if (drift !== lastDrift) {
          // The picture moves against the page: slower, and the opposite way.
          im.style.transform = `translate3d(0, ${drift}%, 0) scale(1.16)`;
          lastDrift = drift;
        }
      },
    });
  }, []);

  return (
    <figure id={id} className="shell my-4 md:my-8">
      <div
        ref={frame}
        className="relative w-full overflow-hidden rounded-2xl border border-on-media-line will-change-transform"
        style={{ height, opacity: 0 }}
      >
        <div ref={inner} className="absolute inset-0 will-change-transform">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="media-scene-img object-cover"
          />
        </div>

        {/* Keeps the photograph inside the site's two colours rather than
            introducing a third, and ties it to the cards. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{ background: "linear-gradient(150deg, rgba(0,117,246,0.85) 0%, rgba(52,194,76,0.8) 100%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(7,9,12,0.92) 0%, rgba(7,9,12,0.38) 38%, rgba(7,9,12,0.12) 70%, rgba(7,9,12,0.4) 100%)",
          }}
        />

        {caption && (
          <figcaption className="absolute inset-x-0 bottom-0 p-7 md:p-10">
            <p className="t-serif max-w-[26ch] text-[clamp(1.25rem,2.6vw,2rem)] leading-tight text-on-media">
              {caption}
            </p>
          </figcaption>
        )}
      </div>
    </figure>
  );
}
