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

export async function getBrands(): Promise<Brand[]> {
  try {
    const data = await fetchApi("/catalog/brands");
    return Array.isArray(data) ? data : BRANDS;
  } catch (e) {
    return BRANDS;
  }
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  try {
    const brand = await fetchApi(`/catalog/brands/${slug}`);
    if (brand && !brand.message) return brand;
  } catch (e) {
    // fallback
  }
  if (slug === "coco-joy") {
    return BRANDS.find((b) => b.slug === "cocojoy");
  }
  return BRANDS.find((b) => b.slug === slug);
}
