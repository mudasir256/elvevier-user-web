import Link from "next/link";

const types = [
  { id: "all", label: "All" },
  { id: "shoes", label: "Shoes" },
  { id: "trouser", label: "Trouser" },
  { id: "sweatshirt", label: "Sweatshirt" },
  { id: "jeans", label: "Jeans" },
  { id: "hoodie", label: "Hoodies" },
  { id: "jacket", label: "Jackets" },
] as const;

export type GenderShop = "men" | "women";
export type GenderShopType = (typeof types)[number]["id"];

function hrefFor(gender: GenderShop, type: GenderShopType) {
  if (type === "all") return `/${gender}`;
  if (type === "shoes") return `/shoes/${gender}`;
  return `/${gender}?type=${type}`;
}

export function GenderShopNav({
  gender,
  active,
}: {
  gender: GenderShop;
  active: GenderShopType;
}) {
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
        {types.map((type) => {
          const selected = type.id === active;
          return (
            <Link
              key={type.id}
              href={hrefFor(gender, type.id)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                selected
                  ? "bg-[#f4e6ec] font-medium text-[#4a142a]"
                  : "text-[var(--muted)] hover:text-[#4a142a]"
              }`}
            >
              {type.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
