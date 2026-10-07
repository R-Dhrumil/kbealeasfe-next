import { Brand } from "@/types/brand";
import { fetchApi } from "@/lib/api";

export const BRANDS: Brand[] = [
  {
    id: "brand-vrinda",
    slug: "vrinda",
    name: "Vrinda",
    tagline: "The Soul of Indian Chai",
    description: "Honoring traditional Indian tea craftsmanship with heritage spice infusions and rich Assam estates.",
    logo: "VR",
    accentColor: "#143425",
    productCount: 8,
    featured: true,
    story: "Vrinda was born from the desire to recreate the timeless warmth of home-brewed tapri and royal court chai. Utilizing crush-tear-curl (CTC) and whole spice granulations, Vrinda premixes deliver an authentic cup in seconds.",
  },
  {
    id: "brand-sangam",
    slug: "sangam",
    name: "Sangam",
    tagline: "Vibrant Botanical Refreshment",
    description: "Contemporary iced teas infused with exotic fruits, Himalayan herbs, and bold spice surprises.",
    logo: "SG",
    accentColor: "#C89B3C",
    productCount: 6,
    featured: true,
    story: "Sangam bridges modern youth lifestyle with mindful hydration. From our iconic Guava Chilly to classic zesty lemon, Sangam transforms ordinary tea into an invigorating daily ritual.",
  },
  {
    id: "brand-urban-roast",
    slug: "urban-roast",
    name: "Urban Roast",
    tagline: "Crafted for the Discerning Palate",
    description: "Shade-grown Chikmagalur beans, precision drum roasting, and smooth velvety coffee premixes.",
    logo: "UR",
    accentColor: "#6E4D38",
    productCount: 7,
    featured: true,
    story: "Urban Roast caters to the modern coffee enthusiast who appreciates complex flavor notes—caramel, dark chocolate, and roasted hazelnut—delivered with utmost convenience.",
  },
  {
    id: "brand-cocojoy",
    slug: "cocojoy",
    name: "CocoJoy",
    tagline: "Joy in Every Sip — Decadent Chocolate Drinks",
    description: "Luxurious European hot chocolate and velvety street-style cold cocoa premixes crafted with pure Dutch cocoa and wholesome jaggery.",
    logo: "CJ",
    accentColor: "#5C3826",
    productCount: 3,
    featured: true,
    story: "CocoJoy was born for pure chocolate indulgence. From rich, steaming European-style winter mugs to thick, chilled Vadodara street-style cold cocoa, our instant premixes deliver velvety cafe-grade chocolate drinks in seconds with rich cocoa aromas and zero chemical preservatives.",
  },
];

const DEFAULT_BRAND_METADATA: Record<string, Partial<Brand>> = {
  vrinda: {
    logo: "VR",
    accentColor: "#143425",
    tagline: "The Soul of Indian Chai",
    description: "Honoring traditional Indian tea craftsmanship with heritage spice infusions and rich Assam estates.",
    story: "Vrinda was born from the desire to recreate the timeless warmth of home-brewed tapri and royal court chai. Utilizing crush-tear-curl (CTC) and whole spice granulations, Vrinda premixes deliver an authentic cup in seconds.",
  },
  sangam: {
    logo: "SG",
    accentColor: "#C89B3C",
    tagline: "Vibrant Botanical Refreshment",
    description: "Contemporary iced teas infused with exotic fruits, Himalayan herbs, and bold spice surprises.",
    story: "Sangam bridges modern youth lifestyle with mindful hydration. From our iconic Guava Chilly to classic zesty lemon, Sangam transforms ordinary tea into an invigorating daily ritual.",
  },
  "urban-roast": {
    logo: "UR",
    accentColor: "#6E4D38",
    tagline: "Crafted for the Discerning Palate",
    description: "Shade-grown Chikmagalur beans, precision drum roasting, and smooth velvety coffee premixes.",
    story: "Urban Roast caters to the modern coffee enthusiast who appreciates complex flavor notes—caramel, dark chocolate, and roasted hazelnut—delivered with utmost convenience.",
  },
  cocojoy: {
    logo: "CJ",
    accentColor: "#5C3826",
    tagline: "Joy in Every Sip — Decadent Chocolate Drinks",
    description: "Luxurious European hot chocolate and velvety street-style cold cocoa premixes crafted with pure Dutch cocoa and wholesome jaggery.",
    story: "CocoJoy was born for pure chocolate indulgence. From rich, steaming European-style winter mugs to thick, chilled Vadodara street-style cold cocoa, our instant premixes deliver velvety cafe-grade chocolate drinks in seconds with rich cocoa aromas and zero chemical preservatives.",
  },
};

export function mapBackendBrandToFrontend(dto: any): Brand {
  const slug = (dto.slug || "").toLowerCase().trim();
  const meta = DEFAULT_BRAND_METADATA[slug] || {};

  return {
    id: dto.id ? String(dto.id) : (slug || "brand"),
    slug: dto.slug || slug,
    name: dto.name || "",
    tagline: dto.tagline || meta.tagline || "",
    description: dto.description || meta.description || "",
    logo: dto.logo || dto.logoUrl || meta.logo || (dto.name ? dto.name.substring(0, 2).toUpperCase() : "KB"),
    accentColor: dto.accentColor || dto.themeColor || meta.accentColor || "#143425",
    productCount: typeof dto.productCount === "number" ? dto.productCount : 0,
    featured: dto.featured ?? dto.isActive ?? true,
    story: dto.story || meta.story || dto.description || "",
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
  return BRANDS;
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const normalizedSlug = slug.toLowerCase().trim();
  try {
    const brand = await fetchApi(`/catalog/brands/${normalizedSlug}`);
    if (brand && !brand.message) {
      return mapBackendBrandToFrontend(brand);
    }
  } catch (e) {
    console.error(`Failed to fetch brand by slug ${slug}:`, e);
  }
  return BRANDS.find((b) => b.slug.toLowerCase() === normalizedSlug);
}
