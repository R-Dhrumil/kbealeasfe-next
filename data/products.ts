import { Product } from "@/types/product";
import { fetchApi } from "@/lib/api";

/**
 * Hardcoded mock products have been removed in favor of live dynamic backend data.
 * Maintained as an empty array export for backward compatibility.
 */
export const PRODUCTS: Product[] = [];

function mapBackendProductToFrontend(dto: any): Product {
  if (dto.price !== undefined) return dto as Product;

  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    brandId: dto.brandId,
    brandName: dto.brandName,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
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
    images: dto.images 
      ? dto.images.map((img: any) => img.imageUrl.startsWith("/") ? `http://localhost:5153${img.imageUrl}` : img.imageUrl) 
      : (dto.primaryImageUrl ? [dto.primaryImageUrl.startsWith("/") ? `http://localhost:5153${dto.primaryImageUrl}` : dto.primaryImageUrl] : []),
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

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
  try {
    const data = await fetchApi(`/catalog/products?brandId=${brandId}&pageSize=100`);
    return data?.items ? data.items.map(mapBackendProductToFrontend) : [];
  } catch (e) {
    console.error(`Failed to fetch products by brand ${brandId}:`, e);
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
