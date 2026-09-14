/** Shared show/hide-password glyph, extracted from SignInForm so
 * AcceptInviteForm (and anywhere else with a password field) can use the
 * same icon instead of redefining it. */
export default function EyeIcon({ open }: { open: boolean }) {
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
