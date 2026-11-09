import { STORE_SALE } from "@/lib/campaign";

type Offer = { label: string; icon?: "shoe" | "truck"; sale?: boolean };

const offers: Offer[] = [
  { label: "Nationwide delivery", icon: "truck" },
  { label: "100% original" },
  { label: "First check then pay", icon: "shoe" },
];

// Shown first while the store-wide sale is live.
const saleOffers: Offer[] = [
  { label: "Mega Sale is live", sale: true },
  { label: `Flat ${STORE_SALE.percent}% off on everything`, sale: true },
  { label: "Discount applied automatically", sale: true },
];

export function OfferTicker({ sale = false }: { sale?: boolean }) {
  const items = sale ? [...saleOffers, ...offers] : offers;
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-[#161616] text-white">
      <div className="ticker-scroll flex w-max items-center py-2.5">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {loop.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="mx-3 h-1 w-1 shrink-0 rounded-full bg-white/35" aria-hidden="true" />
                {item.icon === "shoe" ? <ShoeIcon /> : null}
                {item.icon === "truck" ? <TruckIcon /> : null}
                {item.sale ? (
                  <span className="mr-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wide sm:text-[11px]">
                    {STORE_SALE.short}
                  </span>
                ) : null}
                <span
                  className={`text-[11px] uppercase tracking-[0.16em] sm:text-xs ${
                    item.sale ? "font-semibold text-white" : "font-medium"
                  }`}
                >
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
