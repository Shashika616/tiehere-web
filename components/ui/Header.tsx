"use client";

import { useEffect, useState } from "react";
import Lockup from "./Lockup";

/**
 * Transparent over the hero, backed after one viewport. Inverts to dark type
 * automatically over the light safety chapter via `data-film-light`, which
 * the film sets from the ground colour it is actually painting.
 */
export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which section the reader is actually in. A thin band across the middle of
  // the viewport means exactly one section qualifies at a time; in the gaps
  // between them (a photographic chapter, say) the last one stays lit, which
  // is what a reader expects from a progress indicator.
  useEffect(() => {
    const ids = ["how", "trust", "safety", "faq"];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent("#" + e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Retire the sticky CTA once the real one is on screen. Past that point it
  // is both redundant (the final section carries the store buttons) and in the
  // way: fixed to the viewport bottom, it sat on top of the footer.
  useEffect(() => {
    const target = document.querySelector("#get");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtEnd(entry.isIntersecting),
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const links = [
    { href: "#how", label: "How it works" },
    { href: "#trust", label: "Trust" },
    { href: "#safety", label: "Safety" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          stuck ? "border-b border-white/[0.07] bg-[rgba(7,9,12,0.72)] backdrop-blur-md" : ""
        }`}
        data-header
      >
        {/* Always-on scroll edge effect. The canvas behind the chrome never
            stops changing, so the type always needs ground under it, not
            only once the blur material arrives. */}
        <div
          aria-hidden="true"
          className={`header-scrim pointer-events-none absolute inset-x-0 top-0 h-28 transition-opacity duration-500 ${
            stuck ? "opacity-0" : "opacity-100"
          }`}
        />

        <div className="shell relative flex h-16 items-center justify-between md:h-20">
          <a href="#top" aria-label="TieHere, home" className="group inline-flex">
            <Lockup id="nav-lockup" />
          </a>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-current={current === l.href ? "" : undefined}
                aria-current={current === l.href ? "true" : undefined}
                className="nav-link t-nav"
              >
                <span>{l.label}</span>
              </a>
            ))}
            <a
              href="#get"
              className="rounded-full bg-white px-5 py-2.5 text-[0.875rem] font-medium tracking-tight text-ink-900 transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.97]"
            >
              Get the app
            </a>
          </nav>

          <button
            type="button"
            className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-6">
              <span
                className="absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: menu ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 top-3 block h-px w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: menu ? "translateY(-6px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile overlay: staggered line reveal, full screen. */}
      <div
        className={`fixed inset-0 z-40 bg-ink-900/95 backdrop-blur-2xl transition-opacity duration-400 md:hidden ${
          menu ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="shell flex h-full flex-col justify-center gap-2" aria-label="Mobile">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenu(false)}
              data-current={current === l.href ? "" : undefined}
              aria-current={current === l.href ? "true" : undefined}
              className="nav-link-m t-h2 py-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: menu ? "none" : "translateY(28px)",
                opacity: menu ? 1 : 0,
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Thumb-reachable persistent CTA. Highest-converting placement on mobile. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          stuck && !menu && !atEnd
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <a
          href="#get"
          className="flex h-13 w-full items-center justify-center rounded-full bg-white py-3.5 text-[0.95rem] font-medium tracking-tight text-ink-900 transition-transform duration-150 ease-out active:scale-[0.98]"
        >
          Get TieHere
        </a>
      </div>
    </>
  );
}
