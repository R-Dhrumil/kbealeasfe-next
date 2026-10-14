"use client";

import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/product";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  className?: string;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, className, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const isList = viewMode === "list";

  return (
    <div
      className={cn(
        "group relative flex rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-md transition-all duration-300 overflow-hidden",
        isList
          ? "flex-col sm:flex-row p-4 sm:p-5 gap-5 items-stretch sm:items-center"
          : "flex-col p-3.5 sm:p-4",
        className
      )}
    >
      {/* Top badges & Wishlist button */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.mrp > product.price && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#C89B3C] text-white shadow-2xs">
            -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#143425] text-white shadow-2xs">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#A87E28] text-white shadow-2xs">
            New
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-colors shadow-2xs",
          isWishlisted
            ? "text-rose-600 bg-rose-50"
            : "text-stone-400 hover:text-stone-800 hover:bg-white"
        )}
      >
        <Heart
          className={cn("h-4 w-4", isWishlisted && "fill-current text-rose-500")}
        />
      </button>

      {/* Image container with secondary hover image */}
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          "relative rounded-xl bg-[#F7F4EE] overflow-hidden flex items-center justify-center shrink-0",
          isList
            ? "w-full sm:w-44 h-44 aspect-square mb-0"
            : "aspect-square w-full mb-3.5"
        )}
      >
        <SafeImage
          src={(product.images && product.images[0]) ? product.images[0] : null}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 ease-out group-hover:scale-105",
            (product.images && product.images[1]) && "group-hover:opacity-0"
          )}
        />
        {(product.images && product.images[1]) && (
          <SafeImage
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
          />
        )}
      </Link>

      {/* Product Information */}
      <div className={cn("flex flex-col flex-1", isList && "justify-between")}>
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[#A87E28] text-[11px]">
              {product.brandName}
            </span>
            <div className="flex items-center gap-1 text-stone-600">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-xs">{product.rating}</span>
              <span className="text-[11px] text-stone-400">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className={cn(
              "font-medium text-stone-900 group-hover:text-[#143425] transition-colors",
              isList ? "text-base sm:text-lg line-clamp-1" : "text-sm sm:text-base line-clamp-1"
            )}
          >
            {product.name}
          </Link>

          <p className={cn("text-xs text-stone-500 mt-0.5", isList ? "line-clamp-2 sm:line-clamp-3" : "line-clamp-1")}>
            {product.description || product.tagline}
          </p>

          {/* Flavor Notes Pills */}
          <div className="flex flex-wrap gap-1 mt-2.5 mb-3">
            {(product.flavorNotes || []).slice(0, isList ? 4 : 2).map((note, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-[#F2ECE1] text-[#6E4D38] px-1.5 py-0.5 rounded font-medium"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Price and Add to Cart Action */}
        <div className={cn("pt-2.5 border-t border-stone-100 flex items-center justify-between", !isList && "mt-auto")}>
          <PriceDisplay price={product.price} mrp={product.mrp} size={isList ? "md" : "sm"} />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3.5 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-medium transition-all shadow-2xs active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
