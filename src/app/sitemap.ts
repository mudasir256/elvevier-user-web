import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { blogs } from "@/data/blogs";
import { products as seedProducts } from "@/data/products";
import { getActiveProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import type { Product } from "@/types";

export const revalidate = 3600;

const stylePaths = ["/jackets", "/hoodies", "/sweatshirts", "/trousers", "/jeans"];
const apparelTypes = ["trouser", "sweatshirt", "jeans", "hoodie", "jacket"];
const subcategoryPaths = [
  ...["tops", "dresses", "tshirts", "bottoms", "blazers", "sweaters", "jackets"].map((slug) => `/women/${slug}`),
  ...["shirts", "tshirts", "polo", "bottoms", "blazers", "sweaters", "jackets"].map((slug) => `/men/${slug}`),
  ...["tops", "bottoms", "dresses"].map((slug) => `/kids/${slug}`),
  "/shoes/men",
  "/shoes/women",
  "/shoes/kids",
  "/accessories/eyewear",
];

function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: priority >= 0.7 ? "daily" : "weekly",
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Product[] = seedProducts.filter((product) => product.active !== false);
  try {
    const live = await getActiveProducts();
    if (live.length) products = live;
  } catch {
    // Seed catalog keeps the sitemap available if the live catalog is unreachable.
  }

  const genderPaths = ["men", "women"].flatMap((gender) => [
    `/${gender}?filter=new`,
    ...apparelTypes.map((type) => `/${gender}?type=${type}`),
  ]);

  return [
    entry("", 1),
    ...categories.map((category) => entry(`/${category.slug}`, 0.8)),
    ...stylePaths.map((path) => entry(path, 0.8)),
    ...subcategoryPaths.map((path) => entry(path, 0.7)),
    ...genderPaths.map((path) => entry(path, 0.7)),
    ...products.map((product) => entry(`/product/${product.slug}`, 0.8)),
    entry("/blog", 0.6),
    ...blogs.map((post) => entry(`/blog/${post.slug}`, 0.6)),
    entry("/about", 0.5),
    entry("/contact", 0.5),
    entry("/faqs", 0.5),
    entry("/returns", 0.4),
    entry("/privacy", 0.3),
  ];
}
