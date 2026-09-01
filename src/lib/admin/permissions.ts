import type { AdminRole } from "./types";

/** Only Admins see and can manage the Users page. */
export function canManageUsers(role: AdminRole): boolean {
  return role === "admin";
}

/** Editors and Admins can create/edit/delete. Viewers get a read-only dashboard. */
export function canEdit(role: AdminRole): boolean {
  return role === "admin" || role === "editor";
}

export function roleLabel(role: AdminRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
