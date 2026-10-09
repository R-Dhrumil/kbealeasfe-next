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

function mapBackendCategoryToFrontend(dto: any): Category {
  const normalizedSlug = dto.slug?.toLowerCase()?.trim() || "";

  return {
    id: dto.id ? String(dto.id) : normalizedSlug,
    slug: dto.slug || "",
    name: dto.name || "",
    tagline: dto.tagline || "",
    description: dto.description || "",
    image: dto.imageUrl || dto.image || dto.icon || "",
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

