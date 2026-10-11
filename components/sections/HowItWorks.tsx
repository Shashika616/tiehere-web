import { STEPS } from "@/content/site";
import { RevealLines, Rise } from "@/components/ui/Reveal";

/**
 * Sticky stacked cards, the one Tier-A pattern worth keeping. No data-film
 * anchor on purpose: the film cross-dissolves from the intent fan toward the
 * trust ladder across the whole length of this section.
 */
export default function HowItWorks() {
  return (
    <section id="how" className="relative py-28 md:py-36">
      <div className="shell">
        <RevealLines
          as="h2"
          className="t-h2 max-w-[18ch]"
          lines={["Three steps, and", <span key="line-emph">none of them is a <span className="t-serif">profile</span>.</span>]}
        />
      </div>

      <div className="shell mt-16 md:mt-24">
        {STEPS.map((step, i) => (
          <div
            key={step.n}
            className="sticky"
            style={{ top: `calc(18vh + ${i * 2.2}rem)`, zIndex: i + 1 }}
          >
            <Rise delay={i * 80}>
              <article className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0d12] p-8 shadow-[0_-24px_60px_-20px_rgba(0,0,0,0.9)] md:p-14">
                <span
                  className="pointer-events-none absolute -right-4 -top-10 select-none text-[clamp(8rem,18vw,16rem)] font-medium leading-none tracking-tighter text-white/[0.035]"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div className="relative grid gap-5 md:grid-cols-[auto_1fr] md:gap-14">
                  <span className="t-label md:pt-3">{`{${step.n}}`}</span>
                  <div>
                    <h3 className="t-h3 max-w-[18ch]">{step.title}</h3>
                    <p className="t-lead mt-5 max-w-[48ch]">{step.body}</p>
                  </div>
                </div>
              </article>
            </Rise>
          </div>
        ))}
      </div>
    </section>
  );
}
