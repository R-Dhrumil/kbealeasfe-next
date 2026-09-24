import React from "react";
import { CATEGORIES } from "@/data/categories";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { FeatureStrip } from "@/components/storefront/FeatureStrip";
import { PromoBanners } from "@/components/storefront/PromoBanners";
import { TabbedProductShowcase } from "@/components/storefront/TabbedProductShowcase";
import { HeritageStory } from "@/components/storefront/HeritageStory";
import { DealBanner } from "@/components/storefront/DealBanner";
import { BrandCarousel } from "@/components/storefront/BrandCarousel";
import { SocialShowcase } from "@/components/storefront/SocialShowcase";

export default function HomePage() {
  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      {/* 1. HERO BANNER SLIDER (Shofy Jewelry Style) */}
      <HeroSlider />

      {/* 2. VALUE PROPOSITION & TRUST BADGES */}
      <FeatureStrip />

      {/* 3. PROMOTIONAL ASYMMETRIC BANNER GRID */}
      <PromoBanners />

      {/* 4. THE FOUR PRIMARY CATEGORIES */}
      {/* <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <SectionHeader
          eyebrow="Curated Portfolio"
          title="The Four Core Categories"
          description="Every beverage in our catalog is systematically organized across four foundational collections."
          actionText="View Full Catalog"
          actionHref="/shop"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section> */}

      {/* 5. TABBED POPULAR PRODUCTS CATALOG */}
      <TabbedProductShowcase />

      {/* 6. EDITORIAL HERITAGE STORY */}
      <HeritageStory />

      {/* 7. DEAL OF THE DAY / DISCOVERY BOX BANNER */}
      {/* <DealBanner /> */}

      {/* 8. BRAND ARCHITECTURE & CERTIFICATIONS */}
      <BrandCarousel />

      {/* 9. INSTAGRAM & COMMUNITY SOCIAL GALLERY */}
      <SocialShowcase />
    </div>
  );
}
