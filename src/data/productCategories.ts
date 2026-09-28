import type { CategoryId } from "@/types";

export const productCategories: {
  id: CategoryId;
  name: string;
  subcategories: string[];
}[] = [
  {
    id: "women",
    name: "Woman",
    subcategories: ["Tops", "Dresses", "T-Shirts", "Bottoms", "Blazers", "Sweaters", "Jackets"],
  },
  {
    id: "men",
    name: "Man",
    subcategories: ["Shirts", "T-Shirts", "Polo", "Bottoms", "Blazers", "Sweaters", "Jackets"],
  },
  {
    id: "kids",
    name: "Kids",
    subcategories: ["Tops", "Bottoms", "Dresses"],
  },
  { id: "shoes", name: "Shoes", subcategories: ["Woman", "Man", "Kids"] },
  { id: "accessories", name: "Accessories", subcategories: ["Eyewear"] },
  { id: "belts", name: "Belts", subcategories: [] },
  { id: "caps", name: "Caps & Headwear", subcategories: [] },
  { id: "bags", name: "Bags", subcategories: [] },
  { id: "fragrance", name: "Fragrance & Living", subcategories: [] },
];

export function isCategoryId(value: string): value is CategoryId {
  return productCategories.some((category) => category.id === value);
}
