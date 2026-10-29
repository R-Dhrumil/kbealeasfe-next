"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FilterPanel, FilterState } from "@/components/storefront/FilterPanel";
import {
  SlidersHorizontal,
  Search as SearchIcon,
  RotateCcw,
  LayoutGrid,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShopCatalogClientProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialBrand?: string;
  initialCollection?: string;
}

const ITEMS_PER_PAGE = 9;

export function ShopCatalogClient({
  initialProducts,
  initialCategory = "",
  initialBrand = "",
  initialCollection = "",
}: ShopCatalogClientProps) {
  const resolveCollectionFromCategory = (cat?: string) => {
    if (!cat) return "";
    const c = cat.toLowerCase();
    if (c === "tea" || c === "cat-tea" || c === "tea-premixes" || c === "cat-tea-premixes") return "vrinda";
    if (c === "iced-tea" || c === "cat-iced-tea" || c === "iced-teas" || c === "cat-iced-teas") return "sangam";
    if (c === "coffee" || c === "cat-coffee" || c === "coffees" || c === "cat-coffees" || c === "artisan-coffee" || c === "cat-artisan-coffee") return "urban-roast";
    if (c === "chocolate" || c === "cat-chocolate" || c === "chocolate-drinks" || c === "cat-chocolate-drinks" || c === "plant-based-specialties") return "cocojoy";
    return "";
  };

  // Normalize initial collection from category or brand
  const startingCollection =
    initialCollection ||
    (initialBrand ? initialBrand.replace(/^brand-/, "") : "") ||
    resolveCollectionFromCategory(initialCategory);

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const catalogTopRef = useRef<HTMLDivElement>(null);

  // Compute dynamic brand collection counts from live products
  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = {
      vrinda: 0,
      sangam: 0,
      "urban-roast": 0,
      cocojoy: 0,
    };
    initialProducts.forEach((p) => {
      const bId = (p.brandId || "").toLowerCase();
      const bName = (p.brandName || "").toLowerCase().replace(/[\s-]+/g, "");
      const bSlug = (p.brandSlug || "").toLowerCase().replace(/[\s-]+/g, "");
      const cId = (p.categoryId || "").toLowerCase();
      const cName = (p.categoryName || "").toLowerCase();

      if (bName.includes("vrinda") || bSlug.includes("vrinda") || bId.includes("vrinda") || cId.includes("tea") || cName.includes("tea")) {
        counts.vrinda = (counts.vrinda || 0) + 1;
      }
      if (bName.includes("sangam") || bSlug.includes("sangam") || bId.includes("sangam") || cId.includes("iced") || cName.includes("iced")) {
        counts.sangam = (counts.sangam || 0) + 1;
      }
      if (bName.includes("urban") || bSlug.includes("urban") || bId.includes("urban") || cId.includes("coffee") || cName.includes("coffee")) {
        counts["urban-roast"] = (counts["urban-roast"] || 0) + 1;
      }
      if (bName.includes("coco") || bSlug.includes("coco") || bId.includes("coco") || cId.includes("chocolate") || cName.includes("chocolate") || cId.includes("plant-based")) {
        counts.cocojoy = (counts.cocojoy || 0) + 1;
      }
    });
    return counts;
  }, [initialProducts]);

  // Active collection ID resolution
  const activeCol = useMemo(() => {
    return (
      filters.collection ||
      (filters.brand ? filters.brand.replace(/^brand-/, "") : "") ||
      resolveCollectionFromCategory(filters.category)
    );
  }, [filters.collection, filters.brand, filters.category]);

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
          (p.flavorNotes || []).some((fn) => fn.toLowerCase().includes(q))
      );
    }

    // Collection / Brand filter
    if (activeCol) {
      const activeClean = activeCol.toLowerCase().replace(/[\s-]+/g, "");
      result = result.filter((p) => {
        const pbNameClean = (p.brandName || "").toLowerCase().replace(/[\s-]+/g, "");
        const pbSlugClean = (p.brandSlug || "").toLowerCase().replace(/[\s-]+/g, "");
        const pbId = (p.brandId || "").toLowerCase();
        const pcName = (p.categoryName || "").toLowerCase();
        const pcId = (p.categoryId || "").toLowerCase();

        if (activeClean === "cocojoy" || activeClean === "coco") {
          return pbNameClean.includes("coco") || pbSlugClean.includes("coco") || pbId.includes("coco") || pcName.includes("chocolate") || pcId.includes("chocolate");
        }
        if (activeClean === "vrinda") {
          return pbNameClean.includes("vrinda") || pbSlugClean.includes("vrinda") || pbId.includes("vrinda") || pcName.includes("tea") || pcId.includes("tea");
        }
        if (activeClean === "sangam") {
          return pbNameClean.includes("sangam") || pbSlugClean.includes("sangam") || pbId.includes("sangam") || pcName.includes("iced") || pcId.includes("iced");
        }
        if (activeClean === "urbanroast" || activeClean === "urban") {
          return pbNameClean.includes("urban") || pbSlugClean.includes("urban") || pbId.includes("urban") || pcName.includes("coffee") || pcId.includes("coffee");
        }

        return pbNameClean.includes(activeClean) || pbSlugClean.includes(activeClean) || pbId.includes(activeClean);
      });
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
  }, [initialProducts, filters, activeCol, searchQuery, sortBy]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  const handleTabSelect = (tabId: string) => {
    setFilters((prev) => ({
      ...prev,
      collection: tabId,
      category: "",
      brand: "",
    }));
  };

  return (
    <div ref={catalogTopRef} className="space-y-6">
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
            collectionCounts={collectionCounts}
          />
        </aside>

        {/* Main Catalog Area */}
        <div className="lg:col-span-3 space-y-5">
          {/* Search, Layout & Sort Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input with Instant Clear */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by flavor, spice, or brand..."
                className="w-full h-10 pl-10 pr-9 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {/* Mobile Filter Drawer Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden gap-1.5 h-10 px-3"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>

              {/* Grid vs. List View Toggle */}
              <div className="hidden sm:inline-flex items-center p-1 rounded-lg border border-stone-200 bg-stone-50">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-[#143425] shadow-2xs"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="List view"
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-[#143425] shadow-2xs"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs text-stone-600 shrink-0">
                <span className="hidden md:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#143425]/20"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Fresh New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Removable Tags */}
          {(activeCol || filters.serveStyle || filters.priceRange || filters.inStockOnly || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 text-[11px] font-medium mr-1">Active filters:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#143425]/5 border border-[#143425]/20 text-[#143425] font-medium">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {activeCol && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#143425]/5 border border-[#143425]/20 text-[#143425] font-medium capitalize">
                  Brand: {activeCol.replace(/-/g, " ")}
                  <button
                    type="button"
                    onClick={() => handleTabSelect("")}
                    className="hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.serveStyle && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#143425]/5 border border-[#143425]/20 text-[#143425] font-medium capitalize">
                  Style: {filters.serveStyle === "hot" ? "Hot Brew" : "Chilled / Iced"}
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, serveStyle: "" }))}
                    className="hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.priceRange && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#143425]/5 border border-[#143425]/20 text-[#143425] font-medium">
                  Price: {filters.priceRange === "under-300" ? "Under ₹300" : filters.priceRange === "300-450" ? "₹300 – ₹450" : "Above ₹450"}
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, priceRange: "" }))}
                    className="hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#143425]/5 border border-[#143425]/20 text-[#143425] font-medium">
                  In Stock Only
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                    className="hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#A87E28] hover:underline inline-flex items-center gap-1 text-[11px] font-semibold ml-auto"
              >
                <RotateCcw className="h-3 w-3" /> Reset all
              </button>
            </div>
          )}

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <p>
              Showing{" "}
              <span className="font-semibold text-stone-900">
                {filteredProducts.length === 0
                  ? 0
                  : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredProducts.length
                    )}`}
              </span>{" "}
              of <span className="font-semibold text-stone-900">{filteredProducts.length}</span> beverages
            </p>
          </div>

          {/* Products Grid / List / Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-2xs">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#F9F6F0] flex items-center justify-center text-[#143425]">
                <SearchIcon className="h-7 w-7 text-stone-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#143425]">
                No beverages matched your criteria
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try refining your search keyword or clearing applied brand and price filters.
              </p>
              <div className="pt-2">
                <Button variant="primary" size="sm" onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            </div>
          ) : viewMode === "list" ? (
            <div className="flex flex-col gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="list" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-stone-200/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                        isCurrent
                          ? "bg-[#143425] text-white shadow-2xs"
                          : "bg-white border border-stone-200 hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
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
              collectionCounts={collectionCounts}
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
