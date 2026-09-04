/**
 * Shared types for the admin dashboard's mock data layer.
 *
 * These field names/shapes are deliberately written the way a real API
 * response would look (flat IDs, ISO timestamps, consistent naming) so that
 * swapping `mockData.ts` for real fetch calls later is a drop-in
 * replacement, not a rebuild.
 */

export type AdminRole = "admin" | "editor" | "viewer";

export const ADMIN_ROLES: AdminRole[] = ["admin", "editor", "viewer"];

// TODO(real-api-migration): `AdminCategory` below is the mock shape, still
// used by pages not yet wired to the real backend (content/media/users —
// see AdminDataContext.tsx). The migrated Categories page instead imports a
// differently-shaped `AdminCategory` from `lib/admin/api.ts` (real field
// names: `iconUrl` not `icon`, plus `heroImageUrl`/`heroImageAlt`,
// `createdAt`). Two types, same name, different modules — collapse this one
// away (and update every remaining mock consumer) once every admin page is
// migrated off `AdminDataContext`.

export type Language = "fr" | "en" | "de" | "it";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "it", label: "IT" },
];

/** A field translated into all four site languages. Empty string = not yet translated. */
export type LocalizedText = Record<Language, string>;

export interface AdminCategory {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  displayOrder: number;
  active: boolean;
  contentCount: number;
  updatedAt: string;
}

export type ContentStatus = "draft" | "published";

export interface AdminContentItem {
  id: string;
  categoryId: string;
  title: LocalizedText;
  featuredImage: string;
  body: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  status: ContentStatus;
  author: string;
  updatedAt: string;
}

export interface AdminMediaItem {
  id: string;
  filename: string;
  url: string;
  sizeKb: number;
  width: number;
  height: number;
  usedIn: string[];
  altText: LocalizedText;
  uploadedAt: string;
}

export type UserStatus = "active" | "invited" | "disabled";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: UserStatus;
  lastLogin: string | null;
  avatarColor: string;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  actorRole: AdminRole;
  action: string;
  target: string;
  timestamp: string;
}

export interface AdminSettings {
  siteName: string;
  defaultLanguage: Language;
  contactEmail: string;
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
}

export function emptyLocalizedText(): LocalizedText {
  return { fr: "", en: "", de: "", it: "" };
}

export function localizedCompleteness(text: LocalizedText): number {
  return LANGUAGES.filter((lang) => text[lang.code].trim().length > 0).length;
}
