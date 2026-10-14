import React from "react";
import { Metadata } from "next";
import { getProducts } from "@/service/products";
import { ShopCatalogClient } from "./ShopCatalogClient";

export const metadata: Metadata = {
  title: "Shop Full Beverage Brands & Products | KB Beverage",
  description: "Browse authentic Vrinda tea premixes, Sangam botanical iced teas, Urban Roast crafted coffees, and CocoJoy rich chocolate drinks.",
};

interface ShopPageProps {
  searchParams?: Promise<{
    category?: string;
    brand?: string;
    collection?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const products = await getProducts();
  const params = searchParams ? await searchParams : {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
          Catalog &amp; Brands
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#143425] tracking-tight font-normal mt-1">
          Explore Our Pure Beverage Portfolio
        </h1>
        <p className="text-stone-600 text-sm mt-1 max-w-2xl">
          Crafted from estate-grown ingredients, natural spices, and single-origin coffee beans. All beverages are sealed with aroma-lock foil for maximum flavor fidelity.
        </p>
      </div>

      {/* Catalog Client Interface */}
      <ShopCatalogClient
        initialProducts={products}
        initialCategory={params.category}
        initialBrand={params.brand}
        initialCollection={params.collection}
      />
    </div>
  );
}
