import type { NextConfig } from "next";

// Same value src/lib/api/client.ts falls back to — single source of truth
// for where the real backend lives, read here (plain Node, not bundled to
// the client) so the rewrite below and the client's server-side fetches
// never drift apart.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // mukalimv2-backend's media uploads — Supabase Storage bucket "media"
        // (see the backend's SUPABASE_URL env var / src/utils/storage.ts).
        // Next's image optimizer refuses any host not explicitly allowlisted
        // here, even though the object itself is public and CORS-open.
        protocol: "https",
        hostname: "bitomyqwngxdpbyrutrj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Proxies every browser request to /api/* through this deployment's own
  // origin instead of the backend's cross-origin one. The backend's auth
  // cookies are already spec-correct (SameSite=None; Secure, no explicit
  // Domain), but Safari's Intelligent Tracking Prevention still blocks/purges
  // third-party SameSite=None cookies regardless of correct attributes — a
  // browser-level policy no amount of cookie-attribute tuning gets around.
  // Routing through this rewrite makes the request same-origin from the
  // browser's point of view, so the cookie is set as an ordinary first-party
  // one and Safari never sees a cross-site request to police at all. See
  // `lib/api/client.ts` for the client-side half of this (only browser
  // fetches route through here; server-side rendering calls the backend
  // directly, since that has no cookie/browser concept to begin with).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
