"use client";

import Mark from "./Mark";
import LocalClock from "./LocalClock";
import StoreButtons from "./StoreButtons";
import { BRAND, LINKS } from "@/content/site";
import { MailIcon, LinkedInIcon, InstagramIcon, XIcon } from "./SocialIcons";
import { useInView } from "@/lib/useInView";

// Root-relative, not bare fragments. The footer is on every page, and
// "#how" from /privacy points at an element that does not exist there, so the
// link simply did nothing. "/#how" navigates home and ScrollEntry honours the
// hash on arrival.
const PRODUCT = [
  { href: "/#home", label: "Home" },
  { href: "/#how", label: "How it works" },
  { href: "/#intents", label: "Intents" },
  { href: "/#trust", label: "Trust levels" },
  { href: "/#faq", label: "FAQ" },
];

const LEGAL = [
  { href: "/safety", label: "Safety" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/delete-account", label: "Delete your account" },
];

const REACH = [
  { label: "Email", href: LINKS.email && `mailto:${LINKS.email}`, Icon: MailIcon },
  { label: "LinkedIn", href: LINKS.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: LINKS.instagram, Icon: InstagramIcon },
  { label: "X", href: LINKS.x, Icon: XIcon },
];

/**
 * The sign-off.
 *
 * A wordmark at full scale, the reader's own place and local time beside it,
 * then the index. The giant wordmark rises on a clip mask when the footer
 * comes into view: one CSS transition per word, fired once by an observer, so
 * there is no scroll handler and nothing runs per frame.
 *
 * It is decorative and marked `aria-hidden`: the accessible brand name is on
 * the home link in the header and in the copyright line below, which is what
 * makes it safe to split for the stagger.
 *
 * The footer rises over the pinned final CTA rather than sitting below it,
 * the same sticky stack the step panels use. That requires an opaque ground:
 * a translucent footer sliding over a live section reads as a rendering bug,
 * which is the exact defect the step panels had before they became full-bleed
 * photographs.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useInView<HTMLDivElement>(0.15);

  return (
    <footer data-film="knot" className="foot-rise relative overflow-hidden border-t border-line">
      <div ref={ref} className="shell grid gap-16 py-20 md:grid-cols-[1.35fr_1fr] md:gap-20 md:py-28">
        <div>
          <h2 className="foot-mark" aria-hidden="true">
            <span className="foot-word">
              <span style={{ ["--d" as string]: "0ms" }}>Tie</span>
            </span>
            <span className="foot-word">
              <span className="brand-here" style={{ ["--d" as string]: "90ms" }}>
                Here
              </span>
            </span>
          </h2>
          <p className="t-lead mt-7 max-w-[34ch] !text-[1.05rem]">{BRAND.line}</p>
          <div className="mt-9">
            <StoreButtons />
          </div>
        </div>

        <div className="md:justify-self-end md:text-left">
          <LocalClock />
        </div>
      </div>

      <div className="shell grid gap-12 border-t border-line py-14 md:grid-cols-3 md:gap-10">
        <nav aria-label="Product">
          <p className="t-label mb-6">product</p>
          <ul className="space-y-1">
            {PRODUCT.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="foot-link">
                  <span>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="t-label mb-6">legal</p>
          <ul className="space-y-1">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="foot-link">
                  <span>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Reach us">
          <p className="t-label mb-6">reach us</p>
          <ul className="border-t border-line">
            {REACH.map((l) =>
              l.href ? (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="foot-row"
                    {...(l.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span className="flex items-center gap-3.5">
                      <l.Icon className="foot-row-icon" tone="brand" />
                      {l.label}
                    </span>
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="foot-row-arrow">
                      <path
                        d="M4 12 12 4M6 4h6v6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              ) : (
                // No destination yet, so it is not a link. Rendering an anchor
                // to "#" here is what made the footer feel broken.
                <li key={l.label}>
                  <span className="foot-row is-soon">
                    <span className="flex items-center gap-3.5">
                      <l.Icon className="foot-row-icon" tone="brand" />
                      {l.label}
                    </span>
                    <span className="foot-soon">soon</span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-line py-8 pb-28 md:flex-row md:items-center md:justify-between md:pb-8">
        <p className="t-label">
          © {year} {BRAND.name}
        </p>
        <p className="t-label">{BRAND.domain}</p>
        <Mark size={22} className="opacity-70" />
      </div>
    </footer>
  );
}
