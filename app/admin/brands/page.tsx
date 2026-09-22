"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit2, Sparkles, Award } from "lucide-react";
import { BRANDS } from "@/data/brands";
import { Badge } from "@/components/ui/Badge";

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
          <Award className="h-3 w-3 text-[#A87E28]" />
          <span>Verified Brand Portfolio</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#143425]">
          Brand Portfolio Management
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage brand identities, taglines, and heritage stories as verified from the KB brochure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRANDS.map((brand) => (
          <div
            key={brand.id}
            className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#F2ECE1] flex items-center justify-center text-2xl">
                  {brand.logo}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#143425]">
                    {brand.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#A87E28] uppercase tracking-wider">
                    {brand.tagline}
                  </p>
                </div>
              </div>

              <Badge variant="success">Active Brand</Badge>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {brand.story}
            </p>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>{brand.productCount} Active Beverage SKUs</span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/brands/${brand.slug}`}
                  target="_blank"
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 flex items-center gap-1 font-semibold"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
