import { Category } from "@/types/category";
import { fetchApi } from "@/lib/api";

export const CATEGORIES: Category[] = [];

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

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "tea": "/assets/HeroSlider_images/vrinda_tea.png",
  "tea-premixes": "/assets/HeroSlider_images/vrinda_tea.png",
  "iced-tea": "/assets/HeroSlider_images/ice_tea.png",
  "iced-teas": "/assets/HeroSlider_images/ice_tea.png",
  "coffee": "/assets/banners/banner-coffee.png",
  "artisan-coffee": "/assets/banners/banner-coffee.png",
  "chocolate": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=1200&q=80",
  "chocolate-drinks": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=1200&q=80",
};

function isValidImageUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("blob:")
  );
}

function resolveCategoryImage(dto: any, normalizedSlug: string): string {
  if (isValidImageUrl(dto.imageUrl)) return dto.imageUrl;
  if (isValidImageUrl(dto.image)) return dto.image;
  
  const mapped =
    DEFAULT_CATEGORY_IMAGES[normalizedSlug] ||
    DEFAULT_CATEGORY_IMAGES[SLUG_ALIASES[normalizedSlug] || ""];
  if (mapped) return mapped;

  return "/assets/banners/promo-composite.png";
}

function mapBackendCategoryToFrontend(dto: any): Category {
  const normalizedSlug = dto.slug?.toLowerCase()?.trim() || "";

  return {
    id: dto.id ? String(dto.id) : normalizedSlug,
    slug: dto.slug || "",
    name: dto.name || "",
    tagline: dto.tagline || dto.description || "",
    description: dto.description || "",
    image: resolveCategoryImage(dto, normalizedSlug),
    icon: dto.icon || "",
    productCount: typeof dto.productCount === "number" ? dto.productCount : 0,
    featured: dto.isFeatured ?? dto.isActive ?? true,
    order: dto.displayOrder ?? dto.order ?? 1,
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchApi("/catalog/categories");
    if (Array.isArray(data)) {
      // Filter out root placeholder container if present
      const items = data.filter((c: any) => c.slug !== "all-premixes");
      return items.map(mapBackendCategoryToFrontend);
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch categories:", e);
    return [];
  }
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
    return undefined;
  } catch (e) {
    console.error(`Failed to fetch category by slug ${slug}:`, e);
    return undefined;
  }
}
