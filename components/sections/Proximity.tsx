import { RevealLines, Rise } from "@/components/ui/Reveal";
import Ticker from "@/components/ui/Ticker";
import { INTENTS } from "@/content/site";

/**
 * The turn: scattered people become a place. The film lands the cloud onto a
 * city grid here, so "here" stops being an abstraction two seconds before the
 * copy uses the word.
 */
export default function Proximity() {
  return (
    <section data-film="city" className="relative flex min-h-[110svh] items-center py-32">
      <div className="shell w-full">
        <div className="grid gap-12 md:grid-cols-[1fr_0.9fr] md:items-end">
          <div>
            <RevealLines
              as="h2"
              className="t-h2 max-w-[15ch]"
              lines={[<span key="line-emph"><span className="t-serif">Here</span> is not</span>, "a metaphor."]}
            />
          </div>

          <Rise delay={140}>
            <p className="t-lead max-w-[40ch]">
              TieHere only shows you what is happening within reach, inside a window you are
              actually free. Proximity is the filter that makes a yes cheap, and a cheap yes is
              the only kind anyone ever says.
            </p>
          </Rise>
        </div>

        <Rise delay={260} className="mt-20">
          <div className="border-y border-line">
            <Ticker items={INTENTS.map((i) => i.label)} duration={54} size="lg" />
          </div>
        </Rise>
      </div>
    </section>
  );
}
