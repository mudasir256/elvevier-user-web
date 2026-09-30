import type { Product } from "@/types";
import { products as seedProducts } from "@/data/products";
import { getSupabase } from "@/lib/supabase";
import { normalizeColorImages, normalizeVariants, type ColorGallery } from "@/lib/variants";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  category_id: Product["categoryId"];
  subcategory: string;
  color: string;
  variants: unknown;
  color_images?: unknown;
  image: string;
  images: string[] | null;
  description: string;
  featured: boolean;
  is_new: boolean;
  active: boolean;
  created_at: string;
  updated_at: string | null;
};

const subcategorySlugToLabel: Record<string, Record<string, string>> = {
  women: {
    tops: "Tops",
    dresses: "Dresses",
    tshirts: "T-Shirts",
    bottoms: "Bottoms",
    blazers: "Blazers",
    sweaters: "Sweaters",
    jackets: "Jackets",
  },
  men: {
    shirts: "Shirts",
    tshirts: "T-Shirts",
    polo: "Polo",
    bottoms: "Bottoms",
    blazers: "Blazers",
    sweaters: "Sweaters",
    jackets: "Jackets",
  },
  kids: {
    tops: "Tops",
    bottoms: "Bottoms",
    dresses: "Dresses",
  },
};

function toProduct(row: ProductRow): Product {
  const gallery = Array.isArray(row.images) ? row.images.map(String).filter(Boolean) : [];
  const images = gallery.length ? gallery : row.image ? [row.image] : [];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    categoryId: row.category_id,
    subcategory: row.subcategory || undefined,
    color: row.color,
    variants: normalizeVariants(row.variants),
    colorImages: normalizeColorImages(row.color_images),
    image: images[0] || row.image,
    images,
    description: row.description || undefined,
    featured: row.featured,
    new: row.is_new,
    active: row.active,
  };
}

export function collectImages(body: Record<string, unknown>) {
  const listed = Array.isArray(body.images) ? body.images.map((item) => String(item).trim()).filter(Boolean) : [];
  const single = String(body.image ?? "").trim();
  const images = [...new Set(listed.length ? listed : single ? [single] : [])].slice(0, 8);
  if (!images.length) return { error: "Add at least one product image." as const };
  return { image: images[0], images };
}

export function resolveProductPhotos(body: Record<string, unknown>, colorImages: ColorGallery[]) {
  const photos = collectImages(body);
  const first = colorImages.find((item) => item.images.length);
  if ("error" in photos) {
    if (!first) return photos;
    return { image: first.images[0], images: first.images };
  }
  if (first) return { image: first.images[0], images: photos.images };
  return photos;
}

let seedPromise: Promise<void> | null = null;

async function seedIfEmpty() {
  const supabase = getSupabase();
  const { count, error } = await supabase.from("products").select("id", { count: "exact", head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return;

  const rows = seedProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    category_id: product.categoryId,
    subcategory: product.subcategory ?? "",
    color: product.color,
    image: product.image,
    images: product.images?.length ? product.images : [product.image],
    description: product.description ?? "",
    featured: Boolean(product.featured),
    is_new: Boolean(product.new),
    active: true,
  }));

  const inserted = await supabase.from("products").upsert(rows, { onConflict: "id" });
  if (inserted.error) throw inserted.error;
}

export function ensureCatalog() {
  if (!seedPromise) {
    seedPromise = seedIfEmpty().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

export async function listProducts(options?: { activeOnly?: boolean }) {
  await ensureCatalog();
  const supabase = getSupabase();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (options?.activeOnly) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map(toProduct);
}

export async function getActiveProducts() {
  return listProducts({ activeOnly: true });
}

export async function getProductsByCategory(categoryId: string) {
  const products = await getActiveProducts();
  return products.filter((product) => product.categoryId === categoryId);
}

export async function getProductsByCategoryAndSubcategory(categoryId: string, subcategorySlug: string) {
  const products = await getActiveProducts();
  const base = products.filter((product) => product.categoryId === categoryId);
  if (categoryId === "shoes") {
    const label = subcategorySlug === "women" ? "Woman" : subcategorySlug === "men" ? "Man" : subcategorySlug === "kids" ? "Kids" : "";
    if (!label) return base;
    return base.filter((product) => product.subcategory?.toLowerCase() === label.toLowerCase());
  }
  if (categoryId === "accessories" && subcategorySlug.toLowerCase() === "eyewear") {
    return base.filter((product) => product.subcategory?.toLowerCase() === "eyewear");
  }
  const map = subcategorySlugToLabel[categoryId];
  if (!map) return base;
  const label = map[subcategorySlug.toLowerCase()];
  if (!label) return base;
  return base.filter((product) => product.subcategory?.toLowerCase() === label.toLowerCase());
}

export async function getProductsByCategoryNew(categoryId: string) {
  const products = await getActiveProducts();
  return products.filter((product) => product.categoryId === categoryId && product.new);
}

export async function getProductBySlug(slug: string) {
  const products = await getActiveProducts();
  return products.find((product) => product.slug === slug);
}

export async function getFeaturedProducts() {
  const products = await getActiveProducts();
  return products.filter((product) => product.featured);
}

export async function getNewProducts() {
  const products = await getActiveProducts();
  return products.filter((product) => product.new);
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
