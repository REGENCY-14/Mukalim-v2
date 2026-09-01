"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AdminRole } from "@/lib/admin/types";
import { canManageUsers } from "@/lib/admin/permissions";
import { baseTransition } from "@/lib/animations";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  role: AdminRole;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavLinks({ role, collapsed, onNavigate }: { role: AdminRole; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.filter((item) => !item.adminOnly || canManageUsers(role)).map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-gold/15 text-admin-cream"
                : "text-admin-cream/80 hover:bg-white/10 hover:text-admin-cream"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Icon className={`size-[18px] shrink-0 ${isActive ? "text-brand-gold" : ""}`} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ role, collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-brand-brown transition-[width] duration-200 md:flex ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className={`flex h-[72px] shrink-0 items-center border-b border-white/10 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link href="/admin/dashboard" className="font-serif text-lg font-bold text-admin-cream">
              MUKALIM <span className="font-sans text-xs font-medium text-brand-gold uppercase">Admin</span>
            </Link>
          )}
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex size-8 items-center justify-center rounded-full text-admin-cream/70 transition-colors hover:bg-white/10 hover:text-admin-cream"
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavLinks role={role} collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-brand-ink/50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={baseTransition}
              className="relative flex h-full w-72 flex-col bg-brand-brown"
            >
              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-4">
                <span className="font-serif text-lg font-bold text-admin-cream">
                  MUKALIM <span className="font-sans text-xs font-medium text-brand-gold uppercase">Admin</span>
                </span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="flex size-8 items-center justify-center rounded-full text-admin-cream/70 hover:bg-white/10 hover:text-admin-cream"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <NavLinks role={role} collapsed={false} onNavigate={onCloseMobile} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
