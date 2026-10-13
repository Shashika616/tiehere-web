"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { STEPS } from "@/content/site";
import { RevealLines } from "@/components/ui/Reveal";
import { scrollState } from "@/lib/scroll";
import { onTick, ORDER } from "@/lib/ticker";

/**
 * Three steps as full-bleed panels that stack over one another.
 *
 * The stacking is pure CSS `position: sticky`. Each panel pins to the top and
 * the next one, later in flow, scrolls up over it. There is no scroll
 * listener, no transform written per frame and no JavaScript in the effect at
 * all, which is the only way to promise it never stutters: the compositor
 * does the whole thing.
 *
 * It also fixes a real defect in the version this replaces. Those panels were
 * translucent cards, so a covered card's body text showed through the one on
 * top and read as broken. A full-bleed photograph is opaque by definition.
 *
 * Content sits in the upper third rather than centred, so a panel's title is
 * still readable in the strip left above the one rising over it. That is what
 * makes the stack read as a deck being dealt rather than as a hard cut.
 *
 * The one line of JS here is an optimisation, not an effect: while the stack
 * covers the viewport the canvas film behind it cannot be seen, so it is told
 * to stop drawing. That is three screens of scrolling with no canvas work.
 */
export default function HowItWorks() {
  const stack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stack.current;
    if (!el) return;
    return onTick({
      order: ORDER.scene,
      read: () => {
        const r = el.getBoundingClientRect();
        scrollState.covered = r.top <= 0 && r.bottom >= window.innerHeight;
      },
    });
  }, []);

  return (
    <section id="how" className="relative">
      <div className="shell py-28 md:py-36">
        <RevealLines
          as="h2"
          className="t-h2 max-w-[18ch]"
          lines={[
            "Three steps, and",
            <span key="line-emph">
              none of them is a <span className="t-serif">profile</span>.
            </span>,
          ]}
        />
      </div>

      <div ref={stack} className="how-stack">
        {STEPS.map((step, i) => (
          <article key={step.n} className="how-panel" style={{ zIndex: i + 1 }}>
            <Image
              src={step.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: i === 0 ? "50% 55%" : "50% 50%" }}
            />
            <div aria-hidden="true" className="how-panel-grade" />

            <div className="shell relative flex h-full flex-col justify-start pt-[22vh] md:pt-[26vh]">
              <div className="flex items-end gap-6 md:gap-10">
                <h3 className="t-display !text-[clamp(2.25rem,5.4vw,4.75rem)]">{step.title}</h3>
                <span className="mb-4 hidden h-px flex-1 bg-white/25 md:block" />
                <span className="t-label mb-5 hidden shrink-0 !text-white/70 md:block">
                  {step.meta}
                </span>
              </div>

              <div className="mt-8 flex items-start gap-8 md:mt-10 md:gap-14">
                <span className="t-label mt-1.5 shrink-0 !text-white/55">{step.n}</span>
                <p className="t-lead max-w-[44ch] !text-white/80">{step.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
