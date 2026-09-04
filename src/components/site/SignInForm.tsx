"use client";

import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { useAdminAuth, DEMO_CREDENTIALS } from "@/lib/admin/AdminAuthContext";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 20 20" fill="none" className="size-[18px]" aria-hidden="true">
      <path
        d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" className="size-[18px]" aria-hidden="true">
      <path
        d="M2.5 2.5l15 15M8.03 8.06a2.25 2.25 0 0 0 3.17 3.19M5.6 5.63C3.4 7.06 1.5 10 1.5 10s3 6 8.5 6c1.53 0 2.84-.46 3.93-1.1M16.4 14.4C17.83 13.1 18.5 10 18.5 10s-3-6-8.5-6c-.47 0-.92.04-1.35.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Only ever send the browser to an internal path — never follow an
 * absolute/protocol-relative `next` value from the URL. */
function safeRedirectTarget(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/admin/dashboard";
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const { locale } = useLocale();
  const t = ui[locale].signInPage;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (await login(email, password)) {
        setError(null);
        router.push(safeRedirectTarget(searchParams.get("next")));
        return;
      }
      setError(t.invalidCredentials);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
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

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor={passwordId} className="text-xs font-medium tracking-[1px] text-brand-brown-deep uppercase">
            {t.passwordLabel}
          </label>
          <a href="#" className="text-xs text-brand-rust transition-colors hover:underline">
            {t.forgotPassword}
          </a>
        </div>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
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
      </div>

      <label htmlFor={rememberId} className="-mt-1 flex items-center gap-2 text-sm text-brand-brown-deep">
        <input
          id={rememberId}
          name="remember"
          type="checkbox"
          className="size-4 rounded-sm border-brand-line text-brand-brown accent-brand-brown"
        />
        {t.rememberMe}
      </label>

      {error && <p className="text-sm text-brand-rust">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-brand-brown py-3.5 text-sm font-medium tracking-[0.7px] text-brand-cream transition-colors hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t.submitting : t.submit}
      </button>

      <p className="text-center text-sm text-brand-brown-deep">
        {t.newHere}{" "}
        <a href="#" className="font-medium text-brand-rust hover:underline">
          {t.createAccount}
        </a>
      </p>

      <p className="border-t border-brand-line/60 pt-5 text-center text-xs text-brand-muted">
        {t.demoNote}{" "}
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="font-medium text-brand-brown-deep underline decoration-brand-line underline-offset-2 transition-colors hover:text-brand-brown hover:decoration-brand-brown"
        >
          {t.demoAutofill}
        </button>
      </p>
    </form>
  );
}
