"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import {
  ACCEPTED_IMAGE_ACCEPT,
  ACCEPTED_IMAGE_LABEL,
  REJECTED_FILE_TYPE_MESSAGE,
  isAcceptedImageType,
} from "@/lib/admin/mediaTypes";

interface MediaUploadZoneProps {
  onFiles: (files: File[]) => void;
  /** Called when at least one selected/dropped file isn't an accepted image
   * type (e.g. SVG), so the page can surface it the same way it surfaces an
   * upload/API error, rather than the file silently vanishing. */
  onRejected?: (message: string) => void;
}

export default function MediaUploadZone({ onFiles, onRejected }: MediaUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFiles = (allFiles: File[]) => {
    const accepted = allFiles.filter(isAcceptedImageType);
    const rejectedCount = allFiles.length - accepted.length;
    if (rejectedCount > 0) onRejected?.(REJECTED_FILE_TYPE_MESSAGE);
    if (accepted.length) onFiles(accepted);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        acceptFiles(Array.from(event.dataTransfer.files));
      }}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        dragging ? "border-brand-gold bg-brand-gold/5" : "border-brand-line/50 bg-white"
      }`}
    >
      <UploadCloud className={`size-8 ${dragging ? "text-brand-gold" : "text-admin-warm-grey"}`} />
      <p className="text-sm text-brand-brown">
        <button type="button" onClick={() => inputRef.current?.click()} className="font-medium text-brand-rust hover:underline">
          Click to upload
        </button>{" "}
        or drag and drop
      </p>
      <p className="text-xs text-admin-warm-grey">{ACCEPTED_IMAGE_LABEL} up to 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          acceptFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
    </div>
  );
}
