"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { ApiError } from "@/lib/api/client";

export default function ForgotPasswordForm() {
  const { requestPasswordReset } = useAdminAuth();
  const { locale } = useLocale();
  const t = ui[locale].forgotPasswordPage;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // The backend's response message is deliberately identical whether or not
  // the email matches an account (enumeration-safe), shown as-is rather
  // than duplicated as a hardcoded translation string.
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const emailId = useId();

  if (sentMessage) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-brown-deep">{sentMessage}</p>
        <Link href="/sign-in" className="text-sm font-medium text-brand-brown-deep underline underline-offset-2">
          {t.backToSignIn}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const message = await requestPasswordReset(email);
      setSentMessage(message);
    } catch (err) {
      if (err instanceof ApiError) {
        const details = err.details as { fieldErrors?: Record<string, string[]> } | undefined;
        setError(details?.fieldErrors?.email?.[0] ?? err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="text-xs font-medium tracking-[1px] text-brand-brown-deep uppercase">
          {t.emailLabel}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full border-b border-brand-line bg-transparent py-2.5 text-base text-brand-ink outline-none transition-colors placeholder:text-brand-muted/60 focus:border-brand-brown"
        />
      </div>

      {error && <p className="text-sm text-brand-rust">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-brand-brown py-3.5 text-sm font-medium tracking-[0.7px] text-brand-cream transition-colors hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t.submitting : t.submit}
      </button>

      <p className="text-center text-sm text-brand-brown-deep">
        <Link href="/sign-in" className="font-medium text-brand-rust hover:underline">
          {t.backToSignIn}
        </Link>
      </p>
    </form>
  );
}
