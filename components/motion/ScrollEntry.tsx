"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

const KEY = "tiehere:scroll:";

/**
 * Where the page starts.
 *
 * A brand site has to open on the hero. Two separate things were stopping it:
 * the browser's own `scrollRestoration` is "auto", so a reload put you back
 * wherever you had scrolled to, and the nav handler used to write the section
 * into the URL, so any reload after clicking a tab landed on that tab.
 *
 * Restoration is therefore taken over by hand rather than switched off, since
 * switching it off alone would mean coming back from /privacy dumps you at the
 * top of a nineteen-thousand-pixel page instead of where you were reading.
 *
 *   deep link (/#safety)  -> honour it
 *   back or forward       -> restore the position we saved for that page
 *   fresh load or reload  -> the hero, every time
 */
export default function ScrollEntry() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const navType = (
      performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    )?.type;

    const headerOffset = () => {
      const h = document.querySelector<HTMLElement>("header[data-header]");
      return h ? h.getBoundingClientRect().height + 8 : 0;
    };

    const flowTop = (el: HTMLElement) => {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return top;
    };

    const go = (y: number) => {
      window.scrollTo(0, y);
      // Lenis keeps its own position; tell it, or the first wheel event snaps
      // the page back to wherever it thought we were.
      requestAnimationFrame(() => {
        const lenis = (window as unknown as { lenis?: Lenis }).lenis;
        lenis?.scrollTo(y, { immediate: true });
      });
    };

    const hash = window.location.hash;
    const saved = sessionStorage.getItem(KEY + window.location.pathname);

    if (hash && hash.length > 1) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      // Layout has to settle before the target's position means anything.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => go(el ? Math.max(0, flowTop(el) - headerOffset()) : 0)),
      );
    } else if (navType === "back_forward" && saved) {
      requestAnimationFrame(() => requestAnimationFrame(() => go(Number(saved) || 0)));
    } else {
      go(0);
    }

    const save = () => {
      try {
        sessionStorage.setItem(KEY + window.location.pathname, String(Math.round(window.scrollY)));
      } catch {
        // Private mode and blocked storage both throw. Losing the position is
        // not worth throwing on.
      }
    };
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", save);

    return () => {
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", save);
    };
  }, []);

  return null;
}
