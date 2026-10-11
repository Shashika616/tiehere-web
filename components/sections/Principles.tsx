import { PRINCIPLES } from "@/content/site";
import { RevealLines, Rise } from "@/components/ui/Reveal";

/**
 * The three decisions a competitor cannot copy without rebuilding their
 * product. No film anchor: this section is the long dissolve from the trust
 * ladder into the stillness of the safety chapter.
 */
export default function Principles() {
  return (
    <section id="principles" className="relative py-28 md:py-36">
      <div className="shell">
        <RevealLines
          as="h2"
          className="t-h2 max-w-[22ch]"
          lines={["Three things this app", <span key="line-emph">refuses to <span className="t-serif">do</span>.</span>]}
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Rise key={p.title} delay={i * 110}>
              <div className="flex h-full flex-col gap-5 bg-[#090c11] p-8 md:p-10">
                <span className="t-label">{`{0${i + 1}}`}</span>
                <h3 className="t-h3 !text-[clamp(1.25rem,2vw,1.6rem)] max-w-[16ch]">{p.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-white/60">{p.body}</p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
