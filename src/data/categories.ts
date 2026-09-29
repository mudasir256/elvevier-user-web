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
    id: "shoes",
    name: "Shoes",
    slug: "shoes",
    children: [
      { name: "Men", slug: "shoes/men" },
      { name: "Women", slug: "shoes/women" },
    ],
  },
  {
    id: "trouser",
    name: "Trouser",
    slug: "search?q=trouser",
    children: [
      { name: "Men", slug: "men?type=trouser" },
      { name: "Women", slug: "women?type=trouser" },
    ],
  },
  {
    id: "sweatshirt",
    name: "Sweatshirt",
    slug: "search?q=sweatshirt",
    children: [
      { name: "Men", slug: "men?type=sweatshirt" },
      { name: "Women", slug: "women?type=sweatshirt" },
    ],
  },
  {
    id: "jeans",
    name: "Jeans",
    slug: "search?q=jeans",
    children: [
      { name: "Men", slug: "men?type=jeans" },
      { name: "Women", slug: "women?type=jeans" },
    ],
  },
  {
    id: "hoodies",
    name: "Hoodies",
    slug: "search?q=hoodie",
    children: [
      { name: "Men", slug: "men?type=hoodie" },
      { name: "Women", slug: "women?type=hoodie" },
    ],
  },
  {
    id: "jackets",
    name: "Jackets",
    slug: "search?q=jacket",
    children: [
      { name: "Men", slug: "men?type=jacket" },
      { name: "Women", slug: "women?type=jacket" },
    ],
  },
];
