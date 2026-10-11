"use client";

import { useRef, useState, useId } from "react";
import type { Faq } from "@/content/site";

export default function Accordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-white/10">
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
  const body = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-white/10">
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
            className="mt-1 shrink-0 text-xl text-white/40 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        className="overflow-hidden transition-[height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          height: isOpen ? (body.current?.scrollHeight ?? 0) + 28 : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={body} className="max-w-[46rem] pb-7">
          <p className="t-lead !text-[1rem]">{item.a}</p>
        </div>
      </div>
    </div>
  );
}
