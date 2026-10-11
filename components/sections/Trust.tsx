"use client";

import { useEffect, useRef, useState } from "react";
import { TRUST } from "@/content/site";
import { RevealLines, Rise } from "@/components/ui/Reveal";

/**
 * The differentiator chapter. A sticky ladder on the left fills blue → green
 * as the rungs scroll past on the right, so the graphic says exactly what the
 * copy says. Framed as what you get, never as hoops to jump through.
 */
export default function Trust() {
  const [active, setActive] = useState(0);
  const rungs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.rung);
            setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    rungs.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, []);

  const fill = ((active + 1) / TRUST.length) * 100;

  return (
    <section id="trust" data-film="ladder" className="relative py-28 md:py-36">
      <div className="shell">
        <RevealLines
          as="h2"
          className="t-h2 max-w-[20ch]"
          lines={["Trust is not a badge.", <span key="line-emph">It is a <span className="t-serif">ladder</span>, and you climb it.</span>]}
        />
        <Rise delay={120}>
          <p className="t-lead mt-8 max-w-[52ch]">
            Every rung unlocks something real. You can stop at any of them. Nothing here is a
            gate for its own sake.
          </p>
        </Rise>
      </div>

      <div className="shell mt-20 grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        {/* The ladder: sticky, fills as you climb. */}
        <div className="hidden md:block">
          <div className="sticky top-[28vh]">
            <div className="relative flex h-[50vh] gap-7">
              <div className="relative w-px bg-white/12">
                <div
                  className="absolute inset-x-0 top-0 w-px transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    height: `${fill}%`,
                    background: "linear-gradient(to bottom, #0075F6, #34C24C)",
                  }}
                />
                {TRUST.map((r, i) => (
                  <span
                    key={r.level}
                    className="absolute -left-[5px] block h-[11px] w-[11px] rounded-full border transition-all duration-500"
                    style={{
                      top: `calc(${(i / (TRUST.length - 1)) * 100}% - 5px)`,
                      background: i <= active ? (i === 3 ? "#34C24C" : "#0075F6") : "#0f1318",
                      borderColor: i <= active ? "transparent" : "rgba(255,255,255,0.22)",
                      transform: i === active ? "scale(1.5)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col justify-between py-0">
                {TRUST.map((r, i) => (
                  <div
                    key={r.level}
                    className="transition-opacity duration-500"
                    style={{ opacity: i === active ? 1 : 0.32 }}
                  >
                    <p className="t-label !text-white/55">level {r.level}</p>
                    <p className="text-[1.05rem] font-medium tracking-tight">{r.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The rungs. */}
        <div>
          {TRUST.map((r, i) => (
            <div
              key={r.level}
              data-rung={i}
              ref={(n) => {
                rungs.current[i] = n;
              }}
              className="border-t border-white/10 py-12 first:border-t-0 md:py-20"
            >
              <Rise>
                <div className="flex items-baseline gap-5">
                  <span
                    className="font-mono text-[clamp(2.5rem,5vw,4rem)] leading-none"
                    style={{
                      color: i === 3 ? "#34C24C" : i === 2 ? "#0075F6" : "rgba(255,255,255,0.28)",
                    }}
                  >
                    {r.level}
                  </span>
                  <h3 className="t-h3">{r.name}</h3>
                </div>
                <p className="t-lead mt-6 max-w-[44ch]">{r.unlocks}</p>
                <p className="mt-4 max-w-[44ch] text-[0.9rem] leading-relaxed text-white/45">
                  <span className="t-label mr-2 !inline">needs</span>
                  {r.requires}
                </p>
              </Rise>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
