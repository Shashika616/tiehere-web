"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollState, prefersReducedMotion } from "@/lib/scroll";
import { onTick, ORDER } from "@/lib/ticker";

/**
 * Mounted once in the root layout so every page stays server-rendered.
 *
 * Damped scrolling on pointer devices, and writing `scrollState.raw`, which
 * the film and every scroll-driven component read. Lenis is driven from the
 * shared ticker at order 0, so scroll position has settled before anything
 * else reads layout this frame.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    scrollState.reduced = reduced;

    const isTouch = window.matchMedia("(hover: none)").matches;

    let max = 1;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();

    const readProgress = () => {
      scrollState.raw = max > 0 ? window.scrollY / max : 0;
    };
    readProgress();

    if (reduced || isTouch) {
      // Native scrolling: we only observe it. Emulated momentum is worse than
      // the platform's own on touch, and unwanted entirely under reduced motion.
      window.addEventListener("scroll", readProgress, { passive: true });
      window.addEventListener("resize", () => {
        measure();
        readProgress();
      });
      if (reduced) scrollState.smooth = scrollState.raw;
      return () => {
        window.removeEventListener("scroll", readProgress);
      };
    }

    const lenis = new Lenis({
      // 0.09 is a ~200ms trail behind the wheel, which reads as lag, not
      // smoothness. 0.16 keeps the glide and gives the input back.
      lerp: 0.16,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    // Exposed so local tooling (scripts/shoot.mjs, scripts/perf.mjs) can drive
    // scroll deterministically; Lenis owns scrollTop, so window.scrollTo fights it.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    const onResize = () => {
      measure();
      readProgress();
    };
    window.addEventListener("resize", onResize);

    const stop = onTick({
      order: ORDER.scroll,
      read: (t) => {
        lenis.raf(t);
        readProgress();
      },
    });

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
