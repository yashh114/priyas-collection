import { Product } from "@/types/product";
import categorySarees from "@/assets/category-sarees.jpg";
import categoryKurtis from "@/assets/category-kurtis.jpg";
import categoryLehengas from "@/assets/category-lehengas.jpg";
import featuredCollection from "@/assets/featured-collection.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

// Re-use available images for product listings
const productImages = [categorySarees, categoryKurtis, categoryLehengas, featuredCollection, heroBanner];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Crimson Banarasi Silk Saree",
    category: "Sarees",
    fabric: "Silk",
    occasion: ["Wedding", "Festive"],
    priceRange: "₹15,000 – ₹18,000",
    description: "A stunning crimson Banarasi silk saree with intricate gold zari work. Perfect for weddings and festive celebrations.",
    images: [categorySarees, heroBanner],
    featured: true,
    trending: true,
    createdAt: "2026-03-01",
  },
  {
    id: "2",
    name: "Ivory Chikankari Kurta Set",
    category: "Kurta Sets",
    fabric: "Cotton",
    occasion: ["Casual", "Festive"],
    priceRange: "₹4,500 – ₹5,500",
    description: "An elegant ivory kurta set featuring delicate Chikankari embroidery. Comfortable yet refined for everyday luxury.",
    images: [categoryKurtis],
    featured: true,
    trending: false,
    createdAt: "2026-03-02",
  },
  {
    id: "3",
    name: "Royal Maroon Bridal Lehenga",
    category: "Lehengas",
    fabric: "Velvet",
    occasion: ["Wedding", "Reception"],
    priceRange: "₹45,000 – ₹55,000",
    description: "A breathtaking royal maroon bridal lehenga with heavy gold embroidery and stone work. The ultimate bridal statement piece.",
    images: [categoryLehengas, heroBanner],
    featured: true,
    trending: true,
    createdAt: "2026-03-01",
  },
  {
    id: "4",
    name: "Blush Pink Organza Dupatta",
    category: "Dupattas",
    fabric: "Organza",
    occasion: ["Festive", "Party"],
    priceRange: "₹2,500 – ₹3,500",
    description: "A lightweight blush pink organza dupatta with subtle sequin borders. The perfect finishing touch.",
    images: [featuredCollection],
    featured: false,
    trending: true,
    createdAt: "2026-03-03",
  },
  {
    id: "5",
    name: "Emerald Georgette Ready Saree",
    category: "Ready-to-Wear Sarees",
    fabric: "Georgette",
    occasion: ["Party", "Festive"],
    priceRange: "₹8,000 – ₹10,000",
    description: "Pre-stitched for effortless draping. This emerald georgette saree brings modern convenience to traditional elegance.",
    images: [featuredCollection, categorySarees],
    featured: false,
    trending: true,
    createdAt: "2026-03-02",
  },
  {
    id: "6",
    name: "Mustard Silk Palazzo Set",
    category: "Palazzos",
    fabric: "Silk",
    occasion: ["Festive", "Casual"],
    priceRange: "₹6,000 – ₹7,500",
    description: "A flowing mustard silk palazzo set with delicate gota patti detailing. Effortlessly elegant for festive occasions.",
    images: [categoryKurtis],
    featured: false,
    trending: false,
    createdAt: "2026-03-04",
  },
  {
    id: "7",
    name: "Navy Chanderi Silk Kurti",
    category: "Kurtis",
    fabric: "Silk",
    occasion: ["Office", "Casual"],
    priceRange: "₹3,200 – ₹4,000",
    description: "A refined navy Chanderi silk kurti with subtle gold prints. Perfect for office wear with an ethnic touch.",
    images: [categoryKurtis, featuredCollection],
    featured: true,
    trending: false,
    createdAt: "2026-03-05",
  },
  {
    id: "8",
    name: "Teal Chiffon Embroidered Saree",
    category: "Sarees",
    fabric: "Chiffon",
    occasion: ["Party", "Reception"],
    priceRange: "₹9,500 – ₹12,000",
    description: "A flowing teal chiffon saree with intricate thread embroidery. Lightweight and perfect for evening affairs.",
    images: [categorySarees],
    featured: false,
    trending: true,
    createdAt: "2026-03-03",
  },
];

export const categories = [
  { name: "Sarees" as const, slug: "sarees" },
  { name: "Ready-to-Wear Sarees" as const, slug: "ready-to-wear-sarees" },
  { name: "Kurtis" as const, slug: "kurtis" },
  { name: "Kurta Sets" as const, slug: "kurta-sets" },
  { name: "Lehengas" as const, slug: "lehengas" },
  { name: "Palazzos" as const, slug: "palazzos" },
  { name: "Dupattas" as const, slug: "dupattas" },
];

export const fabrics = [
  { name: "Silk", description: "Lustrous and luxurious, a timeless choice" },
  { name: "Cotton", description: "Breathable comfort meets artisan craft" },
  { name: "Organza", description: "Sheer elegance with delicate drape" },
  { name: "Georgette", description: "Flowing grace for every occasion" },
  { name: "Chiffon", description: "Lightweight and ethereal beauty" },
];
