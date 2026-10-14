import { Product } from "@/types/product";
import { fetchApi } from "@/lib/api";

/**
 * Hardcoded mock products have been removed in favor of live dynamic backend data.
 * Maintained as an empty array export for backward compatibility.
 */
export const PRODUCTS: Product[] = [];

function normalizeImageUrl(url: unknown, isChocolate = false): string {
  if (typeof url !== "string") {
    return isChocolate 
      ? "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80"
      : "/assets/HeroSlider_images/vrinda_tea.png";
  }
  let trimmed = url.trim();
  if (!trimmed) {
    return isChocolate 
      ? "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80"
      : "/assets/HeroSlider_images/vrinda_tea.png";
  }

  // If pointing to backend assets on localhost, use local Next.js /assets/ directly
  if (trimmed.includes("localhost:5153/assets/")) {
    trimmed = trimmed.replace(/^https?:\/\/localhost:5153/, "");
  }

  // If it's a backend upload
  if (trimmed.startsWith("/uploads/")) {
    trimmed = `http://localhost:5153${trimmed}`;
  }

  // If it's a chocolate product with the default tea cup image placeholder, give it chocolate imagery
  if (isChocolate && trimmed.includes("vrinda-cardamom")) {
    return "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80";
  }

  try {
    return encodeURI(decodeURI(trimmed));
  } catch {
    return trimmed;
  }
}

function mapBackendProductToFrontend(dto: any): Product {
  if (dto.price !== undefined) return dto as Product;

  const bName = dto.brandName || "";
  const cName = dto.categoryName || "";
  const isChocolate = 
    bName.toLowerCase().includes("coco") || 
    cName.toLowerCase().includes("chocolate") ||
    (dto.slug || "").includes("chocolate") ||
    (dto.slug || "").includes("cocoa");

  const rawImages: string[] = [];
  if (Array.isArray(dto.images) && dto.images.length > 0) {
    dto.images.forEach((img: any) => {
      const u = typeof img === "string" ? img : img?.imageUrl;
      if (u) rawImages.push(normalizeImageUrl(u, isChocolate));
    });
  } else if (dto.primaryImageUrl) {
    rawImages.push(normalizeImageUrl(dto.primaryImageUrl, isChocolate));
  } else {
    rawImages.push(normalizeImageUrl(null, isChocolate));
  }

  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    brandId: dto.brandId ? String(dto.brandId) : "",
    brandName: bName,
    brandSlug: dto.brandSlug || bName.toLowerCase().replace(/\s+/g, "-"),
    categoryId: dto.categoryId ? String(dto.categoryId) : "",
    categoryName: cName,
    categorySlug: dto.categorySlug || cName.toLowerCase().replace(/\s+/g, "-"),
    tagline: dto.tagline || "",
    description: dto.shortDescription || dto.fullDescription || "",
    details: {
      packaging: "Standard",
      shelfLife: "12 Months",
      servingSize: "Standard",
      netWeight: "N/A",
      form: "Standard",
      ingredients: [],
      preparationNotes: [],
      storageNotes: ""
    },
    price: dto.basePrice || 0,
    mrp: dto.costPrice || (dto.basePrice ? dto.basePrice * 1.2 : 0),
    sku: dto.sku || "",
    images: rawImages,
    inStock: dto.inStock !== undefined ? dto.inStock : (dto.totalAvailableQuantity > 0),
    stockCount: dto.totalAvailableQuantity || 0,
    isBestSeller: dto.isBestseller,
    isFeatured: dto.isFeatured,
    rating: 5.0,
    reviewCount: 0,
    flavorNotes: [],
    variantId: dto.variants && dto.variants.length > 0 ? dto.variants[0].id : undefined
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchApi("/catalog/products?pageSize=100");
    return data?.items ? data.items.map(mapBackendProductToFrontend) : [];
  } catch (e) {
    console.error("Failed to fetch products from backend:", e);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const p = await fetchApi(`/catalog/products/${slug}`);
    return p ? mapBackendProductToFrontend(p) : undefined;
  } catch (e) {
    console.error(`Failed to fetch product by slug ${slug}:`, e);
    return undefined;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const data = await fetchApi(`/catalog/products?categoryId=${categoryId}&pageSize=100`);
    return data?.items ? data.items.map(mapBackendProductToFrontend) : [];
  } catch (e) {
    console.error(`Failed to fetch products by category ${categoryId}:`, e);
    return [];
  }
}

export async function getProductsByBrand(brandIdOrSlug: string): Promise<Product[]> {
  const clean = (brandIdOrSlug || "").trim();
  if (!clean) return [];

  const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

  try {
    const queryParam = isGuid ? `brandId=${clean}` : `brandSlug=${clean}`;
    let data = await fetchApi(`/catalog/products?${queryParam}&pageSize=100`);

    if ((!data?.items || data.items.length === 0) && !isGuid) {
      // Try alt slug variation (e.g. cocojoy <-> coco-joy)
      const altSlug = clean === "cocojoy" ? "coco-joy" : (clean === "coco-joy" ? "cocojoy" : clean.replace(/-/g, ""));
      if (altSlug !== clean) {
        data = await fetchApi(`/catalog/products?brandSlug=${altSlug}&pageSize=100`);
      }
    }

    if (data?.items && data.items.length > 0) {
      return data.items.map(mapBackendProductToFrontend);
    }
  } catch (e) {
    console.error(`Failed to fetch products by brand ${brandIdOrSlug}:`, e);
  }

  // Resilient fallback: fetch all and filter in memory
  try {
    const all = await getProducts();
    const noHyphen = clean.toLowerCase().replace(/[\s-]+/g, "");
    return all.filter((p) => {
      const pBrandId = (p.brandId || "").toLowerCase();
      const pBrandName = (p.brandName || "").toLowerCase().replace(/[\s-]+/g, "");
      const pBrandSlug = (p.brandSlug || "").toLowerCase().replace(/[\s-]+/g, "");
      return (
        p.brandId === clean ||
        pBrandName.includes(noHyphen) ||
        pBrandSlug.includes(noHyphen) ||
        (noHyphen.includes("coco") && (p.categoryId.includes("chocolate") || p.categoryName.toLowerCase().includes("chocolate")))
      );
    });
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await fetchApi(`/catalog/featured`);
    return data ? data.map(mapBackendProductToFrontend) : [];
  } catch (e) {
    console.error("Failed to fetch featured products:", e);
    return [];
  }
}
