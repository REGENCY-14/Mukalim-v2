"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import type { ContentStatus, Language } from "@/lib/admin/types";
import { LANGUAGES } from "@/lib/admin/types";
import {
  listContent,
  listCategories,
  deleteContent as apiDeleteContent,
  type AdminContentItem,
  type AdminCategory,
} from "@/lib/admin/api";
import { ApiError, isBackendMediaUrl, resolveMediaUrl } from "@/lib/api/client";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import { ContentStatusBadge } from "@/components/admin/Badge";
import LanguageDots from "@/components/admin/LanguageDots";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Select from "@/components/admin/Select";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ContentPage() {
  const router = useRouter();
  const { session } = useAdminAuth();
  const editable = session ? canEdit(session.role) : false;

  const [content, setContent] = useState<AdminContentItem[] | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ContentStatus>("all");
  const [languageFilter, setLanguageFilter] = useState<"all" | Language>("all");

  // Filters are real query params against the backend (category/status
  // server-side in SQL, language post-fetch — see listAdmin in
  // contentService.ts), not client-side array filtering, so this refetches
  // on every filter change instead of filtering an already-loaded list.
  useEffect(() => {
    let cancelled = false;
    listContent({
      category: categoryFilter === "all" ? undefined : categoryFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      language: languageFilter === "all" ? undefined : languageFilter,
      limit: 100,
    })
      .then((res) => {
        if (cancelled) return;
        setContent(res.data);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof ApiError ? err.message : "Failed to load content.");
      });
    return () => {
      cancelled = true;
    };
  }, [categoryFilter, statusFilter, languageFilter]);

  useEffect(() => {
    listCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {
        // Non-fatal for this page — the category column just shows "—" and
        // the filter dropdown falls back to "All Categories" only.
      });
  }, []);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError(null);
    try {
      await apiDeleteContent(deleteTarget.id);
      setContent((prev) => prev?.filter((c) => c.id !== deleteTarget.id) ?? prev);
      setDeleteTarget(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to delete content item.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Content" }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Content</h1>
            <p className="text-sm text-admin-warm-grey">
              {content ? `${content.length} item${content.length === 1 ? "" : "s"}` : "Loading…"}
            </p>
          </div>
          {editable && (
            <Link
              href="/admin/content/new"
              className="flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Add Content
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          fullWidth={false}
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((category) => ({ value: category.id, label: category.name.en || category.name.fr })),
          ]}
          className="rounded-xl border border-brand-line/40 bg-white px-3.5 py-2 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        <Select
          fullWidth={false}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as "all" | ContentStatus)}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
          className="rounded-xl border border-brand-line/40 bg-white px-3.5 py-2 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        <Select
          fullWidth={false}
          value={languageFilter}
          onChange={(value) => setLanguageFilter(value as "all" | Language)}
          options={[
            { value: "all", label: "All Languages" },
            ...LANGUAGES.map((lang) => ({ value: lang.code, label: `Translated in ${lang.label}` })),
          ]}
          className="rounded-xl border border-brand-line/40 bg-white px-3.5 py-2 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
      </div>

      {actionError && (
        <div className="rounded-2xl border border-admin-terracotta/30 bg-admin-terracotta/5 px-6 py-4 text-sm text-admin-terracotta">
          {actionError}
        </div>
      )}

      {loadError ? (
        <div className="rounded-2xl border border-admin-terracotta/30 bg-admin-terracotta/5 px-6 py-4 text-sm text-admin-terracotta">
          {loadError}
        </div>
      ) : !content ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-line/30 bg-white shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-line/30 text-xs tracking-wide text-admin-warm-grey uppercase">
                <th className="px-6 py-3.5 font-medium">Title</th>
                <th className="px-6 py-3.5 font-medium">Category</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium">Languages</th>
                <th className="px-6 py-3.5 font-medium">Author</th>
                <th className="px-6 py-3.5 font-medium">Last Updated</th>
                {editable && <th className="px-6 py-3.5 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line/20">
              {content.map((item) => {
                const category = categoryById.get(item.categoryId);
                return (
                  <tr key={item.id} className="transition-colors hover:bg-brand-gold/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-admin-cream">
                          <Image
                          src={resolveMediaUrl(item.featuredImage)}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized={isBackendMediaUrl(item.featuredImage)}
                        />
                        </span>
                        <Link
                          href={editable ? `/admin/content/${item.id}` : "#"}
                          className={`font-medium text-brand-brown ${editable ? "hover:underline" : "cursor-default"}`}
                        >
                          {item.title.en || item.title.fr}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-brown/80">{category?.name.en ?? "—"}</td>
                    <td className="px-6 py-4">
                      <ContentStatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4">
                      <LanguageDots fields={[item.title]} />
                    </td>
                    <td className="px-6 py-4 text-brand-brown/80">{item.author}</td>
                    <td className="px-6 py-4 text-admin-warm-grey">{formatDate(item.updatedAt)}</td>
                    {editable && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/content/${item.id}`)}
                            aria-label={`Edit ${item.title.en}`}
                            className="flex size-8 items-center justify-center rounded-lg text-brand-brown/70 transition-colors hover:bg-brand-brown/5 hover:text-brand-brown"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            aria-label={`Delete ${item.title.en}`}
                            className="flex size-8 items-center justify-center rounded-lg text-admin-terracotta/70 transition-colors hover:bg-admin-terracotta/10 hover:text-admin-terracotta"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {content.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-admin-warm-grey">
                    No content matches these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete "${deleteTarget?.title.en}"?`}
        description={deleting ? "Deleting…" : "This will permanently remove the content item."}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
