import type { Metadata } from "next";
import { Suspense } from "react";
import AcceptInvitePageContent from "@/components/site/AcceptInvitePageContent";

export const metadata: Metadata = {
  title: "Accept Invite, Mukalim",
  description: "Set your password to activate your Mukalim admin account.",
};

export default function AcceptInvitePage() {
  return (
    // AcceptInvitePageContent reads the `?token=` search param, which
    // requires a Suspense boundary per Next.js's rules for useSearchParams.
    <Suspense fallback={null}>
      <AcceptInvitePageContent />
    </Suspense>
  );
}
