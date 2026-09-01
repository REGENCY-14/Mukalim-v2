"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canManageUsers } from "@/lib/admin/permissions";
import type { AdminUser } from "@/lib/admin/types";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import { RoleBadge, UserStatusBadge } from "@/components/admin/Badge";
import InviteUserPanel from "@/components/admin/InviteUserPanel";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatLastLogin(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function UsersPage() {
  const router = useRouter();
  const { users, deleteUser } = useAdminData();
  const { session } = useAdminAuth();
  const [panelOpen, setPanelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (session && !canManageUsers(session.role)) router.replace("/admin/dashboard");
  }, [session, router]);

  if (!session || !canManageUsers(session.role)) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Users" }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Users</h1>
            <p className="text-sm text-admin-warm-grey">{users.length} users</p>
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.02]"
          >
            <Plus className="size-4" />
            Invite User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-brand-line/30 bg-white shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-line/30 text-xs tracking-wide text-admin-warm-grey uppercase">
              <th className="px-6 py-3.5 font-medium">Name</th>
              <th className="px-6 py-3.5 font-medium">Email</th>
              <th className="px-6 py-3.5 font-medium">Role</th>
              <th className="px-6 py-3.5 font-medium">Status</th>
              <th className="px-6 py-3.5 font-medium">Last Login</th>
              <th className="px-6 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line/20">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-brand-gold/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white ${user.avatarColor}`}>
                      {initials(user.name)}
                    </span>
                    <span className="font-medium text-brand-brown">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-brand-brown/80">{user.email}</td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 text-admin-warm-grey">{formatLastLogin(user.lastLogin)}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(user)}
                    disabled={user.id === "u1"}
                    aria-label={`Remove ${user.name}`}
                    className="flex size-8 items-center justify-center rounded-lg text-admin-terracotta/70 transition-colors hover:bg-admin-terracotta/10 hover:text-admin-terracotta disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteUserPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Remove "${deleteTarget?.name}"?`}
        description="This will revoke their access to the dashboard."
        confirmLabel="Remove"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && session) deleteUser(deleteTarget.id, { name: session.name, role: session.role });
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
