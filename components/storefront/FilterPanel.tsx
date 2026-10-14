"use client";

import React from "react";
import { BRAND_COLLECTIONS } from "@/service/collections";
import { X, RotateCcw } from "lucide-react";

export interface FilterState {
  collection: string;
  serveStyle: string;
  priceRange: string;
  inStockOnly: boolean;
  category?: string;
  brand?: string;
}

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
  collectionCounts?: Record<string, number>;
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  isMobileDrawer = false,
  onCloseMobile,
  collectionCounts,
}: FilterPanelProps) {
  // Active collection ID: checks direct collection, or matches legacy category/brand
  const activeCollection =
    filters.collection ||
    (filters.brand ? filters.brand.replace(/^brand-/, "") : "") ||
    (filters.category === "tea-premixes"
      ? "vrinda"
      : filters.category === "iced-teas"
      ? "sangam"
      : filters.category === "artisan-coffee"
      ? "urban-roast"
      : filters.category === "chocolate-drinks" || filters.category === "plant-based-specialties"
      ? "cocojoy"
      : "");

  const handleCollectionChange = (id: string) => {
    onChange({
      ...filters,
      collection: activeCollection === id ? "" : id,
      category: "",
      brand: "",
    });
  };

  const handleServeStyleChange = (style: string) => {
    onChange({
      ...filters,
      serveStyle: filters.serveStyle === style ? "" : style,
    });
  };

  const handlePriceChange = (range: string) => {
    onChange({
      ...filters,
      priceRange: filters.priceRange === range ? "" : range,
    });
  };

  const handleStockToggle = () => {
    onChange({
      ...filters,
      inStockOnly: !filters.inStockOnly,
    });
  };

  const hasActiveFilters =
    Boolean(activeCollection) ||
    Boolean(filters.serveStyle) ||
    Boolean(filters.priceRange) ||
    filters.inStockOnly;

  return (
    <div className="space-y-6">
      {/* Header if mobile drawer */}
      {isMobileDrawer && (
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <h3 className="font-serif text-lg font-bold text-[#143425]">
            Filter Catalog
          </h3>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 text-stone-500 hover:text-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Clear active filters button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A87E28] hover:text-[#143425] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}

      {/* Unified Brands Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#143425]">
            Brands
          </h4>
          <span className="text-[10px] text-[#A87E28] font-medium">4 Lines</span>
        </div>

        <div className="space-y-1.5">
          {BRAND_COLLECTIONS.map((col) => {
            const isChecked = activeCollection === col.id;
            const count = collectionCounts?.[col.id] ?? col.productCount;
            return (
              <label
                key={col.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-sm cursor-pointer select-none transition-all ${
                  isChecked
                    ? "bg-[#143425]/5 border-[#143425]/30 shadow-2xs"
                    : "border-transparent hover:bg-[#FAF7F2]"
                }`}
              >
                <span className="flex items-center gap-2.5 text-stone-700">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCollectionChange(col.id)}
                    className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                  <div>
                    <span className="font-semibold text-stone-900 block leading-tight">
                      {col.brandName}
                    </span>
                    <span className="text-[11px] text-[#A87E28] block leading-tight mt-0.5">
                      {col.categoryName}
                    </span>
                  </div>
                </span>
                <span className="text-[10px] font-mono text-stone-500 px-2 py-0.5 rounded-full bg-stone-100">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Serving Style Filter */}
      <div className="pt-4 border-t border-stone-200/80 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#143425]">
          Serving Temperature
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleServeStyleChange("hot")}
            className={`flex items-center justify-center py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
              filters.serveStyle === "hot"
                ? "bg-[#143425] text-white border-[#143425]"
                : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
            }`}
          >
            Hot Brew
          </button>
          <button
            type="button"
            onClick={() => handleServeStyleChange("cold")}
            className={`flex items-center justify-center py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
              filters.serveStyle === "cold"
                ? "bg-[#143425] text-white border-[#143425]"
                : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
            }`}
          >
            Chilled / Iced
          </button>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-stone-200/80 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#143425]">
          Price Range
        </h4>
        <div className="space-y-2">
          {[
            { label: "Under ₹300", value: "under-300" },
            { label: "₹300 – ₹450", value: "300-450" },
            { label: "Above ₹450", value: "above-450" },
          ].map((range) => {
            const isChecked = filters.priceRange === range.value;
            return (
              <label
                key={range.value}
                className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-950 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isChecked}
                  onChange={() => handlePriceChange(range.value)}
                  className="h-4 w-4 text-[#143425] focus:ring-[#143425]"
                />
                <span>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-4 border-t border-stone-200/80">
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={handleStockToggle}
            className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
