# Mukalim-v2

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Shared responsiveness & animation foundation

- `lib/animations.ts` — shared Framer Motion variants (page transitions, fade/slide, stagger, scroll reveal, hover/tap micro-interactions) and shared duration/easing tokens. Use these instead of introducing one-off transitions per component.
- `components/AnimatedBackground.tsx` — reusable decorative animated background (aria-hidden, pointer-events-none, respects `prefers-reduced-motion`). Extend this rather than adding one-off background SVGs per page.
- Tailwind v4's default breakpoint scale is used (`sm` 40rem / `md` 48rem / `lg` 64rem / `xl` 80rem / `2xl` 96rem) — no custom breakpoints are defined in `globals.css`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
