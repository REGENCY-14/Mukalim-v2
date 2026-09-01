import type { Metadata } from "next";
import { AdminDataProvider } from "@/lib/admin/AdminDataContext";

export const metadata: Metadata = {
  title: "Mukalim Admin",
  description: "Mukalim content management dashboard.",
  robots: { index: false, follow: false },
};

/**
 * Wraps every /admin/* route with the mock CMS data layer (categories,
 * content, media, users). Auth (`AdminAuthProvider`) lives in the root
 * layout instead, since the public `/sign-in` page — outside /admin —
 * needs it too; see that page for why there's no separate /admin/sign-in.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminDataProvider>{children}</AdminDataProvider>;
}
