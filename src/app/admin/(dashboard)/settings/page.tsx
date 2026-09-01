"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAdminData } from "@/lib/admin/AdminDataContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { canEdit } from "@/lib/admin/permissions";
import { LANGUAGES, type AdminSettings, type Language } from "@/lib/admin/types";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import Select from "@/components/admin/Select";

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminData();
  const { session } = useAdminAuth();
  const editable = session ? canEdit(session.role) : false;

  const [form, setForm] = useState<AdminSettings>(settings);
  const [saved, setSaved] = useState(false);

  // `settings` is a singleton (no per-item `key` to remount on, unlike the
  // category/content/media forms), so re-syncing local form state when it
  // changes externally — e.g. the SSR→localStorage hydration correction —
  // uses React's "adjust state during render" pattern instead of an effect:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevSettings, setPrevSettings] = useState(settings);
  if (settings !== prevSettings) {
    setPrevSettings(settings);
    setForm(settings);
  }

  const inputClass =
    "w-full rounded-xl border border-brand-line/40 bg-admin-cream px-4 py-2.5 text-sm text-brand-brown outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-60";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Settings" }]} />
        <h1 className="font-serif text-2xl font-bold text-brand-brown sm:text-3xl">Settings</h1>
        <p className="text-sm text-admin-warm-grey">Global site configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        <fieldset disabled={!editable} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-brand-line/30 bg-white p-6 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
            <h2 className="font-serif text-lg font-bold text-brand-brown">General</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Site Name</label>
              <input
                value={form.siteName}
                onChange={(event) => setForm((prev) => ({ ...prev, siteName: event.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Default Language</label>
              <Select
                value={form.defaultLanguage}
                onChange={(event) => setForm((prev) => ({ ...prev, defaultLanguage: event.target.value as Language }))}
                className={`${inputClass} pr-9`}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brand-brown">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(event) => setForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-brand-line/30 bg-white p-6 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]">
            <h2 className="font-serif text-lg font-bold text-brand-brown">Social Links</h2>
            {(["instagram", "facebook", "linkedin"] as const).map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-brown capitalize">{key}</label>
                <input
                  value={form.social[key]}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, social: { ...prev.social, [key]: event.target.value } }))
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </fieldset>

        {editable && (
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-medium text-[#5c4000] shadow-[0_4px_12px_rgba(225,169,60,0.3)] transition-transform hover:scale-[1.02]"
            >
              Save Settings
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-admin-green">
                <Check className="size-4" />
                Saved
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
