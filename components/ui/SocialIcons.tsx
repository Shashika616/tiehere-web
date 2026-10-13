"use client";

import { useId } from "react";

/**
 * Glyphs for the contact rail.
 *
 * Authored SVG on a shared 24x24 grid, filled rather than stroked. The
 * envelope is drawn to the same optical weight as the three brand marks,
 * because a hairline outline next to three solid logos reads as a mistake at
 * this size.
 *
 * `tone="brand"` paints each platform in its own colour, which is the one
 * place the site's two-colour rule gives way: a brand mark recoloured is no
 * longer that brand's mark, and the Google Play glyph in the store buttons
 * already sets the precedent. Email has no owner, so it takes TieHere blue:
 * our channel in our colour, their platforms in theirs.
 *
 * `tone="mono"` is the default and still inherits `currentColor`, so any
 * other use of these stays inside the palette.
 */
type Tone = "mono" | "brand";
type Props = { className?: string; tone?: Tone };

const base = (className: string) => ({
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
  className,
});

const fill = (tone: Tone | undefined, brand: string) =>
  tone === "brand" ? brand : "currentColor";

export function MailIcon({ className = "", tone }: Props) {
  return (
    <svg {...base(className)} fill={fill(tone, "#0075F6")}>
      <path d="M4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11A2.5 2.5 0 0 1 4.5 4Zm.2 2a.5.5 0 0 0-.36.15l7.16 5.37a.83.83 0 0 0 1 0l7.16-5.37A.5.5 0 0 0 19.3 6H4.7Zm15.3 2.4-6.6 4.95a2.83 2.83 0 0 1-3.4 0L3.4 8.4v9.1c0 .28.22.5.5.5h16.2a.5.5 0 0 0 .5-.5V8.4Z" />
    </svg>
  );
}

export function LinkedInIcon({ className = "", tone }: Props) {
  return (
    <svg {...base(className)} fill={fill(tone, "#0A66C2")}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "", tone }: Props) {
  // Instagram's mark is a gradient, not a flat colour, so it needs a def of
  // its own. The id is generated, or two copies on one page would collide.
  const id = useId().replace(/:/g, "");
  return (
    <svg {...base(className)} fill={tone === "brand" ? `url(#${id})` : "currentColor"}>
      {tone === "brand" && (
        <defs>
          <radialGradient id={id} cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#FDF497" />
            <stop offset="5%" stopColor="#FDF497" />
            <stop offset="45%" stopColor="#FD5949" />
            <stop offset="60%" stopColor="#D6249F" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
      )}
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.71 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.71-1.46-1.38-2.13-.67-.66-1.34-1.08-2.13-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Z" />
      <path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
      <circle cx="18.41" cy="5.59" r="1.44" />
    </svg>
  );
}

export function XIcon({ className = "", tone }: Props) {
  // X's mark is black. On a dark ground the white version is the correct one,
  // so this is the only brand mark that follows the theme.
  return (
    <svg {...base(className)} fill={fill(tone, "var(--color-x-mark)")}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  );
}
