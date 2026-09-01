"use client";

import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { useAdminAuth, DEMO_CREDENTIALS } from "@/lib/admin/AdminAuthContext";
import { hoverScale, microTransition, staggerItem, tapScale } from "@/lib/animations";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
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
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
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
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const { locale } = useLocale();
  const t = ui[locale].signInPage;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (login(email, password)) {
      setError(null);
      router.push(safeRedirectTarget(searchParams.get("next")));
      return;
    }
    setError(t.invalidCredentials);
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  };

  return (
    <motion.form
      variants={staggerItem}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-5 rounded-xl border border-brand-line/30 bg-white p-8 shadow-[0_8px_30px_0_rgba(107,58,31,0.1)] sm:p-10"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="text-sm font-medium tracking-[0.7px] text-brand-brown-deep">
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
          className="w-full rounded-xl border border-brand-line/40 bg-brand-cream px-4 py-3 text-base text-brand-ink outline-none transition-colors placeholder:text-brand-brown-deep/50 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor={passwordId} className="text-sm font-medium tracking-[0.7px] text-brand-brown-deep">
            {t.passwordLabel}
          </label>
          <a href="#" className="text-sm text-brand-rust transition-colors hover:underline">
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
            className="w-full rounded-xl border border-brand-line/40 bg-brand-cream px-4 py-3 pr-11 text-base text-brand-ink outline-none transition-colors placeholder:text-brand-brown-deep/50 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((show) => !show)}
            aria-label={showPassword ? t.hidePassword : t.showPassword}
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-brand-brown-deep transition-colors hover:bg-brand-sand"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      <label htmlFor={rememberId} className="flex items-center gap-2 text-sm text-brand-brown-deep">
        <input
          id={rememberId}
          name="remember"
          type="checkbox"
          className="size-4 rounded border-brand-line/50 text-brand-gold accent-brand-gold-deep"
        />
        {t.rememberMe}
      </label>

      {error && <p className="text-sm text-brand-rust">{error}</p>}

      <motion.button
        type="submit"
        whileHover={hoverScale}
        whileTap={tapScale}
        transition={microTransition}
        className="mt-1 w-full rounded-xl bg-brand-gold px-6 py-3.5 text-sm font-medium tracking-[0.7px] text-[#5c4000] shadow-[0_8px_15px_rgba(225,169,60,0.3)]"
      >
        {t.submit}
      </motion.button>

      <button
        type="button"
        onClick={fillDemoCredentials}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-line/60 px-4 py-2.5 text-xs font-medium text-brand-brown-deep/70 transition-colors hover:border-brand-gold hover:text-brand-brown"
      >
        <Sparkles className="size-3.5" />
        {t.useDemoCredentials} ({DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password})
      </button>
    </motion.form>
  );
}
