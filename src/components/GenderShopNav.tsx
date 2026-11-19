import Link from "next/link";
import { getActiveProducts } from "@/lib/catalog";
import { genderStyleTabs, styleHref } from "@/lib/styles";

export type GenderShop = "men" | "women";
// "all", "shoes", or a style such as "trouser" or "sweaters".
export type GenderShopType = string;

function hrefFor(gender: GenderShop, type: GenderShopType) {
  if (type === "all") return `/${gender}`;
  if (type === "shoes") return `/shoes/${gender}`;
  return styleHref(type, gender);
}

// The tabs list every style that has products for this gender, so a new type
// added in admin (e.g. "Sweaters") gets its tab without a code change.
export async function GenderShopNav({
  gender,
  active,
}: {
  gender: GenderShop;
  active: GenderShopType;
}) {
  const tabs = [
    { id: "all", label: "All", href: hrefFor(gender, "all") },
    { id: "shoes", label: "Shoes", href: hrefFor(gender, "shoes") },
    ...genderStyleTabs(await getActiveProducts(), gender),
  ];
  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["men", "women"] as const).map((item) => {
          const selected = item === gender;
          return (
            <Link
              key={item}
              href={hrefFor(item, active)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "bg-[#4a142a] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[#4a142a] hover:text-[#4a142a]"
              }`}
            >
              {item === "men" ? "Men" : "Women"}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                selected
                  ? "bg-[#f4e6ec] font-medium text-[#4a142a]"
                  : "text-[var(--muted)] hover:text-[#4a142a]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
