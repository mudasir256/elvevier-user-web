// Plain JS, not TypeScript: Hostinger's servers are too old for Next's native
// compiler, and the WebAssembly fallback it uses there cannot load next.config.ts.
/** @type {import("next").NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Sweatshirts and hoodies share one page; old links keep working (?gender=women is kept).
  async redirects() {
    return ["/sweatshirts", "/sweatshirt", "/hoodies", "/hoodie"].map((source) => ({
      source,
      destination: "/sweatshirts-and-hoodies",
      permanent: true,
    }));
  },
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
