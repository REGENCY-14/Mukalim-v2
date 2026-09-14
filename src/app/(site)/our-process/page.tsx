import type { Metadata } from "next";
import ProcessPageContent from "@/components/site/ProcessPageContent";

export const metadata: Metadata = {
  title: "Our Process — Mukalim",
  description: "How an ingredient earns the Mukalim name — sourcing, testing, and certification.",
};

export default function ProcessPage() {
  return <ProcessPageContent />;
}
