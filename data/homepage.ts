export interface HeroSlide {
  id: string;
  tagline: string;
  title: string;
  highlightText: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  badgeText: string;
  image: string;
}

export interface BrandPillar {
  iconName: string;
  title: string;
  description: string;
}

export const HERO_CONTENT: HeroSlide = {
  id: "hero-main",
  badgeText: "Pure Taste, Every Time.",
  tagline: "Master Crafted Beverages",
  title: "Authentic Chai, Refreshing Iced Teas & Artisan Brews",
  highlightText: "Crafted for Everyday Moments.",
  description: "Experience the timeless richness of Vrinda tea premixes, exhilarating Sangam botanical iced teas, Urban Roast crafted coffees, and CocoJoy pure coastal hydration.",
  primaryCtaText: "Shop Products",
  primaryCtaHref: "/shop",
  secondaryCtaText: "Explore Categories",
  secondaryCtaHref: "#categories",
  image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
};

export const BRAND_PILLARS: BrandPillar[] = [
  {
    iconName: "Sparkles",
    title: "Pure Estate Ingredients",
    description: "Sourced directly from single-origin tea gardens in Assam and spice growers in the Western Ghats.",
  },
  {
    iconName: "ShieldCheck",
    title: "Aroma-Lock Technology",
    description: "Multi-barrier foil packaging safeguards natural volatile essential oils and freshness.",
  },
  {
    iconName: "Clock",
    title: "Consistent Cup in 10 Seconds",
    description: "Precisely granulated formulations dissolve effortlessly in hot water or iced liquids without sediment.",
  },
  {
    iconName: "Leaf",
    title: "Responsible & Thoughtful",
    description: "No artificial chemical preservatives, zero adulteration, and ethically contracted farm sources.",
  },
];
