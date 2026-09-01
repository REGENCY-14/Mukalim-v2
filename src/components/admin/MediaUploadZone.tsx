"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface MediaUploadZoneProps {
  onFiles: (files: File[]) => void;
}

export default function MediaUploadZone({ onFiles }: MediaUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
        if (files.length) onFiles(files);
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
      <p className="text-xs text-admin-warm-grey">PNG, JPG up to 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length) onFiles(files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
