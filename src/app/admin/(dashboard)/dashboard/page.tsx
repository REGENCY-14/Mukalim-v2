"use client";

import { Tags, FileText, FileClock, Image as ImageIcon } from "lucide-react";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import StatCard from "@/components/admin/StatCard";

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

export default function DashboardPage() {
  const { categories, content, media, activity } = useAdminData();
  const { session } = useAdminAuth();

  const draftCount = content.filter((item) => item.status === "draft").length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard" }]} />
        <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">
          Welcome back{session ? `, ${session.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-admin-warm-grey">Here&apos;s what&apos;s happening across the site.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Categories" value={categories.length} icon={Tags} tone="gold" />
        <StatCard label="Total Content Items" value={content.length} icon={FileText} tone="brown" />
        <StatCard label="Drafts Pending" value={draftCount} icon={FileClock} tone="terracotta" />
        <StatCard label="Total Media Files" value={media.length} icon={ImageIcon} tone="green" />
      </div>

      <div className="rounded-2xl border border-brand-line/30 bg-white shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
        <div className="border-b border-brand-line/30 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-brand-brown">Recent Activity</h2>
        </div>
        <ul className="divide-y divide-brand-line/20">
          {activity.map((entry) => (
            <li key={entry.id} className="flex items-start justify-between gap-4 px-6 py-4">
              <p className="text-sm text-brand-brown/90">
                <span className="font-medium">
                  {entry.actorRole.charAt(0).toUpperCase() + entry.actorRole.slice(1)} {entry.actor}
                </span>{" "}
                {entry.action} <span className="font-medium">{entry.target}</span>
              </p>
              <span className="shrink-0 text-xs whitespace-nowrap text-admin-warm-grey">{timeAgo(entry.timestamp)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
