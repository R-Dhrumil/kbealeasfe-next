import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-2xl h-80 sm:h-96 p-6 transition-all duration-300 shadow-sm hover:shadow-xl",
        className
      )}
    >
      {/* Background Image with Dark Vignette */}
      <SafeImage
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 space-y-2">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#C89B3C]">
          {category.productCount} Products
        </span>

        <h3 className="font-serif text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-[#F9F6F0]">
          {category.name}
        </h3>

        <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed">
          {category.description}
        </p>

        <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-white group-hover:text-[#C89B3C] transition-colors">
          <span>Explore Collection</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
