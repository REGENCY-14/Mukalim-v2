import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import ArticleDetail from "@/components/site/ArticleDetail";
import { getAllArticleParams, getArticleBySlug, getRelatedArticles } from "@/lib/categories";

export function generateStaticParams() {
  return getAllArticleParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[article]">): Promise<Metadata> {
  const { category, article } = await params;
  const found = getArticleBySlug(category, article);
  if (!found) return {};
  return {
    title: `${found.article.title} — Mukalim`,
    description: found.article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps<"/[category]/[article]">) {
  const { category, article } = await params;
  const found = getArticleBySlug(category, article);

  if (!found) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(category, article);

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <ArticleDetail
          category={found.category}
          article={found.article}
          relatedArticles={relatedArticles}
        />
      </main>
      <Footer />
    </>
  );
}
