"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CategoryArticle, CategoryPageData } from "@/lib/categories";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { localizeArticle, localizeCategoryHero, ui, type Locale } from "@/lib/i18n/translations";
import { fadeInUp, scrollViewport, staggerContainer, staggerItem } from "@/lib/animations";
import ArticleCard from "./ArticleCard";

interface ArticleDetailProps {
  category: CategoryPageData;
  article: CategoryArticle;
  relatedArticles: CategoryArticle[];
}

function formatDate(iso: string, locale: Locale): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleDetail({ category, article, relatedArticles }: ArticleDetailProps) {
  const { locale } = useLocale();
  const t = ui[locale];
  const categoryTitle = localizeCategoryHero(category.slug, category.title, category.description, locale).title;
  const localizedArticle = localizeArticle(article, category.slug, locale);
  const localizedRelated = relatedArticles.map((related) => localizeArticle(related, category.slug, locale));

  return (
    <>
      <article>
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="border-b border-brand-line/30 px-4 py-12 sm:px-6 lg:px-16 lg:py-16"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            <motion.div variants={staggerItem}>
              <Link
                href={`/${category.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.7px] text-brand-brown-deep transition-colors hover:text-brand-rust"
              >
                <img
                  src="/mukalim/arrow-right.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-3.5 rotate-180"
                />
                {t.articleDetail.backTo} {categoryTitle}
              </Link>
            </motion.div>

            <motion.span
              variants={staggerItem}
              className="w-fit rounded-full bg-[#e7a380] px-3 py-0.5 text-xs text-[#69381d]"
            >
              {localizedArticle.tag}
            </motion.span>

            <motion.h1
              variants={staggerItem}
              className="font-serif text-3xl font-bold tracking-tight text-brand-brown sm:text-4xl lg:text-5xl"
            >
              {localizedArticle.title}
            </motion.h1>

            <motion.p variants={staggerItem} className="text-sm text-brand-brown-deep">
              {t.articleDetail.published} {formatDate(article.publishedAt, locale)}
            </motion.p>
          </div>
        </motion.header>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-16"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_0_rgba(107,58,31,0.15)]">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-16 lg:py-16"
        >
          {locale === "fr" && (
            <motion.p
              variants={staggerItem}
              className="rounded-lg border border-brand-line/40 bg-brand-sand/50 px-4 py-3 text-sm text-brand-brown-deep italic"
            >
              {t.articleDetail.englishOnlyNote}
            </motion.p>
          )}
          {article.body.map((paragraph, index) => (
            <motion.p
              key={index}
              variants={staggerItem}
              className="text-lg leading-loose text-brand-brown-deep"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </article>

      {localizedRelated.length > 0 && (
        <section className="border-t border-brand-line/30 bg-brand-cream-alt px-4 py-16 sm:px-6 lg:px-16 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            <h2 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">
              {t.articleDetail.moreIn} {categoryTitle}
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {localizedRelated.map((related, index) => (
                <ArticleCard
                  key={related.slug}
                  article={related}
                  categorySlug={category.slug}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
