import { RevealLines, Rise } from "@/components/ui/Reveal";
import Lockup from "@/components/ui/Lockup";
import StoreButtons from "@/components/ui/StoreButtons";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-between pb-24 pt-28 md:pb-32 md:pt-32"
    >
      {/* The film opens on the mark and disperses into the crowd.
          Two markers rather than one attribute on the section, because the
          section's own centre resolves to a single point and a chapter needs
          somewhere to travel between. The first sits at the top of the hero,
          so at rest the particles ARE the mark; the second at the bottom, so
          the first half-screen of scroll scatters them.
          This also turns the knot at the final CTA into a return rather than
          a first reveal, which is the better shape for the whole film. */}
      <span
        data-film="mark"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-0 w-0"
      />
      <span
        data-film="cloud"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-0 w-0"
      />

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
