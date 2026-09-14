import type { Metadata } from "next";
import BlogPageContent from "@/components/site/BlogPageContent";
import { listRecentArticles } from "@/lib/publicApi";

export const metadata: Metadata = {
  title: "Blog & Recipes, Mukalim",
  description: "Real articles from Mukalim's ingredient library, gathered in one place.",
};

export default async function BlogPage() {
  const initialArticles = await listRecentArticles("en").catch(() => []);
  return <BlogPageContent initialArticles={initialArticles} />;
}
