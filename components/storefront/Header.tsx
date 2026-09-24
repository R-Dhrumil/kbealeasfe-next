"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  Search,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { BRAND_COLLECTIONS } from "@/data/collections";

export function Header() {
  const { openCart, summary } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#E8DED1]/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation"
            className="md:hidden p-2 text-[#143425] hover:text-[#C89B3C] transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-xl bg-[#143425] flex items-center justify-center text-[#F9F6F0] font-serif font-bold text-xl tracking-wider shadow-sm group-hover:bg-[#1C4834] transition-colors">
              KB
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#143425] block leading-none">
                KB BEVERAGE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A87E28] font-semibold block mt-0.5">
                Pure Taste, Every Time.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <Link
              href="/shop"
              className="hover:text-[#143425] transition-colors py-2"
            >
              Shop All
            </Link>

            {/* Unified Collections Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#143425] transition-colors"
              >
                <span>Collections</span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {collectionsOpen && (
                <div className="absolute top-full -left-4 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                    Our 4 Dedicated Collections
                  </div>
                  <div className="pt-1.5 space-y-1">
                    {BRAND_COLLECTIONS.map((col) => (
                      <Link
                        key={col.id}
                        href={`/brands/${col.brandSlug}`}
                        onClick={() => setCollectionsOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F9F6F0] transition-colors group/item"
                      >
                        <div>
                          <p className="text-sm font-semibold text-stone-900 group-hover/item:text-[#143425]">
                            {col.brandName}{" "}
                            <span className="text-xs font-normal text-stone-500">
                              • {col.categoryName}
                            </span>
                          </p>
                          <p className="text-[11px] text-stone-400 line-clamp-1">
                            {col.tagline}
                          </p>
                        </div>
                        <span className="text-[11px] font-mono text-stone-400">
                          {col.productCount}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 px-3 py-1 flex items-center justify-between">
                    <Link
                      href="/brands"
                      onClick={() => setCollectionsOpen(false)}
                      className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Brand Heritage</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/shop"
                      onClick={() => setCollectionsOpen(false)}
                      className="text-xs text-stone-500 hover:text-stone-900"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="hover:text-[#143425] transition-colors py-2"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="hover:text-[#143425] transition-colors py-2"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/search"
              aria-label="Search catalog"
              className="p-2 text-stone-700 hover:text-[#143425] hover:bg-stone-200/50 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/wishlist"
              aria-label="View wishlist"
              className="relative p-2 text-stone-700 hover:text-[#143425] hover:bg-stone-200/50 rounded-lg transition-colors"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#C89B3C] text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label="Open shopping cart"
              className="relative p-2 text-stone-700 hover:text-[#143425] hover:bg-stone-200/50 rounded-lg transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {summary.itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#143425] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {summary.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-[#F9F6F0] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E8DED1]">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-[#143425] flex items-center justify-center text-white font-serif font-bold">
                    KB
                  </div>
                  <div>
                    <span className="font-serif font-bold text-[#143425] text-base block">
                      KB BEVERAGE
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#A87E28]">
                      Pure Taste, Every Time.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-stone-900 hover:text-[#143425]"
                >
                  Shop Full Catalog
                </Link>

                <div className="pt-2 border-t border-[#E8DED1]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Brand Collections
                  </p>
                  <div className="space-y-2 pl-2">
                    {BRAND_COLLECTIONS.map((col) => (
                      <Link
                        key={col.id}
                        href={`/brands/${col.brandSlug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between text-sm text-stone-700 hover:text-[#143425] py-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium text-stone-900">{col.brandName}</span>
                          <span className="text-xs text-stone-500">({col.categoryName})</span>
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          {col.productCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8DED1] space-y-2">
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-stone-800"
                  >
                    About KB Heritage
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-stone-800"
                  >
                    Contact &amp; Distribution
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-stone-800"
                  >
                    My Account / Orders
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DED1] text-xs text-stone-500 space-y-2">
              <p>Customer Support: care@kbbeverage.com</p>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-[#143425] font-semibold bg-[#E8F2EC] px-3 py-2 rounded-lg w-full justify-center"
              >
                <ShieldAlert className="h-4 w-4 text-[#A87E28]" /> Open Admin Operations UI
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
