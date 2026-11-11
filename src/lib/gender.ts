import type { Product } from "@/types";
import type { GenderShop } from "@/components/GenderShopNav";

// Whether a product belongs in the men's or women's view. Unisex items show in both;
// shoes go by their type ("Men" / "Woman").
export function forGender(product: Product, gender: GenderShop) {
  const type = product.subcategory?.toLowerCase();
  if (gender === "men") {
    return product.categoryId === "men" || product.categoryId === "unisex" || (product.categoryId === "shoes" && (type === "men" || type === "man"));
  }
  return product.categoryId === "women" || product.categoryId === "unisex" || (product.categoryId === "shoes" && type === "woman");
}
