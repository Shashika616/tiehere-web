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
            invert ? "text-ink-900/55" : "text-white/60"
          }`}
        >
          {sub}
        </span>
        <span className="block text-[0.95rem] font-medium tracking-tight">{store}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <span
        className="inline-flex cursor-default items-center gap-3 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-3 text-white/55"
        aria-label={`${store}, coming soon`}
      >
        {inner}
        <span className="ml-1 shrink-0 rounded-full border border-white/12 px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.09em] text-white/35">
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
          ? "group inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-ink-900 transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
          : "group inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/[0.11] active:scale-[0.98]"
      }
    >
      {inner}
    </a>
  );
}

export default function StoreButtons({ invert = false }: { invert?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
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
