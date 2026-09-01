"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import ContentEditor from "@/components/admin/ContentEditor";

export default function NewContentPage() {
  const router = useRouter();
  const { session } = useAdminAuth();

  useEffect(() => {
    if (session && !canEdit(session.role)) router.replace("/admin/content");
  }, [session, router]);

  if (!session || !canEdit(session.role)) return null;

  return <ContentEditor key="new" item={null} />;
}
