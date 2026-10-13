"use client";

import { useState, useId } from "react";
import type { Faq } from "@/content/site";

export default function Accordion({ items }: { items: Faq[] }) {
  // Everything closed on arrival. An accordion that opens one item for you
  // reads as a rendering fault rather than as a hint, especially when the
  // first question is "Is this a dating app?".
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <Row
          key={i}
          item={item}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
          id={`${baseId}-${i}`}
        />
      ))}
    </div>
  );
}

function Row({
  item,
  isOpen,
  onToggle,
  id,
}: {
  item: Faq;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          className="flex w-full items-start justify-between gap-8 py-7 text-left transition-opacity duration-200 hover:opacity-70"
        >
          <span className="t-h3 max-w-[48rem] !text-[clamp(1.05rem,2vw,1.6rem)]">{item.q}</span>
          <span
            className="mt-1 shrink-0 text-xl text-fg-3 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      {/* Animated with grid-template-rows rather than a measured height.
          Reading scrollHeight during render gave 0 on the first pass, because
          the ref is not attached yet and nothing re-renders to correct it, so
          an item open by default rendered clipped to its padding. This needs
          no measurement at all and cannot desync from its content. */}
      <div
        id={`${id}-panel`}
        role="region"
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className="t-lead max-w-[46rem] pb-7 !text-[1rem]">{item.a}</p>
        </div>
      </div>
    </div>
  );
}
