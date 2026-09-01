"use client";

import { useState } from "react";
import Image from "next/image";
import type { AdminMediaItem, Language, LocalizedText } from "@/lib/admin/types";
import { emptyLocalizedText } from "@/lib/admin/types";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import SlideOver from "./SlideOver";
import LanguageTabs from "./LanguageTabs";

function formatBytes(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

interface MediaDetailPanelProps {
  media: AdminMediaItem | null;
  onClose: () => void;
  editable: boolean;
}

/**
 * The caller keys this by `media?.id` so opening a *different* item gets a
 * fresh instance (form state below is computed once via lazy `useState`
 * initializers rather than a reset-on-prop-change effect). The same
 * instance persists through closing, though — `media` goes to `null` right
 * away so the panel starts its close animation, but we keep rendering the
 * last non-null item's content (`lastMedia`, synced via the same
 * render-time-adjustment pattern as `SettingsPage` — no ref, since reading
 * a ref during render isn't allowed here) instead of unmounting mid-animation.
 */
export default function MediaDetailPanel({ media, onClose, editable }: MediaDetailPanelProps) {
  const { updateMediaAltText } = useAdminData();
  const [lastMedia, setLastMedia] = useState(media);
  if (media && media !== lastMedia) setLastMedia(media);
  const displayMedia = media ?? lastMedia;

  const [activeLang, setActiveLang] = useState<Language>("en");
  const [altText, setAltText] = useState<LocalizedText>(() => media?.altText ?? emptyLocalizedText());

  if (!displayMedia) return null;

  const handleSave = () => {
    updateMediaAltText(displayMedia.id, altText);
    onClose();
  };

  return (
    <SlideOver open={media !== null} onClose={onClose} title={displayMedia.filename}>
      <div className="flex flex-col gap-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-admin-cream">
          <Image src={displayMedia.url} alt="" fill sizes="480px" className="object-cover" />
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-admin-warm-grey">File size</dt>
            <dd className="font-medium text-brand-brown">{formatBytes(displayMedia.sizeKb)}</dd>
          </div>
          <div>
            <dt className="text-admin-warm-grey">Dimensions</dt>
            <dd className="font-medium text-brand-brown">
              {displayMedia.width} × {displayMedia.height}px
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-admin-warm-grey">Used in</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {displayMedia.usedIn.length > 0 ? (
                displayMedia.usedIn.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-gold/10 px-2.5 py-1 text-xs text-brand-gold-deep">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-admin-warm-grey">Not currently referenced</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3 border-t border-brand-line/30 pt-5">
          <LanguageTabs active={activeLang} onChange={setActiveLang} fields={[altText]} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-brown">Alt Text ({activeLang.toUpperCase()})</label>
            <textarea
              value={altText[activeLang]}
              onChange={(event) => setAltText((prev) => ({ ...prev, [activeLang]: event.target.value }))}
              disabled={!editable}
              rows={3}
              placeholder="Describe the image for screen readers and SEO"
              className="w-full resize-none rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {editable && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-brown/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)]"
            >
              Save Alt Text
            </button>
          </div>
        )}
      </div>
    </SlideOver>
  );
}
