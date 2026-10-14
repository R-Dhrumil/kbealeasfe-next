export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  accentColor: string;
  themeColor?: string;
  lightBg?: string;
  heroImageUrl?: string;
  logoUrl?: string;
  productCount: number;
  featured: boolean;
  story: string;
}
