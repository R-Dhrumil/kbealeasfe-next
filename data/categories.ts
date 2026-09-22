import { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  {
    id: "cat-tea-premixes",
    slug: "tea-premixes",
    name: "Tea Premixes",
    tagline: "Authentic Taste in Seconds",
    description: "Traditional Indian chai recipes crafted with real spices, high-grown Assam tea leaves, and balanced sweetness.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    productCount: 8,
    featured: true,
    order: 1,
  },
  {
    id: "cat-iced-teas",
    slug: "iced-teas",
    name: "Iced Teas",
    tagline: "Crisp, Botanical & Refreshing",
    description: "Sun-brewed fruit infusions and botanical blends designed for instant rejuvenation and vibrant hydration.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    productCount: 6,
    featured: true,
    order: 2,
  },
  {
    id: "cat-artisan-coffee",
    slug: "artisan-coffee",
    name: "Artisan Coffee",
    tagline: "Bold Aromas & Slow Roasts",
    description: "Finely roasted Arabica & Robusta coffees crafted for espresso lovers and effortless cafe-quality brews.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    productCount: 7,
    featured: true,
    order: 3,
  },
  {
    id: "cat-plant-based-specialties",
    slug: "plant-based-specialties",
    name: "Plant-Based Specialties",
    tagline: "Pure Tropical Nourishment",
    description: "Naturally hydrating tender coconut waters and plant-based lattes with zero artificial preservatives.",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80",
    productCount: 5,
    featured: true,
    order: 4,
  },
];

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
