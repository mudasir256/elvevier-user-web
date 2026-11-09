import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Product photos come from Supabase Storage; serve them directly so a
    // failed Next image-optimizer request cannot break every product image.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fvpukvbdvtfqlnvlijqa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
