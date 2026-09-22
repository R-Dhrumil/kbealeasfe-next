"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();

  const wishlistedProducts = PRODUCTS.filter((p) =>
    wishlistIds.includes(p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
            Saved Collections
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#143425] mt-1">
            My Wishlist ({wishlistedProducts.length})
          </h1>
        </div>
        <Link href="/shop">
          <Button variant="outline" size="sm">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-14 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
          <div className="h-16 w-16 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#143425]">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-stone-500">
            Save your favorite tea premixes, cold iced teas, and specialty beverages to order anytime with one click.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="primary" size="md" className="gap-2">
                <span>Discover Products</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
