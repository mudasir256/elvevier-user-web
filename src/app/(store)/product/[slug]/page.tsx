import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getActiveProducts, getProductBySlug } from "@/lib/catalog";
import { ProductDetail } from "./ProductDetail";

type Props = { params: Promise<{ slug: string }> };

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getActiveProducts())
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[100rem] px-4 py-8 sm:px-6 lg:px-10">
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

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-20 pt-16 border-t border-[var(--border)]">
          <h2 className="section-heading mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group flex h-full flex-col"
              >
                <div className="relative aspect-[3/4] shrink-0 overflow-hidden rounded-xl bg-[var(--cream)]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain scale-110"
                    sizes="25vw"
                  />
                </div>
                <p className="mt-2 h-5 truncate text-sm text-[var(--muted)]">{p.color}</p>
                <p className="h-12 overflow-hidden font-medium leading-6 line-clamp-2 group-hover:text-[var(--accent)]">
                  {p.name}
                </p>
                <p className="mt-auto pt-1 text-sm font-medium">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((product) => ({ slug: product.slug }));
}
