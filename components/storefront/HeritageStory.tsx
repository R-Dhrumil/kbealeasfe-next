import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function HeritageStory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 md:my-24">
      <div className="rounded-3xl bg-[#FAF7F2] border border-[#E8DED1] p-6 sm:p-10 lg:p-14 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
              <Image
                src="/assets/products/vrinda-cardamom-cup.png"
                alt="KB Tea & Beverages Art of Brewing"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Certification Badge */}
            <div className="absolute -bottom-5 -right-5 sm:bottom-4 sm:right-4 h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white p-2 shadow-xl border border-stone-100 flex items-center justify-center">
              <div className="relative h-full w-full">
                <Image
                  src="/assets/badges/badge-origin.png"
                  alt="Single Origin Assam Tea Leaves"
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F2EC] text-[#143425] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
              <span>Heritage & Sourcing</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-serif text-[#143425] tracking-tight leading-tight">
                Crafted for Moments That Matter.
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                At KB Beverage, we honor the time-tested rituals of Indian tea making. Instead of artificial flavorings or excessive sugar fillers, our premixes start with single-estate black teas and whole cardamom pods crushed in traditional stone mills.
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C89B3C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#143425] uppercase tracking-wide">
                    Zero Adulteration
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    100% natural spices without chemical additives.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C89B3C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#143425] uppercase tracking-wide">
                    Instant Solubility
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Micro-granulated crystals dissolve effortlessly in 10s.
                  </p>
                </div>
              </div>
            </div>

            {/* Link to Full Story */}
            <div className="pt-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#143425] hover:text-[#A87E28] transition-colors group"
              >
                <span>Read The Full KB Story</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
