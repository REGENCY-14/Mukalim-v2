import type { Metadata } from "next";
import { Suspense } from "react";
import SignInPageContent from "@/components/site/SignInPageContent";

export const metadata: Metadata = {
  title: "Sign In — Mukalim",
  description: "Sign in to your Mukalim account.",
};

export default function SignInPage() {
  return (
    // SignInPageContent reads the `?next=` search param (used when the
    // admin dashboard bounces an unauthenticated visitor here), which
    // requires a Suspense boundary per Next.js's rules for useSearchParams.
    <Suspense fallback={null}>
      <SignInPageContent />
    </Suspense>
  );
}
