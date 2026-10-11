"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollState, prefersReducedMotion } from "@/lib/scroll";

/**
 * Mounted once in the root layout so every page stays server-rendered.
 *
 * Two jobs: damped scrolling on pointer devices, and writing
 * `scrollState.raw`, which the film reads every frame.
 *
 * There is deliberately no GSAP/ScrollTrigger here. Every scroll-driven
 * element on this site (the pinned intent track, the trust ladder, the mark
 * that draws itself) reads its own `getBoundingClientRect` inside its own
 * rAF loop. That is a fraction of the weight and, more importantly, cannot
 * desync from Lenis the way a scroller proxy plus a pin can.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    scrollState.reduced = reduced;

    const isTouch = window.matchMedia("(hover: none)").matches;

    const readProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.raw = max > 0 ? window.scrollY / max : 0;
    };
    readProgress();

    if (reduced || isTouch) {
      // Native scrolling: we only observe it. Emulated momentum is worse than
      // the platform's own on touch, and unwanted entirely under reduced motion.
      window.addEventListener("scroll", readProgress, { passive: true });
      window.addEventListener("resize", readProgress);
      if (reduced) scrollState.smooth = scrollState.raw;
      return () => {
        window.removeEventListener("scroll", readProgress);
        window.removeEventListener("resize", readProgress);
      };
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    // Exposed so local tooling (scripts/shoot.mjs) can drive scroll position
    // deterministically; Lenis owns scrollTop, so window.scrollTo would fight it.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on("scroll", readProgress);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
