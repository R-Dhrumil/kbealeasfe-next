import React from "react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { FeatureStrip } from "@/components/storefront/FeatureStrip";
import { PromoBanners } from "@/components/storefront/PromoBanners";
import { TabbedProductShowcase } from "@/components/storefront/TabbedProductShowcase";
import { HeritageStory } from "@/components/storefront/HeritageStory";
import { BrandCarousel } from "@/components/storefront/BrandCarousel";
import { SocialShowcase } from "@/components/storefront/SocialShowcase";

export default function HomePage() {
  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      {/* 1. HERO BANNER SLIDER */}
      <HeroSlider />

      {/* 2. VALUE PROPOSITION & TRUST BADGES */}
      <FeatureStrip />

      {/* 3. PROMOTIONAL ASYMMETRIC BANNER GRID */}
      <PromoBanners />

      {/* 4. TABBED POPULAR PRODUCTS CATALOG */}
      <TabbedProductShowcase />

      {/* 5. EDITORIAL HERITAGE STORY */}
      <HeritageStory />

      {/* 6. BRAND ARCHITECTURE & CERTIFICATIONS */}
      <BrandCarousel />

      {/* 7. INSTAGRAM & COMMUNITY SOCIAL GALLERY */}
      <SocialShowcase />
    </div>
  );
}
