import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { GenderShopNav, type GenderShop, type GenderShopType } from "@/components/GenderShopNav";
import {
  getActiveProducts,
  getProductsByCategory,
  getProductsByCategoryNew,
} from "@/lib/catalog";
import { categories } from "@/data/categories";
import type { Product } from "@/types";
import { MetaCatalogView } from "@/components/MetaPixel";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ filter?: string; type?: string }>;
};

const categorySlugs = categories.map((c) => c.slug);

const stylePages: Record<string, { heading: string; subcategory: string; men: string; women: string }> = {
  jackets: { heading: "Jackets", subcategory: "jacket", men: "/men?type=jacket", women: "/women?type=jacket" },
  jacket: { heading: "Jackets", subcategory: "jacket", men: "/men?type=jacket", women: "/women?type=jacket" },
  hoodies: { heading: "Hoodies", subcategory: "hoodie", men: "/men?type=hoodie", women: "/women?type=hoodie" },
  hoodie: { heading: "Hoodies", subcategory: "hoodie", men: "/men?type=hoodie", women: "/women?type=hoodie" },
  sweatshirts: { heading: "Sweatshirts", subcategory: "sweatshirt", men: "/men?type=sweatshirt", women: "/women?type=sweatshirt" },
  sweatshirt: { heading: "Sweatshirts", subcategory: "sweatshirt", men: "/men?type=sweatshirt", women: "/women?type=sweatshirt" },
  trousers: { heading: "Trousers", subcategory: "trouser", men: "/men?type=trouser", women: "/women?type=trouser" },
  trouser: { heading: "Trousers", subcategory: "trouser", men: "/men?type=trouser", women: "/women?type=trouser" },
  jeans: { heading: "Jeans", subcategory: "jeans", men: "/men?type=jeans", women: "/women?type=jeans" },
};

const apparelTypes: Record<string, { label: string; heading: string }> = {
  trouser: { label: "Trouser", heading: "Trousers" },
  sweatshirt: { label: "Sweatshirt", heading: "Sweatshirts" },
  jeans: { label: "Jeans", heading: "Jeans" },
  hoodie: { label: "Hoodie", heading: "Hoodies" },
  jacket: { label: "Jacket", heading: "Jackets" },
};

function forGender(product: Product, gender: GenderShop) {
  if (gender === "men") {
    return product.categoryId === "men" || (product.categoryId === "shoes" && product.subcategory?.toLowerCase() === "man");
  }
  return product.categoryId === "women" || (product.categoryId === "shoes" && product.subcategory?.toLowerCase() === "woman");
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params;
  const { filter, type } = await searchParams;

  const style = stylePages[categorySlug.toLowerCase()];
  if (style) {
    const products = await getActiveProducts();
    const list = products.filter((product) => product.subcategory?.toLowerCase() === style.subcategory);
    return (
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-10">
        <MetaCatalogView name={style.heading} category={style.subcategory} ids={list.map((product) => product.id)} />
        <div className="mb-8 animate-fade-up">
          <h1 className="section-heading">{style.heading}</h1>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={style.men} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-medium hover:border-[#4a142a] hover:text-[#4a142a]">
              Men
            </Link>
            <Link href={style.women} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-medium hover:border-[#4a142a] hover:text-[#4a142a]">
              Women
            </Link>
          </div>
        </div>
        {list.length === 0 ? (
          <p className="type-copy py-12 text-center text-[var(--muted)]">
            No products in this category yet.{" "}
            <Link href="/" className="text-[var(--accent)] hover:underline">
              Back to home
            </Link>
          </p>
        ) : (
          <>
            <p className="mb-6 text-sm text-[var(--muted)]">
              {list.length} product{list.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {list.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  const category = categories.find(
    (c) => c.slug === categorySlug.toLowerCase()
  );
  if (!category) notFound();

  const gender: GenderShop | null = category.id === "men" || category.id === "women" ? category.id : null;
  const typeKey = type?.toLowerCase();
  const typeInfo = gender && typeKey ? apparelTypes[typeKey] : undefined;
  const isNewFilter = filter === "new";

  let list: Product[];
  if (gender && !isNewFilter) {
    const products = await getActiveProducts();
    const mine = products.filter((product) => forGender(product, gender));
    list = typeInfo
      ? mine.filter((product) => product.subcategory?.toLowerCase() === typeInfo.label.toLowerCase())
      : mine;
  } else {
    list = isNewFilter
      ? await getProductsByCategoryNew(category.id)
      : await getProductsByCategory(category.id);
  }

  const who = gender === "men" ? "Men" : "Women";
  const heading = isNewFilter
    ? `New In – ${category.name}`
    : gender && typeInfo
      ? `${who}'s ${typeInfo.heading}`
      : gender
        ? who
        : category.name;

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-10">
      <MetaCatalogView name={heading} category={category.id} ids={list.map((product) => product.id)} />
      <div className="mb-8 animate-fade-up">
        <h1 className="section-heading capitalize">
          {heading}
        </h1>
        {category.description && (
          <p className="type-copy mt-2 text-[var(--muted)]">{category.description}</p>
        )}
        {gender && (
          <GenderShopNav gender={gender} active={(typeInfo ? typeKey : "all") as GenderShopType} />
        )}
        {category.id === "shoes" && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/shoes/men" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-medium hover:border-[#4a142a] hover:text-[#4a142a]">
              Men
            </Link>
            <Link href="/shoes/women" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-medium hover:border-[#4a142a] hover:text-[#4a142a]">
              Women
            </Link>
          </div>
        )}
      </div>
      {list.length === 0 ? (
        <p className="type-copy py-12 text-center text-[var(--muted)]">
          No products in this category yet.{" "}
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Back to home
          </Link>
        </p>
      ) : (
        <>
          <p className="text-sm text-[var(--muted)] mb-6">
            {list.length} product{list.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {list.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return categorySlugs.map((slug) => ({ category: slug }));
}
