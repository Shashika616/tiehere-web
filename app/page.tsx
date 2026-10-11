import Hero from "@/components/sections/Hero";
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
      <Problem />
      <Proximity />
      <Intents />
      <HowItWorks />
      <Trust />
      <Principles />
      <Safety />
      <Faq />
      <FinalCta />
    </>
  );
}
