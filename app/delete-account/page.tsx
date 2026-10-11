import type { Metadata } from "next";
import Doc from "@/components/ui/Doc";

export const metadata: Metadata = {
  title: "Delete your account",
  description: "How to delete your TieHere account and what deletion removes.",
};

export default function Page() {
  return (
    <Doc
      kicker="account"
      title="Delete your account"
      lede="Deletion is available from inside the app, and it removes your data rather than hiding it."
    >
      <h2>How</h2>
      <ul>
        <li>Open TieHere and go to your profile.</li>
        <li>Settings → Delete account.</li>
        <li>Confirm. The session ends immediately on the device.</li>
      </ul>

      <h2>What is removed</h2>
      <ul>
        <li>Your profile, photo and verification records.</li>
        <li>Your trusted contacts.</li>
        <li>Your meetups, requests and device push registrations.</li>
      </ul>

      <h2>What is retained, and why</h2>
      <p>
        Records that other people&rsquo;s accounts depend on, for example a rating somebody else
        received, are retained in a form that no longer identifies you. TODO: confirm the exact
        retention window with legal.
      </p>

      <h2>If you cannot open the app</h2>
      <p>TODO: the support address that will action a deletion request manually.</p>
    </Doc>
  );
}
