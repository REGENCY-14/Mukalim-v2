import type { NextConfig } from "next";

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
};

export default nextConfig;
