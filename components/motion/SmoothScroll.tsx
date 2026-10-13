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

    // Document height is not a constant: fonts swap, images decode, sticky
    // sections resolve. Caching it at mount and only refreshing on window
    // resize left `raw` reading 0.73 at the true 0.90 once the page had grown,
    // and every scroll-driven thing on the site inherited that error.
    let max = 1;
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    measure();

    let pending = 0;
    const remeasure = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        measure();
        readProgress();
      });
    };
    const ro = new ResizeObserver(remeasure);

    const readProgress = () => {
      scrollState.raw = max > 0 ? window.scrollY / max : 0;
    };
    readProgress();
    ro.observe(document.body);

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
        ro.disconnect();
        if (pending) cancelAnimationFrame(pending);
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
    // A tab that was suspended can come back with a different extent.
    const onResume = () => {
      if (!document.hidden) onResize();
    };
    document.addEventListener("visibilitychange", onResume);
    window.addEventListener("pageshow", onResume);

    const stop = onTick({
      order: ORDER.scroll,
      read: (t) => {
        lenis.raf(t);
        readProgress();
      },
    });

    return () => {
      stop();
      ro.disconnect();
      if (pending) cancelAnimationFrame(pending);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onResume);
      window.removeEventListener("pageshow", onResume);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
