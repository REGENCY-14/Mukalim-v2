"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import type { AdminContentItem, ContentStatus, Language } from "@/lib/admin/types";
import { LANGUAGES } from "@/lib/admin/types";
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
  const { content, categories, deleteContent } = useAdminData();
  const { session } = useAdminAuth();
  const editable = session ? canEdit(session.role) : false;

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ContentStatus>("all");
  const [languageFilter, setLanguageFilter] = useState<"all" | Language>("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminContentItem | null>(null);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = content.filter((item) => {
    if (categoryFilter !== "all" && item.categoryId !== categoryFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (languageFilter !== "all" && !item.title[languageFilter].trim()) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Content" }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Content</h1>
            <p className="text-sm text-admin-warm-grey">
              {filtered.length} of {content.length} items
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
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border border-brand-line/40 bg-white py-2 pr-9 pl-3.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name.en || category.name.fr}
            </option>
          ))}
        </Select>
        <Select
          fullWidth={false}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | ContentStatus)}
          className="rounded-xl border border-brand-line/40 bg-white py-2 pr-9 pl-3.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <Select
          fullWidth={false}
          value={languageFilter}
          onChange={(event) => setLanguageFilter(event.target.value as "all" | Language)}
          className="rounded-xl border border-brand-line/40 bg-white py-2 pr-9 pl-3.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        >
          <option value="all">All Languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              Translated in {lang.label}
            </option>
          ))}
        </Select>
      </div>

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
            {filtered.map((item) => {
              const category = categoryById.get(item.categoryId);
              return (
                <tr key={item.id} className="transition-colors hover:bg-brand-gold/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-admin-cream">
                        <Image src={item.featuredImage} alt="" fill sizes="40px" className="object-cover" />
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-admin-warm-grey">
                  No content matches these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete "${deleteTarget?.title.en}"?`}
        description="This will permanently remove the content item."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && session) {
            deleteContent(deleteTarget.id, { name: session.name, role: session.role });
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
