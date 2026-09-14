import type { Metadata } from "next";
import ForgotPasswordPageContent from "@/components/site/ForgotPasswordPageContent";

export const metadata: Metadata = {
  title: "Forgot Password, Mukalim",
  description: "Request a password reset link for your Mukalim account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />;
}
