import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/types/brand";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";

export interface BrandCardProps {
  brand: Brand;
  className?: string;
}

export function BrandCard({ brand, className }: BrandCardProps) {
  const brandColor = brand.themeColor || brand.accentColor || "#143425";

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl bg-white border border-[#E8DED1] p-6 shadow-2xs hover:shadow-xl hover:border-stone-300 transition-all duration-300 overflow-hidden",
        className
      )}
    >
      {/* Brand Theme Color Accent Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 opacity-90 transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: brandColor }}
      />

      <div>
        {/* Header: Logo & Item count */}
        <div className="flex items-center justify-between mb-5 pt-1">
          <div className="relative h-14 w-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DED1] p-2 flex items-center justify-center font-serif font-bold text-sm text-[#143425] tracking-wider shadow-2xs group-hover:scale-105 group-hover:border-stone-300 transition-all duration-300 overflow-hidden">
            {typeof brand.logo === "string" && (brand.logo.startsWith("/") || brand.logo.startsWith("http")) ? (
              <SafeImage
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain p-1.5"
                fallbackSrc="/assets/HeroSlider_images/vrinda_tea.png"
              />
            ) : (
              <span>{brand.logo || brand.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>

          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E8DED1]">
            {brand.productCount} {brand.productCount === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Brand Titles */}
        <h3 className="font-serif text-2xl font-bold text-[#143425] group-hover:text-[#A87E28] transition-colors leading-tight">
          {brand.name}
        </h3>
        <p className="text-xs font-semibold text-[#A87E28] uppercase tracking-wider mt-1">
          {brand.tagline}
        </p>

        {/* Description */}
        <p className="mt-3 text-xs text-stone-600 leading-relaxed line-clamp-3">
          {brand.description}
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 mt-6 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#143425] group-hover:text-[#C89B3C] transition-colors">
        <span>Explore Brand</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
