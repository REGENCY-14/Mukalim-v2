"use client";

import { useEffect, useState } from "react";
import { Tags, FileText, FileClock, Image as ImageIcon } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { getDashboardStats, getActivity, type DashboardStats, type AdminActivityEntry } from "@/lib/admin/api";
import { ApiError } from "@/lib/api/client";
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
  const { session } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<AdminActivityEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getDashboardStats(), getActivity(10)])
      .then(([statsRes, activityRes]) => {
        if (cancelled) return;
        setStats(statsRes);
        setActivity(activityRes.data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Something went wrong loading the dashboard.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard" }]} />
        <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">
          Welcome back{session ? `, ${session.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-admin-warm-grey">Here&apos;s what&apos;s happening across the site.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-admin-terracotta/30 bg-admin-terracotta/5 px-6 py-4 text-sm text-admin-terracotta">
          {error}
        </div>
      )}

      {!error && !stats ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Categories" value={stats.totalCategories} icon={Tags} tone="gold" />
            <StatCard label="Total Content Items" value={stats.totalContentItems} icon={FileText} tone="brown" />
            <StatCard label="Drafts Pending" value={stats.draftsPending} icon={FileClock} tone="terracotta" />
            <StatCard label="Total Media Files" value={stats.totalMediaFiles} icon={ImageIcon} tone="green" />
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
                      {entry.actorRole.charAt(0).toUpperCase() + entry.actorRole.slice(1)}{" "}
                      {entry.actorName ?? "Unknown user"}
                    </span>{" "}
                    {entry.action} <span className="font-medium">{entry.targetLabel}</span>
                  </p>
                  <span className="shrink-0 text-xs whitespace-nowrap text-admin-warm-grey">
                    {timeAgo(entry.createdAt)}
                  </span>
                </li>
              ))}
              {activity.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-admin-warm-grey">No activity yet.</li>
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
