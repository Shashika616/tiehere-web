"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { INTENTS } from "@/content/site";
import { clamp, lerp } from "@/lib/scroll";

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
 * lightly toward the two brand colours so seven pictures from four different
 * sources read as one set. Full colour returns on hover, which is the card
 * coming alive under the pointer.
 */
export default function Intents() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = () => setPinned(mq.matches && !reduced);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!pinned) {
      if (track.current) track.current.style.transform = "";
      return;
    }

    let raf = 0;
    let current = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const sec = section.current;
      const tr = track.current;
      if (!sec || !tr) return;

      const rect = sec.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const p = clamp(-rect.top / scrollable);
      const distance = Math.max(0, tr.scrollWidth - window.innerWidth + 96);

      // Damped, so the cards carry a little weight instead of snapping to the wheel.
      current = lerp(current, p * distance, 0.12);
      tr.style.transform = `translate3d(${-current.toFixed(2)}px,0,0)`;
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
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
                className="group relative flex h-[clamp(21rem,52vh,27rem)] w-[clamp(16.5rem,25vw,22rem)] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-2xl border border-white/12 bg-ink-800"
              >
                {/* Duotone stack: desaturate, then tint toward brand blue and
                    green, then let real colour back in on hover. */}
                <Image
                  src={intent.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 70vw, 22rem"
                  priority={i < 2}
                  className="object-cover saturate-[0.62] brightness-[0.72] contrast-[1.02] transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:saturate-100 group-hover:brightness-[1]"
                  style={{ objectPosition: intent.focus }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 mix-blend-color opacity-[0.18] transition-opacity duration-700 group-hover:opacity-0"
                  style={{
                    background:
                      i % 2 === 0
                        ? "linear-gradient(155deg, #0075F6 0%, #1E8FA8 62%, #34C24C 100%)"
                        : "linear-gradient(155deg, #2BA36B 0%, #1273C9 70%, #0075F6 100%)",
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
                  <h3 className="text-[clamp(1.5rem,2.4vw,2.05rem)] font-medium leading-none tracking-tight text-white">
                    {intent.label}
                  </h3>
                  <p className="t-serif mt-3 text-[1.1rem] leading-snug text-white/90">
                    {intent.tagline}
                  </p>
                  <div className="mt-5 h-px w-full bg-white/15" />
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/75">
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
