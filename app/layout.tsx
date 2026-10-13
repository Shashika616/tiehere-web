import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CinematicFilm from "@/components/motion/CinematicFilm";
import Header from "@/components/ui/Header";
import BrandFlight from "@/components/motion/BrandFlight";
import SmoothAnchors from "@/components/motion/SmoothAnchors";
import ScrollEntry from "@/components/motion/ScrollEntry";
import Footer from "@/components/ui/Footer";
import { BRAND } from "@/content/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: `${BRAND.name}, ${BRAND.line}`,
    template: `%s, ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name}, ${BRAND.line}`,
    description: BRAND.description,
    url: `https://${BRAND.domain}`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name}, ${BRAND.line}`,
    description: BRAND.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07090C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // The inline script below writes data-brand-flight before React
      // hydrates, so the client <html> carries an attribute the server did
      // not render. This scopes the mismatch warning to this element's own
      // attributes, which is exactly the one we are causing on purpose.
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body>
        {/* Runs before anything is parsed, so neither the theme nor the nav
            lockup is ever painted wrong and then corrected. That flash was ~280ms and most obvious on a phone, where
            there is no large hero lockup drawing the eye away from it.
            Skipped under reduced motion, where there is no flight to wait
            for, and a no-JS visitor never sets it, so the lockup just shows. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement,t=null;try{t=localStorage.getItem('tiehere:theme')}catch(e){}" +
              "if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}" +
              "d.dataset.theme=t;" +
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.brandFlight='pending'}}catch(e){}",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cta focus:px-5 focus:py-2 focus:text-sm focus:text-cta-fg"
        >
          Skip to content
        </a>
        <ScrollEntry />
        <SmoothScroll />
        <SmoothAnchors />
        <CinematicFilm />
        <Header />
        <BrandFlight />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
