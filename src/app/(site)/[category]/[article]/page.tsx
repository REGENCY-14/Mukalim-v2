import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import ArticleDetail from "@/components/site/ArticleDetail";
import {
  listPublicCategories,
  getPublicCategory,
  getPublicArticle,
  listPublicArticles,
  isNotFoundError,
} from "@/lib/publicApi";

// Same ISR tradeoff as the category page — see the comment there.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { data: categories } = await listPublicCategories();
    const params = await Promise.all(
      categories.map(async (category) => {
        const { data: articles } = await listPublicArticles(category.slug, { limit: 100 }).catch(() => ({
          data: [],
        }));
        return articles.map((article) => ({ category: category.slug, article: article.slug }));
      }),
    );
    return params.flat();
  } catch {
    // Backend unreachable at build time — render every article on-demand
    // at request time instead of failing the whole build.
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[article]">): Promise<Metadata> {
  const { category, article } = await params;
  try {
    const data = await getPublicArticle(category, article);
    return { title: `${data.title} — Mukalim`, description: data.excerpt };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: PageProps<"/[category]/[article]">) {
  const { category, article } = await params;

  let categoryData;
  let articleData;
  try {
    [categoryData, articleData] = await Promise.all([
      getPublicCategory(category),
      getPublicArticle(category, article),
    ]);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    throw err;
  }

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <ArticleDetail categorySlug={categoryData.slug} initialCategoryTitle={categoryData.title} initialArticle={articleData} />
      </main>
      <Footer />
    </>
  );
}
