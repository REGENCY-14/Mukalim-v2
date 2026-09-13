"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  /** `emailSent` tells the parent whether to show a "invite sent" toast or
   * rely on this panel's own fallback link UI (shown inline below instead
   * of closing) when delivery failed. */
  onInvited: (user: AdminUser, emailSent: boolean) => void;
}

interface FieldErrors {
  name?: string;
  email?: string;
  role?: string;
}

export default function InviteUserPanel({ open, onClose, onInvited }: InviteUserPanelProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Set only when the invite succeeds but email delivery failed — switches
  // the panel to a "here's the link" fallback view instead of closing.
  const [fallback, setFallback] = useState<{ name: string; link: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setRole("editor");
    setError(null);
    setFieldErrors({});
    setFallback(null);
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
    setFieldErrors({});
    try {
      const trimmedName = name.trim();
      const { user, emailSent, inviteToken } = await inviteUser({
        name: trimmedName || undefined,
        email,
        role,
      });
      onInvited(user, emailSent);
      if (emailSent) {
        handleClose();
      } else if (inviteToken) {
        // Delivery failed (e.g. Resend misconfigured/down) but the user and
        // token already exist server-side — offer the link so the admin can
        // relay it manually rather than losing it.
        const link = `${window.location.origin}/accept-invite?token=${encodeURIComponent(inviteToken)}`;
        setFallback({ name: user.name, link });
      } else {
        // Shouldn't happen per the API contract, but don't strand the admin
        // with no feedback if it ever does.
        handleClose();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          router.push("/sign-in");
          return;
        }
        if (err.status === 409) {
          setFieldErrors({ email: err.message });
        } else if (err.status === 400 && err.details && typeof err.details === "object") {
          const flat = err.details as { fieldErrors?: Record<string, string[]> };
          if (flat.fieldErrors) {
            setFieldErrors({
              name: flat.fieldErrors.name?.[0],
              email: flat.fieldErrors.email?.[0],
              role: flat.fieldErrors.role?.[0],
            });
          } else {
            setError(err.message);
          }
        } else {
          // Covers 429 RATE_LIMITED and anything else — surfaced generically.
          setError(err.message);
        }
      } else {
        setError("Failed to send invite.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!fallback) return;
    try {
      await navigator.clipboard.writeText(fallback.link);
      setCopied(true);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS context) — the link is
      // still selectable/visible in the field below.
    }
  };

  return (
    <SlideOver open={open} onClose={handleClose} title={fallback ? "Invite Created" : "Invite User"} widthClassName="max-w-md">
      {fallback ? (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-brand-brown">
            <span className="font-medium">{fallback.name}</span> was created with status <em>invited</em>, but the
            invite email couldn&apos;t be delivered. Share this link with them directly so they can set their
            password.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-brown">Invite Link</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={fallback.link}
                onFocus={(event) => event.target.select()}
                className="w-full truncate rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 font-mono text-xs text-brand-brown outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy invite link"
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
            <p className="text-xs text-admin-warm-grey">Leave blank to auto-generate from email.</p>
            {fieldErrors.name && <p className="text-xs text-admin-terracotta">{fieldErrors.name}</p>}
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
            {fieldErrors.email && <p className="text-xs text-admin-terracotta">{fieldErrors.email}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brand-brown">Role</label>
            <Select
              value={role}
              onChange={(value) => setRole(value as AdminRole)}
              options={ADMIN_ROLES.map((r) => ({ value: r, label: roleLabel(r) }))}
              className="rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
            {fieldErrors.role && <p className="text-xs text-admin-terracotta">{fieldErrors.role}</p>}
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
