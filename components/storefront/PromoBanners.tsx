import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="space-y-6">
        {/* 1. Large Top Hero Banner: Master Blend Royal Cardamom Saffron Chai */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8DED1] shadow-sm hover:shadow-md bg-[#FAF7F2] transition-all duration-500 group">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Image side - clean high-resolution crop without placeholder artifacts */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] w-full overflow-hidden bg-[#F2EDE4]">
              <Image
                src="/assets/banners/banner-master-blend.png"
                alt="Master Blend - Royal Cardamom & Kashmiri Saffron Chai"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {/* Soft gradient transition on desktop */}
              <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#FAF7F2] pointer-events-none" />
            </div>

            {/* Content side */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center space-y-5 bg-gradient-to-br from-[#FAF7F2] via-[#F6F0E6] to-[#EDE4D6] relative z-10">
              {/* Top badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#143425] text-[#D4AF37] shadow-xs">
                  <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                  <span>Signature Blend</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A87E28] px-2.5 py-0.5 rounded-full bg-[#A87E28]/10 border border-[#A87E28]/20">
                  Vrinda Heritage
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2.5">
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-serif text-[#143425] font-normal leading-[1.2] tracking-tight">
                  Royal Cardamom &amp; Kashmiri Saffron
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Handcrafted formulation infused with whole crushed Idukki cardamom pods, authentic Kashmiri saffron strands, and single-origin Assam CTC tea for an unforgettable royal warmth.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#143425]/10 text-[#143425] flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-[#143425]" />
                  </span>
                  <span className="font-medium text-[11px] sm:text-xs">Pure Kashmiri Saffron</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#143425]/10 text-[#143425] flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-[#143425]" />
                  </span>
                  <span className="font-medium text-[11px] sm:text-xs">Crushed Green Cardamom</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#143425]/10 text-[#143425] flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-[#143425]" />
                  </span>
                  <span className="font-medium text-[11px] sm:text-xs">Single-Origin Assam CTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#143425]/10 text-[#143425] flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-[#143425]" />
                  </span>
                  <span className="font-medium text-[11px] sm:text-xs">Ready in 10 Seconds</span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop?category=cat-tea-premixes"
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-xl bg-[#143425] hover:bg-[#1C4834] text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all shadow-sm hover:shadow inline-flex items-center gap-2.5 group/btn"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <span className="text-xs text-stone-500 font-medium">
                  Starting from <span className="font-bold text-[#143425]">₹440</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Split Dual Banners (Botanical Iced Teas + Morning Energizers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Botanical Summer Iced Teas */}
          <Link
            href="/shop?category=cat-iced-teas"
            className="relative rounded-3xl overflow-hidden border border-[#E8DED1] shadow-sm hover:shadow-md bg-[#121E18] group aspect-[16/10] block"
          >
            <Image
              src="/assets/banners/banner-iced-tea.png"
              alt="Botanical Summer Iced Teas - Crisp Lemon & Mint Premix"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            {/* Subtle bottom vignette to support the floating action pill */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

            {/* Floating Action Pill & Indicator */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white/95">
                <span className="h-2 w-2 rounded-full bg-[#FCD34D] animate-pulse" />
                <span>Instant Cold-Water Brew</span>
              </div>

              <span className="h-10 px-4 rounded-full bg-white/95 hover:bg-white text-[#143425] text-xs font-semibold uppercase tracking-wider shadow-md backdrop-blur-sm inline-flex items-center gap-1.5 transition-all group-hover:bg-[#143425] group-hover:text-white group-hover:shadow-lg shrink-0">
                <span>Explore Flavors</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          {/* Card 2: Morning Energizers Artisan Coffee */}
          <Link
            href="/shop?category=cat-coffees"
            className="relative rounded-3xl overflow-hidden border border-[#E8DED1] shadow-sm hover:shadow-md bg-[#1E1915] group aspect-[16/10] block"
          >
            <Image
              src="/assets/banners/banner-coffee.png"
              alt="Morning Energizers - Urban Roast Artisan Coffee"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            {/* Subtle bottom vignette to support the floating action pill */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

            {/* Floating Action Pill & Indicator */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white/95">
                <span className="h-2 w-2 rounded-full bg-[#C89B3C] animate-pulse" />
                <span>100% Estate Arabica</span>
              </div>

              <span className="h-10 px-4 rounded-full bg-white/95 hover:bg-white text-[#143425] text-xs font-semibold uppercase tracking-wider shadow-md backdrop-blur-sm inline-flex items-center gap-1.5 transition-all group-hover:bg-[#143425] group-hover:text-white group-hover:shadow-lg shrink-0">
                <span>Discover Blends</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

