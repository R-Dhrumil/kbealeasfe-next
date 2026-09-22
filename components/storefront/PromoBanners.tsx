import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="space-y-6">
        {/* 1. Large Top Hero Banner: Master Blend Royal Cardamom Saffron Chai */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8DED1] shadow-sm bg-[#FDFBF7] group">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Image side */}
            <div className="lg:col-span-8 relative aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden">
              <Image
                src="/assets/banners/banner-master-blend.png"
                alt="Master Blend - Royal Cardamom Saffron Chai"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover object-left-center transition-transform duration-700 group-hover:scale-103"
              />
            </div>

            {/* Content side */}
            <div className="lg:col-span-4 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4 bg-gradient-to-br from-[#FAF7F2] to-[#F2ECE1]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#143425] text-[#C89B3C] w-fit">
                <Sparkles className="h-3 w-3" />
                <span>Signature Blend</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#143425] leading-tight">
                Royal Cardamom & Kashmiri Saffron
              </h2>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Handcrafted formulation infused with pure whole spices and high-elevation CTC tea leaves for unforgettable warmth.
              </p>

              <div className="pt-2">
                <Link
                  href="/shop?category=cat-tea-premixes"
                  className="h-11 px-6 rounded-xl bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold tracking-wide uppercase transition-all shadow-xs inline-flex items-center gap-2 group/btn"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Split Dual Banners (Botanical Iced Teas + Morning Energizers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Botanical Summer Iced Teas */}
          <div className="relative rounded-3xl overflow-hidden border border-[#E8DED1] shadow-sm bg-stone-900 group aspect-[16/10] sm:aspect-[16/9]">
            <Image
              src="/assets/banners/banner-iced-tea.png"
              alt="Botanical Summer Iced Teas"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FCD34D] mb-1">
                Summer Refreshment
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
                Botanical Summer Iced Teas
              </h3>
              <p className="text-stone-200 text-xs mt-1 max-w-sm">
                Crisp lemon, wild peach, and mint infusions formulated for instant iced indulgence.
              </p>
              <div className="pt-3">
                <Link
                  href="/shop?category=cat-iced-teas"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#FCD34D] hover:text-white uppercase tracking-wider transition-colors"
                >
                  <span>Explore Flavors</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Morning Energizers Artisan Coffee */}
          <div className="relative rounded-3xl overflow-hidden border border-[#E8DED1] shadow-sm bg-stone-900 group aspect-[16/10] sm:aspect-[16/9]">
            <Image
              src="/assets/banners/banner-coffee.png"
              alt="Morning Energizers - Artisan Roast Coffee"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C89B3C] mb-1">
                Small Batch Roasted
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
                Urban Roast Artisan Coffee
              </h3>
              <p className="text-stone-200 text-xs mt-1 max-w-sm">
                100% Arabica beans harvested from Chikmagalur estates with rich dark cocoa top notes.
              </p>
              <div className="pt-3">
                <Link
                  href="/shop?category=cat-coffees"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#C89B3C] hover:text-white uppercase tracking-wider transition-colors"
                >
                  <span>Discover Blends</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
