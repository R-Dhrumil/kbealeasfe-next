"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomer } from "@/context/CustomerContext";
import { BRAND_COLLECTIONS } from "@/service/collections";

export function Header() {
  const { openCart, summary } = useCart();
  const { wishlistCount } = useWishlist();
  const { customer, isLoggedIn, logout, orders } = useCustomer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

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
            <div className="relative h-12 w-16 sm:h-14 sm:w-20 overflow-hidden rounded-xl bg-white p-1 border border-stone-200/60 shadow-2xs group-hover:border-[#143425]/30 transition-all">
              <Image
                src="/kbealeas_logo.jpeg"
                alt="KB Beverage - Pure Taste, Every Time"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#143425] block leading-none">
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

          {/* Right Action Icons (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              aria-label="Search catalog"
              className="p-2 text-stone-700 hover:text-[#143425] hover:bg-stone-200/50 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>


            {/* Account / User Menu Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <Link
                href={customer?.memberTier === "Admin" ? "/admin" : "/account"}
                aria-label="Customer Account"
                className="flex items-center gap-1.5 p-2 text-stone-700 hover:text-[#143425] hover:bg-stone-200/50 rounded-lg transition-colors group"
              >
                {isLoggedIn && customer ? (
                  <div className="h-6 w-6 rounded-full bg-[#143425] text-white flex items-center justify-center text-[10px] font-bold">
                    {customer.fullName.charAt(0)}
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="hidden xl:inline text-xs font-semibold text-stone-800">
                  {isLoggedIn && customer ? customer.fullName.split(" ")[0] : "Account"}
                </span>
              </Link>

              {accountOpen && (
                <div className="absolute top-full right-0 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isLoggedIn && customer ? (
                    <>
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-[#143425] line-clamp-1">
                          {customer.fullName}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href={customer?.memberTier === "Admin" ? "/admin" : "/account"}
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#F9F6F0] rounded-xl transition-colors"
                        >
                          <User className="h-4 w-4 text-[#A87E28]" />
                          <span>Profile</span>
                          {wishlistCount > 0 && (
                            <span className="ml-auto h-4 w-4 bg-[#C89B3C] text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setAccountOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 space-y-2 text-center">
                      <p className="text-xs text-stone-600">
                        Sign in to access your orders, saved addresses, and member privileges.
                      </p>
                      <Link
                        href="/account/login"
                        onClick={() => setAccountOpen(false)}
                        className="block w-full py-2 rounded-xl bg-[#143425] text-white text-xs font-semibold hover:bg-[#1C4834] transition-colors"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger */}
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
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-white p-0.5 border border-stone-200/60 shadow-2xs">
                    <Image
                      src="/kbealeas_logo.jpeg"
                      alt="KB Beverage Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-[#143425] text-base block">
                      KB BEVERAGE
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#A87E28]">
                      Pure Taste, Every Time.
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Customer Status Card */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#E8DED1] shadow-2xs">
                {isLoggedIn && customer ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#143425] text-white flex items-center justify-center text-xs font-bold">
                        {customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">{customer.fullName}</p>
                      </div>
                    </div>
                    <Link
                      href={customer?.memberTier === "Admin" ? "/admin" : "/account"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] font-semibold text-[#143425] hover:underline"
                    >
                      Account &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600">Welcome, Guest</span>
                    <Link
                      href="/account/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-semibold text-[#143425] underline"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
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
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm font-medium text-stone-800"
                  >
                    <span>My Orders</span>
                    <span className="font-mono text-xs text-stone-400">({orders.length})</span>
                  </Link>
                  <Link
                    href={customer?.memberTier === "Admin" ? "/admin" : "/account"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-stone-800"
                  >
                    Profile &amp; Addresses
                  </Link>
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
