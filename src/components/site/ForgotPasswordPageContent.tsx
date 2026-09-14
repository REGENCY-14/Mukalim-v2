"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TopNavBar from "@/components/site/TopNavBar";
import ForgotPasswordForm from "@/components/site/ForgotPasswordForm";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { fadeInUp, fadeInDown } from "@/lib/animations";

export default function ForgotPasswordPageContent() {
  const { locale } = useLocale();
  const t = ui[locale].forgotPasswordPage;

  return (
    <>
      <TopNavBar />
      <main className="grid min-h-screen pt-[88px] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-brand-ink lg:block">
          <Image
            src="/mukalim/trust.jpg"
            alt="An artisan grinding spices by hand with a traditional mortar and pestle"
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-brown/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-10 xl:p-14">
            <span className="h-px w-12 bg-brand-gold" />
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-md font-serif text-2xl leading-snug font-medium text-white xl:text-[28px]"
            >
              &ldquo;{t.subtext}&rdquo;
            </motion.p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-brand-cream px-6 py-16 sm:px-10 lg:px-16 xl:px-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInDown}
            className="w-full max-w-sm"
          >
            <span className="text-xs font-semibold tracking-[2.5px] text-brand-gold-deep uppercase">
              {t.eyebrow}
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-brand-ink sm:text-[42px]">
              {t.heading}
            </h1>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-brand-brown-deep">{t.subtext}</p>

            <div className="mt-10">
              <ForgotPasswordForm />
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
