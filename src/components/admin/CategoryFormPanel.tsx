"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import type { AdminCategory, Language, LocalizedText } from "@/lib/admin/types";
import { emptyLocalizedText } from "@/lib/admin/types";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import SlideOver from "./SlideOver";
import LanguageTabs from "./LanguageTabs";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CategoryFormPanelProps {
  open: boolean;
  onClose: () => void;
  category: AdminCategory | null;
}

/**
 * Note: the parent (`categories/page.tsx`) mounts this with a `key` that
 * changes on every open (see `panelKey`), so each open is a fresh
 * component instance — form state can be computed once from `category` via
 * plain `useState` initializers below instead of a "reset on prop change"
 * effect (which React's `set-state-in-effect` rule flags: syncing local
 * state from a prop belongs in a lazy initializer or the render body, not
 * an effect — see https://react.dev/learn/you-might-not-need-an-effect).
 */
export default function CategoryFormPanel({ open, onClose, category }: CategoryFormPanelProps) {
  const { addCategory, updateCategory } = useAdminData();
  const { session } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeLang, setActiveLang] = useState<Language>("en");
  const [name, setName] = useState<LocalizedText>(() => category?.name ?? emptyLocalizedText());
  const [description, setDescription] = useState<LocalizedText>(() => category?.description ?? emptyLocalizedText());
  const [slug, setSlug] = useState(() => category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(() => category !== null);
  const [icon, setIcon] = useState(() => category?.icon ?? "/mukalim/icon-cosmetics.svg");
  const [displayOrder, setDisplayOrder] = useState(() => category?.displayOrder ?? 1);
  const [active, setActive] = useState(() => category?.active ?? true);

  const handleNameChange = (value: string) => {
    setName((prev) => ({ ...prev, [activeLang]: value }));
    if (activeLang === "en" && !slugTouched) setSlug(slugify(value));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setIcon(URL.createObjectURL(file));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    const actor = { name: session.name, role: session.role };
    if (category) {
      updateCategory(category.id, { name, description, slug, icon, displayOrder, active }, actor);
    } else {
      addCategory({ name, description, slug, icon, displayOrder, active }, actor);
    }
    onClose();
  };

  return (
    <SlideOver open={open} onClose={onClose} title={category ? "Edit Category" : "Add Category"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <LanguageTabs active={activeLang} onChange={setActiveLang} fields={[name, description]} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-brown">Name ({activeLang.toUpperCase()})</label>
            <input
              value={name[activeLang]}
              onChange={(event) => handleNameChange(event.target.value)}
              required={activeLang === "en"}
              placeholder="e.g. Cosmetics"
              className="w-full rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-brown">Description ({activeLang.toUpperCase()})</label>
            <textarea
              value={description[activeLang]}
              onChange={(event) => setDescription((prev) => ({ ...prev, [activeLang]: event.target.value }))}
              rows={4}
              placeholder="Short description shown on the category page"
              className="w-full resize-none rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
          </div>
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
            placeholder="cosmetics"
            className="w-full rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 font-mono text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
          <p className="text-xs text-admin-warm-grey">Auto-filled from the English name — editable.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-brown">Icon / Thumbnail</label>
          <div className="flex items-center gap-4">
            <span className="relative flex size-16 shrink-0 items-center justify-center rounded-xl border border-brand-line/40 bg-admin-cream p-3">
              <Image src={icon} alt="" width={32} height={32} className="object-contain" unoptimized={icon.startsWith("blob:")} />
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-brand-line/40 px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:border-brand-gold hover:bg-brand-gold/5"
            >
              <Upload className="size-4" />
              Upload image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-brown">Display Order</label>
            <input
              type="number"
              min={1}
              value={displayOrder}
              onChange={(event) => setDisplayOrder(Number(event.target.value))}
              className="w-full rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brand-brown">Active</span>
            <button
              type="button"
              onClick={() => setActive((value) => !value)}
              aria-pressed={active}
              className={`flex h-[42px] w-16 items-center rounded-full p-1 transition-colors ${
                active ? "bg-admin-green" : "bg-admin-warm-grey/30"
              }`}
            >
              <span
                className={`size-[26px] rounded-full bg-white shadow transition-transform ${
                  active ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-brand-line/30 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-brown/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.02]"
          >
            {category ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </form>
    </SlideOver>
  );
}
