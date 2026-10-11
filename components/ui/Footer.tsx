import Mark from "./Mark";
import { BRAND } from "@/content/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark size={28} />
            <span className="text-base font-medium tracking-tight">TieHere</span>
          </div>
          <p className="t-lead mt-5 max-w-sm !text-[0.95rem]">{BRAND.line}</p>
        </div>

        <nav aria-label="Product">
          <p className="t-label mb-4">product</p>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li><a href="#how" className="transition-colors hover:text-white">How it works</a></li>
            <li><a href="#intents" className="transition-colors hover:text-white">Intents</a></li>
            <li><a href="#trust" className="transition-colors hover:text-white">Trust levels</a></li>
            <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="t-label mb-4">legal</p>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li><a href="/safety" className="transition-colors hover:text-white">Safety</a></li>
            <li><a href="/privacy" className="transition-colors hover:text-white">Privacy</a></li>
            <li><a href="/terms" className="transition-colors hover:text-white">Terms</a></li>
            <li><a href="/delete-account" className="transition-colors hover:text-white">Delete your account</a></li>
          </ul>
        </nav>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-white/[0.07] py-7 md:flex-row md:items-center md:justify-between">
        <p className="t-label">© {year} {BRAND.name}</p>
        <p className="t-label">{BRAND.domain}</p>
      </div>
    </footer>
  );
}
