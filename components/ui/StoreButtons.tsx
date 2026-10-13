import { LINKS } from "@/content/site";

/**
 * Store CTAs. The marks are authored SVG, not glyphs or bitmap badges, so they
 * stay crisp at any size and inherit currentColor.
 *
 * Until `LINKS.appStore` and `LINKS.playStore` are filled in, these are not
 * anchors. They keep their shape and say "soon" instead, because a primary
 * call to action that does nothing when you click it is the single most
 * damaging dead control on a page: it reads as a broken site rather than an
 * unreleased one. Paste the listings into `content/site.ts` and they become
 * real links with no other change.
 *
 * TODO before launch: confirm the lockups against Apple's and Google's current
 * badge guidelines.
 */

function AppleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.05 12.58c-.03-2.65 2.17-3.93 2.27-3.99-1.24-1.81-3.16-2.06-3.84-2.09-1.63-.17-3.19.96-4.02.96-.83 0-2.11-.94-3.47-.91-1.78.03-3.43 1.04-4.35 2.63-1.85 3.22-.47 7.98 1.33 10.59.88 1.28 1.93 2.71 3.31 2.66 1.33-.05 1.83-.86 3.44-.86 1.6 0 2.06.86 3.46.83 1.43-.02 2.34-1.3 3.21-2.59 1.01-1.48 1.43-2.92 1.46-3-.03-.01-2.8-1.07-2.8-4.25z" />
      <path d="M14.46 4.6c.73-.89 1.23-2.12 1.09-3.35-1.06.04-2.34.7-3.1 1.59-.68.78-1.27 2.03-1.11 3.23 1.18.09 2.39-.6 3.12-1.47z" />
    </svg>
  );
}

function PlayMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M3.6 1.9a1.3 1.3 0 0 0-.6 1.1v18a1.3 1.3 0 0 0 .6 1.1l10-10.1z" fill="#00D2FF" />
      <path d="M17.3 8.4 13.6 12l3.7 3.6 4.2-2.4c.9-.5.9-1.9 0-2.4z" fill="#FFCE00" />
      <path d="M3.6 1.9 13.6 12l3.7-3.6L5.3 1.5a1.4 1.4 0 0 0-1.7.4z" fill="#00F076" />
      <path d="M3.6 22.1 13.6 12l3.7 3.6L5.3 22.5a1.4 1.4 0 0 1-1.7-.4z" fill="#FF3A44" />
    </svg>
  );
}

function Badge({
  store,
  sub,
  icon,
  href,
  invert = false,
}: {
  store: string;
  sub: string;
  icon: React.ReactNode;
  href?: string;
  invert?: boolean;
}) {
  const inner = (
    <>
      <span className="shrink-0">{icon}</span>
      <span className="text-left leading-tight">
        <span
          className={`block font-mono text-[0.625rem] font-medium tracking-[0.08em] ${
            invert ? "text-cta-fg/70" : "text-fg-2"
          }`}
        >
          {sub}
        </span>
        <span className="block text-[0.95rem] font-medium tracking-tight">{store}</span>
      </span>
    </>
  );

  // The store name keeps full contrast even while the link is unavailable.
  // Muting the whole badge made the primary call to action read as disabled
  // chrome rather than as something arriving; the chip beside it is what says
  // "not yet".
  if (!href) {
    return (
      <span
        className="inline-flex w-full cursor-default items-center justify-center gap-3 rounded-xl border border-line bg-raise px-5 py-3 text-fg sm:w-auto sm:justify-start"
        aria-label={`${store}, coming soon`}
      >
        {inner}
        <span className="ml-1 shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.09em] text-fg-3">
          soon
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sub} ${store}`}
      className={
        invert
          ? "group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-cta px-5 py-3 text-cta-fg transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:justify-start"
          : "group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-raise px-5 py-3 backdrop-blur-md transition-all duration-200 hover:border-fg-3 hover:bg-raise-2 active:scale-[0.98] sm:w-auto sm:justify-start"
      }
    >
      {inner}
    </a>
  );
}

export default function StoreButtons({ invert = false }: { invert?: boolean }) {
  // Stacked and equal width on a phone: side by side they size to their own
  // labels, so "App Store" came out 25px wider than "Google Play" and the
  // pair read as a mistake.
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Badge
        store="App Store"
        sub="Download on the"
        href={LINKS.appStore || undefined}
        invert={invert}
        icon={<AppleMark className="h-6 w-6" />}
      />
      <Badge
        store="Google Play"
        sub="Get it on"
        href={LINKS.playStore || undefined}
        invert={invert}
        icon={<PlayMark className="h-5 w-5" />}
      />
    </div>
  );
}
