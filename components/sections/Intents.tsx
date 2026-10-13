"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { INTENTS } from "@/content/site";
import { clamp, lerp } from "@/lib/scroll";
import { onTick, ORDER } from "@/lib/ticker";

/**
 * The horizontal chapter: seven intents scrubbed sideways by vertical scroll.
 *
 * Driven by the section's own bounding rect in a rAF loop rather than by a
 * ScrollTrigger pin. Lenis already owns scroll position, and layering a pin on
 * a scroller proxy is the single most fragile thing in this genre of site.
 * Sticky plus a transform cannot desync.
 *
 * On touch it is not pinned at all, it becomes a native snap carousel.
 * Hijacking vertical scroll to move things sideways on a phone is a trap.
 *
 * The photographs are CC0 (see IMAGE-CREDITS.md), graded down and tinted
 * lightly toward the two brand colours so seven pictures from several sources
 * read as one set. Full colour returns on hover, which is the card coming
 * alive under the pointer.
 *
 * The tint is a plain translucent gradient, not `mix-blend-mode`. A blend
 * group on each of seven cards is something the compositor re-resolves every
 * frame while the track scrubs sideways; at this opacity the two are almost
 * indistinguishable and only one of them is free.
 */
export default function Intents() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trackWidth = useRef(0);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = () => setPinned(mq.matches && !reduced);
    apply();
    const remeasure = () => {
      trackWidth.current = track.current?.scrollWidth ?? 0;
    };
    remeasure();
    mq.addEventListener("change", apply);
    window.addEventListener("resize", remeasure);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  useEffect(() => {
    if (!pinned) {
      if (track.current) track.current.style.transform = "";
      return;
    }

    let current = 0;
    let target = 0;
    let last = -1;

    return onTick({
      order: ORDER.track,
      read: () => {
        const sec = section.current;
        const tr = track.current;
        if (!sec || !tr) return;

        const rect = sec.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;

        const p = clamp(-rect.top / scrollable);
        // scrollWidth is a layout read; it only changes on resize, so cache it.
        if (trackWidth.current === 0) trackWidth.current = tr.scrollWidth;
        const distance = Math.max(0, trackWidth.current - window.innerWidth + 96);
        target = p * distance;
      },
      write: () => {
        const tr = track.current;
        if (!tr) return;
        // Damped, so the cards carry a little weight instead of snapping to the wheel.
        current = lerp(current, target, 0.2);
        const v = Math.round(current * 100) / 100;
        if (v !== last) {
          tr.style.transform = `translate3d(${-v}px,0,0)`;
          last = v;
        }
      },
    });
  }, [pinned]);

  return (
    <section
      id="intents"
      ref={section}
      data-film="fan"
      className="relative"
      style={pinned ? { height: `${INTENTS.length * 62 + 60}svh` } : undefined}
      aria-labelledby="intents-heading"
    >
      <div
        className={
          pinned
            ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden"
            : "py-28"
        }
      >
        <div className="shell mb-12">
          <h2 id="intents-heading" className="t-h3 max-w-[24ch]">
            You never just &ldquo;meet up&rdquo;. You meet up{" "}
            <span className="t-serif">for</span> something.
          </h2>
        </div>

        <div
          className={
            pinned
              ? "w-full overflow-hidden"
              : "w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]"
          }
        >
          <div
            ref={track}
            className="flex w-max gap-5 px-[clamp(1rem,4vw,4.5rem)] will-change-transform"
          >
            {INTENTS.map((intent, i) => (
              <article
                key={intent.id}
                className="group relative flex h-[clamp(21rem,52vh,27rem)] w-[clamp(16.5rem,25vw,22rem)] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-2xl border border-on-media-line bg-ink-800"
              >
                {/* Duotone stack: desaturate, then tint toward brand blue and
                    green, then let real colour back in on hover. */}
                <Image
                  src={intent.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 70vw, 22rem"
                  priority={i < 2}
                  className="media-card-img object-cover group-hover:scale-[1.05]"
                  style={{ objectPosition: intent.focus }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.22] transition-opacity duration-700 group-hover:opacity-0"
                  style={{
                    background:
                      i % 2 === 0
                        ? "linear-gradient(155deg, rgba(0,117,246,0.9) 0%, rgba(30,143,168,0.7) 62%, rgba(52,194,76,0.75) 100%)"
                        : "linear-gradient(155deg, rgba(43,163,107,0.8) 0%, rgba(18,115,201,0.75) 70%, rgba(0,117,246,0.9) 100%)",
                  }}
                />
                {/* Ground for the type. Near solid where the words sit. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, #070a0e 0%, #070a0e 26%, rgba(7,10,14,0.82) 44%, rgba(7,10,14,0.3) 68%, rgba(7,10,14,0.08) 100%)",
                  }}
                />

                <div className="relative p-7">
                  <h3 className="text-[clamp(1.5rem,2.4vw,2.05rem)] font-medium leading-none tracking-tight text-on-media">
                    {intent.label}
                  </h3>
                  <p className="t-serif mt-3 text-[1.1rem] leading-snug text-on-media">
                    {intent.tagline}
                  </p>
                  <div className="mt-5 h-px w-full bg-on-media-line" />
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-on-media-2">
                    {intent.note}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
