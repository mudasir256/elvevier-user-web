import { BrandPartners } from "@/components/BrandPartners";
import { HeroMedia } from "@/components/HeroMedia";
import { listActiveBanners } from "@/lib/banners";

export async function HeroSlider() {
  const banners = await listActiveBanners();
  return (
    <>
    {banners.length ? (
      <section className="px-3 sm:px-4 md:px-6 pt-3 md:pt-4 pb-3 md:pb-5" aria-label="Featured banners">
        <HeroMedia banners={banners} />
      </section>
    ) : null}
    <BrandPartners />
    </>
  );
}
