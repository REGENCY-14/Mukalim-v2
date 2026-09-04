"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin/types";
import { roleLabel } from "@/lib/admin/permissions";
import { inviteUser, type AdminUser } from "@/lib/admin/api";
import { ApiError } from "@/lib/api/client";
import SlideOver from "./SlideOver";
import Select from "./Select";

interface InviteUserPanelProps {
  open: boolean;
  onClose: () => void;
  onInvited: (user: AdminUser) => void;
}

export default function InviteUserPanel({ open, onClose, onInvited }: InviteUserPanelProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set once the invite succeeds — switches the panel to a "here's the
  // token" view instead of closing immediately (see the note below on why).
  const [result, setResult] = useState<{ name: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setRole("editor");
    setError(null);
    setResult(null);
    setCopied(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { user, inviteToken } = await inviteUser({ name: name || email.split("@")[0] || email, email, role });
      onInvited(user);
      // There's no email provider wired up in the backend (see its README's
      // Auth notes) and no accept-invite page anywhere in this frontend —
      // the token has nowhere to go but here. Show it instead of closing,
      // so there's at least a way for the admin to relay it manually until
      // a real invite-delivery flow exists.
      setResult({ name: user.name, token: inviteToken });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send invite.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.token);
      setCopied(true);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS context) — the token is
      // still selectable/visible in the field below.
    }
  };

  return (
    <SlideOver open={open} onClose={handleClose} title={result ? "Invite Created" : "Invite User"} widthClassName="max-w-md">
      {result ? (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-brand-brown">
            <span className="font-medium">{result.name}</span> was created with status <em>invited</em>. No email was
            sent — there&apos;s no mail provider wired up yet, so this token needs to be relayed to them manually
            (e.g. via <code className="rounded bg-admin-cream px-1 py-0.5 text-xs">POST /api/auth/accept-invite</code>{" "}
            once there&apos;s a page for it).
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-brown">Invite Token</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={result.token}
                onFocus={(event) => event.target.select()}
                className="w-full truncate rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 font-mono text-xs text-brand-brown outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy invite token"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-line/40 text-brand-brown transition-colors hover:border-brand-gold hover:bg-brand-gold/5"
              >
                {copied ? <Check className="size-4 text-admin-green" /> : <Copy className="size-4" />}
              </button>
            </div>
            <p className="text-xs text-admin-warm-grey">Expires in 7 days.</p>
          </div>
          <div className="flex justify-end border-t border-brand-line/30 pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)]"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
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

          {error && <p className="text-sm text-admin-terracotta">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-brand-line/30 pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-brown/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Invite"}
            </button>
          </div>
        </form>
      )}
    </SlideOver>
  );
}
