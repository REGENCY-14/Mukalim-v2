import { PublicCategoriesProvider } from "@/lib/site/PublicCategoriesContext";
import { listPublicCategories } from "@/lib/publicApi";

/**
 * Route group covering every public-facing page (homepage, category pages,
 * article pages, sign-in) — `/admin/*` is a separate top-level segment and
 * never sees this fetch. Fetches the category list once, server-side, and
 * hands it to `PublicCategoriesProvider` so `TopNavBar`/`Footer`/
 * `CategoryGrid` all read from one source instead of each fetching
 * independently — see that file for the French-locale correction.
 *
 * `revalidate = 60` here applies to every page in this group via Next's
 * segment-config inheritance (the most restrictive value in the tree wins),
 * including the homepage and sign-in, which previously had no revalidation
 * config of their own — this closes the same "cached forever" gap the
 * `[category]` pages had, for the nav/footer/grid's category data too.
 */
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await listPublicCategories()
    .then((res) => res.data)
    .catch(() => []);

  return <PublicCategoriesProvider initialCategories={categories}>{children}</PublicCategoriesProvider>;
}
