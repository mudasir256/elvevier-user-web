import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "women", name: "Woman", slug: "women", description: "Women's fashion" },
  { id: "men", name: "Man", slug: "men", description: "Men's fashion" },
  { id: "kids", name: "Kids", slug: "kids", description: "Children's wear" },
  { id: "shoes", name: "Shoes", slug: "shoes", description: "Footwear for all" },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Belts, caps, bags & more",
  },
  { id: "belts", name: "Belts", slug: "belts", description: "Belts" },
  { id: "caps", name: "Caps & Headwear", slug: "caps", description: "Caps and hats" },
  { id: "bags", name: "Bags", slug: "bags", description: "Handbags & more" },
  {
    id: "fragrance",
    name: "Fragrance & Living",
    slug: "fragrance",
    description: "Perfumes & self-care",
  },
];

export const navCategories = [
  {
    id: "women",
    name: "Woman",
    slug: "women",
    children: [
      { name: "New In", slug: "women?filter=new" },
      { name: "Tops & Blouses", slug: "women/tops" },
      { name: "Dresses & Jumpsuits", slug: "women/dresses" },
      { name: "T-Shirts", slug: "women/tshirts" },
      { name: "Bottoms", slug: "women/bottoms" },
      { name: "Blazers", slug: "women/blazers" },
      { name: "Sweaters & Cardigans", slug: "women/sweaters" },
      { name: "Jackets & Coats", slug: "women/jackets" },
      { name: "Shoes", slug: "shoes/women" },
    ],
  },
  {
    id: "men",
    name: "Man",
    slug: "men",
    children: [
      { name: "New In", slug: "men?filter=new" },
      { name: "Shirts", slug: "men/shirts" },
      { name: "T-Shirts", slug: "men/tshirts" },
      { name: "Polo", slug: "men/polo" },
      { name: "Bottoms", slug: "men/bottoms" },
      { name: "Blazers", slug: "men/blazers" },
      { name: "Sweaters & Cardigans", slug: "men/sweaters" },
      { name: "Jackets & Coats", slug: "men/jackets" },
      { name: "Shoes", slug: "shoes/men" },
    ],
  },
  {
    id: "kids",
    name: "Kids",
    slug: "kids",
    children: [
      { name: "New In", slug: "kids?filter=new" },
      { name: "Tops", slug: "kids/tops" },
      { name: "Bottoms", slug: "kids/bottoms" },
      { name: "Dresses", slug: "kids/dresses" },
      { name: "Shoes", slug: "shoes/kids" },
    ],
  },
  {
    id: "shoes",
    name: "Shoes",
    slug: "shoes",
    children: [
      { name: "Woman", slug: "shoes/women" },
      { name: "Man", slug: "shoes/men" },
      { name: "Kids", slug: "shoes/kids" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    children: [
      { name: "Belts", slug: "belts" },
      { name: "Caps", slug: "caps" },
      { name: "Bags", slug: "bags" },
      { name: "Eyewear", slug: "accessories/eyewear" },
    ],
  },
];
