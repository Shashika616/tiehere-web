/**
 * Store CTAs. The marks are authored SVG, not glyphs or bitmap badges, so they
 * stay crisp at any size and inherit currentColor.
 *
 * TODO before launch: swap `href="#"` for the real listings, and confirm the
 * lockups against Apple's and Google's current badge guidelines.
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
  invert = false,
}: {
  store: string;
  sub: string;
  icon: React.ReactNode;
  invert?: boolean;
}) {
  return (
    <a
      href="#"
      aria-label={`${sub} ${store}`}
      className={
        invert
          ? "group inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-ink-900 transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
          : "group inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/[0.11] active:scale-[0.98]"
      }
    >
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
    </a>
  );
}

export default function StoreButtons({ invert = false }: { invert?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge
        store="App Store"
        sub="Download on the"
        invert={invert}
        icon={<AppleMark className="h-6 w-6" />}
      />
      <Badge
        store="Google Play"
        sub="Get it on"
        invert={invert}
        icon={<PlayMark className="h-5 w-5" />}
      />
    </div>
  );
}
