# Mukalim — Database Schema

Derived directly from the frontend's mock data layer (`src/lib/admin/types.ts`,
`src/lib/admin/mockData.ts`) and the public site's static content
(`src/lib/categories.ts`). Written as relational tables (Postgres-flavored
SQL types), but the same shapes map cleanly onto a document store if that's
the direction the backend takes — each "table" below is one entity.

**⚠️ Read [Reconciliation notes](#reconciliation-notes-read-this-first) before
building against this** — the admin mock model and the public site's actual
content needs currently disagree on a few fields, and this schema resolves
those in favor of what the frontend will actually need once it's wired to a
real API.

---

## Conventions

- **IDs**: `uuid` everywhere (mock data uses strings like `cat-1`, `content-3`
  — those were just seed convenience, not a real ID scheme).
- **Timestamps**: `timestamptz`, always UTC, ISO 8601 on the wire.
- **Soft vs hard delete**: the frontend has no "trash/restore" UI anywhere —
  every delete action (`deleteCategory`, `deleteContent`, `deleteMedia`,
  `deleteUser`) is a real, immediate delete in the mock layer. Hard-delete is
  fine unless the backend wants soft-delete for audit purposes; if so, filter
  it out everywhere the frontend expects a delete to be final.
- **i18n strategy**: the admin dashboard authors content in **4 languages**
  (`fr`, `en`, `de`, `it` — see `LANGUAGES` in `types.ts`), always via the same
  `LocalizedText` shape (`{ fr, en, de, it }`, empty string = not yet
  translated). Modeled below as a `*_translations` child table per
  translatable entity (`category_translations`, `content_translations`,
  `media_translations`) rather than 4 columns per field — cleaner to add a
  5th language later, and matches how `localizedCompleteness()` already
  counts non-empty entries generically.

---

## Tables

### `users`

Admin dashboard accounts. **Not** the same thing as a public-site customer
account — there is no customer-facing account system in this build (the
public `/sign-in` page exists only to authenticate into the admin dashboard;
see `DEMO_CREDENTIALS` in `AdminAuthContext.tsx`).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` NOT NULL | |
| `email` | `citext` UNIQUE NOT NULL | |
| `password_hash` | `text` NOT NULL | bcrypt/argon2 — the mock has one hardcoded plaintext demo password, obviously not real auth |
| `role` | `enum('admin','editor','viewer')` NOT NULL | see `AdminRole` in `types.ts` |
| `status` | `enum('active','invited','disabled')` NOT NULL DEFAULT `'invited'` | a freshly-invited user starts `invited` — see `addUser` in `AdminDataContext.tsx` |
| `avatar_color` | `text` | a Tailwind class token in the mock (`bg-brand-gold`, etc.) purely for the initials-avatar background; store a small enum/token, not a hex, so the frontend's existing palette keeps working |
| `last_login_at` | `timestamptz` NULL | `NULL` until first login |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | |
| `updated_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

**Business rules seen in the frontend:**
- Only `role = 'admin'` can view/manage `/admin/users` (`canManageUsers()` in
  `permissions.ts`) — enforce server-side too, not just hide the nav item.
- `editor` and `admin` can create/edit/delete content, categories, media;
  `viewer` is read-only everywhere (`canEdit()` in `permissions.ts`).
- The seed data has one user (`u1`) whose row-level delete button is disabled
  in the UI — the real rule is almost certainly "can't delete yourself" and/or
  "can't delete the last remaining admin"; enforce whichever server-side.

---

### `categories`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `slug` | `text` UNIQUE NOT NULL | auto-derived from the English name client-side (`slugify()` in `CategoryFormPanel.tsx`) but editable — validate uniqueness server-side regardless |
| `icon_url` | `text` NOT NULL | path/URL to an SVG or image; defaults to a preset (`/mukalim/icon-cosmetics.svg`) but is freely replaceable via file upload in the form |
| `display_order` | `integer` NOT NULL DEFAULT `1` | drives nav/grid ordering |
| `active` | `boolean` NOT NULL DEFAULT `true` | inactive categories are hidden from the public site but stay in the admin list (`toggleCategoryActive`) |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | |
| `updated_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

Derived, not stored: **`content_count`** (`AdminCategory.contentCount` in the
mock) — compute as `count(content_items where category_id = categories.id)`
rather than maintaining a counter column; the mock increments/decrements it
by hand on every content add/delete specifically because it has no real
queries available, a real backend shouldn't copy that.

#### `category_translations`

| Column | Type | Notes |
|---|---|---|
| `category_id` | `uuid` FK → `categories.id` ON DELETE CASCADE | |
| `locale` | `enum('fr','en','de','it')` | |
| `name` | `text` NOT NULL DEFAULT `''` | |
| `description` | `text` NOT NULL DEFAULT `''` | shown on the category hero (`CategoryHero.tsx`) |

`PRIMARY KEY (category_id, locale)`. English (`en`) should be treated as the
required/fallback locale everywhere — every localize helper in
`src/lib/i18n/translations.ts` falls back to `.en` when a translation is
missing, e.g. `category.name.en || category.name.fr`.

---

### `content_items`

The admin dashboard's "Content" CRUD (`ContentEditor.tsx`,
`AdminContentItem` in `types.ts`) and the public site's articles
(`CategoryArticle` in `categories.ts`) are **currently two separate,
disconnected data shapes** in the mock build — see
[Reconciliation notes](#reconciliation-notes-read-this-first). This table is
the unified shape both should read from.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `category_id` | `uuid` FK → `categories.id` NOT NULL | |
| `slug` | `text` NOT NULL | **not in the current admin mock model** — required for public article URLs (`/[category]/[article]`); unique per `category_id` |
| `tag` | `text` NOT NULL | **not in the current admin mock model** — the badge shown on article cards (e.g. "Botanical", "Root") and the exact value the public Filter-by-tag dropdown filters on (`FilterBar.tsx`) |
| `excerpt` | `text` NOT NULL DEFAULT `''` | **not in the current admin mock model** — the card-preview summary (`ArticleCard.tsx`); distinct from the full body |
| `featured_image_url` | `text` NOT NULL | |
| `status` | `enum('draft','published')` NOT NULL DEFAULT `'draft'` | the public site must only ever serve `published` items |
| `author_id` | `uuid` FK → `users.id` NULL | the mock only stores an author *name* string; store the FK and resolve the display name server-side so it survives a user rename |
| `published_at` | `timestamptz` NULL | **not in the current admin mock model** — the public site sorts by this for "Newest"/"Oldest" (`CategoryArticles.tsx`); set on first transition to `status = 'published'`, not on every edit |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | |
| `updated_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

#### `content_translations`

| Column | Type | Notes |
|---|---|---|
| `content_id` | `uuid` FK → `content_items.id` ON DELETE CASCADE | |
| `locale` | `enum('fr','en','de','it')` | |
| `title` | `text` NOT NULL DEFAULT `''` | |
| `body` | `text` NOT NULL DEFAULT `''` | the admin editor is a plain textarea today ("stands in for a rich text editor" — comment in `ContentEditor.tsx`); the public article template renders body as **an array of paragraphs** (`CategoryArticle.body: string[]`). Store as markdown or HTML and have the API split-on-blank-line (or the frontend do it) — don't store `text[]` directly, a rich text editor will need real markup eventually anyway. |
| `seo_title` | `text` NOT NULL DEFAULT `''` | |
| `seo_description` | `text` NOT NULL DEFAULT `''` | |

`PRIMARY KEY (content_id, locale)`.

---

### `media`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `filename` | `text` NOT NULL | original upload filename, shown as the slide-over panel title |
| `url` | `text` NOT NULL | wherever the file actually lives (S3/Cloudinary/etc.) |
| `size_kb` | `integer` NOT NULL | |
| `width` | `integer` NOT NULL | |
| `height` | `integer` NOT NULL | read from the file on upload, not user-entered — see `readImageDimensions()` in `media/page.tsx` |
| `uploaded_by` | `uuid` FK → `users.id` NULL | |
| `uploaded_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

**Upload constraints from the frontend** (`MediaUploadZone.tsx`): image types
only, **max 10MB per file**, multi-file select/drag-drop supported — enforce
both client- and server-side.

#### `media_translations`

| Column | Type | Notes |
|---|---|---|
| `media_id` | `uuid` FK → `media.id` ON DELETE CASCADE | |
| `locale` | `enum('fr','en','de','it')` | |
| `alt_text` | `text` NOT NULL DEFAULT `''` | |

`PRIMARY KEY (media_id, locale)`.

#### `media_usage` (derived, not hand-maintained)

The mock's `AdminMediaItem.usedIn: string[]` is just seeded label strings
("Cosmetics category", "Turmeric article") with no real referential link.
Don't copy that — compute usage properly:

| Column | Type | Notes |
|---|---|---|
| `media_id` | `uuid` FK → `media.id` | |
| `entity_type` | `enum('category_icon','content_featured_image')` | |
| `entity_id` | `uuid` | polymorphic reference to `categories.id` or `content_items.id` depending on `entity_type` |

Populate/depopulate this whenever `categories.icon_url` or
`content_items.featured_image_url` is set to point at a `media.url` — or,
simpler, just compute "used in" on read with two `EXISTS` queries against
`categories`/`content_items` instead of maintaining a join table at all.

---

### `activity_log`

Powers the dashboard's "Recent Activity" feed and the topbar notification
panel (both read the same `activity` array — `dashboard/page.tsx`,
`Topbar.tsx`). Every mutation in `AdminDataContext.tsx` writes one row of
this immediately alongside its main effect, in the same shape.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `actor_user_id` | `uuid` FK → `users.id` NOT NULL | |
| `actor_role` | `enum('admin','editor','viewer')` NOT NULL | snapshot the role **at the time of the action** (the dev-only "preview as" role switcher can change a session's effective role without changing the underlying user) |
| `action` | `text` NOT NULL | short verb phrase as already written in the mock, e.g. `"created the"`, `"updated"`, `"set to draft"`, `"uploaded"`, `"invited"`, `"removed"` — keep these consistent, the frontend concatenates `actor + action + target` directly into a sentence |
| `target_label` | `text` NOT NULL | human-readable target, e.g. `"'Turmeric: The Golden Healer'"` — the mock pre-formats quotes/labels into this string; consider instead storing `target_type` + `target_id` and letting the API format the label, so a renamed category doesn't leave stale label text in old log entries |
| `created_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

Sorted newest-first, unbounded in the mock; paginate this in the real API
(the notification panel only ever shows the 6 most recent — `activity.slice(0, 6)`).

---

### `settings`

Singleton — exactly one row, no `id` needed beyond a fixed key, or just make
it `id = 1` / a well-known UUID.

| Column | Type | Notes |
|---|---|---|
| `site_name` | `text` NOT NULL | |
| `default_language` | `enum('fr','en','de','it')` NOT NULL | |
| `contact_email` | `citext` NOT NULL | |
| `social_instagram` | `text` NOT NULL DEFAULT `''` | |
| `social_facebook` | `text` NOT NULL DEFAULT `''` | |
| `social_linkedin` | `text` NOT NULL DEFAULT `''` | |
| `updated_at` | `timestamptz` NOT NULL DEFAULT `now()` | |

---

## Indexes

- `content_items (category_id)` — every admin content list and public
  category page filters by this.
- `content_items (status, published_at DESC)` — the public site's
  "Newest"/"Oldest" sort, scoped to published-only.
- `content_items (category_id, slug)` UNIQUE — article detail page lookup
  (`/[category]/[article]`).
- `categories (slug)` UNIQUE — already covered by the column constraint above.
- `activity_log (created_at DESC)` — feed/notification queries.
- `users (email)` UNIQUE — already covered above; also the login lookup path.

---

## Reconciliation notes (read this first)

Two real gaps exist between what's mocked today and what the frontend
actually renders — both are resolved in the schema above, but flagging them
explicitly since they're easy to miss just skimming `types.ts`:

1. **`AdminContentItem` (admin mock) is missing fields the public site
   requires**: `slug`, `tag`, `excerpt`, `published_at`. The admin content
   editor currently has no UI for any of these — they'll need new form
   fields in `ContentEditor.tsx` alongside the backend work. `tag` in
   particular is load-bearing: it's exactly what the public Filter-by
   dropdown filters on.

2. **Locale mismatch**: the admin dashboard authors in 4 languages
   (`fr`/`en`/`de`/`it`), but the public site's own language switcher only
   ships 2 (`en`/`fr` — `Locale` type in `LocaleContext.tsx`). Decide
   whether `de`/`it` content is (a) authored ahead of a future public launch
   in those languages, or (b) not meant to exist yet and the admin dashboard
   should only show `fr`/`en` tabs until then. Either is a legitimate
   product call — just isn't something the current frontend code decides on
   its own.
