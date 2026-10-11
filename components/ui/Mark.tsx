const RIGHT =
  "M50.00 60.00 L51.79 58.22 L53.61 56.47 L55.52 54.75 L57.54 53.11 L59.71 51.59 L62.08 50.23 L64.66 49.11 L67.45 48.32 L70.44 47.98 L73.56 48.22 L76.65 49.16 L79.52 50.88 L81.88 53.37 L83.45 56.50 L84.00 60.00 L83.45 63.50 L81.88 66.63 L79.52 69.12 L76.65 70.84 L73.56 71.78 L70.44 72.02 L67.45 71.68 L64.66 70.89 L62.08 69.77 L59.71 68.41 L57.54 66.89 L55.52 65.25 L53.61 63.53 L51.79 61.78 L50.00 60.00";
const LEFT =
  "M50.00 60.00 L48.21 58.22 L46.39 56.47 L44.48 54.75 L42.46 53.11 L40.29 51.59 L37.92 50.23 L35.34 49.11 L32.55 48.32 L29.56 47.98 L26.44 48.22 L23.35 49.16 L20.48 50.88 L18.12 53.37 L16.55 56.50 L16.00 60.00 L16.55 63.50 L18.12 66.63 L20.48 69.12 L23.35 70.84 L26.44 71.78 L29.56 72.02 L32.55 71.68 L35.34 70.89 L37.92 69.77 L40.29 68.41 L42.46 66.89 L44.48 65.25 L46.39 63.53 L48.21 61.78 L50.00 60.00";

/**
 * The TieHere mark: two interlocking figures, a blue one and a green one,
 * forming one continuous knot, with two heads above.
 *
 * Drawn as geometry rather than shipped as the 276×264 PNG the app carries,
 * so it scales to the hero, the favicon and the final CTA from one source and
 * can be stroke-animated.
 */
export default function Mark({
  size = 32,
  className = "",
  draw = false,
  title,
}: {
  size?: number;
  className?: string;
  /** Render as an un-drawn outline, for the scroll-scrubbed finale. */
  draw?: boolean;
  title?: string;
}) {
  const common = {
    fill: "none",
    strokeWidth: 15,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="29" cy="20" r="12.5" fill="#0075F6" className={draw ? "mark-head mark-head-a" : ""} />
      <circle cx="72" cy="24" r="10" fill="#34C24C" className={draw ? "mark-head mark-head-b" : ""} />
      <path d={LEFT} stroke="#0075F6" {...common} className={draw ? "mark-path mark-path-a" : ""} />
      <path d={RIGHT} stroke="#34C24C" {...common} className={draw ? "mark-path mark-path-b" : ""} />
    </svg>
  );
}
