"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import {
  listMedia,
  listCategories,
  uploadMedia,
  deleteMedia as apiDeleteMedia,
  type AdminMediaItem,
  type AdminCategory,
} from "@/lib/admin/api";
import { ApiError, isBackendMediaUrl, resolveMediaUrl } from "@/lib/api/client";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import MediaUploadZone from "@/components/admin/MediaUploadZone";
import MediaDetailPanel from "@/components/admin/MediaDetailPanel";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Select from "@/components/admin/Select";

function formatBytes(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export default function MediaPage() {
  const { session } = useAdminAuth();
  const editable = session ? canEdit(session.role) : false;

  const [media, setMedia] = useState<AdminMediaItem[] | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<AdminMediaItem | null>(null);
  // Bumped only when *opening* a (possibly different) item — not on close,
  // so MediaDetailPanel's close animation can keep rendering the item it
  // had while it fades out. See the note in that file.
  const [panelKey, setPanelKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<AdminMediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openMedia = (item: AdminMediaItem) => {
    setSelected(item);
    setPanelKey((key) => key + 1);
  };

  // Real filtering is server-side (`?category=`, `?search=` — filename
  // ILIKE and category usage computed live in mediaService.list), not
  // client-side array filtering — debounced so typing in the search box
  // doesn't fire a request per keystroke.
  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(
      () => {
        listMedia({
          category: categoryFilter === "all" ? undefined : categoryFilter,
          search: search || undefined,
          limit: 100,
        })
          .then((res) => {
            if (cancelled) return;
            setMedia(res.data);
            setLoadError(null);
          })
          .catch((err: unknown) => {
            if (cancelled) return;
            setLoadError(err instanceof ApiError ? err.message : "Failed to load media.");
          });
      },
      search ? 300 : 0,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [search, categoryFilter]);

  useEffect(() => {
    listCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {
        // Non-fatal — the category filter just falls back to "All Categories" only.
      });
  }, []);

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    setActionError(null);
    try {
      const res = await uploadMedia(files);
      setMedia((prev) => (prev ? [...res.data, ...prev] : res.data));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to upload file(s).");
    } finally {
      setUploading(false);
    }
  };

  const handleAltTextSaved = (updated: AdminMediaItem) => {
    setMedia((prev) => prev?.map((m) => (m.id === updated.id ? updated : m)) ?? prev);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError(null);
    try {
      await apiDeleteMedia(deleteTarget.id);
      setMedia((prev) => prev?.filter((m) => m.id !== deleteTarget.id) ?? prev);
      setDeleteTarget(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to delete media.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Media" }]} />
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Media Library</h1>
          <p className="text-sm text-admin-warm-grey">{media ? `${media.length} files` : "Loading…"}</p>
        </div>
      </div>

      {editable && <MediaUploadZone onFiles={handleUpload} />}
      {uploading && <p className="text-sm text-admin-warm-grey">Uploading…</p>}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-admin-warm-grey" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by filename…"
            className="w-full rounded-xl border border-brand-line/40 bg-white py-2 pr-3 pl-9 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
        </div>
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
      ) : !media ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {media.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-brand-line/30 bg-white shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]"
            >
              <button type="button" onClick={() => openMedia(item)} className="relative aspect-square w-full overflow-hidden bg-admin-cream">
                <Image
                  src={resolveMediaUrl(item.url)}
                  alt={item.altText.en || item.altText.fr}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={isBackendMediaUrl(item.url)}
                />
                {item.usedIn.length > 0 && (
                  <span className="absolute top-2 left-2 rounded-full bg-brand-ink/70 px-2 py-0.5 text-[10px] font-medium text-white">
                    {item.usedIn.length} use{item.usedIn.length === 1 ? "" : "s"}
                  </span>
                )}
              </button>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="truncate text-xs font-medium text-brand-brown" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-[11px] text-admin-warm-grey">
                  {formatBytes(item.sizeKb)} · {item.width}×{item.height}
                </p>
                {editable && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="mt-1 flex items-center gap-1 self-start text-[11px] text-admin-terracotta transition-colors hover:underline"
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-admin-warm-grey">No media matches these filters.</p>
          )}
        </div>
      )}

      <MediaDetailPanel key={panelKey} media={selected} onClose={() => setSelected(null)} onSaved={handleAltTextSaved} editable={editable} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete "${deleteTarget?.filename}"?`}
        description={
          deleting
            ? "Deleting…"
            : deleteTarget && deleteTarget.usedIn.length > 0
              ? `This file is currently used in: ${deleteTarget.usedIn.join(", ")}. The server blocks deleting a file that's still referenced — reassign or remove those references first.`
              : "This will permanently remove the file from the media library."
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
