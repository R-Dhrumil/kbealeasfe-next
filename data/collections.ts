export interface BrandCollection {
  id: string;
  brandName: string;
  categoryName: string;
  brandSlug: string;
  categorySlug: string;
  tagline: string;
  description: string;
  accentColor: string;
  productCount: number;
  featured: boolean;
  image: string;
  href: string;
}

export const BRAND_COLLECTIONS: BrandCollection[] = [
  {
    id: "vrinda",
    brandName: "Vrinda",
    categoryName: "Tea Premixes",
    brandSlug: "vrinda",
    categorySlug: "tea-premixes",
    tagline: "The Soul of Indian Chai",
    description: "Traditional Indian chai recipes crafted with real spices, high-grown Assam tea leaves, and balanced sweetness.",
    accentColor: "#143425",
    productCount: 8,
    featured: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    href: "/brands/vrinda",
  },
  {
    id: "sangam",
    brandName: "Sangam",
    categoryName: "Botanical Iced Teas",
    brandSlug: "sangam",
    categorySlug: "iced-teas",
    tagline: "Vibrant Botanical Refreshment",
    description: "Sun-brewed fruit infusions and botanical blends designed for instant rejuvenation and vibrant hydration.",
    accentColor: "#C89B3C",
    productCount: 6,
    featured: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    href: "/brands/sangam",
  },
  {
    id: "urban-roast",
    brandName: "Urban Roast",
    categoryName: "Artisan Coffee",
    brandSlug: "urban-roast",
    categorySlug: "artisan-coffee",
    tagline: "Crafted for the Discerning Palate",
    description: "Shade-grown Chikmagalur beans, precision drum roasting, and smooth velvety coffee premixes.",
    accentColor: "#6E4D38",
    productCount: 7,
    featured: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    href: "/brands/urban-roast",
  },
  {
    id: "cocojoy",
    brandName: "CocoJoy",
    categoryName: "Chocolate Drinks",
    brandSlug: "cocojoy",
    categorySlug: "chocolate-drinks",
    tagline: "Joy in Every Sip — Decadent Chocolate Drinks",
    description: "Decadent European hot chocolates and thick Gujarat-style chilled cocoa premixes crafted with rich Dutch cocoa and wholesome jaggery.",
    accentColor: "#5C3826",
    productCount: 3,
    featured: true,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    href: "/brands/cocojoy",
  },
];

export function getBrandCollections(): BrandCollection[] {
  return BRAND_COLLECTIONS;
}

export function getCollectionByIdOrSlug(identifier: string): BrandCollection | undefined {
  const norm = identifier.toLowerCase().replace(/^cat-|^brand-/, "").replace(/\s+/g, "-");
  return BRAND_COLLECTIONS.find(
    (c) =>
      c.id === norm ||
      c.brandSlug === norm ||
      c.categorySlug === norm ||
      (norm === "plant-based-specialties" && c.id === "cocojoy") ||
      (norm === "chocolate" && c.id === "cocojoy") ||
      (norm === "coco-joy" && c.id === "cocojoy")
  );
}
