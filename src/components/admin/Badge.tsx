import type { AdminRole, ContentStatus, UserStatus } from "@/lib/admin/types";
import { roleLabel } from "@/lib/admin/permissions";

type Tone = "gold" | "terracotta" | "green" | "grey" | "brown";

const TONE_CLASSES: Record<Tone, string> = {
  gold: "bg-brand-gold/15 text-brand-gold-deep",
  terracotta: "bg-admin-terracotta/12 text-admin-terracotta",
  green: "bg-admin-green/12 text-admin-green",
  grey: "bg-admin-warm-grey/15 text-admin-warm-grey",
  brown: "bg-brand-brown/10 text-brand-brown",
};

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role }: { role: AdminRole }) {
  const tone: Tone = role === "admin" ? "gold" : role === "editor" ? "brown" : "grey";
  return <Pill tone={tone}>{roleLabel(role)}</Pill>;
}

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  return status === "published" ? (
    <Pill tone="green">Published</Pill>
  ) : (
    <Pill tone="grey">Draft</Pill>
  );
}

export function CategoryStatusBadge({ active }: { active: boolean }) {
  return active ? <Pill tone="green">Active</Pill> : <Pill tone="grey">Inactive</Pill>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const tone: Tone = status === "active" ? "green" : status === "invited" ? "gold" : "terracotta";
  const label = status === "active" ? "Active" : status === "invited" ? "Invited" : "Disabled";
  return <Pill tone={tone}>{label}</Pill>;
}
