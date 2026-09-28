"use client";

import React from "react";
import Image from "next/image";
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
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white border border-stone-200/80 p-3.5 sm:p-4 hover:border-stone-300 hover:shadow-md transition-all duration-300 overflow-hidden",
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
        className="relative aspect-square w-full rounded-xl bg-[#F7F4EE] overflow-hidden flex items-center justify-center mb-3.5"
      >
        <Image
          src={(product.images && product.images[0]) ? product.images[0] : "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 ease-out group-hover:scale-105",
            (product.images && product.images[1]) && "group-hover:opacity-0"
          )}
        />
        {(product.images && product.images[1]) && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
          />
        )}
      </Link>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
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
          className="font-medium text-sm sm:text-base text-stone-900 group-hover:text-[#143425] line-clamp-1 transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
          {product.tagline}
        </p>

        {/* Flavor Notes Pills */}
        <div className="flex flex-wrap gap-1 mt-2.5 mb-3">
          {(product.flavorNotes || []).slice(0, 2).map((note, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-[#F2ECE1] text-[#6E4D38] px-1.5 py-0.5 rounded font-medium"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Price and Add to Cart Action */}
        <div className="mt-auto pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-medium transition-all shadow-2xs active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
