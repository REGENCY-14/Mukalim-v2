"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import {
  listCategories,
  deleteCategory as apiDeleteCategory,
  toggleCategoryActive as apiToggleCategoryActive,
  type AdminCategory,
} from "@/lib/admin/api";
import { ApiError, isBackendMediaUrl, resolveMediaUrl } from "@/lib/api/client";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import { CategoryStatusBadge } from "@/components/admin/Badge";
import CategoryFormPanel from "@/components/admin/CategoryFormPanel";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function CategoriesPage() {
  const { session } = useAdminAuth();
  const editable = session ? canEdit(session.role) : false;

  const [categories, setCategories] = useState<AdminCategory[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  // Bumped on every open so CategoryFormPanel remounts fresh each time
  // (see the note in that file for why this replaces a reset-on-prop effect).
  const [panelKey, setPanelKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    listCategories()
      .then((res) => {
        setCategories(res.data);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof ApiError ? err.message : "Failed to load categories.");
      });
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setPanelKey((key) => key + 1);
    setPanelOpen(true);
  };

  const openEdit = (category: AdminCategory) => {
    setEditing(category);
    setPanelKey((key) => key + 1);
    setPanelOpen(true);
  };

  const handleSaved = (saved: AdminCategory) => {
    setCategories((prev) => {
      if (!prev) return prev;
      const exists = prev.some((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [...prev, saved];
    });
    setPanelOpen(false);
  };

  const handleToggleActive = async (category: AdminCategory) => {
    setActionError(null);
    try {
      const updated = await apiToggleCategoryActive(category.id);
      setCategories((prev) => prev?.map((c) => (c.id === updated.id ? updated : c)) ?? prev);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update category.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError(null);
    try {
      await apiDeleteCategory(deleteTarget.id);
      setCategories((prev) => prev?.filter((c) => c.id !== deleteTarget.id) ?? prev);
      setDeleteTarget(null);
    } catch (err) {
      // Notably the 409 "still has content" case (categoryService.remove) —
      // surfaced verbatim so the admin knows why it didn't delete.
      setActionError(err instanceof ApiError ? err.message : "Failed to delete category.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const sorted = categories ? [...categories].sort((a, b) => a.displayOrder - b.displayOrder) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Categories" }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Categories</h1>
            <p className="text-sm text-admin-warm-grey">{categories ? `${categories.length} categories` : "Loading…"}</p>
          </div>
          {editable && categories && (
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Add Category
            </button>
          )}
        </div>
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
      ) : !categories ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-line/30 bg-white shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-line/30 text-xs tracking-wide text-admin-warm-grey uppercase">
                <th className="px-6 py-3.5 font-medium">Name</th>
                <th className="px-6 py-3.5 font-medium">Slug</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium"># Items</th>
                <th className="px-6 py-3.5 font-medium">Last Updated</th>
                {editable && <th className="px-6 py-3.5 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line/20">
              {sorted.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-brand-gold/5">
                  <td className="flex items-center gap-3 px-6 py-4">
                    <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-admin-cream">
                      <Image
                        src={resolveMediaUrl(category.iconUrl)}
                        alt=""
                        width={18}
                        height={18}
                        className="object-contain"
                        unoptimized={isBackendMediaUrl(category.iconUrl)}
                      />
                    </span>
                    <span className="font-medium text-brand-brown">{category.name.en || category.name.fr}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-admin-warm-grey">{category.slug}</td>
                  <td className="px-6 py-4">
                    <CategoryStatusBadge active={category.active} />
                  </td>
                  <td className="px-6 py-4 text-brand-brown/80">{category.contentCount}</td>
                  <td className="px-6 py-4 text-admin-warm-grey">{formatDate(category.updatedAt)}</td>
                  {editable && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          aria-label={`Edit ${category.name.en}`}
                          className="flex size-8 items-center justify-center rounded-lg text-brand-brown/70 transition-colors hover:bg-brand-brown/5 hover:text-brand-brown"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(category)}
                          aria-label={`Toggle ${category.name.en} active`}
                          className="flex size-8 items-center justify-center rounded-lg text-brand-brown/70 transition-colors hover:bg-brand-brown/5 hover:text-brand-brown"
                        >
                          <Power className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(category)}
                          aria-label={`Delete ${category.name.en}`}
                          className="flex size-8 items-center justify-center rounded-lg text-admin-terracotta/70 transition-colors hover:bg-admin-terracotta/10 hover:text-admin-terracotta"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormPanel key={panelKey} open={panelOpen} onClose={() => setPanelOpen(false)} category={editing} onSaved={handleSaved} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete "${deleteTarget?.name.en}"?`}
        description={
          deleting
            ? "Deleting…"
            : "This will permanently remove the category. It can only be deleted while no content items reference it."
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
