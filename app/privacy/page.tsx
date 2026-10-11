import type { Metadata } from "next";
import Doc from "@/components/ui/Doc";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What TieHere collects, why, and what it never shares.",
};

export default function Page() {
  return (
    <Doc
      kicker="privacy"
      title="Privacy"
      lede="Placeholder structure. This page must be reviewed by a lawyer before launch. The App Store and Google Play both require a live, accurate policy at a stable URL."
    >
      <h2>What is collected</h2>
      <p>
        Account identity (email, and whichever federated sign-in you used), the verification
        signals you choose to add at levels 2 and 3, your approximate location while the app is
        in use, and the meetups you host, request or attend.
      </p>

      <h2>What other users see</h2>
      <p>
        Your profile as you have filled it in, your trust level, your rating history, and
        quantised location, never exact. Contact details are shared only on confirmation of a
        meetup, per participant.
      </p>

      <h2>What is never shared</h2>
      <p>
        Your precise coordinates, your phone number and email before a confirmed meetup, and your
        trusted contacts, who are visible to nobody but you.
      </p>

      <h2>Deletion</h2>
      <p>
        Account deletion removes your data rather than hiding it. See the deletion page for what
        is removed and what is retained for legal reasons.
      </p>

      <h2>Contact</h2>
      <p>TODO: the address a privacy request should be sent to.</p>
    </Doc>
  );
}
