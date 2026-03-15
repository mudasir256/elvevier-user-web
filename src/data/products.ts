import type { Product } from "@/types";
import { assets } from "./assets";

export const products: Product[] = [
  // Women - featured & new
  {
    id: "w-rust-shirt",
    name: "Rust Half-Button Summer Shirt",
    slug: "rust-half-button-summer-shirt",
    price: 5450,
    categoryId: "women",
    subcategory: "Tops",
    color: "Rust",
    image: assets.womenTops,
    featured: true,
    new: true,
  },
  {
    id: "w-safari",
    name: "Green Washed Effect Safari Shirt",
    slug: "green-washed-effect-safari-shirt",
    price: 6450,
    categoryId: "women",
    subcategory: "Tops",
    color: "Green",
    image: assets.greenShirt,
    featured: true,
    new: true,
  },
  {
    id: "w-garden-pants",
    name: "Black Garden After Dark Pants",
    slug: "black-garden-after-dark-pants",
    price: 3950,
    categoryId: "women",
    subcategory: "Bottoms",
    color: "Black",
    image: assets.khakiTrousers2,
    featured: true,
    new: true,
  },
  {
    id: "w-linen-blend",
    name: "Beige Bamboo Linen Blend Shirt",
    slug: "beige-bamboo-linen-blend-shirt",
    price: 7450,
    categoryId: "women",
    subcategory: "Tops",
    color: "Beige",
    image: assets.linenShirtChoc,
    new: true,
  },
  {
    id: "w-denim-vest",
    name: "Dark Blue Classic Denim Vest",
    slug: "dark-blue-classic-denim-vest",
    price: 6450,
    categoryId: "women",
    subcategory: "Tops",
    color: "Dark Blue",
    image: assets.denimVest,
  },
  {
    id: "w-striped-shirt",
    name: "Blue Cotton Striped Shirt",
    slug: "blue-cotton-striped-shirt",
    price: 5950,
    categoryId: "women",
    subcategory: "Tops",
    color: "Blue",
    image: assets.blueStripedShirt,
  },
  {
    id: "w-dress-midi",
    name: "Ivory Midi Dress",
    slug: "ivory-midi-dress",
    price: 8950,
    categoryId: "women",
    subcategory: "Dresses",
    color: "Ivory",
    image: assets.satinDress,
  },
  {
    id: "w-cardigan",
    name: "Sage Cropped Cardigan",
    slug: "sage-cropped-cardigan",
    price: 5250,
    categoryId: "women",
    subcategory: "Sweaters",
    color: "Sage",
    image: assets.twoAbb,
  },
  // Men
  {
    id: "m-polo-coffee",
    name: "Coffee Textured Polo",
    slug: "coffee-textured-polo",
    price: 7450,
    categoryId: "men",
    subcategory: "Polo",
    color: "Coffee",
    image: assets.jerseyCuban,
    featured: true,
    new: true,
  },
  {
    id: "m-tee-ivory",
    name: "Ivory Hotel Metropole Tee",
    slug: "ivory-hotel-metropole-tee",
    price: 3450,
    categoryId: "men",
    subcategory: "T-Shirts",
    color: "Ivory",
    image: assets.coneTee,
    featured: true,
    new: true,
  },
  {
    id: "m-safari-green",
    name: "Green Washed Effect Safari Shirt",
    slug: "green-washed-effect-safari-shirt-men",
    price: 6450,
    categoryId: "men",
    subcategory: "Shirts",
    color: "Green",
    image: assets.greenShirt,
    new: true,
  },
  {
    id: "m-zipper-polo",
    name: "Black Zipper Polo",
    slug: "black-zipper-polo",
    price: 7450,
    categoryId: "men",
    subcategory: "Polo",
    color: "Black",
    image: assets.blackDenimShirt,
  },
  {
    id: "m-linen-shirt",
    name: "Chocolate 100% Pure Linen Shirt",
    slug: "chocolate-pure-linen-shirt",
    price: 12950,
    categoryId: "men",
    subcategory: "Shirts",
    color: "Chocolate",
    image: assets.linenShirtChoc2,
  },
  {
    id: "m-garden-shirt",
    name: "Black Garden After Dark Shirt",
    slug: "black-garden-after-dark-shirt",
    price: 5950,
    categoryId: "men",
    subcategory: "Shirts",
    color: "Black",
    image: assets.blackDenimShirt2,
  },
  {
    id: "m-beige-safari",
    name: "Beige Stitch Detail Safari",
    slug: "beige-stitch-detail-safari",
    price: 7450,
    categoryId: "men",
    subcategory: "Shirts",
    color: "Beige",
    image: assets.beigeSafari,
  },
  {
    id: "m-grey-safari",
    name: "Grey Washed Effect Safari Shirt",
    slug: "grey-washed-effect-safari-shirt",
    price: 6450,
    categoryId: "men",
    subcategory: "Shirts",
    color: "Grey",
    image: assets.greySafari,
  },
  {
    id: "m-khaki-trousers",
    name: "Khaki Pleated Straight Trousers",
    slug: "khaki-pleated-straight-trousers",
    price: 5490,
    categoryId: "men",
    subcategory: "Bottoms",
    color: "Khaki",
    image: assets.khakiTrousers,
  },
  // Kids
  {
    id: "k-tshirt",
    name: "Kids Cotton Graphic Tee",
    slug: "kids-cotton-graphic-tee",
    price: 1950,
    categoryId: "kids",
    subcategory: "Tops",
    color: "Navy",
    image: assets.img5533,
    new: true,
  },
  {
    id: "k-dress",
    name: "Floral Summer Dress",
    slug: "kids-floral-summer-dress",
    price: 3250,
    categoryId: "kids",
    subcategory: "Dresses",
    color: "Pink",
    image: assets.satinDress,
  },
  {
    id: "k-hoodie",
    name: "Kids Hoodie",
    slug: "kids-hoodie",
    price: 2750,
    categoryId: "kids",
    subcategory: "Tops",
    color: "Grey",
    image: assets.d0d2047b,
  },
  // Shoes
  {
    id: "sh-sandals-tan",
    name: "Tan Holiday Mama Sandals",
    slug: "tan-holiday-mama-sandals",
    price: 7450,
    categoryId: "shoes",
    color: "Tan",
    image: assets.loafers1,
    featured: true,
  },
  {
    id: "sh-sneakers-navy",
    name: "Navy Lace-Up Knit Sneakers",
    slug: "navy-lace-up-knit-sneakers",
    price: 14950,
    categoryId: "shoes",
    color: "Navy",
    image: assets.menSneakers,
    featured: true,
  },
  {
    id: "sh-blocks-coffee",
    name: "Coffee Brunch & Bookstore Blocks",
    slug: "coffee-brunch-bookstore-blocks",
    price: 6950,
    categoryId: "shoes",
    color: "Coffee",
    image: assets.sandSneakers,
  },
  {
    id: "sh-suede-beige",
    name: "Beige Suede Lifestyle Sneakers",
    slug: "beige-suede-lifestyle-sneakers",
    price: 14950,
    categoryId: "shoes",
    color: "Beige",
    image: assets.loafers2,
  },
  {
    id: "sh-slides-pink",
    name: "Pink Cushiony Party Slides",
    slug: "pink-cushiony-party-slides",
    price: 5450,
    categoryId: "shoes",
    color: "Pink",
    image: assets.sandSneakers,
  },
  {
    id: "sh-loafers",
    name: "Brown Leather Loafers",
    slug: "brown-leather-loafers",
    price: 9950,
    categoryId: "shoes",
    color: "Brown",
    image: assets.loafers1,
  },
  // Belts
  {
    id: "b-leather-classic",
    name: "Classic Leather Belt",
    slug: "classic-leather-belt",
    price: 2450,
    categoryId: "belts",
    color: "Brown",
    image: assets.accessory,
  },
  {
    id: "b-leather-black",
    name: "Black Leather Belt",
    slug: "black-leather-belt",
    price: 2450,
    categoryId: "belts",
    color: "Black",
    image: assets.accessory,
  },
  // Caps
  {
    id: "c-baseball-navy",
    name: "Navy Baseball Cap",
    slug: "navy-baseball-cap",
    price: 1650,
    categoryId: "caps",
    color: "Navy",
    image: assets.accessory,
  },
  {
    id: "c-beanie",
    name: "Wool Beanie",
    slug: "wool-beanie",
    price: 1250,
    categoryId: "caps",
    color: "Grey",
    image: assets.accessory,
  },
  // Bags
  {
    id: "bag-meadow",
    name: "Coffee Meadow Shoulder Bag",
    slug: "coffee-meadow-shoulder-bag",
    price: 11950,
    categoryId: "bags",
    color: "Coffee",
    image: assets.bagStyle,
    featured: true,
  },
  {
    id: "bag-oakland",
    name: "Cream Oakland Handle Bag",
    slug: "cream-oakland-handle-bag",
    price: 11950,
    categoryId: "bags",
    color: "Cream",
    image: assets.oaklandBag,
  },
  {
    id: "bag-cairo",
    name: "Coffee Cairo Shoulder Bag",
    slug: "coffee-cairo-shoulder-bag",
    price: 11950,
    categoryId: "bags",
    color: "Coffee",
    image: assets.lotusBag,
  },
  {
    id: "bag-crossbody",
    name: "Coffee Small Lotus Crossbody",
    slug: "coffee-small-lotus-crossbody",
    price: 8450,
    categoryId: "bags",
    color: "Coffee",
    image: assets.lotusBag2,
  },
  // Fragrance
  {
    id: "fr-perfume-1",
    name: "Desert Rose Eau de Parfum",
    slug: "desert-rose-eau-de-parfum",
    price: 8950,
    categoryId: "fragrance",
    color: "—",
    image: assets.imagesJpeg,
  },
  {
    id: "fr-candle",
    name: "Sandalwood Candle",
    slug: "sandalwood-candle",
    price: 3450,
    categoryId: "fragrance",
    color: "—",
    image: assets.imagesJpeg,
  },
];

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

/** Slug used in URL -> product subcategory value (for filtering) */
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

export function getProductsByCategoryAndSubcategory(
  categoryId: string,
  subcategorySlug: string
): Product[] {
  const base = products.filter((p) => p.categoryId === categoryId);
  if (categoryId === "shoes") {
    return base;
  }
  if (categoryId === "accessories" && subcategorySlug.toLowerCase() === "eyewear") {
    return [];
  }
  const map = subcategorySlugToLabel[categoryId];
  if (!map) return base;
  const label = map[subcategorySlug.toLowerCase()];
  if (!label) return base;
  return base.filter(
    (p) => p.subcategory?.toLowerCase() === label.toLowerCase()
  );
}

export function getProductsByCategoryNew(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId && p.new);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.new);
}
