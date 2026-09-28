import Image from "next/image";
import { assets } from "@/data/assets";
import { BrandPartners } from "@/components/BrandPartners";

export function HeroSlider() {
  return (
    <>
    <section className="px-3 sm:px-4 md:px-6 pt-3 md:pt-4 pb-3 md:pb-5">
      <div className="relative mx-auto aspect-[1122/1402] h-auto w-full overflow-hidden rounded-[28px] bg-[#ececec] md:aspect-[1958/803]">
        <Image
          src={assets.heroMobile}
          alt="Empulse, we sell all original brands, coming soon"
          fill
          priority
          className="object-cover object-center md:hidden"
          sizes="100vw"
        />
        <Image
          src={assets.hero}
          alt="Empulse, we sell all original brands, coming soon"
          fill
          priority
          className="hidden object-cover object-center md:block"
          sizes="100vw"
        />
      </div>
    </section>
    <OfferTicker />
    <BrandPartners />
    </>
  );
}

const offers: { label: string; icon?: "shoe" | "truck"; sale?: boolean }[] = [
  { label: "100% original" },
  { label: "First check then pay", icon: "shoe" },
  { label: "Nationwide delivery", icon: "truck" },
  { label: "Save 30% off", sale: true },
];

function OfferTicker() {
  const loop = [...offers, ...offers, ...offers, ...offers];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#161616] text-white">
      <div className="ticker-scroll flex w-max items-center py-2.5">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {loop.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="mx-3 h-1 w-1 shrink-0 rounded-full bg-white/35" aria-hidden="true" />
                {item.sale ? (
                  <span className="mr-2 rounded bg-[#4a142a] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    Sale
                  </span>
                ) : null}
                {item.icon === "shoe" ? <ShoeIcon /> : null}
                {item.icon === "truck" ? <TruckIcon /> : null}
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] sm:text-xs">
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShoeIcon() {
  return (
    <svg className="mr-2 h-4 w-4 text-[#c989a3]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 16.5c0-.4.2-.8.6-1l4.2-2.2c.5-.3 1.1-.2 1.5.2l1.2 1.3c.3.3.7.5 1.1.5h7.1c.7 0 1.3.6 1.3 1.3v.4c0 .8-.7 1.5-1.5 1.5H4.5A1.5 1.5 0 0 1 3 17v-.5Zm5.2-4.4 1.6-3.2c.3-.6.9-1 1.6-1h2.1c.4 0 .7.2.9.5l2.4 4.2" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="mr-2 h-4 w-4 text-[#c989a3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 7h11v8H3V7Zm11 3h4l3 3v2h-7v-5ZM7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}
