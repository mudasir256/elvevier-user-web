import type { ComponentProps, CSSProperties } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ComingSoon } from "@/components/ComingSoon";
import type { Product } from "@/types";
import { availableFirst } from "@/lib/variants";
import { sameType } from "@/lib/productTypes";

// Columns of the product grid at each screen size: phones, sm, md, lg.
const COLUMNS = [2, 3, 4, 5] as const;
const GRID = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6";
// Each card reads its position for the current screen size from CSS variables set below.
const PLACED =
  "[order:var(--o2)] [grid-column-start:var(--c2)] sm:[order:var(--o3)] sm:[grid-column-start:var(--c3)] md:[order:var(--o4)] md:[grid-column-start:var(--c4)] lg:[order:var(--o5)] lg:[grid-column-start:var(--c5)]";

/**
 * One full row of each type in turn (e.g. a row of sweatshirts, then a row of hoodies), at every
 * screen size. When a type runs out, the others carry on. Products of no listed type come last.
 */
function rowPlacement(groups: Product[][]) {
  const placement = new Map<string, Record<string, string | number>>();
  for (const columns of COLUMNS) {
    const queues = groups.map((group) => [...group]);
    let position = 0;
    while (queues.some((queue) => queue.length)) {
      for (const queue of queues) {
        const row = queue.splice(0, columns);
        row.forEach((product, i) => {
          const vars = placement.get(product.id) ?? {};
          vars[`--o${columns}`] = position++;
          // The first card of each run starts a new row, so a short run never shares a row.
          vars[`--c${columns}`] = i === 0 ? 1 : "auto";
          placement.set(product.id, vars);
        });
      }
    }
  }
  return placement;
}

export function BrandSections({
  products,
  heading,
  empty,
  rowTypes,
}: {
  products: Product[];
  heading: string;
  empty?: Partial<ComponentProps<typeof ComingSoon>>;
  /** Alternate whole rows of these product types, in this order, e.g. ["sweatshirt", "hoodie"]. */
  rowTypes?: string[];
}) {
  if (products.length === 0) {
    return (
      <ComingSoon
        title={`${heading} are on their way`}
        text={`We're putting together a new range of ${heading.toLowerCase()}. Check back soon.`}
        {...empty}
      />
    );
  }

  const count = (
    <p className="text-sm text-[var(--muted)] mb-6">
      {products.length} product{products.length !== 1 ? "s" : ""}
    </p>
  );

  if (rowTypes?.length) {
    const groups = rowTypes.map((type) => availableFirst(products.filter((product) => sameType(product.subcategory, type))));
    const rest = availableFirst(products.filter((product) => !rowTypes.some((type) => sameType(product.subcategory, type))));
    const placement = rowPlacement(rest.length ? [...groups, rest] : groups);
    // Page order follows the widest layout; CSS reorders the cards for smaller screens.
    const ordered = [...products].sort((a, b) => Number(placement.get(a.id)?.["--o5"]) - Number(placement.get(b.id)?.["--o5"]));
    return (
      <>
        {count}
        <div className={GRID}>
          {ordered.map((product, i) => (
            <div key={product.id} className={PLACED} style={placement.get(product.id) as CSSProperties}>
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {count}
      <div className={GRID}>
        {availableFirst(products).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </>
  );
}
