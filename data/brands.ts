import { Brand } from "@/types/brand";

export const BRANDS: Brand[] = [
  {
    id: "brand-vrinda",
    slug: "vrinda",
    name: "Vrinda",
    tagline: "The Soul of Indian Chai",
    description: "Honoring traditional Indian tea craftsmanship with heritage spice infusions and rich Assam estates.",
    logo: "🌿",
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
    logo: "🍋",
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
    logo: "☕",
    accentColor: "#6E4D38",
    productCount: 7,
    featured: true,
    story: "Urban Roast caters to the modern coffee enthusiast who appreciates complex flavor notes—caramel, dark chocolate, and roasted hazelnut—delivered with utmost convenience.",
  },
  {
    id: "brand-cocojoy",
    slug: "cocojoy",
    name: "CocoJoy",
    tagline: "Pure Coastal Sunshine",
    description: "100% natural tender coconut waters, coconut milk lattes, and tropical revitalizers.",
    logo: "🥥",
    accentColor: "#337A59",
    productCount: 5,
    featured: true,
    story: "Harvested from coastal coconut groves, CocoJoy captures nature's purest isotonic beverage. Packed with natural electrolytes and zero artificial flavorings.",
  },
];

export function getBrands(): Brand[] {
  return BRANDS;
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
