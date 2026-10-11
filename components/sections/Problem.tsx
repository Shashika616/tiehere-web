import { RevealLines, Rise } from "@/components/ui/Reveal";

/**
 * The argument against the feed, made by the film as much as the copy: this
 * is where the cloud of a thousand people is thrown out of frame and the
 * emptiness left behind is the point.
 */
export default function Problem() {
  return (
    <section data-film="sparse" className="relative flex min-h-[100svh] items-center py-32">
      <div className="shell w-full">
        <RevealLines
          as="h2"
          className="t-h2 max-w-[20ch]"
          lines={["You know a thousand", <span key="line-emph">people. You&rsquo;ve <span className="t-serif">met</span> forty.</span>]}
        />

        <div className="mt-14 grid max-w-5xl gap-8 md:grid-cols-2 md:gap-16">
          <Rise delay={100}>
            <p className="t-lead">
              Every professional network you belong to is optimised for accumulation. Add, follow,
              connect, grow the number. None of them are optimised for the only thing that has ever
              actually changed a career: sitting across from one person for forty minutes.
            </p>
          </Rise>
          <Rise delay={200}>
            <p className="t-lead">
              The gap is not reach. You already have reach. The gap is that meeting someone new,
              in person, is socially expensive, and no product has made it cheap, specific and
              safe enough to be worth doing on a Tuesday.
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}
