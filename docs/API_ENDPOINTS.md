# Mukalim — API Endpoints

Derived directly from every read/write the frontend currently does against
its mock layer (`AdminDataContext.tsx`, `AdminAuthContext.tsx`) and its
static content (`src/lib/categories.ts`). Pairs with
[`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — read that first if a field
below looks unfamiliar, especially the **Reconciliation notes** at the
bottom of it.

---

## Conventions

- **Base path**: `/api` — public endpoints are unauthenticated,
  everything under `/api/admin/*` requires a session.
- **Auth**: cookie-based session (httpOnly, secure) is the natural fit —
  the frontend's current mock session is itself just a client-stored object
  with no token concept, so there's no existing bearer-token assumption to
  preserve. A signed httpOnly cookie also sidesteps needing to expose a
  token to client JS at all.
- **Role gate**: two tiers used throughout the admin UI
  (`permissions.ts`) — `canEdit` (`admin` or `editor`: can write) and
  `canManageUsers` (`admin` only). Each admin endpoint below states which
  applies. **Enforce these server-side** — the current build only hides UI
  for `viewer`/non-admin, it doesn't block anything at a data layer because
  there is no data layer yet.
- **Errors**: a consistent shape, e.g. `{ "error": { "code": "...",
  "message": "..." } }`, with standard HTTP status codes (`400` validation,
  `401` no session, `403` wrong role, `404` not found, `409` conflict e.g.
  duplicate slug/email).
- **Timestamps**: ISO 8601 UTC on the wire, matching what's already in
  `mockData.ts`.
- **List responses**: wrap in `{ "data": [...], "meta": { ... } }` rather
  than a bare array, so pagination can be added later without a breaking
  change — see the *Pagination* note below.

### Pagination — not yet in the frontend, plan for it anyway

The current build fetches full arrays and filters/sorts entirely
client-side (`CategoryArticles.tsx`, every admin list page). The public
category page even has a "Load More Articles" button
(`CategoryArticles.tsx`) that's **currently non-functional** — no
click handler wired up. That's the intended seam for real pagination:
build list endpoints with `?page=`/`?limit=` (or cursor-based) support now,
and "Load More" becomes a real "fetch next page" call instead of a UI
placeholder.

---

## Auth

### `POST /api/auth/login`

Replaces the hardcoded check in `AdminAuthContext.tsx` (`DEMO_CREDENTIALS`).
Backs the single shared sign-in form used by both the public site and the
admin dashboard (`SignInForm.tsx` — the same page redirects post-login via
its `?next=` param, so this endpoint doesn't need to know which context
triggered it).

- **Auth**: none
- **Body**: `{ "email": string, "password": string }`
- **200**: `{ "user": { "id", "name", "email", "role" } }` + sets session cookie
- **401**: invalid credentials — the frontend shows this inline
  (`t.invalidCredentials` in `SignInForm.tsx`), no need for a distinct
  "wrong password" vs "no such user" message

### `POST /api/auth/logout`

Replaces `logout()` in `AdminAuthContext.tsx` — clears the session.

- **Auth**: session required
- **200**: empty body, clears session cookie

### `GET /api/auth/session`

Replaces reading the client-stored session object on load
(`readSession()` in `AdminAuthContext.tsx`) — the dashboard layout guard
(`(dashboard)/layout.tsx`) needs this to know whether to redirect to
`/sign-in?next=...` before rendering anything.

- **Auth**: session cookie if present
- **200**: `{ "user": { "id", "name", "email", "role" } }`
- **401**: no/expired session

> **Note on the "preview as" role switcher**: `Topbar.tsx` has a dev-only
> control that changes the *effective* role of the current session without
> re-authenticating (`setRole()` in `AdminAuthContext.tsx`). That's
> explicitly a development/demo affordance per the dashboard brief — don't
> build a real endpoint for it; strip it from the frontend before a
> production launch, or gate it behind a build-time flag so it never ships.

---

## Public site (no auth, published content only)

Every endpoint here must only ever return `content_items` where
`status = 'published'` and categories where `active = true` — there is no
"preview draft" flow in the current frontend.

### `GET /api/categories`

Replaces the static `categories` export (`src/lib/categories.ts`) for the
homepage's category grid (`CategoryGrid.tsx`) and nav (`TopNavBar.tsx`).

- **Query**: `?locale=en|fr` (default `en`; falls back to `en` for any
  field missing in the requested locale, matching
  `localizeCategory()` in `translations.ts`)
- **200**: `{ "data": [{ "slug", "navLabel"/"name", "title", "description",
  "heroImage", "heroImageAlt" }] }`, ordered by `display_order`

### `GET /api/categories/:slug`

Single category, for the category page header (`CategoryHero.tsx`).

- **Query**: `?locale=en|fr`
- **200**: same shape as one item above
- **404**: unknown or inactive slug

### `GET /api/categories/:slug/articles`

Backs `CategoryArticles.tsx`'s filter bar — currently all client-side over
a full array, so this is where server-side filtering/sorting/pagination
gets introduced.

- **Query**:
  - `locale=en|fr`
  - `tag=<string>` — exact match against `content_items.tag`; omit for all
  - `sort=newest|oldest|a-z|z-a` (default `newest`) — maps 1:1 to
    `SortOption` in `FilterBar.tsx`
  - `letter=<A-Z>` — first-letter-of-title filter, mirrors
    `AlphabetFilter.tsx`'s client-side behavior; **note the frontend
    currently narrows this to only letters with an available match after
    the tag filter applies** (`availableLetters` in `CategoryArticles.tsx`)
    — either replicate that (return available letters as part of the
    response so the UI can grey out the rest) or move that computation
    fully server-side and return it as `meta.availableLetters`
  - `page=<int>`, `limit=<int>` — see the *Pagination* note above
- **200**: `{ "data": [{ "slug", "title", "tag", "excerpt", "image",
  "imageAlt", "publishedAt" }], "meta": { "total", "page", "limit",
  "availableTags", "availableLetters" } }`

### `GET /api/categories/:slug/articles/:articleSlug`

Article detail page (`/[category]/[article]`, `ArticleDetail.tsx`).

- **Query**: `?locale=en|fr`
- **200**: full article incl. `body` (paragraph array — see the
  reconciliation note on `content_translations.body` in the schema doc for
  how that's derived from stored markup) + `relatedArticles`: same-category
  articles excluding this one (`getRelatedArticles()` in `categories.ts`),
  capped to whatever count the "More in {category}" section actually
  renders
- **404**: unknown category/article slug, or article not `published`

---

## Admin — Categories

Mirrors `AdminDataContext.tsx`'s `addCategory`/`updateCategory`/
`deleteCategory`/`toggleCategoryActive`, consumed by
`categories/page.tsx` + `CategoryFormPanel.tsx`.

### `GET /api/admin/categories`

- **Auth**: session required (any role — Categories list is viewable by
  `viewer` too, per the dashboard brief)
- **200**: `{ "data": [AdminCategory] }` — full `LocalizedText` objects per
  field, not locale-resolved (the admin UI shows/edits all 4 languages via
  tabs — `LanguageTabs.tsx`), plus derived `contentCount`

### `POST /api/admin/categories`

- **Auth**: `canEdit` (admin or editor)
- **Body**: `{ "name": LocalizedText, "description": LocalizedText,
  "heroImageAlt": LocalizedText, "slug", "iconUrl", "heroImageUrl",
  "displayOrder", "active" }` — `heroImageUrl`/`heroImageAlt` are optional
  (default to a placeholder hero image + empty alt); the admin form doesn't
  expose either yet
- **201**: created `AdminCategory`
- **Duplicate slug**: **not** a 409 as originally planned here — the
  implementation (`categoryService.ensureUniqueSlug`) silently appends a
  numeric suffix (`-2`, `-3`, ...) instead and always succeeds. A slug
  conflict is not user-facing at all; don't build error handling for it.

### `PATCH /api/admin/categories/:id`

- **Auth**: `canEdit`
- **Body**: partial patch of the same fields
- **200**: updated `AdminCategory`
- Same duplicate-slug behavior as create (silent suffix, never 409).

### `DELETE /api/admin/categories/:id`

- **Auth**: `canEdit`
- **204**
- **Resolved**: blocks with **409** while any `content_items` still
  reference the category (`"Cannot delete '<slug>' — N content item(s)
  still reference it. Reassign or delete them first."`) — no cascade, no
  reassignment bucket.

### `PATCH /api/admin/categories/:id/toggle-active`

Separate from the general `PATCH` because it's a single-click table-row
action in the UI (no form submit) — modeling it as its own endpoint keeps
the activity-log message accurate ("set to active the '…' category" vs a
generic "updated").

- **Auth**: `canEdit`
- **200**: updated `AdminCategory`

---

## Admin — Content

Mirrors `addContent`/`updateContent`/`deleteContent`, consumed by
`content/page.tsx` + `ContentEditor.tsx`. **Read the schema doc's
reconciliation note first** — `slug`/`tag`/`excerpt`/`publishedAt` need to
be added to the admin content form for these endpoints to be fully usable.

### `GET /api/admin/content`

- **Auth**: session required
- **Query**: `category=<id>`, `status=draft|published`,
  `language=<fr|en|de|it>` (filters to items with a non-empty translation
  in that language — mirrors the exact semantics in `content/page.tsx`:
  `item.title[languageFilter].trim()`), `page`, `limit`
- **200**: `{ "data": [AdminContentItem], "meta": {...} }`

### `POST /api/admin/content`

- **Auth**: `canEdit`
- **Body**: `{ "categoryId", "slug", "tag", "title": LocalizedText,
  "excerpt": LocalizedText, "featuredImage", "body": LocalizedText,
  "seoTitle": LocalizedText, "seoDescription": LocalizedText, "status" }`
- **201**: created item; also increments the owning category's derived
  content count (naturally, since that's computed on read — see schema doc)

### `PATCH /api/admin/content/:id`

- **Auth**: `canEdit`
- **Body**: partial patch
- **200**: updated item — set `published_at` server-side the first time
  `status` transitions to `'published'`, never overwrite it on subsequent
  edits (see schema doc)

### `DELETE /api/admin/content/:id`

- **Auth**: `canEdit`
- **204**

---

## Admin — Media

Mirrors `addMedia`/`updateMediaAltText`/`deleteMedia`, consumed by
`media/page.tsx` + `MediaUploadZone.tsx` + `MediaDetailPanel.tsx`.

### `GET /api/admin/media`

- **Auth**: session required
- **Query**: `category=<id>` (filters by where the image is *used* — see
  `media_usage` in the schema doc), `search=<filename substring>`, `page`,
  `limit`
- **200**: `{ "data": [AdminMediaItem incl. usedIn] }`

### `POST /api/admin/media`

- **Auth**: `canEdit`
- **Body**: `multipart/form-data`, one or more files under a repeated
  `files` field (the frontend already supports multi-select/drag-drop —
  `MediaUploadZone.tsx`)
- **Constraints**: image MIME types only, **10MB max per file** (enforced
  client-side today, must also be enforced server-side)
- **201**: `{ "data": [AdminMediaItem] }` — one entry per uploaded file,
  `width`/`height` read server-side from the file, not trusted from the
  client

### `PATCH /api/admin/media/:id/alt-text`

Separate from a general media `PATCH` because it's the only field the UI
ever edits post-upload (`MediaDetailPanel.tsx` — everything else there is
read-only file metadata).

- **Auth**: `canEdit`
- **Body**: `{ "altText": LocalizedText }`
- **200**: updated item

### `DELETE /api/admin/media/:id`

- **Auth**: `canEdit`
- **204**
- Consider warning/blocking if `media_usage` shows it's still referenced by
  a live category icon or content featured image — the current UI has no
  such warning, but it's the kind of thing worth adding alongside real data.

---

## Admin — Users

Mirrors `addUser`/`updateUser`/`deleteUser`, consumed by `users/page.tsx` +
`InviteUserPanel.tsx`. **Entirely gated to `admin` role** —
`canManageUsers()` — both for viewing the page and every mutation below.

### `GET /api/admin/users`

- **Auth**: `canManageUsers` (admin only)
- **200**: `{ "data": [AdminUser] }`

### `POST /api/admin/users` (invite)

- **Auth**: `canManageUsers`
- **Body**: `{ "name", "email", "role" }`
- **201**: created user with `status: "invited"`, `lastLogin: null` — the
  frontend has no separate "accept invite" flow yet, so decide whether this
  triggers a real invite email + password-setup link, or just creates the
  account directly; either way the mock's immediate-`invited`-status
  behavior should be preserved for the UI to keep working as-is
- **409**: email already exists

### `PATCH /api/admin/users/:id`

- **Auth**: `canManageUsers`
- **Body**: partial patch (role, status, etc. — no dedicated UI for this
  today beyond invite + delete, but `updateUser` exists in the data layer)
- **200**: updated user

### `DELETE /api/admin/users/:id`

- **Auth**: `canManageUsers`
- **204**
- **403** or **409** if targeting the caller's own account, or the last
  remaining `admin` — see the note on the disabled delete button for `u1`
  in the schema doc's `users` section

---

## Admin — Dashboard

### `GET /api/admin/dashboard/stats`

Backs the four stat cards on `dashboard/page.tsx`.

- **Auth**: session required
- **200**: `{ "totalCategories", "totalContentItems", "draftsPending",
  "totalMediaFiles" }` — all simple counts (`draftsPending` = content where
  `status = 'draft'`)

### `GET /api/admin/activity`

Backs both the dashboard's "Recent Activity" panel and the topbar's
notification dropdown (`Topbar.tsx` shows the 6 most recent).

- **Auth**: session required
- **Query**: `limit` (topbar wants 6, dashboard page wants more/all — same
  endpoint, different `limit`), `page` if paginating the full dashboard view
- **200**: `{ "data": [ActivityEntry] }`, newest first

---

## Admin — Settings

Mirrors `updateSettings`, consumed by `settings/page.tsx`. Singleton
resource — no ID in the path.

### `GET /api/admin/settings`

- **Auth**: session required (viewable by all roles; the form itself is
  wrapped in a `<fieldset disabled={!canEdit}>` — `settings/page.tsx` — so
  `viewer` sees it read-only)
- **200**: `AdminSettings`

### `PATCH /api/admin/settings`

- **Auth**: `canEdit`
- **Body**: partial patch
- **200**: updated `AdminSettings`
