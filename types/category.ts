export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  icon?: string;
  productCount: number;
  featured: boolean;
  order: number;
}
