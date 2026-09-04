/**
 * Typed calls into the real mukalimv2-backend admin API. Grows one function
 * (and response type) per endpoint as each mock data domain in
 * `AdminDataContext.tsx` gets replaced — see that file's seed data for the
 * mock shapes these are retiring.
 *
 * Response shapes here are taken from the backend's actual source
 * (services/controllers/routes), not `docs/API_ENDPOINTS.md` — that doc has
 * drifted from the implementation in places. Notably: the doc lists activity
 * at `GET /api/admin/activity` (404 in practice); the real router mounts it
 * at `GET /api/admin/dashboard/activity` (`adminDashboardRoutes.ts`).
 */

import { api } from "@/lib/api/client";
import type { AdminRole, ContentStatus, Language, LocalizedText, UserStatus } from "./types";

export interface DashboardStats {
  totalCategories: number;
  totalContentItems: number;
  draftsPending: number;
  totalMediaFiles: number;
}

export function getDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>("/admin/dashboard/stats");
}

/**
 * One row from `GET /admin/dashboard/activity`. Field names differ from the
 * old mock `ActivityEntry` type: `actor` → `actorName`, `target` →
 * `targetLabel`, `timestamp` → `createdAt`; `actorName` is nullable because
 * it's a left join against `users` (a deleted actor leaves it null, the row
 * itself is kept).
 */
export interface AdminActivityEntry {
  id: string;
  actorUserId: string;
  actorName: string | null;
  actorRole: AdminRole;
  action: string;
  targetLabel: string;
  createdAt: string;
}

interface ListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getActivity(limit?: number): Promise<{ data: AdminActivityEntry[]; meta: ListMeta }> {
  const query = limit ? `?limit=${limit}` : "";
  return api.get(`/admin/dashboard/activity${query}`);
}

// ---- Categories ----
//
// Real shape (src/db/schema/categories.ts + categoryService.ts,
// attachTranslationsAndCount) differs from the old mock `AdminCategory`:
// the icon field is `iconUrl` not `icon`, and there are two fields the mock
// never had at all — `heroImageUrl`/`heroImageAlt` (the public category
// page's hero banner image + alt text, per locale). The admin form has no
// UI for either yet — every category keeps the schema's default hero image
// until that's built.
//
// Also: despite docs/API_ENDPOINTS.md documenting a 409 on duplicate slug,
// `categoryService.create`/`update` never throw one — `ensureUniqueSlug`
// silently appends "-2", "-3", etc. instead. Don't build 409-duplicate-slug
// handling for categories; it can't happen.

export interface AdminCategory {
  id: string;
  slug: string;
  iconUrl: string;
  heroImageUrl: string;
  heroImageAlt: LocalizedText;
  displayOrder: number;
  active: boolean;
  name: LocalizedText;
  description: LocalizedText;
  contentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: LocalizedText;
  description: LocalizedText;
  heroImageAlt?: LocalizedText;
  slug?: string;
  iconUrl: string;
  heroImageUrl?: string;
  displayOrder: number;
  active: boolean;
}

export function listCategories(): Promise<{ data: AdminCategory[] }> {
  return api.get("/admin/categories");
}

export function createCategory(input: CategoryInput): Promise<AdminCategory> {
  return api.post("/admin/categories", input);
}

export function updateCategory(id: string, patch: Partial<CategoryInput>): Promise<AdminCategory> {
  return api.patch(`/admin/categories/${id}`, patch);
}

export function toggleCategoryActive(id: string): Promise<AdminCategory> {
  return api.patch(`/admin/categories/${id}/toggle-active`);
}

export function deleteCategory(id: string): Promise<void> {
  return api.delete(`/admin/categories/${id}`);
}

// ---- Content ----
//
// The mock `AdminContentItem` was missing three fields the real API
// actually requires/returns (content.ts schema + contentService.ts):
//   - `slug` — required in the DB, optional in the request (auto-derived
//     from title.en if omitted, same UX as category slugs); always present
//     in the response, unique per category.
//   - `tag` — REQUIRED non-empty string on create, no default. Drives the
//     public article-card badge and tag filter dropdown. Not optional —
//     added a real input for it, can't be silently omitted.
//   - `excerpt` — required `LocalizedText` on create (all 4 locale keys,
//     empty string values allowed), shown on public article cards. Added as
//     a real per-locale field alongside title/body.
// `publishedAt` is the fourth field the doc flagged — it is NOT a request
// field at all, on create or update. It's set server-side the first time
// `status` transitions to "published" and never touched again. No form
// input for it; it's response-only (surfaced read-only where useful).
export interface AdminContentItem {
  id: string;
  categoryId: string;
  slug: string;
  tag: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  featuredImage: string;
  body: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  status: ContentStatus;
  authorId: string | null;
  author: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentInput {
  categoryId: string;
  slug?: string;
  tag: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  featuredImage: string;
  body: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  status: ContentStatus;
}

export interface ListContentParams {
  category?: string;
  status?: ContentStatus;
  language?: Language;
  page?: number;
  limit?: number;
}

export function listContent(params: ListContentParams = {}): Promise<{ data: AdminContentItem[]; meta: ListMeta }> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.status) qs.set("status", params.status);
  if (params.language) qs.set("language", params.language);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return api.get(`/admin/content${query ? `?${query}` : ""}`);
}

export function getContentItem(id: string): Promise<AdminContentItem> {
  return api.get(`/admin/content/${id}`);
}

export function createContent(input: ContentInput): Promise<AdminContentItem> {
  return api.post("/admin/content", input);
}

export function updateContent(id: string, patch: Partial<ContentInput>): Promise<AdminContentItem> {
  return api.patch(`/admin/content/${id}`, patch);
}

export function deleteContent(id: string): Promise<void> {
  return api.delete(`/admin/content/${id}`);
}

// ---- Media ----
//
// This is the closest match to the mock of any domain so far — `AdminMediaItem`
// already had the right shape (`filename`, `url`, `sizeKb`, `width`, `height`,
// `altText: LocalizedText`, `usedIn: string[]`). Real additions: `uploadedBy`
// (nullable uploader id). `usedIn` is computed live on every read (categories
// whose iconUrl/heroImageUrl match, content items whose featuredImage
// matches) — never hand-maintained — and its string format ("cosmetics
// category", "'some-slug' article") already matches what the mock hardcoded.
//
// DELETE now blocks with 409 when a category's iconUrl/heroImageUrl or a
// content item's featuredImage matches this file's url — mirrors category
// delete's block-on-linked-content check, added after an initial pass
// confirmed the API allowed silent orphaning here. It's a plain string
// match against those three URL columns (`mediaService.remove`), not a
// foreign key — there's no FK from categories/content_items to media at
// all, so a file renamed/moved outside this system (e.g. direct DB edit,
// future S3 migration) could desync from the match and let a still-used
// file through. A real FK-based reference (storing a media id instead of a
// raw URL string in those columns) is the correct long-term fix; flagged
// as a follow-up once the frontend migration is done, not done now.
export interface AdminMediaItem {
  id: string;
  filename: string;
  url: string;
  sizeKb: number;
  width: number;
  height: number;
  uploadedBy: string | null;
  uploadedAt: string;
  altText: LocalizedText;
  usedIn: string[];
}

export interface ListMediaParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function listMedia(params: ListMediaParams = {}): Promise<{ data: AdminMediaItem[]; meta: ListMeta }> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return api.get(`/admin/media${query ? `?${query}` : ""}`);
}

/** Real upload — multipart/form-data, repeated `files` field (up to 20 at
 * once), image MIME types only, 10MB/file max (enforced server-side via
 * multer, in `middleware/upload.ts`). Width/height in the response are read
 * server-side (sharp), never trusted from the client. */
export function uploadMedia(files: File[]): Promise<{ data: AdminMediaItem[] }> {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);
  return api.post("/admin/media", formData);
}

export function updateMediaAltText(id: string, altText: LocalizedText): Promise<AdminMediaItem> {
  return api.patch(`/admin/media/${id}/alt-text`, { altText });
}

export function deleteMedia(id: string): Promise<void> {
  return api.delete(`/admin/media/${id}`);
}

// ---- Users ----
//
// Admin-only across every route (view + every mutation) — enforced
// server-side (`requireAdmin`), the frontend hiding the nav item is not the
// real gate. Shape is close to the mock: `lastLogin` renamed `lastLoginAt`,
// plus `createdAt`/`updatedAt` the mock never had. `avatarColor` already
// matches — the backend assigns one of 4 Tailwind class tokens on invite,
// same convention the mock used.
//
// Invite still has no real email delivery (see backend README's Auth
// notes) — `POST /admin/users` returns the raw `inviteToken` directly in
// the response, and there is no accept-invite UI page anywhere in this
// frontend, only the raw `POST /api/auth/accept-invite` endpoint. Until
// that page exists, the admin has no in-app way to deliver this beyond
// copying the token themselves — surfaced as-is, not hidden behind a fake
// "invite sent" message.
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: UserStatus;
  avatarColor: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function listUsers(): Promise<{ data: AdminUser[] }> {
  return api.get("/admin/users");
}

export interface InviteUserInput {
  name: string;
  email: string;
  role: AdminRole;
}

export function inviteUser(input: InviteUserInput): Promise<{ user: AdminUser; inviteToken: string }> {
  return api.post("/admin/users", input);
}

export interface UpdateUserInput {
  name?: string;
  role?: AdminRole;
  status?: UserStatus;
}

/** Role/status changes both go through this one PATCH — the backend has no
 * separate toggle endpoint for users the way categories do. Blocked
 * server-side with 409 if it would leave zero non-disabled admins (changing
 * the last admin's role away from admin, or disabling them). */
export function updateUser(id: string, patch: UpdateUserInput): Promise<AdminUser> {
  return api.patch(`/admin/users/${id}`, patch);
}

/** 403 if `id` is the caller's own account; 409 if `id` is the last
 * remaining (non-disabled) admin. */
export function deleteUser(id: string): Promise<void> {
  return api.delete(`/admin/users/${id}`);
}
