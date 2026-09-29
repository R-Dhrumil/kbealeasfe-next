"use client";

import React, { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, summary, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "KBWELCOME10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try KBWELCOME10 for ₹100 off.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
        <div className="h-20 w-20 mx-auto rounded-full bg-[#F2ECE1] flex items-center justify-center text-[#143425]">
          <ShoppingBag className="h-10 w-10 text-[#143425]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#143425]">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-stone-600 text-sm max-w-md mx-auto">
          You haven&apos;t added any beverages to your cart yet. Explore our authentic tea premixes, cold iced teas, and roasted coffees.
        </p>
        <div className="pt-2">
          <Link href="/shop">
            <Button variant="primary" size="lg" className="gap-2">
              <span>Start Exploring</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
            Order Review
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#143425] mt-1">
            Shopping Cart ({summary.itemCount} items)
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100 shadow-2xs">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#F7F4EE] overflow-hidden shrink-0 border border-stone-100">
                    <SafeImage
                      src={(item.product.images && item.product.images[0]) ? item.product.images[0] : null}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87E28]">
                      {item.product.brandName}
                    </span>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-serif text-base sm:text-lg font-medium text-stone-900 hover:text-[#143425] block line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {item.selectedPack || item.product.details.netWeight}
                    </p>
                    <p className="text-xs font-mono font-medium text-[#143425] mt-1">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(qty) => updateQuantity(item.product.id, qty)}
                    size="sm"
                  />

                  <div className="text-right min-w-[70px]">
                    <span className="font-mono font-bold text-sm sm:text-base text-stone-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    aria-label="Remove item"
                    className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143425] hover:text-[#C89B3C] pt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping Collections</span>
          </Link>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-2xs">
            <h3 className="font-serif text-lg font-bold text-[#143425] pb-4 border-b border-stone-100">
              Order Summary
            </h3>

            {/* Price lines */}
            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({summary.itemCount} items)</span>
                <span className="font-mono font-medium text-stone-900">
                  {formatPrice(summary.subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono font-medium text-stone-900">
                  {summary.shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-xs">
                      Free
                    </span>
                  ) : (
                    formatPrice(summary.shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-mono font-medium text-stone-900">
                  {formatPrice(summary.tax)}
                </span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon: KBWELCOME10</span>
                  <span className="font-mono">-₹100</span>
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex justify-between text-base sm:text-lg font-bold text-[#143425]">
                <span>Total Amount</span>
                <span className="font-mono">
                  {formatPrice(
                    couponApplied ? Math.max(0, summary.total - 100) : summary.total
                  )}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-700 block">
                Have a Promo Code?
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. KBWELCOME10"
                  className="flex-1 h-10 px-3 rounded-lg border border-stone-300 text-xs text-stone-900 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#143425]"
                />
                <Button variant="outline" size="sm" type="submit">
                  Apply
                </Button>
              </div>
              {couponApplied && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Code KBWELCOME10 applied successfully!
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">
                  {couponError}
                </p>
              )}
            </form>

            <Link href="/checkout" className="block w-full">
              <Button variant="primary" size="lg" className="w-full gap-2 shadow-sm">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
