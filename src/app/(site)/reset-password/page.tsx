import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordPageContent from "@/components/site/ResetPasswordPageContent";

export const metadata: Metadata = {
  title: "Reset Password — Mukalim",
  description: "Set a new password for your Mukalim account.",
};

export default function ResetPasswordPage() {
  return (
    // ResetPasswordPageContent reads the `?token=` search param, which
    // requires a Suspense boundary per Next.js's rules for useSearchParams.
    <Suspense fallback={null}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
