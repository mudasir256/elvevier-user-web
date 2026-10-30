import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "women", name: "Woman", slug: "women", description: "Women's fashion" },
  { id: "men", name: "Men", slug: "men", description: "Men's fashion" },
  { id: "unisex", name: "Unisex", slug: "unisex", description: "Styles for everyone" },
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
    slug: "trousers",
    children: [
      { name: "Men", slug: "trousers" },
      { name: "Women", slug: "trousers?gender=women" },
    ],
  },
  {
    id: "sweatshirt",
    name: "Sweatshirt",
    slug: "sweatshirts",
    children: [
      { name: "Men", slug: "sweatshirts" },
      { name: "Women", slug: "sweatshirts?gender=women" },
    ],
  },
  {
    id: "jeans",
    name: "Jeans",
    slug: "jeans",
    children: [
      { name: "Men", slug: "jeans" },
      { name: "Women", slug: "jeans?gender=women" },
    ],
  },
  {
    id: "hoodies",
    name: "Hoodies",
    slug: "hoodies",
    children: [
      { name: "Men", slug: "hoodies" },
      { name: "Women", slug: "hoodies?gender=women" },
    ],
  },
  {
    id: "jackets",
    name: "Jackets",
    slug: "jackets",
    children: [
      { name: "Men", slug: "jackets" },
      { name: "Women", slug: "jackets?gender=women" },
    ],
  },
];
