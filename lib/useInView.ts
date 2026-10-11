"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `is-in` once the element crosses into view and leaves it there.
 * One observer per element, disconnected on fire, reveals are not reversible
 * on this site, because a heading that un-reveals when you scroll up reads as
 * a bug, not as motion.
 */
export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            el.querySelectorAll(".reveal-line, .rise").forEach((n) => n.classList.add("is-in"));
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return ref;
}
