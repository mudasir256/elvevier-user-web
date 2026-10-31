import type { Product } from "@/types";

// Each colour of an item is its own product ("… T-Shirt Yellow", "… T-Shirt Red").
// Stripping colour words and the brand from the name leaves the article itself.
const COLOR_WORDS = new Set([
  "all", "black", "white", "off", "brown", "green", "blue", "navy", "red", "pink", "yellow", "skin",
  "cream", "beige", "grey", "gray", "dark", "light", "forest", "olive", "khaki", "chocolate", "stone",
  "sand", "tan", "purple", "lilac", "maroon", "burgundy", "orange", "charcoal", "camel", "ivory",
]);

function words(text: string) {
  return text.toLowerCase().split(/[^a-z0-9'&-]+/).filter(Boolean);
}

export function articleKey(product: Product) {
  const skip = new Set([...COLOR_WORDS, ...words(product.color ?? ""), ...words(product.brand ?? "")]);
  const rest = words(product.name).filter((word) => !skip.has(word));
  return `${product.categoryId}|${(product.brand ?? "").trim().toLowerCase()}|${rest.join(" ")}`;
}

// Keeps the first product of each article, so a row shows different items instead of one item in every colour.
export function onePerArticle(products: Product[]) {
  const seen = new Set<string>();
  return products.filter((product) => {
    const key = articleKey(product);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
