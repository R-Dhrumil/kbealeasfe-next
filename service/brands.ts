import { Brand } from "@/types/brand";
import { fetchApi } from "@/lib/api";

export const BRANDS: Brand[] = [];

export function mapBackendBrandToFrontend(dto: any): Brand {
  const slug = (dto.slug || "").toLowerCase().trim();

  return {
    id: dto.id ? String(dto.id) : (slug || "brand"),
    slug: dto.slug || slug,
    name: dto.name || "",
    tagline: dto.tagline || "",
    description: dto.description || "",
    logo: dto.logo || dto.logoUrl || (dto.name ? dto.name.substring(0, 2).toUpperCase() : "KB"),
    accentColor: dto.accentColor || dto.themeColor || "#143425",
    productCount: typeof dto.productCount === "number" ? dto.productCount : 0,
    featured: dto.featured ?? dto.isActive ?? true,
    story: dto.story || dto.description || "",
  };
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const data = await fetchApi("/catalog/brands");
    if (Array.isArray(data)) {
      return data.map(mapBackendBrandToFrontend);
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch brands from backend:", e);
    return [];
  }
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const normalizedSlug = slug.toLowerCase().trim();
  try {
    const brand = await fetchApi(`/catalog/brands/${normalizedSlug}`);
    if (brand && !brand.message) {
      return mapBackendBrandToFrontend(brand);
    }
    return undefined;
  } catch (e) {
    console.error(`Failed to fetch brand by slug ${slug}:`, e);
    return undefined;
  }
}

