"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // There's no separate /admin/sign-in — the dashboard reuses the site's
  // public sign-in page (see that page for why), so an unauthenticated
  // visitor gets bounced there with `?next=` pointing back to whatever
  // admin page they were trying to reach.
  //
  // `session` is briefly `null` on every hard navigation/reload — the
  // server (and the client's first hydration render) can't read
  // localStorage, so `useSyncExternalStore` reports "logged out" for one
  // commit even for an already-authenticated visitor, before a corrective
  // re-render lands. Redirecting immediately on that stale `null` races the
  // correction and can send a real user through sign-in and back to
  // `/admin/dashboard`, losing whatever page they actually requested.
  // Deferring the redirect and cancelling it in the effect's cleanup (which
  // runs when `session` changes again, i.e. once the correction lands)
  // means a genuinely logged-out visitor still redirects — just one tick
  // later — while a real session never triggers it at all.
  useEffect(() => {
    if (session !== null) return;
    const timeoutId = window.setTimeout(() => {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [session, router, pathname]);

  if (!session) {
    // Either genuinely logged out (redirect effect above is about to fire)
    // or — for one render — the server/first-hydration snapshot. Either
    // way, don't flash real dashboard content.
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
