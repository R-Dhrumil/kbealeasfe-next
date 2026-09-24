import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/types/brand";
import { cn } from "@/lib/utils";

export interface BrandCardProps {
  brand: Brand;
  className?: string;
}

export function BrandCard({ brand, className }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        "group flex flex-col justify-between rounded-2xl bg-white border border-stone-200/90 p-6 hover:border-stone-400 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-[#F2ECE1] flex items-center justify-center font-serif font-bold text-sm text-[#143425] tracking-wider border border-stone-200/60">
            {brand.logo}
          </div>
          <span className="text-xs font-mono text-stone-400">
            {brand.productCount} Items
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold text-[#143425] group-hover:text-[#A87E28] transition-colors">
          {brand.name}
        </h3>
        <p className="text-xs font-semibold text-[#A87E28] uppercase tracking-wider mt-0.5">
          {brand.tagline}
        </p>

        <p className="mt-3 text-xs text-stone-600 leading-relaxed line-clamp-3">
          {brand.description}
        </p>
      </div>

      <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-[#143425] group-hover:text-[#C89B3C] transition-colors">
        <span>View Brand Collection</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
