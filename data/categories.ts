import { Category } from "@/types/category";
import { fetchApi } from "@/lib/api";

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
    id: "cat-chocolate-drinks",
    slug: "chocolate-drinks",
    name: "Chocolate Drinks",
    tagline: "Velvety, Rich & Decadent Indulgence",
    description: "Decadent European hot chocolates and thick Gujarat-style chilled cocoa premixes crafted with rich Dutch cocoa and wholesome jaggery.",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    productCount: 3,
    featured: true,
    order: 4,
  },
];

const DEFAULT_CATEGORY_METADATA: Record<string, { image: string; tagline: string }> = {
  "tea": {
    image: "/assets/HeroSlider_images/vrinda_tea.png",
    tagline: "Authentic Taste in Seconds",
  },
  "tea-premixes": {
    image: "/assets/HeroSlider_images/vrinda_tea.png",
    tagline: "Authentic Taste in Seconds",
  },
  "iced-tea": {
    image: "/assets/HeroSlider_images/ice_tea.png",
    tagline: "Crisp, Botanical & Refreshing",
  },
  "iced-teas": {
    image: "/assets/HeroSlider_images/ice_tea.png",
    tagline: "Crisp, Botanical & Refreshing",
  },
  "coffee": {
    image: "/assets/HeroSlider_images/Gemini_Generated_Image_ikp642ikp642ikp6.png",
    tagline: "Bold Aromas & Slow Roasts",
  },
  "artisan-coffee": {
    image: "/assets/HeroSlider_images/Gemini_Generated_Image_ikp642ikp642ikp6.png",
    tagline: "Bold Aromas & Slow Roasts",
  },
  "chocolate": {
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    tagline: "Velvety, Rich & Decadent Indulgence",
  },
  "chocolate-drinks": {
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    tagline: "Velvety, Rich & Decadent Indulgence",
  },
};

const SLUG_ALIASES: Record<string, string> = {
  "tea-premixes": "tea",
  "tea": "tea-premixes",
  "iced-teas": "iced-tea",
  "iced-tea": "iced-teas",
  "artisan-coffee": "coffee",
  "coffee": "artisan-coffee",
  "chocolate-drinks": "chocolate",
  "chocolate": "chocolate-drinks",
  "plant-based-specialties": "chocolate-drinks",
};

function mapBackendCategoryToFrontend(dto: any): Category {
  const normalizedSlug = dto.slug?.toLowerCase()?.trim() || "";
  const meta = DEFAULT_CATEGORY_METADATA[normalizedSlug] ||
    DEFAULT_CATEGORY_METADATA[SLUG_ALIASES[normalizedSlug]] || {
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      tagline: "Pure Beverage Excellence",
    };

  return {
    id: dto.id ? String(dto.id) : normalizedSlug,
    slug: dto.slug || "",
    name: dto.name || "",
    tagline: dto.tagline || meta.tagline,
    description: dto.description || "",
    image: dto.imageUrl || dto.image || meta.image,
    productCount: typeof dto.productCount === "number" ? dto.productCount : 0,
    featured: dto.isFeatured ?? true,
    order: dto.displayOrder ?? dto.order ?? 1,
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchApi("/catalog/categories");
    if (Array.isArray(data) && data.length > 0) {
      // Filter out root placeholder container if present
      const items = data.filter((c: any) => c.slug !== "all-premixes");
      return items.map(mapBackendCategoryToFrontend);
    }
  } catch (e) {
    console.error("Failed to fetch categories:", e);
  }
  return CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const normalizedSlug = slug.toLowerCase().trim();
  const alias = SLUG_ALIASES[normalizedSlug];

  try {
    let cat = await fetchApi(`/catalog/categories/${normalizedSlug}`);
    if (!cat || cat.message) {
      if (alias) {
        cat = await fetchApi(`/catalog/categories/${alias}`);
      }
    }
    if (cat && !cat.message) {
      return mapBackendCategoryToFrontend(cat);
    }
  } catch (e) {
    console.error(`Failed to fetch category by slug ${slug}:`, e);
  }

  return (
    CATEGORIES.find((c) => c.slug === normalizedSlug || c.slug === alias) ||
    undefined
  );
}
