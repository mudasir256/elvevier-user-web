import { STORE_SALE } from "@/lib/campaign";

// name is set when the discount comes from the store-wide sale (e.g. "11.11 Sale").
export function SaleTag({ percent, name, large = false }: { percent: number; name?: string; large?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-red-600 font-semibold uppercase tracking-wide text-white shadow ${
        large ? "right-4 top-4 px-3 py-1 text-sm" : "px-2.5 py-1 text-[10px]"
      }`}
    >
      {name ? STORE_SALE.short : "Sale"} · {percent}% off
    </span>
  );
}
