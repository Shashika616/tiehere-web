"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { prefersReducedMotion, clamp } from "@/lib/scroll";

/**
 * Smooth scrolling for in-page links.
 *
 * Neither path gave this for free. Lenis does not intercept anchor clicks, and
 * the stylesheet sets `scroll-behavior: auto` on purpose so Lenis and the
 * browser never drive the scroll at once. So every nav click was a hard jump.
 *
 * One delegated listener covers the header, the mobile overlay, the footer
 * index and the bottom CTA bar. On pointer devices it hands the move to Lenis
 * so the easing matches the rest of the site; on touch, where Lenis is off by
 * design, it falls back to native smooth scrolling.
 *
 * Three things a naive version gets wrong and this one does not: it offsets by
 * the real measured header height rather than a guess, it leaves the URL alone
 * so a reload still opens on the hero, and it moves focus to the target, which
 * a scripted scroll otherwise skips entirely.
 */
export default function SmoothAnchors() {
  useEffect(() => {
    const reduced = prefersReducedMotion();

    const headerOffset = () => {
      const h = document.querySelector<HTMLElement>("header[data-header]");
      return h ? h.getBoundingClientRect().height + 8 : 0;
    };

    /** Flow position, which stays correct even for a pinned sticky section. */
    const flowTop = (el: HTMLElement) => {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return top;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#" || !href.startsWith("#")) return;

      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      e.preventDefault();

      // The mobile overlay locks body scroll while it is open. Release it now
      // rather than waiting for React's effect, or the scroll goes nowhere.
      document.body.style.overflow = "";

      // One frame for the overlay to close before we measure anything.
      requestAnimationFrame(() => {
        const offset = headerOffset();
        const to = Math.max(0, flowTop(target) - offset);
        const distance = Math.abs(to - window.scrollY);
        const lenis = (window as unknown as { lenis?: Lenis }).lenis;

        if (reduced) {
          window.scrollTo({ top: to, behavior: "auto" });
        } else if (lenis) {
          lenis.scrollTo(to, {
            // Long jumps need longer than short ones, or the page either
            // crawls across a hop or teleports across the document.
            duration: clamp(distance / 2600, 0.55, 1.35),
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
          });
        } else {
          window.scrollTo({ top: to, behavior: "smooth" });
        }

        // Deliberately NOT written to the URL. A nav click here is a move
        // within one page, not a destination: writing the hash meant any later
        // reload opened on that section and skipped the hero entirely. A hash
        // someone actually pastes is still honoured, by ScrollEntry.

        // A scripted scroll does not move focus the way a real anchor jump
        // does, so a keyboard user would land nowhere.
        //
        // The marker is what suppresses the focus ring. Browsers will match
        // :focus-visible on a scripted focus, and a 2px outline around a
        // full-bleed section renders as a stray blue line across the page.
        // Scoped to this one case, so the skip link and every real control
        // keep their ring.
        target.setAttribute("tabindex", "-1");
        target.setAttribute("data-scroll-target", "");
        target.focus({ preventScroll: true });
        target.addEventListener(
          "blur",
          () => {
            target.removeAttribute("tabindex");
            target.removeAttribute("data-scroll-target");
          },
          { once: true },
        );
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
