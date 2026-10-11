"use client";

/**
 * Infinite ticker with masked edges, the one Framer-template pattern worth
 * keeping, because the mask is the whole difference between "marquee" and
 * "designed". CSS-animated on a duplicated track, so it costs no JS.
 */
export default function Ticker({
  items,
  duration = 42,
  reverse = false,
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
}) {
  const track = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden py-5"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <div
        className="flex w-max items-center gap-14 will-change-transform"
        style={{
          animation: `ticker ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track.map((item, i) => (
          <span key={i} className="t-label flex shrink-0 items-center gap-14 whitespace-nowrap">
            {item}
            <span className="inline-block h-1 w-1 rounded-full bg-brand-green/60" />
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }`}</style>
    </div>
  );
}
