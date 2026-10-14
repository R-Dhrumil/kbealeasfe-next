import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getBrands } from "@/service/brands";
import { BrandCard } from "@/components/storefront/BrandCard";
import { ArrowLeft, Sparkles, ShieldCheck, Zap, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Brands Portfolio | KB Beverage",
  description: "Explore Vrinda tea premixes, Sangam botanical iced teas, Urban Roast coffees, and CocoJoy rich chocolate drinks.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Intro Hero Section */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DED1] p-8 md:p-12 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A87E28] hover:text-[#143425] font-medium transition-colors group mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Home</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143425]/5 border border-[#143425]/10 text-xs font-semibold uppercase tracking-widest text-[#143425]">
          <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
          <span>Portfolio Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#143425] tracking-tight leading-tight max-w-3xl">
          Four Dedicated Brands, One Standard of Excellence
        </h1>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
          Every brand under the KB banner specializes in a distinct category of beverage craftsmanship — formulated with authentic estate spices, single-origin coffee beans, and premium Dutch cocoa.
        </p>

        {/* Brand Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8DED1]">
          <div className="flex items-center gap-2.5 text-xs text-stone-700 font-medium">
            <Leaf className="h-4 w-4 text-[#143425]" />
            <span>100% Estate-Sourced Botanicals</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-stone-700 font-medium">
            <Zap className="h-4 w-4 text-[#C89B3C]" />
            <span>Instant 10-Second Hot &amp; Cold Prep</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-stone-700 font-medium">
            <ShieldCheck className="h-4 w-4 text-[#143425]" />
            <span>0 Chemical Preservatives</span>
          </div>
        </div>
      </div>

      {/* 4 Brands Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
