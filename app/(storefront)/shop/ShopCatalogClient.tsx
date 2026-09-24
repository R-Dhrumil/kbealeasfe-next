"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FilterPanel, FilterState } from "@/components/storefront/FilterPanel";
import { SlidersHorizontal, Search as SearchIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShopCatalogClientProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialBrand?: string;
  initialCollection?: string;
}

export function ShopCatalogClient({
  initialProducts,
  initialCategory = "",
  initialBrand = "",
  initialCollection = "",
}: ShopCatalogClientProps) {
  // Normalize initial collection from category or brand
  const startingCollection =
    initialCollection ||
    (initialBrand ? initialBrand.replace(/^brand-/, "") : "") ||
    (initialCategory === "tea-premixes" || initialCategory === "cat-tea-premixes"
      ? "vrinda"
      : initialCategory === "iced-teas" || initialCategory === "cat-iced-teas"
      ? "sangam"
      : initialCategory === "artisan-coffee" || initialCategory === "cat-artisan-coffee"
      ? "urban-roast"
      : initialCategory === "chocolate-drinks" || initialCategory === "cat-chocolate-drinks" || initialCategory === "plant-based-specialties"
      ? "cocojoy"
      : "");

  const [filters, setFilters] = useState<FilterState>({
    collection: startingCollection,
    serveStyle: "",
    priceRange: "",
    inStockOnly: false,
    category: initialCategory,
    brand: initialBrand,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.flavorNotes.some((fn) => fn.toLowerCase().includes(q))
      );
    }

    // Unified Collection filter
    const activeCol =
      filters.collection ||
      (filters.brand ? filters.brand.replace(/^brand-/, "") : "") ||
      (filters.category === "tea-premixes" || filters.category === "cat-tea-premixes"
        ? "vrinda"
        : filters.category === "iced-teas" || filters.category === "cat-iced-teas"
        ? "sangam"
        : filters.category === "artisan-coffee" || filters.category === "cat-artisan-coffee"
        ? "urban-roast"
        : filters.category === "chocolate-drinks" || filters.category === "cat-chocolate-drinks" || filters.category === "plant-based-specialties"
        ? "cocojoy"
        : "");

    if (activeCol) {
      result = result.filter(
        (p) =>
          p.brandId.includes(activeCol) ||
          p.brandName.toLowerCase().replace(/\s+/g, "-").includes(activeCol) ||
          (activeCol === "vrinda" && (p.categoryId.includes("tea-premixes") || p.categoryName.toLowerCase().includes("tea"))) ||
          (activeCol === "sangam" && (p.categoryId.includes("iced-teas") || p.categoryName.toLowerCase().includes("iced"))) ||
          (activeCol === "urban-roast" && (p.categoryId.includes("coffee") || p.categoryName.toLowerCase().includes("coffee"))) ||
          (activeCol === "cocojoy" && (p.categoryId.includes("chocolate") || p.categoryName.toLowerCase().includes("chocolate") || p.categoryId.includes("plant-based")))
      );
    }

    // Serving style filter
    if (filters.serveStyle === "hot") {
      result = result.filter(
        (p) =>
          p.brandId === "brand-vrinda" ||
          p.brandId === "brand-urban-roast" ||
          p.slug.includes("hot-chocolate")
      );
    } else if (filters.serveStyle === "cold") {
      result = result.filter(
        (p) =>
          p.brandId === "brand-sangam" ||
          p.slug.includes("cold-cocoa") ||
          p.tagline.toLowerCase().includes("chill") ||
          p.name.toLowerCase().includes("iced")
      );
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange === "under-300") {
        result = result.filter((p) => p.price < 300);
      } else if (filters.priceRange === "300-450") {
        result = result.filter((p) => p.price >= 300 && p.price <= 450);
      } else if (filters.priceRange === "above-450") {
        result = result.filter((p) => p.price > 450);
      }
    }

    // Stock toggle
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock && p.stockCount > 0);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [initialProducts, filters, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      collection: "",
      serveStyle: "",
      priceRange: "",
      inStockOnly: false,
      category: "",
      brand: "",
    });
    setSearchQuery("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-stone-200/80 sticky top-28 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <h3 className="font-serif text-lg font-bold text-[#143425]">
            Filter Catalog
          </h3>
        </div>
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
      </aside>

      {/* Main Catalog Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by flavor, spice, or brand..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Drawer Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden gap-1.5 h-10"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-stone-600 shrink-0">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#143425]/20"
              >
                <option value="featured">Featured</option>
                <option value="rating">Customer Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <p>
            Showing <span className="font-semibold text-stone-900">{filteredProducts.length}</span>{" "}
            beverages
          </p>
          {(filters.collection || filters.category || filters.brand || filters.serveStyle || filters.priceRange || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#A87E28] hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="h-3 w-3" /> Clear applied filters
            </button>
          )}
        </div>

        {/* Products Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#F9F6F0] flex items-center justify-center text-[#143425]">
              <SearchIcon className="h-7 w-7 text-stone-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#143425]">
              No beverages matched your criteria
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try refining your search keyword or clearing active category and brand filters.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              isMobileDrawer
              onCloseMobile={() => setMobileFiltersOpen(false)}
            />
            <div className="mt-8 pt-4 border-t border-stone-200">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply & View ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
