"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Where the reader is, and what time it is there.
 *
 * The reference site uses this device to say where the studio is. Ours says
 * where *you* are, which is the premise of the product: a place and a window
 * are the only two things TieHere ever asks for, and the footer is already
 * holding both.
 *
 * Read from `Intl`, so it needs no permission, no network and no API.
 *
 * The seconds are written straight to a text node through a ref. Driving a
 * clock through React state re-renders the subtree and forces a style recalc
 * once a second for a string that only ever changes inside one element.
 */
export default function LocalClock() {
  const timeRef = useRef<HTMLParagraphElement>(null);
  // Place and offset are read once; only the clock face changes after that.
  const [meta, setMeta] = useState<{ place: string; offset: string } | null>(null);

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    // Offsets are not whole hours everywhere: Colombo is +5:30, Kathmandu
    // +5:45, Chatham +12:45. Decimal hours would print "+5.50" and be wrong.
    const mins = -new Date().getTimezoneOffset();
    const sign = mins < 0 ? "-" : "+";
    const abs = Math.abs(mins);
    const h = Math.floor(abs / 60);
    const m = abs % 60;

    setMeta({
      place: (zone.split("/").pop() || "").replace(/_/g, " "),
      offset: `GMT${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`,
    });

    const tick = () => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="max-w-[26ch]">
      <p className="text-[clamp(1.05rem,1.7vw,1.4rem)] leading-snug text-fg">
        {meta?.place ? (
          <>
            You are in <span className="text-brand-green">{meta.place}</span>.
          </>
        ) : (
          <>&nbsp;</>
        )}
      </p>

      <p className="t-label mt-5 flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
        {meta?.offset || " "}
      </p>

      {/* Tabular figures so the seconds tick without the line re-flowing. */}
      <p
        ref={timeRef}
        suppressHydrationWarning
        className="mt-2 font-mono text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tabular-nums tracking-tight"
      >
        &nbsp;
      </p>

      <p className="mt-6 max-w-[30ch] text-[0.9rem] leading-relaxed text-fg-3">
        A place and a window. Those are the only two things this app ever asks you for.
      </p>
    </div>
  );
}
