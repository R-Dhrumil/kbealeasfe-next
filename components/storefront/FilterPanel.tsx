"use client";

import React from "react";
import { CATEGORIES } from "@/data/categories";
import { BRANDS } from "@/data/brands";
import { X, RotateCcw } from "lucide-react";

export interface FilterState {
  category: string;
  brand: string;
  priceRange: string;
  inStockOnly: boolean;
}

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  isMobileDrawer = false,
  onCloseMobile,
}: FilterPanelProps) {
  const handleCategoryChange = (slug: string) => {
    onChange({
      ...filters,
      category: filters.category === slug ? "" : slug,
    });
  };

  const handleBrandChange = (slug: string) => {
    onChange({
      ...filters,
      brand: filters.brand === slug ? "" : slug,
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
    Boolean(filters.category) ||
    Boolean(filters.brand) ||
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

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#143425]">
          Four Categories
        </h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const isChecked = filters.category === cat.slug;
            return (
              <label
                key={cat.id}
                className="flex items-center justify-between text-sm cursor-pointer group select-none"
              >
                <span className="flex items-center gap-2 text-stone-700 group-hover:text-stone-950">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryChange(cat.slug)}
                    className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                  <span>{cat.name}</span>
                </span>
                <span className="text-xs font-mono text-stone-400">
                  {cat.productCount}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-4 border-t border-stone-200/80 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#143425]">
          Brand Portfolio
        </h4>
        <div className="space-y-2">
          {BRANDS.map((brand) => {
            const isChecked = filters.brand === brand.slug;
            return (
              <label
                key={brand.id}
                className="flex items-center justify-between text-sm cursor-pointer group select-none"
              >
                <span className="flex items-center gap-2 text-stone-700 group-hover:text-stone-950">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandChange(brand.slug)}
                    className="h-4 w-4 rounded border-stone-300 text-[#143425] focus:ring-[#143425]"
                  />
                  <span>{brand.name}</span>
                </span>
                <span className="text-xs font-mono text-stone-400">
                  {brand.productCount}
                </span>
              </label>
            );
          })}
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
