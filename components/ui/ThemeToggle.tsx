"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * Theme switch.
 *
 * The chosen theme is written to `data-theme` on <html> and remembered, and an
 * inline script in the layout applies it before first paint, so the page never
 * flashes the wrong ground.
 *
 * It reads the system preference only when nothing has been chosen; once
 * someone picks, that choice wins, because a site that quietly overrides your
 * explicit choice at sunrise is worse than one with no toggle at all.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("tiehere:theme", next);
    } catch {
      // Private mode. Losing the preference is not worth throwing over.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={theme === "light"}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-knob" />
      </span>
    </button>
  );
}
