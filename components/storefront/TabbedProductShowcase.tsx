"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { PRODUCTS, getProducts } from "@/service/products";
import { CATEGORIES, getCategories } from "@/service/categories";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface TabbedProductShowcaseProps {
  initialCategories?: Category[];
  initialProducts?: Product[];
}

export function TabbedProductShowcase({
  initialCategories,
  initialProducts,
}: TabbedProductShowcaseProps = {}) {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : CATEGORIES
  );
  const [products, setProducts] = useState<Product[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : PRODUCTS
  );
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      getCategories().then((cats) => {
        if (cats && cats.length > 0) setCategories(cats);
      });
    }
    if (!initialProducts || initialProducts.length === 0) {
      getProducts().then((prods) => {
        if (prods && prods.length > 0) setProducts(prods);
      });
    }
  }, [initialCategories, initialProducts]);

  const tabs = useMemo(
    () => [
      { id: "all", name: "All Beverages" },
      ...categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
    ],
    [categories]
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === activeTab || c.slug === activeTab),
    [categories, activeTab]
  );

  const filteredProducts = useMemo(() => {
    if (activeTab === "all") {
      return products.slice(0, 8);
    }
    return products
      .filter((p) => {
        if (p.categoryId === activeTab) return true;
        if (selectedCategory && (p.categoryId === selectedCategory.slug || p.categoryName === selectedCategory.name)) {
          return true;
        }
        return false;
      })
      .slice(0, 8);
  }, [activeTab, products, selectedCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#E8DED1] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A87E28] mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
            <span>Signature Brands</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#143425] tracking-tight">
            Popular & Flagship Brews
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-xl">
            Single-origin tea extracts, authentic crushed whole spices, roasted coffees, and velvety chocolate drinks.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#143425] text-white shadow-xs font-semibold"
                    : "bg-[#F7F4EE] text-stone-600 hover:text-stone-900 hover:bg-[#EAE4D7]"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA to shop */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border border-[#143425] text-[#143425] hover:bg-[#143425] hover:text-white text-sm font-medium transition-all group shadow-2xs active:scale-98"
        >
          <span>Explore All Beverages</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
