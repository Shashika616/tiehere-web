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
      <ScrollScene
        id="scene-street"
        src="/scenes/city-street.jpg"
        alt="A narrow street at night with a small lit bar open on the corner"
        caption="A place, an hour, and one person who said yes."
        height="64vh"
      />
      <Trust />
      <Principles />
      <Safety />
      <Faq />
      <FinalCta />
    </>
  );
}
