"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Package,
} from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/storefront/ProductCard";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"prep" | "ingredients" | "packaging">("prep");
  const [packSize, setPackSize] = useState<string>("Standard Pouch");

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity, packSize);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, packSize);
    router.push("/checkout");
  };

  return (
    <div className="space-y-16">
      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl bg-[#F7F4EE] border border-stone-200/80 overflow-hidden shadow-sm">
            <Image
              src={(product.images && product.images.length > 0) ? (product.images[activeImageIndex] || product.images[0]) : "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              {product.isBestSeller && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#143425] text-white">
                  Best Seller
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#C89B3C] text-stone-950">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {(product.images && product.images.length > 1) && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all bg-[#F7F4EE]",
                    activeImageIndex === idx
                      ? "border-[#143425] shadow-xs"
                      : "border-stone-200 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Purchasing & Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand Tag & Title */}
          <div>
            <Link
              href={`/brands/${product.brandId.replace("brand-", "")}`}
              className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-[#A87E28] hover:underline mb-1.5"
            >
              <span>{product.brandName}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#143425] tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-stone-600 text-sm mt-1.5">{product.tagline}</p>
          </div>

          {/* Rating & Stock Status */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold text-xs text-stone-900">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs text-stone-500">
                ({product.reviewCount} Verified Buyer Reviews)
              </span>
            </div>

            {product.inStock ? (
              <Badge variant="success">In Stock ({product.stockCount} left)</Badge>
            ) : (
              <Badge variant="danger">Temporarily Out of Stock</Badge>
            )}
          </div>

          {/* Price Box */}
          <div className="bg-[#F2ECE1]/50 p-4 rounded-2xl border border-[#D9CBB8]">
            <PriceDisplay
              price={product.price}
              mrp={product.mrp}
              size="xl"
              showDiscount
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Inclusive of all taxes. Free shipping on orders over ₹499.
            </p>
          </div>

          {/* Flavor Notes */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
              Sensory Flavor Profile
            </span>
            <div className="flex flex-wrap gap-2">
              {(product.flavorNotes || []).map((note, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-lg bg-white border border-stone-200 text-[#143425] font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Pack Options */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
              Select Quantity / Format
            </span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: product.details?.netWeight || "1 Kg", desc: "Standard Pouch" },
                { label: "Twin Saver Pack", desc: "2 x Pouch (Save 10%)" },
              ].map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPackSize(opt.desc)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all text-xs",
                    packSize === opt.desc
                      ? "border-[#143425] bg-white ring-1 ring-[#143425]"
                      : "border-stone-200 bg-stone-50/50 hover:bg-white"
                  )}
                >
                  <p className="font-bold text-stone-900">{opt.label}</p>
                  <p className="text-stone-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                size="md"
              />

              <Button
                variant="primary"
                onClick={handleAddToCart}
                className="flex-1 h-11 gap-2 shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Cart</span>
              </Button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "h-11 w-11 rounded-xl border flex items-center justify-center transition-colors",
                  isWishlisted
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-stone-300 hover:bg-stone-50 text-stone-600"
                )}
              >
                <Heart
                  className={cn("h-5 w-5", isWishlisted && "fill-current text-rose-500")}
                />
              </button>
            </div>

            <Button
              variant="secondary"
              onClick={handleBuyNow}
              className="w-full h-11 border-[#143425] text-[#143425] font-semibold"
            >
              Buy Now with Instant Checkout
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 border-t border-stone-200/80 grid grid-cols-2 gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>100% Pure Natural Formula</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#A87E28] shrink-0" />
              <span>Ready in 10 Seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#143425] shrink-0" />
              <span>Aroma-Lock Multi-Foil</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#A87E28] shrink-0" />
              <span>Estate Grade Leaves</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Specifications Tabs */}
      <div className="border border-stone-200/80 rounded-3xl bg-white overflow-hidden shadow-2xs">
        <div className="flex border-b border-stone-200 bg-[#F9F6F0]">
          {[
            { id: "prep", label: "Brewing Guide" },
            { id: "ingredients", label: "Ingredients & Formulation" },
            { id: "packaging", label: "Packaging & Storage" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-4 text-xs sm:text-sm font-semibold transition-all border-b-2",
                activeTab === tab.id
                  ? "border-[#143425] text-[#143425] bg-white"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === "prep" && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#143425]">
                How to Brew the Perfect Cup
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {(product.details?.preparationNotes || ["Add 1 scoop to hot/cold water."]).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2"
                  >
                    <div className="h-7 w-7 rounded-full bg-[#143425] text-white font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-[#143425]">
                Natural Ingredients Declaration
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Crafted with complete transparency. We never add synthetic caffeine boosters or artificial thickening gums.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {(product.details?.ingredients || ["Natural Ingredients"]).map((ing, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm text-stone-800"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "packaging" && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#143425]">
                Packaging & Preservation Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700 pt-2">
                <div className="p-4 rounded-xl bg-stone-50">
                  <p className="text-stone-400 font-medium">Packaging Type</p>
                  <p className="font-semibold text-stone-900 mt-1">
                    {product.details?.packaging || "Standard Pouch"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50">
                  <p className="text-stone-400 font-medium">Shelf Life</p>
                  <p className="font-semibold text-stone-900 mt-1">
                    {product.details?.shelfLife || "12 Months"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50">
                  <p className="text-stone-400 font-medium">Storage Advice</p>
                  <p className="font-semibold text-stone-900 mt-1">
                    {product.details?.storageNotes || "Store in a cool, dry place."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
                Complementary Selections
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#143425] mt-0.5">
                You May Also Enjoy
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C]"
            >
              View Full Menu →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
