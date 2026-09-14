"use client";

import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import RecentArticlesGrid from "@/components/site/RecentArticlesGrid";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import type { PublicArticleSummaryWithCategory } from "@/lib/publicApi";

interface BlogPageContentProps {
  initialArticles: PublicArticleSummaryWithCategory[];
}

export default function BlogPageContent({ initialArticles }: BlogPageContentProps) {
  const { locale } = useLocale();
  const t = ui[locale].blogPage;

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <PageHero
          eyebrow={t.eyebrow}
          heading={t.heading}
          subtext={t.subtext}
          image="/mukalim/articles/fb-hero.jpg"
          imageAlt="A kitchen counter with fresh ingredients and a recipe in progress"
        />

        <section className="bg-brand-cream px-4 py-24 sm:px-6 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <RecentArticlesGrid initialArticles={initialArticles} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
