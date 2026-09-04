"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import { getContentItem, type AdminContentItem } from "@/lib/admin/api";
import ContentEditor from "@/components/admin/ContentEditor";

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { session } = useAdminAuth();
  const [item, setItem] = useState<AdminContentItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (session && !canEdit(session.role)) router.replace("/admin/content");
  }, [session, router]);

  useEffect(() => {
    let cancelled = false;
    getContentItem(id)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch(() => {
        // 404 (bad id) and anything else both land on the same "not found"
        // state — there's no separate error UI on this page to show a
        // distinct message for a network failure vs. a real 404.
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!session || !canEdit(session.role)) return null;

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-line/50 py-16 text-center">
        <p className="text-brand-brown">Content item not found.</p>
        <button
          type="button"
          onClick={() => router.push("/admin/content")}
          className="text-sm font-medium text-brand-rust hover:underline"
        >
          Back to Content
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  return <ContentEditor key={item.id} item={item} />;
}
