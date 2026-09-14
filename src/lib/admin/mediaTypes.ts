/**
 * Client-side mirror of the backend's media upload allowlist
 * (`mukalimv2-backend`'s upload validation, confirmed live via a 400
 * `VALIDATION_ERROR` for `image/svg+xml`). SVG was removed from the
 * backend's allowlist entirely, it can carry embedded `<script>` tags, so
 * it's removed here too, giving immediate client-side feedback instead of
 * a confusing server error after the user has already picked the file.
 *
 * Single source of truth for every image-upload entry point
 * (`MediaUploadZone`, `CategoryFormPanel`, `ContentEditor`) so the three
 * don't drift out of sync with each other or with the backend again.
 */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

/** For the `<input accept>` attribute, restricts the OS file picker. */
export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(",");

/** For user-facing copy near the file input. */
export const ACCEPTED_IMAGE_LABEL = "PNG, JPG, WebP, or GIF";

export function isAcceptedImageType(file: File): boolean {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

/** Message shown when a rejected file (SVG or anything else non-image) is
 * selected via click or drag-and-drop, `accept` alone doesn't stop
 * drag-and-drop, and some browsers/pickers don't enforce `accept` strictly
 * either. */
export const REJECTED_FILE_TYPE_MESSAGE = `Unsupported file type. Allowed: ${ACCEPTED_IMAGE_LABEL}.`;
