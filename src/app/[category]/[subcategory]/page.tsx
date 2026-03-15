import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import {
  getProductsByCategoryAndSubcategory,
  getProductsByCategory,
} from "@/data/products";
import { categories } from "@/data/categories";
import { navCategories } from "@/data/categories";

type Props = {
  params: Promise<{ category: string; subcategory: string }>;
};

const categorySlugs = ["women", "men", "kids", "shoes", "accessories"] as const;

const subcategoryTitles: Record<string, Record<string, string>> = {
  women: {
    tops: "Tops & Blouses",
    dresses: "Dresses & Jumpsuits",
    tshirts: "T-Shirts",
    bottoms: "Bottoms",
    blazers: "Blazers",
    sweaters: "Sweaters & Cardigans",
    jackets: "Jackets & Coats",
  },
  men: {
    shirts: "Shirts",
    tshirts: "T-Shirts",
    polo: "Polo",
    bottoms: "Bottoms",
    blazers: "Blazers",
    sweaters: "Sweaters & Cardigans",
    jackets: "Jackets & Coats",
  },
  kids: {
    tops: "Tops",
    bottoms: "Bottoms",
    dresses: "Dresses",
  },
  shoes: {
    women: "Shoes – Woman",
    men: "Shoes – Man",
    kids: "Shoes – Kids",
  },
  accessories: {
    eyewear: "Eyewear",
  },
};

const validSubcategories: Record<string, string[]> = {
  women: ["tops", "dresses", "tshirts", "bottoms", "blazers", "sweaters", "jackets"],
  men: ["shirts", "tshirts", "polo", "bottoms", "blazers", "sweaters", "jackets"],
  kids: ["tops", "bottoms", "dresses"],
  shoes: ["women", "men", "kids"],
  accessories: ["eyewear"],
};

export default async function SubcategoryPage({ params }: Props) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const cat = categorySlug.toLowerCase();
  const sub = subcategorySlug.toLowerCase();

  if (!categorySlugs.includes(cat as (typeof categorySlugs)[number])) notFound();
  const allowed = validSubcategories[cat];
  if (!allowed || !allowed.includes(sub)) notFound();

  const category = categories.find((c) => c.slug === cat);
  if (!category) notFound();

  const title =
    subcategoryTitles[cat]?.[sub] ??
    subcategorySlug.charAt(0).toUpperCase() + subcategorySlug.slice(1);

  const list =
    cat === "shoes"
      ? getProductsByCategory("shoes")
      : getProductsByCategoryAndSubcategory(category.id, sub);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-up">
        <nav className="text-sm text-[var(--muted)] mb-1">
          <Link href="/" className="hover:text-[var(--accent)]">
            Home
          </Link>
          <span className="mx-1">/</span>
          <Link href={`/${cat}`} className="hover:text-[var(--accent)]">
            {category.name}
          </Link>
          <span className="mx-1">/</span>
          <span className="text-[var(--foreground)]">{title}</span>
        </nav>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">
          {title}
        </h1>
        {category.description && (
          <p className="mt-2 text-[var(--muted)]">{category.description}</p>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-[var(--muted)] py-12 text-center animate-fade-up">
          No products in this section yet.{" "}
          <Link href={`/${cat}`} className="text-[var(--accent)] hover:underline">
            View all {category.name}
          </Link>
        </p>
      ) : (
        <>
          <p className="text-sm text-[var(--muted)] mb-6 animate-fade-up">
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
  const params: { category: string; subcategory: string }[] = [];
  for (const [cat, subs] of Object.entries(validSubcategories)) {
    for (const sub of subs) {
      params.push({ category: cat, subcategory: sub });
    }
  }
  return params;
}
