"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Power } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canManageUsers } from "@/lib/admin/permissions";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin/types";
import { roleLabel } from "@/lib/admin/permissions";
import {
  listUsers,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  type AdminUser,
} from "@/lib/admin/api";
import { ApiError } from "@/lib/api/client";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import { UserStatusBadge } from "@/components/admin/Badge";
import InviteUserPanel from "@/components/admin/InviteUserPanel";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Select from "@/components/admin/Select";

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatLastLogin(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function UsersPage() {
  const router = useRouter();
  const { session } = useAdminAuth();

  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // This page is entirely admin-only (view + every mutation) — the backend
  // enforces this itself (requireAdmin on every /admin/users route), this
  // redirect is a UI convenience for non-admins, not the real gate. See the
  // cross-role verification pass for confirmation the API rejects a direct
  // hit regardless of this check.
  useEffect(() => {
    if (session && !canManageUsers(session.role)) router.replace("/admin/dashboard");
  }, [session, router]);

  useEffect(() => {
    if (!session || !canManageUsers(session.role)) return;
    listUsers()
      .then((res) => {
        setUsers(res.data);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof ApiError ? err.message : "Failed to load users.");
      });
  }, [session]);

  // Best-effort client-side hints only — the backend is the real gate
  // (403 self-delete, 409 last-admin change/disable/delete) and is what
  // actually gets verified live, not this count.
  const nonDisabledAdminCount = useMemo(
    () => (users ?? []).filter((u) => u.role === "admin" && u.status !== "disabled").length,
    [users],
  );

  if (!session || !canManageUsers(session.role)) return null;

  const handleInvited = (user: AdminUser) => {
    setUsers((prev) => (prev ? [...prev, user] : [user]));
  };

  const handleRoleChange = async (user: AdminUser, role: AdminRole) => {
    if (role === user.role) return;
    setActionError(null);
    try {
      const updated = await apiUpdateUser(user.id, { role });
      setUsers((prev) => prev?.map((u) => (u.id === updated.id ? updated : u)) ?? prev);
    } catch (err) {
      // e.g. 409 "Cannot change the role of the last remaining admin."
      setActionError(err instanceof ApiError ? err.message : "Failed to update role.");
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === "active" ? "disabled" : "active";
    setActionError(null);
    try {
      const updated = await apiUpdateUser(user.id, { status: nextStatus });
      setUsers((prev) => prev?.map((u) => (u.id === updated.id ? updated : u)) ?? prev);
    } catch (err) {
      // e.g. 409 "Cannot disable the last remaining admin."
      setActionError(err instanceof ApiError ? err.message : "Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError(null);
    try {
      await apiDeleteUser(deleteTarget.id);
      setUsers((prev) => prev?.filter((u) => u.id !== deleteTarget.id) ?? prev);
      setDeleteTarget(null);
    } catch (err) {
      // e.g. 403 "You cannot delete your own account." or 409 last-admin.
      setActionError(err instanceof ApiError ? err.message : "Failed to remove user.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Users" }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Users</h1>
            <p className="text-sm text-admin-warm-grey">{users ? `${users.length} users` : "Loading…"}</p>
          </div>
          {users && (
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Invite User
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <div className="rounded-2xl border border-admin-terracotta/30 bg-admin-terracotta/5 px-6 py-4 text-sm text-admin-terracotta">
          {actionError}
        </div>
      )}

      {loadError ? (
        <div className="rounded-2xl border border-admin-terracotta/30 bg-admin-terracotta/5 px-6 py-4 text-sm text-admin-terracotta">
          {loadError}
        </div>
      ) : !users ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-line/30 bg-white shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
          <table className="w-full min-w-[760px] text-left text-sm">
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
              {users.map((user) => {
                const isSelf = user.id === session.id;
                const isLastAdmin = user.role === "admin" && user.status !== "disabled" && nonDisabledAdminCount <= 1;
                return (
                  <tr key={user.id} className="transition-colors hover:bg-brand-gold/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white ${user.avatarColor}`}
                        >
                          {initials(user.name)}
                        </span>
                        <span className="font-medium text-brand-brown">
                          {user.name}
                          {isSelf && <span className="ml-1.5 text-xs font-normal text-admin-warm-grey">(you)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-brown/80">{user.email}</td>
                    <td className="px-6 py-4">
                      <Select
                        fullWidth={false}
                        value={user.role}
                        onChange={(value) => handleRoleChange(user, value as AdminRole)}
                        options={ADMIN_ROLES.map((r) => ({ value: r, label: roleLabel(r) }))}
                        className="rounded-lg border border-brand-line/40 bg-admin-cream px-3 py-1.5 text-xs font-medium text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <UserStatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-admin-warm-grey">{formatLastLogin(user.lastLoginAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {user.status !== "invited" && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            disabled={isLastAdmin && user.status === "active"}
                            aria-label={user.status === "active" ? `Disable ${user.name}` : `Enable ${user.name}`}
                            title={
                              isLastAdmin && user.status === "active"
                                ? "Can't disable the last remaining admin"
                                : user.status === "active"
                                  ? "Disable"
                                  : "Enable"
                            }
                            className="flex size-8 items-center justify-center rounded-lg text-brand-brown/70 transition-colors hover:bg-brand-brown/5 hover:text-brand-brown disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Power className="size-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          disabled={isSelf || isLastAdmin}
                          aria-label={`Remove ${user.name}`}
                          title={isSelf ? "You can't delete your own account" : isLastAdmin ? "Can't delete the last remaining admin" : undefined}
                          className="flex size-8 items-center justify-center rounded-lg text-admin-terracotta/70 transition-colors hover:bg-admin-terracotta/10 hover:text-admin-terracotta disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <InviteUserPanel open={panelOpen} onClose={() => setPanelOpen(false)} onInvited={handleInvited} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Remove "${deleteTarget?.name}"?`}
        description={deleting ? "Removing…" : "This will revoke their access to the dashboard."}
        confirmLabel="Remove"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
