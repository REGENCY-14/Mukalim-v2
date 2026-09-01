import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import CategoryHero from "@/components/site/CategoryHero";
import CategoryArticles from "@/components/site/CategoryArticles";
import { getAllCategorySlugs, getCategoryBySlug } from "@/lib/categories";

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  const data = getCategoryBySlug(category);
  if (!data) return {};
  return {
    title: `${data.title} — Mukalim`,
    description: data.description,
  };
}

export default async function CategoryPage({ params }: PageProps<"/[category]">) {
  const { category } = await params;
  const data = getCategoryBySlug(category);

  if (!data) {
    notFound();
  }

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <CategoryHero
          categorySlug={data.slug}
          title={data.title}
          description={data.description}
          image={data.heroImage}
          imageAlt={data.heroImageAlt}
        />
        <section className="mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-6 lg:px-16 lg:py-20">
          <CategoryArticles articles={data.articles} categorySlug={data.slug} />
        </section>
      </main>
      <Footer />
    </>
  );
}
