import type { Metadata } from "next";
import SustainabilityPageContent from "@/components/site/SustainabilityPageContent";

export const metadata: Metadata = {
  title: "Sustainability — Mukalim",
  description: "Mukalim's commitments to ethical sourcing, fair labor, and regenerative farming practices.",
};

export default function SustainabilityPage() {
  return <SustainabilityPageContent />;
}
