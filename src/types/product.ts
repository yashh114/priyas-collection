export type Category =
  | "Sarees"
  | "Ready-to-Wear Sarees"
  | "Kurtis"
  | "Kurta Sets"
  | "Lehengas"
  | "Palazzos"
  | "Dupattas";

export type Fabric =
  | "Silk"
  | "Cotton"
  | "Organza"
  | "Georgette"
  | "Chiffon"
  | "Velvet"
  | "Linen"
  | "Crepe";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL";

export const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

/** Categories that support size selection */
export const SIZED_CATEGORIES: Category[] = ["Kurtis", "Kurta Sets"];

export interface Product {
  id: string;
  name: string;
  category: Category;
  fabric: Fabric;
  occasion: string[];
  priceRange: string;
  description: string;
  images: string[];
  featured: boolean;
  trending: boolean;
  sizes?: Size[];
  createdAt: string;
}
