import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import CategoryHero from "@/components/site/CategoryHero";
import CategoryArticles from "@/components/site/CategoryArticles";
import { listPublicCategories, getPublicCategory, listPublicArticles, isNotFoundError } from "@/lib/publicApi";

// ISR, not force-dynamic: this is a content/brand site, not a live
// dashboard — a 60s-stale category page is imperceptible to a real visitor,
// and caching means most requests never touch the Express backend/Supabase
// at all. A newly created category still appears without a rebuild: params
// not covered by `generateStaticParams` render on-demand on first request
// (Next's default `dynamicParams`), then get cached for `revalidate` like
// every other page.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { data } = await listPublicCategories();
    return data.map((category) => ({ category: category.slug }));
  } catch {
    // Backend unreachable at build time — fall back to rendering every slug
    // on-demand at request time instead of failing the whole build.
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  try {
    const data = await getPublicCategory(category);
    return { title: `${data.title} — Mukalim`, description: data.description };
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params }: PageProps<"/[category]">) {
  const { category } = await params;

  let categoryData;
  try {
    categoryData = await getPublicCategory(category);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    throw err;
  }

  // Fetched here (English default, matching the server's always-English
  // render — see CategoryArticles for how French corrects client-side)
  // purely so first paint doesn't wait on an extra client-side round trip
  // for the common case.
  const initialArticles = await listPublicArticles(categoryData.slug, { limit: 100 }).catch(() => null);

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <CategoryHero categorySlug={categoryData.slug} initialData={categoryData} />
        <section className="mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-6 lg:px-16 lg:py-20">
          <CategoryArticles
            categorySlug={categoryData.slug}
            initialArticles={initialArticles?.data ?? null}
            initialMeta={initialArticles?.meta ?? null}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
