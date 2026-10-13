"use client";

import { useEffect, useRef } from "react";
import Mark from "@/components/ui/Mark";
import StoreButtons from "@/components/ui/StoreButtons";
import { RevealLines, Rise } from "@/components/ui/Reveal";
import { clamp } from "@/lib/scroll";
import { onTick, ORDER } from "@/lib/ticker";

/**
 * The payoff. Every particle in the film has been walking toward this shape
 * since the first screen; here the mark draws itself, scrubbed by the last
 * stretch of scroll, and then holds.
 *
 * It pins while the footer rises over it, the same sticky stack the three
 * step panels use. The footer has to be opaque for that to read, which is why
 * it carries its own ground rather than letting the canvas through.
 */
export default function FinalCta() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = wrap.current;
    if (!el) return;

    const paths = Array.from(el.querySelectorAll<SVGPathElement>(".mark-path"));
    const heads = Array.from(el.querySelectorAll<SVGCircleElement>(".mark-head"));

    if (reduced) {
      paths.forEach((p) => (p.style.strokeDashoffset = "0"));
      heads.forEach((h) => (h.style.opacity = "1"));
      return;
    }

    let progress = 0;

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    const lens = paths.map((path) => path.getTotalLength());
    let last = -1;

    return onTick({
      order: ORDER.scene,
      read: () => {
        const r = el.getBoundingClientRect();
        // 0 when the block enters the lower third, 1 once it is centred.
        progress = clamp((window.innerHeight * 0.92 - r.top) / (window.innerHeight * 0.65));
      },
      write: () => {
        const v = Math.round(progress * 500) / 500;
        if (v === last) return;
        last = v;
        paths.forEach((path, i) => {
          const local = clamp((v - i * 0.12) / 0.78);
          path.style.strokeDashoffset = String(lens[i] * (1 - local));
        });
        heads.forEach((h, i) => {
          h.style.opacity = String(clamp((v - 0.62 - i * 0.1) / 0.22));
        });
      },
    });
  }, []);

  return (
    <section id="get" data-film="knot" className="cta-pin relative flex items-center py-24">
      <div className="shell w-full text-center">
        <div ref={wrap} className="flex justify-center">
          <Mark size={132} draw title="The TieHere mark: two figures, tied" />
        </div>

        <div className="mt-14 flex flex-col items-center">
          <RevealLines
            as="h2"
            className="t-h2 max-w-[16ch]"
            lines={["Somebody near you", <span key="line-emph">is free <span className="t-serif">Today</span>.</span>]}
          />

          <Rise delay={140}>
            <p className="t-lead mt-8 max-w-[44ch]">
              Pick an intent, pick a window, and meet one person who is actually there.
            </p>
          </Rise>

          <Rise delay={240} className="mt-12">
            <div className="flex justify-center">
              <StoreButtons />
            </div>
          </Rise>

          <Rise delay={340}>
            <p className="t-label mt-10">free to join · premium optional · cancel in the store</p>
          </Rise>
        </div>
      </div>
    </section>
  );
}
