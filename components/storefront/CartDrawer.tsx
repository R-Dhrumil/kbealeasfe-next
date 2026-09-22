"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, summary } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-[#F9F6F0]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#143425]" />
            <h2 className="font-serif text-lg font-bold text-[#143425]">
              Your Cart
            </h2>
            <span className="text-xs font-mono bg-[#E8F2EC] text-[#143425] font-semibold px-2 py-0.5 rounded-full">
              {summary.itemCount} items
            </span>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="px-6 py-3 bg-[#F2ECE1]/60 border-b border-stone-200 text-xs text-stone-700">
          {summary.subtotal >= 499 ? (
            <p className="text-emerald-800 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Unlocked Free Express Shipping!
            </p>
          ) : (
            <div className="space-y-1.5">
              <p>
                Add{" "}
                <span className="font-semibold text-[#143425]">
                  {formatPrice(499 - summary.subtotal)}
                </span>{" "}
                more to unlock Free Delivery
              </p>
              <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#143425] transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (summary.subtotal / 499) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="h-16 w-16 rounded-full bg-[#F9F6F0] flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag className="h-8 w-8 text-stone-300" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
                Your cart is currently empty
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                Discover our authentic tea premixes, iced teas, and artisan roasted beverages.
              </p>
              <Button
                variant="primary"
                onClick={closeCart}
                className="gap-2"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="py-4 flex gap-4 first:pt-0 last:pb-0"
              >
                <div className="relative h-20 w-20 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A87E28]">
                          {item.product.brandName}
                        </span>
                        <h4 className="text-sm font-medium text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-xs font-mono font-medium text-[#143425] mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <QuantitySelector
                      size="sm"
                      value={item.quantity}
                      onChange={(qty) => updateQuantity(item.product.id, qty)}
                    />

                    <span className="text-xs font-mono font-bold text-stone-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-[#F9F6F0] space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-stone-900">
                  {formatPrice(summary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono font-medium text-stone-900">
                  {summary.shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[11px]">
                      Free
                    </span>
                  ) : (
                    formatPrice(summary.shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-mono font-medium text-stone-900">
                  {formatPrice(summary.tax)}
                </span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotion Discount</span>
                  <span className="font-mono font-medium">
                    -{formatPrice(summary.discount)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-[#143425]">
                <span>Total Amount</span>
                <span className="font-mono">{formatPrice(summary.total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#143425] hover:bg-[#1C4834] text-white font-medium text-sm transition-all shadow-md active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full flex items-center justify-center h-10 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium transition-colors"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
