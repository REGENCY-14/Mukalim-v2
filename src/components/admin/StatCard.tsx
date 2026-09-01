import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "gold" | "terracotta" | "green" | "brown";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  gold: "bg-brand-gold/12 text-brand-gold-deep",
  terracotta: "bg-admin-terracotta/12 text-admin-terracotta",
  green: "bg-admin-green/12 text-admin-green",
  brown: "bg-brand-brown/10 text-brand-brown",
};

export default function StatCard({ label, value, icon: Icon, tone = "gold" }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-brand-line/30 bg-white p-5 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}>
        <Icon className="size-6" />
      </div>
      <div className="flex flex-col">
        <span className="font-serif text-2xl font-bold text-brand-brown">{value}</span>
        <span className="text-sm text-admin-warm-grey">{label}</span>
      </div>
    </div>
  );
}
