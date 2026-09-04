"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, status } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // There's no separate /admin/sign-in — the dashboard reuses the site's
  // public sign-in page (see that page for why), so an unauthenticated
  // visitor gets bounced there with `?next=` pointing back to whatever
  // admin page they were trying to reach.
  //
  // `status` starts at "loading" (the `GET /auth/session` check is still in
  // flight) and only becomes "unauthenticated" once the backend has
  // actually said there's no valid session — so this never races a real
  // session the way reading localStorage synchronously used to.
  useEffect(() => {
    if (status !== "unauthenticated") return;
    router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
  }, [status, router, pathname]);

  if (status !== "authenticated" || !session) {
    // Either still checking, or genuinely logged out (redirect effect above
    // is about to fire) — either way, don't flash real dashboard content.
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-cream">
        <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-admin-cream">
      <Sidebar
        role={session.role}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar session={session} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
