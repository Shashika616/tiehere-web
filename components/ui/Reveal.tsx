"use client";

import { useInView } from "@/lib/useInView";
import type { ElementType, ReactNode } from "react";

/**
 * Line reveal. Splits on explicit lines the author provides, never per
 * character. The full string stays in one accessible node; only the visual
 * wrappers are split, so screen readers read a heading, not an alphabet.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  stagger = 90,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  const ref = useInView<HTMLDivElement>(0.3);
  const label = lines.map((l) => (typeof l === "string" ? l : "")).join(" ").trim();

  return (
    <div ref={ref}>
      <Tag className={className} aria-label={label || undefined}>
        {lines.map((line, i) => (
          <span className="reveal-line" key={i} aria-hidden="true">
            <span style={{ ["--d" as string]: `${i * stagger}ms` }}>{line}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/** Fade-and-rise. 18px, 700ms, one easing. Used for everything that is not a heading. */
export function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className={`rise ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}
