import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, products } from "@/data/products";
import { AddToCartButton } from "./AddToCartButton";

type Props = { params: Promise<{ slug: string }> };

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-[var(--muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${product.categoryId}`}
          className="hover:text-[var(--accent)] capitalize"
        >
          {product.categoryId}
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--cream)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.new && (
            <span className="absolute top-4 left-4 px-3 py-1 text-sm font-medium bg-[var(--foreground)] text-[var(--cream)] rounded">
              New
            </span>
          )}
        </div>

        <div>
          <p className="text-[var(--muted)] text-sm uppercase tracking-wider">
            {product.color}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-2">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[var(--muted)] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.description && (
            <p className="mt-6 text-[var(--muted)]">{product.description}</p>
          )}
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Free shipping on orders above Rs. 2,500. Easy returns.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 pt-16 border-t border-[var(--border)]">
          <h2 className="font-serif text-2xl font-semibold mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--cream)]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    sizes="25vw"
                  />
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{p.color}</p>
                <p className="font-medium line-clamp-2 group-hover:text-[var(--accent)]">
                  {p.name}
                </p>
                <p className="text-sm font-medium">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
