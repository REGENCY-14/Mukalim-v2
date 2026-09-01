"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import SignInForm from "@/components/site/SignInForm";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function SignInPageContent() {
  const { locale } = useLocale();
  const t = ui[locale].signInPage;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAdminAuth();
  const next = searchParams.get("next");
  const isAdminContext = next?.startsWith("/admin") ?? false;

  // Already signed in? Skip the form — this is the same page whether you
  // arrived by clicking "Sign In" or got bounced here from a protected
  // /admin page (see `(dashboard)/layout.tsx`).
  useEffect(() => {
    if (session) router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin/dashboard");
  }, [session, next, router]);

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-brand-cream px-4 py-16 sm:px-6 lg:py-24">
          <AnimatedBackground />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-8"
          >
            <motion.div variants={staggerItem} className="flex flex-col items-center gap-4 text-center">
              <Link href="/" className="flex items-center gap-3">
                <span className="relative size-10 overflow-hidden rounded-md">
                  <Image
                    src="/mukalim/logo.png"
                    alt="Mukalim brand logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <span className="font-serif text-2xl font-bold tracking-tight text-brand-ink">
                  MUKALIM
                </span>
              </Link>
              <div className="flex flex-col gap-2">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-brand-brown sm:text-4xl">
                  {t.welcomeBack}
                </h1>
                <p className="max-w-sm text-base leading-relaxed text-brand-brown-deep">
                  {isAdminContext ? t.adminSubtext : t.subtext}
                </p>
              </div>
            </motion.div>

            <SignInForm />
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
