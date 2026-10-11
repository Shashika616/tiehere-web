"use client";

import { useEffect, useRef } from "react";
import Mark from "@/components/ui/Mark";
import StoreButtons from "@/components/ui/StoreButtons";
import { RevealLines, Rise } from "@/components/ui/Reveal";
import { clamp } from "@/lib/scroll";

/**
 * The payoff. Every particle in the film has been walking toward this shape
 * since the first screen; here the mark draws itself, scrubbed by the last
 * stretch of scroll, and then holds.
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

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const rect = el.getBoundingClientRect();
      // 0 when the block enters the lower third, 1 once it is centred.
      const p = clamp((window.innerHeight * 0.92 - rect.top) / (window.innerHeight * 0.65));

      paths.forEach((path, i) => {
        const len = path.getTotalLength();
        const local = clamp((p - i * 0.12) / 0.78);
        path.style.strokeDashoffset = `${len * (1 - local)}`;
      });
      heads.forEach((h, i) => {
        h.style.opacity = `${clamp((p - 0.62 - i * 0.1) / 0.22)}`;
      });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="get" data-film="knot" className="relative flex min-h-[105svh] items-center py-32">
      <div className="shell w-full text-center">
        <div ref={wrap} className="flex justify-center">
          <Mark size={132} draw title="The TieHere mark: two figures, tied" />
        </div>

        <div className="mt-14 flex flex-col items-center">
          <RevealLines
            as="h2"
            className="t-h2 max-w-[16ch]"
            lines={["Somebody near you", <span key="line-emph">is free on <span className="t-serif">Thursday</span>.</span>]}
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
