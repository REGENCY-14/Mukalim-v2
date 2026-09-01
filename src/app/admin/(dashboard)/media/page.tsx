"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Trash2 } from "lucide-react";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import { emptyLocalizedText, type AdminMediaItem } from "@/lib/admin/types";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import MediaUploadZone from "@/components/admin/MediaUploadZone";
import MediaDetailPanel from "@/components/admin/MediaDetailPanel";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

function formatBytes(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

function readImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

export default function MediaPage() {
  const { media, content, categories, addMedia, deleteMedia } = useAdminData();
  const { session } = useAdminAuth();
  const editable = session ? canEdit(session.role) : false;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<AdminMediaItem | null>(null);
  // Bumped only when *opening* a (possibly different) item — not on close,
  // so MediaDetailPanel's close animation can keep rendering the item it
  // had while it fades out. See the note in that file.
  const [panelKey, setPanelKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<AdminMediaItem | null>(null);

  const openMedia = (item: AdminMediaItem) => {
    setSelected(item);
    setPanelKey((key) => key + 1);
  };

  const mediaCategoryId = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of content) map.set(item.featuredImage, item.categoryId);
    return map;
  }, [content]);

  const filtered = media.filter((item) => {
    if (search && !item.filename.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && mediaCategoryId.get(item.url) !== categoryFilter) return false;
    return true;
  });

  const handleUpload = async (files: File[]) => {
    if (!session) return;
    for (const file of files) {
      const url = URL.createObjectURL(file);
      const { width, height } = await readImageDimensions(url);
      addMedia(
        {
          filename: file.name,
          url,
          sizeKb: Math.round(file.size / 1024),
          width,
          height,
          usedIn: [],
          altText: emptyLocalizedText(),
        },
        { name: session.name, role: session.role },
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Media" }]} />
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Media Library</h1>
          <p className="text-sm text-admin-warm-grey">
            {filtered.length} of {media.length} files
          </p>
        </div>
      </div>

      {editable && <MediaUploadZone onFiles={handleUpload} />}

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
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border border-brand-line/40 bg-white px-3.5 py-2 text-sm text-brand-brown outline-none focus:border-brand-gold"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name.en || category.name.fr}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-brand-line/30 bg-white shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]"
          >
            <button type="button" onClick={() => openMedia(item)} className="relative aspect-square w-full overflow-hidden bg-admin-cream">
              <Image
                src={item.url}
                alt={item.altText.en || item.altText.fr}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={item.url.startsWith("blob:")}
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
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-admin-warm-grey">No media matches these filters.</p>
        )}
      </div>

      <MediaDetailPanel key={panelKey} media={selected} onClose={() => setSelected(null)} editable={editable} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete "${deleteTarget?.filename}"?`}
        description="This will permanently remove the file from the media library."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && session) {
            deleteMedia(deleteTarget.id, { name: session.name, role: session.role });
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
