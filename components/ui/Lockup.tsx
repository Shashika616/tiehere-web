import Mark from "./Mark";

/**
 * The brand lockup: the knot plus the wordmark, in one component so the hero
 * copy, the nav copy and the flying copy are guaranteed to be the same shape.
 * The flight between them is a scale, nothing more, which is what lets it read
 * as one object moving rather than two elements cross-fading.
 *
 * The wordmark is split so "Here" can carry the green figure's colour while
 * "Tie" inherits its context. Solid, not a gradient. The light chapter needs
 * a darker green to clear AA, which globals.css handles off `data-film-light`.
 */
export default function Lockup({
  variant = "nav",
  id,
  className = "",
}: {
  variant?: "nav" | "hero";
  id?: string;
  className?: string;
}) {
  const hero = variant === "hero";

  return (
    <span
      id={id}
      className={`inline-flex origin-left items-center ${hero ? "gap-4" : "gap-2.5"} ${className}`}
    >
      <Mark
        size={hero ? 64 : 30}
        className={hero ? "h-[clamp(2.25rem,8.5vw,4rem)] w-[clamp(2.25rem,8.5vw,4rem)]" : ""}
      />
      <span
        className={
          hero
            ? "text-[clamp(2.25rem,8.5vw,4rem)] font-medium leading-none tracking-[-0.045em]"
            : "text-[1.0625rem] font-medium leading-none tracking-[-0.03em]"
        }
      >
        <span className="brand-tie">Tie</span>
        <span className="brand-here">Here</span>
      </span>
    </span>
  );
}
