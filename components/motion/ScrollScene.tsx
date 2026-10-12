"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { clamp, lerp } from "@/lib/scroll";

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

    let raf = 0;
    let shownNow = 0;
    let driftNow = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = f.getBoundingClientRect();
      const vh = window.innerHeight;

      // 0 as the frame enters the lower edge, 1 once it is comfortably in view.
      const shown = clamp((vh * 0.96 - r.top) / (vh * 0.62));
      // -1 above the viewport, +1 below it. Drives the parallax drift.
      const through = clamp((r.top + r.height / 2) / vh, 0, 1) * 2 - 1;

      shownNow = lerp(shownNow, shown, 0.12);
      driftNow = lerp(driftNow, through, 0.12);

      const scale = 0.94 + shownNow * 0.06;
      f.style.transform = `scale(${scale.toFixed(4)})`;
      f.style.opacity = (0.25 + shownNow * 0.75).toFixed(3);
      // The picture moves against the page: slower, and the opposite way.
      im.style.transform = `translate3d(0, ${(driftNow * 7).toFixed(2)}%, 0) scale(1.16)`;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <figure id={id} className="shell my-4 md:my-8">
      <div
        ref={frame}
        className="relative w-full overflow-hidden rounded-2xl border border-white/10 will-change-transform"
        style={{ height, opacity: 0 }}
      >
        <div ref={inner} className="absolute inset-0 will-change-transform">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover brightness-[0.74] contrast-[1.04] saturate-[0.9]"
          />
        </div>

        {/* Keeps the photograph inside the site's two colours rather than
            introducing a third, and ties it to the cards. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-color"
          style={{ background: "linear-gradient(150deg, #0075F6 0%, #34C24C 100%)" }}
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
            <p className="t-serif max-w-[26ch] text-[clamp(1.25rem,2.6vw,2rem)] leading-tight text-white">
              {caption}
            </p>
          </figcaption>
        )}
      </div>
    </figure>
  );
}
