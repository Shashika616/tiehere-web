import Hero from "@/components/sections/Hero";
import ScrollScene from "@/components/motion/ScrollScene";
import Problem from "@/components/sections/Problem";
import Proximity from "@/components/sections/Proximity";
import Intents from "@/components/sections/Intents";
import HowItWorks from "@/components/sections/HowItWorks";
import Trust from "@/components/sections/Trust";
import Principles from "@/components/sections/Principles";
import Safety from "@/components/sections/Safety";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import { BRAND, FAQ } from "@/content/site";

/**
 * One continuous shot.
 *
 * Sections carrying `data-film` are the film's chapter marks; the ones
 * without are deliberate dissolves between them. Order matters: cloud →
 * sparse → city → fan → (dissolve) → ladder → (dissolve) → quiet →
 * (dissolve) → knot.
 */
export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.name,
        url: `https://${BRAND.domain}`,
        description: BRAND.description,
      },
      {
        "@type": "MobileApplication",
        name: BRAND.name,
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "iOS, Android",
        description: BRAND.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ScrollScene
        id="scene-alone"
        src="/scenes/alone.jpg"
        alt="One person walking alone down a narrow city street"
        caption="A thousand contacts. One of you on this street."
        height="66vh"
      />
      <Problem />
      <ScrollScene
        id="scene-city"
        src="/scenes/rain.jpg"
        alt="A red umbrella on a neon-lit street in the rain at night"
        caption="Every one of those lights is somebody's evening."
      />
      <Proximity />
      <Intents />
      <HowItWorks />
      <Trust />
      <ScrollScene
        id="scene-street"
        src="/scenes/city-street.jpg"
        alt="A narrow street at night with a small lit bar open on the corner"
        caption="A place, an hour, and one person who said yes."
        height="64vh"
      />
      <Principles />
      <Safety />
      <Faq />
      <FinalCta />
      {/* Sticky travel. A sticky element can only stick inside its parent's
          box, and the CTA is the last child of <main>: with nothing below it
          there, it unstuck the instant it pinned and the footer simply
          followed underneath. This reserves a screen of room for it to hold
          while the footer rises over it; the footer takes the same height
          back as a negative margin, so the document is no taller. */}
      <div data-cta-travel aria-hidden="true" className="h-[100svh]" />
    </>
  );
}
