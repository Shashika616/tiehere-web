import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CinematicFilm from "@/components/motion/CinematicFilm";
import Header from "@/components/ui/Header";
import BrandFlight from "@/components/motion/BrandFlight";
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
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2 focus:text-sm focus:text-ink-900"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <CinematicFilm />
        <Header />
        <BrandFlight />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
