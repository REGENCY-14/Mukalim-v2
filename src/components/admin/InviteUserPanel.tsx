"use client";

import { useState } from "react";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin/types";
import { roleLabel } from "@/lib/admin/permissions";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import SlideOver from "./SlideOver";
import Select from "./Select";

export default function InviteUserPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addUser } = useAdminData();
  const { session } = useAdminAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    addUser({ name: name || email.split("@")[0], email, role }, { name: session.name, role: session.role });
    setName("");
    setEmail("");
    setRole("editor");
    onClose();
  };

  return (
    <SlideOver open={open} onClose={onClose} title="Invite User" widthClassName="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-brown">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Priya Nair"
            className="w-full rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-brown">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@mukalim.com"
            className="w-full rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-brown">Role</label>
          <Select
            value={role}
            onChange={(value) => setRole(value as AdminRole)}
            options={ADMIN_ROLES.map((r) => ({ value: r, label: roleLabel(r) }))}
            className="rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-brand-line/30 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-brown/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)]"
          >
            Send Invite
          </button>
        </div>
      </form>
    </SlideOver>
  );
}
