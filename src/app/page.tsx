"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  hoverScale,
  microTransition,
  staggerContainer,
  staggerItem,
  tapScale,
} from "@/lib/animations";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-zinc-50 font-sans dark:bg-black">
      <AnimatedBackground />
      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex w-full max-w-3xl flex-1 flex-col items-center justify-between gap-16 bg-white px-6 py-16 sm:items-start sm:gap-0 sm:px-10 sm:py-24 md:py-28 lg:px-16 lg:py-32 dark:bg-black"
      >
        <motion.div variants={staggerItem}>
          <Image
            className="h-5 w-[100px] dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </motion.div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <motion.h1
            variants={staggerItem}
            className="max-w-xs text-2xl font-semibold leading-9 tracking-tight text-black sm:text-3xl sm:leading-10 md:max-w-sm lg:max-w-md lg:text-4xl lg:leading-tight dark:text-zinc-50"
          >
            To get started, edit the{" "}
            <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
              page.tsx
            </code>{" "}
            file.
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="max-w-md text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:text-zinc-400"
          >
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </motion.p>
        </div>
        <motion.div
          variants={staggerItem}
          className="flex w-full flex-col gap-4 text-base font-medium sm:w-auto sm:flex-row"
        >
          <motion.a
            whileHover={hoverScale}
            whileTap={tapScale}
            transition={microTransition}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] sm:w-40 dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="h-[14px] w-4 dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </motion.a>
          <motion.a
            whileHover={hoverScale}
            whileTap={tapScale}
            transition={microTransition}
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] sm:w-40 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </motion.a>
        </motion.div>
      </motion.main>
    </div>
  );
}
