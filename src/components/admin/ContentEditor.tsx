"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import type { ContentStatus, Language, LocalizedText } from "@/lib/admin/types";
import { emptyLocalizedText } from "@/lib/admin/types";
import {
  createContent,
  updateContent,
  listCategories,
  uploadMedia,
  type AdminContentItem,
  type AdminCategory,
} from "@/lib/admin/api";
import { ApiError, isBackendMediaUrl, resolveMediaUrl } from "@/lib/api/client";
import Breadcrumbs from "./Breadcrumbs";
import LanguageTabs from "./LanguageTabs";
import Select from "./Select";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface ContentEditorProps {
  item: AdminContentItem | null;
}

/**
 * Callers key this by `item?.id ?? "new"` (see the two route pages) so each
 * item gets a fresh instance — form state is computed once from `item` via
 * lazy `useState` initializers rather than a reset-on-prop-change effect.
 */
export default function ContentEditor({ item }: ContentEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [activeLang, setActiveLang] = useState<Language>("en");
  const [title, setTitle] = useState<LocalizedText>(() => item?.title ?? emptyLocalizedText());
  const [excerpt, setExcerpt] = useState<LocalizedText>(() => item?.excerpt ?? emptyLocalizedText());
  const [body, setBody] = useState<LocalizedText>(() => item?.body ?? emptyLocalizedText());
  const [seoTitle, setSeoTitle] = useState<LocalizedText>(() => item?.seoTitle ?? emptyLocalizedText());
  const [seoDescription, setSeoDescription] = useState<LocalizedText>(() => item?.seoDescription ?? emptyLocalizedText());
  const [slug, setSlug] = useState(() => item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(() => item !== null);
  const [tag, setTag] = useState(() => item?.tag ?? "");
  const [categoryId, setCategoryId] = useState(() => item?.categoryId ?? "");
  const [featuredImage, setFeaturedImage] = useState(() => item?.featuredImage ?? "/mukalim/articles/art-turmeric.jpg");
  const [status, setStatus] = useState<ContentStatus>(() => item?.status ?? "draft");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCategories()
      .then((res) => {
        setCategories(res.data);
        // New item, no category picked yet — default to the first one so
        // the (required) categoryId always has a valid value to submit.
        setCategoryId((current) => current || res.data[0]?.id || "");
      })
      .catch((err: unknown) => {
        setCategoriesError(err instanceof ApiError ? err.message : "Failed to load categories.");
      });
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle((prev) => ({ ...prev, [activeLang]: value }));
    if (activeLang === "en" && !slugTouched) setSlug(slugify(value));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const { data } = await uploadMedia([file]);
      const uploaded = data[0];
      if (uploaded) setFeaturedImage(uploaded.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryId) {
      setError("Choose a category.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const payload = { categoryId, slug, tag, title, excerpt, featuredImage, body, seoTitle, seoDescription, status };
    try {
      if (item) {
        await updateContent(item.id, payload);
      } else {
        await createContent(payload);
      }
      router.push("/admin/content");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save content.");
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Content", href: "/admin/content" },
            { label: item ? "Edit" : "New" },
          ]}
        />
        <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">
          {item ? "Edit Content" : "Add Content"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-brand-line/30 bg-white p-6 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
            <LanguageTabs active={activeLang} onChange={setActiveLang} fields={[title, excerpt, body, seoTitle, seoDescription]} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Title ({activeLang.toUpperCase()})</label>
              <input
                value={title[activeLang]}
                onChange={(event) => handleTitleChange(event.target.value)}
                required={activeLang === "en"}
                placeholder="e.g. Turmeric: The Golden Healer"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Excerpt ({activeLang.toUpperCase()})</label>
              <textarea
                value={excerpt[activeLang]}
                onChange={(event) => setExcerpt((prev) => ({ ...prev, [activeLang]: event.target.value }))}
                rows={2}
                placeholder="Short summary shown on article cards"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Body ({activeLang.toUpperCase()})</label>
              <textarea
                value={body[activeLang]}
                onChange={(event) => setBody((prev) => ({ ...prev, [activeLang]: event.target.value }))}
                rows={10}
                placeholder="Article body — a plain styled textarea stands in for a rich text editor during the design phase."
                className={`${inputClass} resize-y font-serif leading-relaxed`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-brand-line/30 bg-white p-6 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
            <h2 className="font-serif text-lg font-bold text-brand-brown">SEO ({activeLang.toUpperCase()})</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Meta Title</label>
              <input
                value={seoTitle[activeLang]}
                onChange={(event) => setSeoTitle((prev) => ({ ...prev, [activeLang]: event.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Meta Description</label>
              <textarea
                value={seoDescription[activeLang]}
                onChange={(event) => setSeoDescription((prev) => ({ ...prev, [activeLang]: event.target.value }))}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-brand-line/30 bg-white p-6 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Category</label>
              <Select
                value={categoryId}
                onChange={setCategoryId}
                options={categories.map((category) => ({ value: category.id, label: category.name.en || category.name.fr }))}
                className={inputClass}
              />
              {categoriesError && <p className="text-xs text-admin-terracotta">{categoriesError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Slug</label>
              <input
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                required
                placeholder="turmeric-the-golden-healer"
                className={`${inputClass} font-mono`}
              />
              <p className="text-xs text-admin-warm-grey">
                Auto-filled from the English title — editable, unique per category. A duplicate gets a numeric
                suffix automatically.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Tag</label>
              <input
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                required
                placeholder="e.g. Botanical"
                className={inputClass}
              />
              <p className="text-xs text-admin-warm-grey">
                Shown as the badge on article cards; also what the public tag filter matches against.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-brown">Featured Image</span>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-admin-cream">
                <Image
                  src={resolveMediaUrl(featuredImage)}
                  alt=""
                  fill
                  sizes="360px"
                  className="object-cover"
                  unoptimized={isBackendMediaUrl(featuredImage)}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex items-center justify-center gap-2 rounded-xl border border-brand-line/40 px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:border-brand-gold hover:bg-brand-gold/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ImagePlus className="size-4" />
                {uploadingImage ? "Uploading…" : "Replace image"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <p className="text-xs text-admin-warm-grey">PNG, JPG, WebP, GIF, or SVG — 10MB max.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-brown">Status</span>
              <div className="flex rounded-xl border border-brand-line/40 bg-admin-cream p-1">
                {(["draft", "published"] as ContentStatus[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatus(option)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                      status === option ? "bg-white text-brand-brown shadow-sm" : "text-admin-warm-grey"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {/* publishedAt is set server-side the first time status flips to
                  "published" and is never a request field — display-only. */}
              {item?.publishedAt && (
                <p className="text-xs text-admin-warm-grey">First published {formatDate(item.publishedAt)}</p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-admin-terracotta">{error}</p>}

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full rounded-xl bg-brand-gold px-5 py-3 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : item ? "Save Changes" : "Create Content"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/content")}
              className="w-full rounded-xl px-5 py-3 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-brown/5"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
