// A store-wide sale: every product gets this discount between startsAt and endsAt (Pakistan time).
// The discount is applied to the product price itself, so cards, product pages, cart and checkout
// all show the sale price, and the server re-prices every order with the same rule.
// A product with its own bigger sale keeps that one; the two are never added together.
// To run another sale, change the values below. To switch it off, set enabled to false.
export const STORE_SALE = {
  enabled: false,
  name: "11.11 Sale",
  short: "11.11",
  percent: 11,
  // Live straight away: no countdown, the sale price shows as soon as this is deployed.
  announceAt: "2026-11-10T00:00:00+05:00",
  startsAt: "2026-11-10T00:00:00+05:00",
  endsAt: "2026-11-12T00:00:00+05:00",
  // false = promo codes are refused while the sale is live.
  allowPromoCodes: true,
};

export type SalePhase = "off" | "upcoming" | "live";

const ms = (value: string) => new Date(value).getTime();

export function salePhase(now = Date.now()): SalePhase {
  if (!STORE_SALE.enabled || !STORE_SALE.percent) return "off";
  if (now >= ms(STORE_SALE.startsAt) && now < ms(STORE_SALE.endsAt)) return "live";
  if (now >= ms(STORE_SALE.announceAt) && now < ms(STORE_SALE.startsAt)) return "upcoming";
  return "off";
}

// The store-wide percent in force right now, or 0.
export function storeSalePercent(now = Date.now()) {
  return salePhase(now) === "live" ? STORE_SALE.percent : 0;
}

export const saleStartsAt = () => ms(STORE_SALE.startsAt);
export const saleEndsAt = () => ms(STORE_SALE.endsAt);
