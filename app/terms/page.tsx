import type { Metadata } from "next";
import Doc from "@/components/ui/Doc";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms of using TieHere.",
};

export default function Page() {
  return (
    <Doc
      kicker="terms"
      title="Terms of use"
      lede="Placeholder structure. Legal review required before launch."
    >
      <h2>Who can use TieHere</h2>
      <p>TODO: minimum age, jurisdictions, one account per person.</p>

      <h2>Conduct</h2>
      <p>
        TieHere arranges meetings between real people in real places. Harassment, impersonation,
        and no-shows are grounds for removal. Verification can be revoked.
      </p>

      <h2>Premium</h2>
      <p>
        Premium is billed through the App Store or Google Play. Plans, prices and renewals are
        handled there, and it can be cancelled there at any time.
      </p>

      <h2>Liability</h2>
      <p>TODO: legal review, this section in particular.</p>
    </Doc>
  );
}
