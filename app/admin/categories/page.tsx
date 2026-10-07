"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CATEGORIES, getCategories } from "@/data/categories";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Edit2, Eye, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editTagline, setEditTagline] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStartEdit = (id: string, currentTagline: string) => {
    setEditingCatId(id);
    setEditTagline(currentTagline);
  };

  const handleSaveEdit = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, tagline: editTagline } : c))
    );
    setEditingCatId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
            <Sparkles className="h-3 w-3 text-[#C89B3C]" />
            <span>Strict Four Primary Brands System</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Four Primary Brands
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            The core architecture of the KB beverage menu. Exactly four primary brands are maintained.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200 font-serif font-bold text-stone-700">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Brand Image & Name</th>
                <th className="py-3.5 px-4">Tagline</th>
                <th className="py-3.5 px-4">Catalog Count</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-500">
                    0{cat.order || idx + 1}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                        <Image src={cat.image} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-sm">
                          {cat.name}
                        </p>
                        <p className="font-mono text-[10px] text-stone-400">
                          slug: /{cat.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    {editingCatId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTagline}
                          onChange={(e) => setEditTagline(e.target.value)}
                          className="h-8 px-2 rounded border border-stone-300 text-xs w-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-1 text-emerald-700 hover:text-emerald-800"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-stone-600 line-clamp-1">{cat.tagline}</p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                    {cat.productCount} SKUs
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="success">Active Pillar</Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat.id, cat.tagline)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100"
                        title="Edit Tagline"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/category/${cat.slug}`}
                        target="_blank"
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100"
                        title="View on Storefront"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
