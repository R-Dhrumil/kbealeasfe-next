import React from "react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { FeatureStrip } from "@/components/storefront/FeatureStrip";
import { PromoBanners } from "@/components/storefront/PromoBanners";
import { TabbedProductShowcase } from "@/components/storefront/TabbedProductShowcase";
import { HeritageStory } from "@/components/storefront/HeritageStory";
import { BrandCarousel } from "@/components/storefront/BrandCarousel";
import { ClienteleShowcase } from "@/components/storefront/ClienteleShowcase";
import { TestimonialSlider } from "@/components/storefront/TestimonialSlider";

import { getBrands } from "@/service/brands";
import { getCategories } from "@/service/categories";
import { getProducts } from "@/service/products";

export default async function HomePage() {
  const [brands, categories, products] = await Promise.all([
    getBrands(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      {/* 1. HERO BANNER SLIDER */}
      <HeroSlider />

      

      {/* 3. PROMOTIONAL ASYMMETRIC BANNER GRID */}
      <PromoBanners />

      {/* 4. TABBED POPULAR PRODUCTS CATALOG */}
      <TabbedProductShowcase initialCategories={categories} initialProducts={products} />

      {/* 5. EDITORIAL HERITAGE STORY */}
      <HeritageStory />

      {/* 6. PATRON & CRITIC TESTIMONIALS SLIDER */}
      <TestimonialSlider />

      {/* 7. BRAND ARCHITECTURE & CERTIFICATIONS */}
      <BrandCarousel initialBrands={brands} />

      {/* 8. VERIFIED CLIENTELE SHOWCASE (FROM OFFICIAL BROCHURE) */}
      <ClienteleShowcase />
    </div>
  );
}
