import { RevealLines, Rise } from "@/components/ui/Reveal";
import Lockup from "@/components/ui/Lockup";
import StoreButtons from "@/components/ui/StoreButtons";

export default function Hero() {
  return (
    <section
      id="top"
      data-film="cloud"
      className="relative flex min-h-[100svh] flex-col justify-between pb-24 pt-28 md:pb-32 md:pt-32"
    >
      <div className="shell w-full">
        <Lockup id="hero-lockup" variant="hero" />
      </div>

      <div className="shell w-full">
        <RevealLines
          as="h1"
          className="t-display max-w-[16ch]"
          lines={[
            "Connect with",
            <span key="line-emph">
              who&rsquo;s <span className="t-serif">here</span>.
            </span>,
          ]}
        />

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.1fr_1fr] md:items-end">
          <Rise delay={120}>
            <p className="t-lead max-w-[42ch]">
              Professionals near you, meeting in person, around something specific. Nobody
              here is anonymous. Not a feed to scroll. A small number of real meetings you
              actually show up to.
            </p>
          </Rise>

          <Rise delay={220} className="md:justify-self-end">
            <StoreButtons />
          </Rise>
        </div>
      </div>
    </section>
  );
}
