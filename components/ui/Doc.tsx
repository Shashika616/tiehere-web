import type { ReactNode } from "react";

/** Shared shell for the text pages. Dark, narrow measure, no film chapter of its own. */
export default function Doc({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <article className="shell max-w-[52rem] py-36 md:py-44">
      <p className="t-label mb-8">{kicker}</p>
      <h1 className="t-h2">{title}</h1>
      {lede && <p className="t-lead mt-7">{lede}</p>}
      <div className="doc mt-14">{children}</div>
    </article>
  );
}
