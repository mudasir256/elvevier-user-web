export function SoldBadge({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute z-20 inline-flex items-center gap-1.5 rounded-full bg-[#4a142a] font-semibold uppercase tracking-wide text-white shadow-sm ring-1 ring-white/20 ${
        large ? "right-4 top-4 px-3.5 py-1.5 text-xs" : "right-3 top-3 px-2.5 py-1 text-[10px]"
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white/70" />
      Sold
    </span>
  );
}
