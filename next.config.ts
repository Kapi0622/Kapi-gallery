import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // あなたのSupabaseのプロジェクトURLに合わせて許可
      },
    ],
  },
};

export default nextConfig;