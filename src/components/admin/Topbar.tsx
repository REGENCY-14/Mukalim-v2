"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, FlaskConical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdminAuth, type AdminSession } from "@/lib/admin/AdminAuthContext";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin/types";
import { roleLabel } from "@/lib/admin/permissions";
import { RoleBadge } from "./Badge";
import { microTransition } from "@/lib/animations";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

export default function Topbar({ session, onOpenMobileMenu }: { session: AdminSession; onOpenMobileMenu: () => void }) {
  const { logout, setRole } = useAdminAuth();
  const { activity } = useAdminData();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const notifRef = useClickOutside(() => setNotifOpen(false));
  const userRef = useClickOutside(() => setUserMenuOpen(false));
  const roleRef = useClickOutside(() => setRoleMenuOpen(false));

  // Just clear the session — no navigation call here. The (dashboard)
  // layout's own guard effect picks up `session === null` and redirects to
  // `/sign-in?next=<the admin page you were on>`, so there's one source of
  // truth for "where does a logged-out visitor go" instead of two
  // navigations racing each other.
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-brand-line/40 bg-admin-cream/95 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-lg text-brand-brown transition-colors hover:bg-brand-brown/5 md:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dev-only role switcher */}
        <div ref={roleRef} className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen((open) => !open)}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-admin-warm-grey/40 px-2.5 py-1.5 text-xs font-medium text-admin-warm-grey transition-colors hover:border-admin-warm-grey hover:text-brand-brown"
          >
            <FlaskConical className="size-3.5" />
            <span className="hidden sm:inline">Preview as:</span> {roleLabel(session.role)}
            <ChevronDown className="size-3.5" />
          </button>
          <AnimatePresence>
            {roleMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={microTransition}
                className="absolute top-[calc(100%+8px)] right-0 z-10 w-44 overflow-hidden rounded-xl border border-brand-line/40 bg-white py-1.5 shadow-[0_8px_30px_0_rgba(107,58,31,0.15)]"
              >
                <p className="px-3.5 pt-1 pb-2 text-[11px] font-medium tracking-wide text-admin-warm-grey uppercase">
                  Dev-only preview
                </p>
                {ADMIN_ROLES.map((r: AdminRole) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition-colors hover:bg-brand-brown/5 ${
                      session.role === r ? "font-semibold text-brand-brown" : "text-brand-brown/80"
                    }`}
                  >
                    {roleLabel(r)}
                    {session.role === r && <span className="text-brand-gold">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((open) => !open)}
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-full text-brand-brown transition-colors hover:bg-brand-brown/5"
          >
            <Bell className="size-[18px]" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-admin-terracotta" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={microTransition}
                // Below `md:` the topbar is a cramped mobile cluster
                // (hamburger + role switcher + bell + avatar all in a row —
                // see the `md:hidden` menu button above), so anchoring a
                // fixed 320px-wide panel to the bell's own right edge runs
                // it off the left edge of the screen. Pin it to the
                // viewport instead on mobile; once there's a real desktop
                // topbar (`md:`), anchor it to the bell like the other
                // menus.
                className="fixed inset-x-4 top-[76px] z-10 overflow-hidden rounded-xl border border-brand-line/40 bg-white shadow-[0_8px_30px_0_rgba(107,58,31,0.15)] md:absolute md:inset-x-auto md:top-[calc(100%+8px)] md:right-0 md:w-80"
              >
                <p className="border-b border-brand-line/30 px-4 py-3 text-sm font-semibold text-brand-brown">
                  Recent activity
                </p>
                <ul className="max-h-80 divide-y divide-brand-line/20 overflow-y-auto">
                  {activity.slice(0, 6).map((entry) => (
                    <li key={entry.id} className="px-4 py-3 text-sm text-brand-brown/90">
                      <span className="font-medium">{entry.actor}</span> {entry.action}{" "}
                      <span className="font-medium">{entry.target}</span>
                      <p className="mt-0.5 text-xs text-admin-warm-grey">{timeAgo(entry.timestamp)}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-brand-brown/5"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-gold text-xs font-semibold text-[#5c4000]">
              {initials(session.name)}
            </span>
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-sm font-medium text-brand-brown">{session.name}</span>
            </span>
            <RoleBadge role={session.role} />
          </button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={microTransition}
                className="absolute top-[calc(100%+8px)] right-0 z-10 w-56 overflow-hidden rounded-xl border border-brand-line/40 bg-white py-1.5 shadow-[0_8px_30px_0_rgba(107,58,31,0.15)]"
              >
                <div className="border-b border-brand-line/30 px-3.5 py-2.5">
                  <p className="text-sm font-medium text-brand-brown">{session.name}</p>
                  <p className="text-xs text-admin-warm-grey">{session.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-admin-terracotta transition-colors hover:bg-admin-terracotta/5"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
