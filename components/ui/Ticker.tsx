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
  size = "sm",
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  /** "lg" is for a ticker carrying real content, not a row of logos. */
  size?: "sm" | "lg";
}) {
  const big = size === "lg";
  const track = [...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden ${big ? "py-9 md:py-12" : "py-5"}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <div
        className={`flex w-max items-center will-change-transform ${big ? "gap-20" : "gap-14"}`}
        style={{
          animation: `ticker ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className={
              big
                ? "flex shrink-0 items-center gap-20 whitespace-nowrap font-mono text-[clamp(1.05rem,1.9vw,1.6rem)] lowercase tracking-[0.1em] text-white/75"
                : "t-label flex shrink-0 items-center gap-14 whitespace-nowrap"
            }
          >
            {item}
            <span
              className={`inline-block rounded-full bg-brand-green/70 ${
                big ? "h-1.5 w-1.5" : "h-1 w-1"
              }`}
            />
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }`}</style>
    </div>
  );
}
