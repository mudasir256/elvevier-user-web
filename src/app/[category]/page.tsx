import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import {
  getProductsByCategory,
  getProductsByCategoryNew,
} from "@/data/products";
import { categories } from "@/data/categories";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ filter?: string; for?: string }>;
};

const categorySlugs = categories.map((c) => c.slug);

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params;
  const { filter, for: forParam } = await searchParams;

  const category = categories.find(
    (c) => c.slug === categorySlug.toLowerCase()
  );
  if (!category) notFound();

  const list =
    filter === "new"
      ? getProductsByCategoryNew(category.id)
      : getProductsByCategory(category.id);

  const isNewFilter = filter === "new";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold capitalize">
          {isNewFilter ? `New In – ${category.name}` : category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-[var(--muted)]">{category.description}</p>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-[var(--muted)] py-12 text-center">
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
