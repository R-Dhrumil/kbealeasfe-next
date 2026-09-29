export interface ProductDetail {
  packaging: string;
  shelfLife: string;
  servingSize: string;
  netWeight: string;
  form: string; // e.g. "Instant Premix Powder", "Cold Brew Concentrate", "Roasted Whole Beans"
  ingredients: string[];
  preparationNotes: string[];
  storageNotes: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  tagline: string;
  description: string;
  details: ProductDetail;
  price: number;
  mrp: number;
  sku: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  flavorNotes: string[];
  variantId?: string;
}
