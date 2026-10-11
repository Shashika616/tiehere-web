import Accordion from "@/components/ui/Accordion";
import { FAQ } from "@/content/site";
import { RevealLines, Rise } from "@/components/ui/Reveal";

export default function Faq() {
  return (
    <section id="faq" data-film="settle" className="relative py-28 md:py-36">
      <div className="shell grid gap-14 md:grid-cols-[0.8fr_1.4fr] md:gap-20">
        <div className="md:sticky md:top-[22vh] md:self-start">
          <RevealLines
            as="h2"
            className="t-h2 max-w-[12ch]"
            lines={["The questions", <span key="line-emph">worth <span className="t-serif">asking</span>.</span>]}
          />
        </div>
        <Rise delay={120}>
          <Accordion items={FAQ} />
        </Rise>
      </div>
    </section>
  );
}
