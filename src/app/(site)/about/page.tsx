import type { Metadata } from "next";
import AboutPageContent from "@/components/site/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us, Mukalim",
  description: "The story behind Mukalim's globally sourced, expertly tested spices and botanicals.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
