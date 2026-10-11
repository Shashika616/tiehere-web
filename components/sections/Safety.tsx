import { SAFETY } from "@/content/site";
import { RevealLines, Rise } from "@/components/ui/Reveal";

/**
 * The still chapter.
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
      className="relative py-32 text-ink-900 md:py-44"
    >
      <div className="shell">
        <RevealLines
          as="h2"
          className="t-h2 max-w-[17ch] !text-ink-900"
          lines={["Meeting a stranger", <span key="line-emph">is a real <span className="t-serif">risk</span>.</span>]}
          stagger={70}
        />

        <p className="mt-8 max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-ink-900/70">
          So it is treated as one. These are mechanisms in the product, not promises in a
          marketing page.
        </p>

        <div className="mt-20 grid gap-x-16 gap-y-14 md:grid-cols-2">
          {SAFETY.map((s) => (
            <div key={s.title} className="border-t border-ink-900/12 pt-7">
              <h3 className="text-[1.3rem] font-medium tracking-tight text-ink-900">{s.title}</h3>
              <p className="mt-4 max-w-[42ch] text-[0.98rem] leading-relaxed text-ink-900/65">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-20 max-w-[40ch] text-[0.9rem] leading-relaxed text-ink-900/50">
          Safety features switch on at trust level 2, once LinkedIn, phone and personal email
          are verified, because a safety net that anonymous accounts can pull is not a safety net.
        </p>
      </div>
    </section>
  );
}
