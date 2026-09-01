"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import ContentEditor from "@/components/admin/ContentEditor";

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { content } = useAdminData();
  const { session } = useAdminAuth();
  const item = content.find((c) => c.id === id) ?? null;

  useEffect(() => {
    if (session && !canEdit(session.role)) router.replace("/admin/content");
  }, [session, router]);

  if (!session || !canEdit(session.role)) return null;

  if (!item) {
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

  return <ContentEditor key={item.id} item={item} />;
}
