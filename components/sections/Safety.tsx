import { SAFETY } from "@/content/site";
import { RevealLines, Rise } from "@/components/ui/Reveal";

/**
 * The still chapter, and the one that carries the site's most important
 * admission: the trust ladder checks credentials, not character.
 *
 * It reads from the `alt-*` tokens rather than the page's own, because it runs
 * against the grain of whichever theme is on: paper against a dark site, ink
 * against a light one. The contrast is the point, so it has to survive the
 * theme rather than follow it.
 *
 * The film's ground turns to paper here and the particles stop. Nothing on
 * this section parallaxes, pins, scrubs or drifts. After four screens of
 * continuous motion, stillness is the loudest thing the page can do, and on
 * the one subject where "look how clever our animation is" would be exactly
 * the wrong signal.
 */
export default function Safety() {
  return (
    <section
      id="safety"
      data-film="quiet"
      className="relative py-32 text-alt-fg md:py-44"
    >
      {/* A second anchor at the very top. A section's own attribute resolves
          to its centre, so the ground was still halfway through the dissolve
          when the heading arrived: white type on mid-grey in the light theme.
          Anchoring the top as well finishes the change before the chapter
          begins, which matters here more than anywhere, because the contrast
          IS the section. */}
      <span
        data-film="quiet"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-0 w-0"
      />
      <div className="shell">
        <RevealLines
          as="h2"
          className="t-h2 max-w-[17ch] !text-alt-fg"
          lines={["Meeting a stranger", <span key="line-emph">is a real <span className="t-serif">risk</span>.</span>]}
          stagger={70}
        />

        <p className="mt-8 max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-alt-fg-2">
          So it is treated as one. These are mechanisms in the product, not promises in a
          marketing page.
        </p>

        <div className="mt-20 grid gap-x-16 gap-y-14 md:grid-cols-2">
          {SAFETY.map((s) => (
            <div key={s.title} className="border-t border-alt-line pt-7">
              <h3 className="text-[1.3rem] font-medium tracking-tight text-alt-fg">{s.title}</h3>
              <p className="mt-4 max-w-[42ch] text-[0.98rem] leading-relaxed text-alt-fg-2">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* The most important honest statement on the site, so it gets the
            weight of a heading rather than a footnote. A trust product that
            lets "verified" imply a safety guarantee is not just overclaiming,
            it is making people less careful at the exact moment they should
            be most careful. */}
        <div className="mt-24 border-t border-alt-line pt-12">
          <h3 className="t-h3 max-w-[20ch] !text-alt-fg">What a check cannot do</h3>

          <div className="mt-7 grid gap-8 md:grid-cols-2 md:gap-16">
            <p className="max-w-[44ch] text-[1.05rem] leading-relaxed text-alt-fg-2">
              A checked account means a real phone, a real email and a real employer are
              attached to it. It does not mean we have met this person. It does not tell you
              how they will behave. No app can tell you that, and any app that implies it can
              is selling you a feeling rather than a fact.
            </p>
            <p className="max-w-[44ch] text-[1.05rem] leading-relaxed text-alt-fg-2">
              What the checks do is make anonymity expensive. If something goes wrong there is
              a real identity to find, and that is a deterrent, not a guarantee. Meet somewhere
              public. Tell a trusted contact where you are going. Leave whenever you want to,
              and you never owe anyone an explanation for going.
            </p>
          </div>

          <p className="mt-12 max-w-[46ch] text-[0.9rem] leading-relaxed text-alt-fg-3">
            Safety features switch on at trust level 2, once LinkedIn, phone and personal email
            are confirmed, because a safety net that anonymous accounts can pull is not a
            safety net.
          </p>
        </div>

      </div>
    </section>
  );
}
