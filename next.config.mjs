// Plain JS, not TypeScript: Hostinger's servers are too old for Next's native
// compiler, and the WebAssembly fallback it uses there cannot load next.config.ts.
/** @type {import("next").NextConfig} */
const nextConfig = {
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
