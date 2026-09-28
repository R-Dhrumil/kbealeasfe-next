"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ProductsAdminClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchBrand =
        selectedBrand === "all" || p.brandId === selectedBrand;
      const matchCategory =
        selectedCategory === "all" || p.categoryId === selectedCategory;
      return matchQuery && matchBrand && matchCategory;
    });
  }, [products, search, selectedBrand, selectedCategory]);

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Product Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage SKU listings, stock levels, brand categorizations, and retail pricing.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" className="gap-1.5 shadow-2xs">
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Strip */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143425]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Brands</option>
            <option value="brand-vrinda">Vrinda</option>
            <option value="brand-sangam">Sangam</option>
            <option value="brand-urban-roast">Urban Roast</option>
            <option value="brand-cocojoy">CocoJoy</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All 4 Categories</option>
            <option value="cat-tea-premixes">Tea Premixes</option>
            <option value="cat-iced-teas">Iced Teas</option>
            <option value="cat-artisan-coffee">Artisan Coffee</option>
            <option value="cat-chocolate-drinks">Chocolate Drinks</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200 font-serif font-bold text-stone-700">
              <tr>
                <th className="py-3.5 px-4">Product & SKU</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / MRP</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  {/* Product & SKU */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                        <Image src={(p.images && p.images[0]) ? p.images[0] : "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 line-clamp-1">
                          {p.name}
                        </p>
                        <p className="font-mono text-[11px] text-stone-400 mt-0.5">
                          {p.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="py-3.5 px-4 font-medium text-stone-800">
                    {p.brandName}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-stone-600">
                    {p.categoryName}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-mono font-medium">
                    <span className="text-stone-900 font-bold">{formatPrice(p.price)}</span>
                    <span className="text-stone-400 line-through text-[11px] ml-1.5">
                      {formatPrice(p.mrp)}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`font-semibold ${
                        p.stockCount < 25 ? "text-amber-700" : "text-stone-800"
                      }`}
                    >
                      {p.stockCount} units
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {p.inStock ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="danger">Out of Stock</Badge>
                    )}
                  </td>

                  {/* Actions Three-dot menu */}
                  <td className="py-3.5 px-4 text-right relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(activeMenuId === p.id ? null : p.id)
                      }
                      className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeMenuId === p.id && (
                      <div className="absolute right-4 top-10 w-36 bg-white rounded-xl shadow-lg border border-stone-200 p-1 z-20 text-left space-y-0.5 animate-in fade-in duration-100">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-50 text-stone-700 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Live</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-rose-50 text-rose-600 text-xs w-full text-left"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
          <span>Showing {filteredProducts.length} of {products.length} SKUs</span>
          <span className="font-mono text-[11px]">All data synchronized with local mock store</span>
        </div>
      </div>
    </div>
  );
}
