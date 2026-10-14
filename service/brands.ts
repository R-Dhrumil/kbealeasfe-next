import { Brand } from "@/types/brand";
import { fetchApi } from "@/lib/api";

export const BRANDS: Brand[] = [];

import { BRAND_COLLECTIONS, getCollectionByIdOrSlug } from "./collections";

export function mapBackendBrandToFrontend(dto: any): Brand {
  const slug = (dto.slug || "").toLowerCase().trim();
  const name = dto.name || "";
  const initials = name
    ? name
        .split(/\s+/)
        .map((w: string) => w.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "KB";

  let logoUrl = dto.logo || dto.logoUrl;
  if (!logoUrl) {
    if (slug.includes("coco")) logoUrl = "/brands/coco-joy-logo.png";
    else if (slug.includes("urban")) logoUrl = "/brands/urban-roast-logo.png";
    else if (slug.includes("sangam")) logoUrl = "/brands/sangam-logo.png";
    else if (slug.includes("vrinda")) logoUrl = "/brands/vrinda-logo.png";
    else logoUrl = initials;
  }

    let themeColor = dto.themeColor || dto.accentColor;
    let lightBg = dto.lightBg;
    if (!themeColor) {
      if (slug.includes("coco")) { themeColor = "#5C3826"; lightBg = "#FCE4EC"; }
      else if (slug.includes("urban")) { themeColor = "#4A2C2A"; lightBg = "#F5F0EB"; }
      else if (slug.includes("sangam")) { themeColor = "#0E4D7A"; lightBg = "#E1F5FE"; }
      else { themeColor = "#143425"; lightBg = "#E8F2EC"; }
    }

    return {
      id: dto.id ? String(dto.id) : (slug || "brand"),
      slug: dto.slug || slug,
      name: name,
      tagline: dto.tagline || "",
      description: dto.description || "",
      logo: logoUrl,
      accentColor: themeColor,
      themeColor: themeColor,
      lightBg: lightBg || "#FAF7F2",
      heroImageUrl: dto.heroImageUrl || "",
      logoUrl: dto.logoUrl || logoUrl,
      productCount: typeof dto.productCount === "number" ? dto.productCount : 0,
      featured: dto.featured ?? dto.isActive ?? true,
      story: dto.story || dto.description || "",
    };
  }

  export async function getBrands(): Promise<Brand[]> {
    try {
      const data = await fetchApi("/catalog/brands");
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapBackendBrandToFrontend);
      }
    } catch (e) {
      console.error("Failed to fetch brands from backend:", e);
    }

    // Fallback to static brands if backend returns empty or is unreachable
    return BRAND_COLLECTIONS.map((c) => ({
      id: c.id,
      slug: c.brandSlug,
      name: c.brandName,
      tagline: c.tagline,
      description: c.description,
      logo: `/brands/${c.id === "cocojoy" ? "coco-joy" : c.id}-logo.png`,
      accentColor: c.accentColor,
      themeColor: c.accentColor,
      lightBg: c.id === "vrinda" ? "#E8F2EC" : c.id === "sangam" ? "#E1F5FE" : c.id === "urban-roast" ? "#F5F0EB" : "#FCE4EC",
      heroImageUrl: c.image,
      logoUrl: `/brands/${c.id === "cocojoy" ? "coco-joy" : c.id}-logo.png`,
      productCount: c.productCount,
      featured: c.featured,
      story: c.description,
    }));
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const clean = (slug || "").toLowerCase().trim();
  if (!clean) return undefined;

  const candidateSlugs = [
    clean,
    clean === "cocojoy" ? "coco-joy" : "",
    clean === "coco-joy" ? "cocojoy" : "",
    clean.replace(/-/g, ""),
  ].filter(Boolean);

  for (const s of candidateSlugs) {
    try {
      const brand = await fetchApi(`/catalog/brands/${s}`);
      if (brand && !brand.message && brand.name) {
        return mapBackendBrandToFrontend(brand);
      }
    } catch {
      // try next candidate
    }
  }

  // Fallback to static collections if not found in backend
  const col = getCollectionByIdOrSlug(clean);
  if (col) {
    return {
      id: col.id,
      slug: clean,
      name: col.brandName,
      tagline: col.tagline,
      description: col.description,
      logo: `/brands/${col.id === "cocojoy" ? "coco-joy" : col.id}-logo.png`,
      accentColor: col.accentColor,
      themeColor: col.accentColor,
      lightBg: col.id === "vrinda" ? "#E8F2EC" : col.id === "sangam" ? "#E1F5FE" : col.id === "urban-roast" ? "#F5F0EB" : "#FCE4EC",
      heroImageUrl: col.image,
      logoUrl: `/brands/${col.id === "cocojoy" ? "coco-joy" : col.id}-logo.png`,
      productCount: col.productCount,
      featured: col.featured,
      story: col.description,
    };
  }

  return undefined;
}

