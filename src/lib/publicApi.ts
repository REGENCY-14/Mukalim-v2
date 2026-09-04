/**
 * Real calls into the mukalimv2-backend's *public* API (`/api/categories/*`
 * — no auth) — replaces the hardcoded data that used to live in
 * `lib/categories.ts` and the homepage's own inline category array.
 *
 * Every one of these endpoints already filters server-side
 * (`categoryService.listPublic`/`getPublic`: `WHERE active = true`;
 * `contentService.listPublicArticles`/`getPublicArticle`:
 * `WHERE status = 'published'`) — there's no RLS layer in this backend, the
 * service functions enforce it directly in the query, so an inactive
 * category or a draft article is never in the response to begin with.
 *
 * Locale: the backend only ever resolves `en`/`fr` here (`PUBLIC_LOCALES` in
 * its `types/localized.ts`) — matches this frontend's own `Locale` type,
 * which never supported anything beyond `en`/`fr` on the public site either
 * (German/Italian are admin-only, for editing `LocalizedText` fields across
 * all 4 locales — never wired into any public page).
 */

import { api, ApiError } from "@/lib/api/client";

export type PublicLocale = "en" | "fr";

export interface PublicCategory {
  slug: string;
  navLabel: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  iconUrl: string;
}

/**
 * A list-row article. Note there's no separate `imageAlt` here — unlike
 * media items (which do have real per-locale alt text), content items have
 * no dedicated image-alt-text field in the schema at all;
 * `contentService.listPublicArticles`/`getPublicArticle` just reuse the
 * article's own title as `imageAlt` (`imageAlt: r.title`). Flagged as a
 * content-model/accessibility gap in the migration report — not something
 * to paper over client-side.
 */
export interface PublicArticleSummary {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  image: string;
  publishedAt: string;
}

export interface PublicArticlesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availableTags: string[];
  availableLetters: string[];
}

export interface PublicArticleDetail {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  body: string[];
  seoTitle: string;
  seoDescription: string;
  image: string;
  publishedAt: string;
  relatedArticles: PublicArticleSummary[];
}

export function listPublicCategories(locale: PublicLocale = "en"): Promise<{ data: PublicCategory[] }> {
  return api.get(`/categories?locale=${locale}`);
}

export function getPublicCategory(slug: string, locale: PublicLocale = "en"): Promise<PublicCategory> {
  return api.get(`/categories/${encodeURIComponent(slug)}?locale=${locale}`);
}

export interface ListArticlesParams {
  locale?: PublicLocale;
  tag?: string;
  sort?: "newest" | "oldest" | "a-z" | "z-a";
  letter?: string;
  page?: number;
  limit?: number;
}

export function listPublicArticles(
  categorySlug: string,
  params: ListArticlesParams = {},
): Promise<{ data: PublicArticleSummary[]; meta: PublicArticlesMeta }> {
  const qs = new URLSearchParams();
  qs.set("locale", params.locale ?? "en");
  qs.set("sort", params.sort ?? "newest");
  if (params.tag) qs.set("tag", params.tag);
  if (params.letter) qs.set("letter", params.letter);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  return api.get(`/categories/${encodeURIComponent(categorySlug)}/articles?${qs.toString()}`);
}

export function getPublicArticle(
  categorySlug: string,
  articleSlug: string,
  locale: PublicLocale = "en",
): Promise<PublicArticleDetail> {
  return api.get(
    `/categories/${encodeURIComponent(categorySlug)}/articles/${encodeURIComponent(articleSlug)}?locale=${locale}`,
  );
}

export function isNotFoundError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}
