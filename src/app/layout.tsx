import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { AdminAuthProvider } from "@/lib/admin/AdminAuthContext";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mukalim — Discover the World Through Spice",
  description:
    "Globally sourced, expertly tested artisanal spices, bringing warmth and culinary authority to your kitchen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-ink">
        {/* reducedMotion="user" makes every Framer Motion animation in the
            app collapse transform-based motion (x/y/scale/rotate) to its end
            state for users with `prefers-reduced-motion` set. */}
        <MotionConfig reducedMotion="user">
          <LocaleProvider>
            {/* Site-wide (not just /admin/*) because the public /sign-in
                page doubles as the admin dashboard's sign-in — see the note
                there. */}
            <AdminAuthProvider>{children}</AdminAuthProvider>
          </LocaleProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
