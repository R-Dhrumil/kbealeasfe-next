"use client";

import React, { useState, useMemo } from "react";
import { Search as SearchIcon, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { ProductCard } from "@/components/storefront/ProductCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.flavorNotes || []).some((f) => f.toLowerCase().includes(q)) ||
        (p.details?.ingredients || []).some((ing) => ing.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Header & Search Bar */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#143425] text-xs font-semibold">
          <Sparkles className="h-3 w-3 text-[#C89B3C]" /> Instant Beverage Search
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#143425] font-normal tracking-tight">
          What would you like to sip today?
        </h1>

        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'Cardamom', 'Guava Chilly', 'Cold Brew', 'Assam', 'Hot Chocolate'..."
            className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-stone-200 bg-white text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#143425] shadow-sm transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600">
          <span className="font-semibold text-stone-400">Trending:</span>
          {["Cardamom Premix", "Guava Chilly", "Masala Chai", "Mysore Gold", "Hot Chocolate", "Cold Cocoa"].map(
            (term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-[#F2ECE1] text-stone-700 hover:text-[#143425] transition-colors border border-stone-200/80"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results or Empty State */}
      {query.trim() ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <h2 className="text-lg font-serif font-bold text-[#143425]">
              Search Results ({results.length})
            </h2>
            <p className="text-xs text-stone-500">
              Matching &quot;{query}&quot;
            </p>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
              <p className="font-serif text-lg font-bold text-[#143425]">
                No beverages match your search
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn&apos;t find any beverages matching &quot;{query}&quot;. Try exploring our four core categories below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Explore Four Categories if no search query entered yet */
        <div className="pt-8 border-t border-[#E8DED1] space-y-6">
          <h2 className="text-xl font-serif font-bold text-[#143425] text-center">
            Or Browse The 4 Primary Collections
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 transition-all hover:shadow-md flex flex-col justify-between h-40"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A87E28] font-bold">
                    Collection
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#143425] mt-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {cat.tagline}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#143425] group-hover:text-[#C89B3C]">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
