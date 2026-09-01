"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import type { AdminContentItem, ContentStatus, Language, LocalizedText } from "@/lib/admin/types";
import { emptyLocalizedText } from "@/lib/admin/types";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import Breadcrumbs from "./Breadcrumbs";
import LanguageTabs from "./LanguageTabs";
import Select from "./Select";

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
  const { categories, addContent, updateContent } = useAdminData();
  const { session } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeLang, setActiveLang] = useState<Language>("en");
  const [title, setTitle] = useState<LocalizedText>(() => item?.title ?? emptyLocalizedText());
  const [body, setBody] = useState<LocalizedText>(() => item?.body ?? emptyLocalizedText());
  const [seoTitle, setSeoTitle] = useState<LocalizedText>(() => item?.seoTitle ?? emptyLocalizedText());
  const [seoDescription, setSeoDescription] = useState<LocalizedText>(() => item?.seoDescription ?? emptyLocalizedText());
  const [categoryId, setCategoryId] = useState(() => item?.categoryId ?? categories[0]?.id ?? "");
  const [featuredImage, setFeaturedImage] = useState(() => item?.featuredImage ?? "/mukalim/articles/art-turmeric.jpg");
  const [status, setStatus] = useState<ContentStatus>(() => item?.status ?? "draft");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFeaturedImage(URL.createObjectURL(file));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    const actor = { name: session.name, role: session.role };
    const payload = { title, categoryId, featuredImage, body, seoTitle, seoDescription, status, author: session.name };
    if (item) {
      updateContent(item.id, payload, actor);
    } else {
      addContent(payload, actor);
    }
    router.push("/admin/content");
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
            <LanguageTabs active={activeLang} onChange={setActiveLang} fields={[title, body, seoTitle, seoDescription]} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Title ({activeLang.toUpperCase()})</label>
              <input
                value={title[activeLang]}
                onChange={(event) => setTitle((prev) => ({ ...prev, [activeLang]: event.target.value }))}
                required={activeLang === "en"}
                placeholder="e.g. Turmeric: The Golden Healer"
                className={inputClass}
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
              <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={`${inputClass} pr-9`}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name.en || category.name.fr}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-brand-brown">Featured Image</span>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-admin-cream">
                <Image
                  src={featuredImage}
                  alt=""
                  fill
                  sizes="360px"
                  className="object-cover"
                  unoptimized={featuredImage.startsWith("blob:")}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-brand-line/40 px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:border-brand-gold hover:bg-brand-gold/5"
              >
                <ImagePlus className="size-4" />
                Replace image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-gold px-5 py-3 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.01]"
            >
              {item ? "Save Changes" : "Create Content"}
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
