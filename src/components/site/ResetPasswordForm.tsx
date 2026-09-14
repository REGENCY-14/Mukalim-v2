"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { ApiError } from "@/lib/api/client";
import EyeIcon from "./EyeIcon";

interface ResetPasswordFormProps {
  /** null when `?token=` is missing/empty, handled before any submit. */
  token: string | null;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { resetPassword } = useAdminAuth();
  const { locale } = useLocale();
  const t = ui[locale].resetPasswordPage;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Set only for an invalid/expired token (backend's badRequest with no
  // `details.fieldErrors`), covers expired, already-used, and never-existed
  // tokens alike, indistinguishable by design. Swaps the whole form out for
  // a dead-end message with a link to request a fresh one.
  const [invalidToken, setInvalidToken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordId = useId();
  const confirmId = useId();

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-rust">{t.missingToken}</p>
        <Link href="/sign-in" className="text-sm font-medium text-brand-brown-deep underline underline-offset-2">
          {t.backToSignIn}
        </Link>
      </div>
    );
  }

  if (invalidToken) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-semibold text-brand-ink">{t.invalidTokenTitle}</h2>
        <p className="text-sm text-brand-rust">{error}</p>
        <Link href="/forgot-password" className="text-sm font-medium text-brand-brown-deep underline underline-offset-2">
          {t.requestNewLink}
        </Link>
        <Link href="/sign-in" className="text-sm font-medium text-brand-brown-deep underline underline-offset-2">
          {t.backToSignIn}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    if (password.length < 8) {
      setError(t.passwordTooShort);
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await resetPassword(token, password);
      router.push("/admin/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        const details = err.details as { fieldErrors?: Record<string, string[]> } | undefined;
        if (err.status === 400 && !details?.fieldErrors) {
          // No fieldErrors on a 400 => the service's own badRequest (invalid
          // or expired reset token), not a Zod validation failure.
          setInvalidToken(true);
          setError(err.message);
        } else if (details?.fieldErrors?.password?.[0]) {
          setError(details.fieldErrors.password[0]);
        } else {
          // Covers 429 RATE_LIMITED and anything else generic.
          setError(err.message);
        }
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
        <label htmlFor={passwordId} className="text-xs font-medium tracking-[1px] text-brand-brown-deep uppercase">
          {t.passwordLabel}
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full border-b border-brand-line bg-transparent py-2.5 pr-9 text-base text-brand-ink outline-none transition-colors placeholder:text-brand-muted/60 focus:border-brand-brown"
          />
          <button
            type="button"
            onClick={() => setShowPassword((show) => !show)}
            aria-label={showPassword ? t.hidePassword : t.showPassword}
            className="absolute top-1/2 right-0 flex size-7 -translate-y-1/2 items-center justify-center text-brand-muted transition-colors hover:text-brand-brown"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        <p className="text-xs text-brand-muted">{t.passwordHint}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={confirmId} className="text-xs font-medium tracking-[1px] text-brand-brown-deep uppercase">
          {t.confirmPasswordLabel}
        </label>
        <div className="relative">
          <input
            id={confirmId}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full border-b border-brand-line bg-transparent py-2.5 pr-9 text-base text-brand-ink outline-none transition-colors placeholder:text-brand-muted/60 focus:border-brand-brown"
          />
        </div>
      </div>

      {error && <p className="text-sm text-brand-rust">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-brand-brown py-3.5 text-sm font-medium tracking-[0.7px] text-brand-cream transition-colors hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
