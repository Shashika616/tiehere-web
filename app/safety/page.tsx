import type { Metadata } from "next";
import Doc from "@/components/ui/Doc";
import { SAFETY, TRUST } from "@/content/site";

export const metadata: Metadata = {
  title: "Safety",
  description:
    "How TieHere handles trust levels, SOS, trusted contacts, the safety gate and location privacy.",
};

export default function Page() {
  return (
    <Doc
      kicker="safety"
      title="How safety actually works"
      lede="Mechanisms in the product, described plainly. If something here is not shipped, it does not belong on this page."
    >
      <h2>The trust ladder</h2>
      <p>
        What you can see and do depends on how far up the ladder your account has climbed. Each
        rung is optional, and each one unlocks something specific.
      </p>
      <ul>
        {TRUST.map((r) => (
          <li key={r.level}>
            <strong>Level {r.level}: {r.name}.</strong> {r.unlocks} {r.requires}
          </li>
        ))}
      </ul>

      <h2>The features</h2>
      <ul>
        {SAFETY.map((s) => (
          <li key={s.title}>
            <strong>{s.title}.</strong> {s.body}
          </li>
        ))}
      </ul>

      <h2>Why level 2 gates the safety features</h2>
      <p>
        SOS, trusted contacts and the safety gate switch on at level 2, once LinkedIn, phone and
        personal email are verified. A safety net that an anonymous account can pull is not a
        safety net, and the people it would reach are real people outside the app.
      </p>

      <h2>Location</h2>
      <p>
        Below level 1 you cannot see where anything is at all. Above it, coordinates are
        quantised before they leave the server, so no viewer ever receives a precise position,
        regardless of their trust level or yours.
      </p>

      <h2>Reporting</h2>
      <p>
        Report and block are available from any profile and any meetup. Reports are reviewed by a
        person. TODO before launch: name the response-time commitment you are willing to keep.
      </p>
    </Doc>
  );
}
