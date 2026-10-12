/**
 * Editorial section numeral: tabular figures, a hairline, nothing else.
 *
 * Replaces the `{01}` bracket form. Brackets read as a code literal, which is
 * a borrowed voice rather than this product's own; a lining numeral next to a
 * rule is the typographic convention for a numbered section and carries the
 * same information without the costume.
 */
export default function Numeral({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  const n = typeof value === "number" ? String(value).padStart(2, "0") : value;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="font-mono text-[0.8125rem] font-medium tabular-nums tracking-[0.06em] text-white/55">
        {n}
      </span>
      <span className="block h-px w-6 bg-white/20" />
    </span>
  );
}
