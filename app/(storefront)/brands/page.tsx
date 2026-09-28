import React from "react";
import { Metadata } from "next";
import { getBrands } from "@/data/brands";
import { BrandCard } from "@/components/storefront/BrandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Our Brands Portfolio | KB Beverage",
  description: "Explore Vrinda tea premixes, Sangam botanical iced teas, Urban Roast coffees, and CocoJoy rich chocolate drinks.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      <SectionHeader
        eyebrow="Portfolio Architecture"
        title="Four Dedicated Brands, One Standard of Excellence"
        description="Every brand under the KB banner specializes in a distinct category of refreshing craftsmanship."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
