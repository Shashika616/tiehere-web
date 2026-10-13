"use client";

import { useEffect, useRef, useState } from "react";
import Lockup from "@/components/ui/Lockup";
import { clamp, easeOutSoft } from "@/lib/scroll";
import { onTick, ORDER } from "@/lib/ticker";

/**
 * The wordmark starts life at hero scale and flies into the navigation as you
 * leave the first screen.
 *
 * It is one element, not two that cross-fade: a single fixed copy is scrubbed
 * from the hero lockup's position and size to the nav lockup's, and only in
 * the last few percent does it hand over to the real nav lockup, which is
 * interactive and inverts over the light chapter. The static copies are
 * measured, never guessed, so the flight lands exactly on the nav lockup at
 * any viewport size.
 *
 * Without JS, or under reduced motion, both static lockups simply show and
 * nothing flies.
 */
export default function BrandFlight() {
  const flyer = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = flyer.current;
    const heroEl = document.getElementById("hero-lockup");
    const navEl = document.getElementById("nav-lockup");
    if (!el || !heroEl || !navEl) return;

    // Hero width can be zero on a very narrow viewport mid-layout; bail rather
    // than divide by it.
    let heroDocX = 0, heroDocY = 0, navX = 0, navY = 0, scale = 1, travel = 1;

    const measure = () => {
      const h = heroEl.getBoundingClientRect();
      const n = navEl.getBoundingClientRect();
      if (h.width < 1 || n.width < 1) return false;
      heroDocX = h.left + window.scrollX;
      heroDocY = h.top + window.scrollY;
      navX = n.left;
      navY = n.top;
      scale = n.width / h.width;
      // The natural distance between the two lockups is only ~100px, which
      // makes the whole flight happen in a flick of the wheel. Give it at
      // least half a screen so it reads as a move rather than a snap.
      travel = Math.max(heroDocY - navY, window.innerHeight * 0.52);
      return true;
    };

    if (!measure()) return;
    setActive(true);
    navEl.style.opacity = "0";

    let last = -1;
    const stop = onTick({
      order: ORDER.scene,
      write: () => {
        const p = clamp(window.scrollY / travel);
        const q = easeOutSoft(p);

        // The crossfade runs on raw progress, not the eased value: an ease
        // approaches 1 asymptotically, so a window expressed in eased terms
        // stretches over hundreds of pixels and leaves both copies on screen.
        const handover = clamp((p - 0.9) / 0.1);

        // Both values gate the early exit. Guarding on the eased value alone
        // froze the handover: the ease rounds to 1 at about p = 0.92, every
        // later frame bailed out, and the two copies stayed half-faded on top
        // of each other for the rest of the page.
        const key = Math.round(q * 2000) * 4096 + Math.round(handover * 1000);
        if (key === last) return;
        last = key;

        const x = heroDocX + (navX - heroDocX) * q;
        const y = heroDocY - window.scrollY + (navY - (heroDocY - window.scrollY)) * q;
        const sc = 1 + (scale - 1) * q;

        // >= 0.999, not >= 1: (1 - 0.9) / 0.1 evaluates to 0.9999999999999998
        // in binary floating point, so an exact test never fires and the
        // flyer stays in the compositor forever.
        if (handover >= 0.999) {
          // Landed. Take the flyer out of the compositor entirely rather than
          // leaving a transparent copy stacked over the real nav lockup.
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          navEl.style.opacity = "1";
          return;
        }

        el.style.visibility = "visible";
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
        el.style.opacity = String(1 - handover);
        // Written straight onto the element. A custom property on :root would
        // invalidate style for the whole document on every frame.
        navEl.style.opacity = String(handover);
      },
    });

    const onResize = () => {
      measure();
      last = -1;
    };
    window.addEventListener("resize", onResize);

    // The lockup is measured in pixels, so it has to be measured in the real
    // typeface. next/font swaps, and a measurement taken against the fallback
    // gives a wrong scale ratio: the flight would then land at a size the nav
    // lockup never has, and the handover would show two different sizes.
    document.fonts?.ready.then(onResize).catch(() => {});
    const settle = window.setTimeout(onResize, 900);

    return () => {
      stop();
      window.clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      navEl.style.opacity = "";
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.brandFlight = active ? "1" : "0";
  }, [active]);

  return (
    <div
      ref={flyer}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[60] origin-top-left will-change-transform ${
        active ? "" : "hidden"
      }`}
    >
      <Lockup variant="hero" />
    </div>
  );
}
