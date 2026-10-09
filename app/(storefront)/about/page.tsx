import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, CheckCircle2, Leaf, HeartHandshake, ArrowRight } from "lucide-react";
import { getBrands } from "@/service/brands";
import { BRAND_PILLARS } from "@/service/homepage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About KB Heritage & Craftsmanship | Pure Taste, Every Time",
  description: "Learn about KB Beverage's commitment to pure tea leaves, natural spices, and state-of-the-art aroma-locking technology.",
};

export default async function AboutPage() {
  const displayBrands = await getBrands();
  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* Hero Banner */}
      <section className="bg-[#143425] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs text-[#C89B3C] font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" /> The Story of KB Beverage
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-white leading-tight">
            Pure Taste, Every Time.
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light">
            Founded with a singular mission: to make authentic, artisanal beverages accessible anytime without compromising on purity, aroma, or authentic culinary heritage.
          </p>
        </div>
      </section>

      {/* The Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
              Origin & Vision
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#143425] leading-snug">
              From Estate Gardens to Your Morning Cup
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Traditional beverage brewing in India has always been an art—demanding the careful crushing of whole green cardamom pods, simmering of fiery sun-dried ginger, and slow reduction with full-cream milk. In the rush of contemporary life, this sacred ritual was often replaced with flavorless vending machine alternatives.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              KB was founded to bridge this divide. Through our brand portfolio—Vrinda, Sangam, Urban Roast, and CocoJoy—we capture the essence of slow-crafted beverages in precision-granulated instant formulations that dissolve completely in seconds.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-stone-200">
            <Image
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
              alt="Tea brewing in cup"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* The Four Craft Pillars */}
      <section className="bg-[#F2ECE1]/70 py-16 md:py-24 border-y border-[#E8DED1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
              Uncompromising Quality
            </span>
            <h2 className="text-3xl font-serif text-[#143425]">
              Our Four Standards of Purity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-[#E8F2EC] text-[#143425] flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Portfolio Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
            Brand Portfolio
          </span>
          <h2 className="text-3xl font-serif text-[#143425]">
            Crafted Across Four Specialized Brands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayBrands.map((brand) => (
            <div
              key={brand.id}
              className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex gap-6 items-start"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#F9F6F0] flex items-center justify-center text-3xl shrink-0">
                {brand.logo}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87E28]">
                  {brand.tagline}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#143425]">
                  {brand.name}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {brand.story}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] inline-flex items-center gap-1"
                  >
                    <span>View Brand Products</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-[#143425] text-white p-10 sm:p-14 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-serif font-normal">
            Ready to Experience Pure Taste?
          </h2>
          <p className="text-stone-300 text-sm max-w-md mx-auto">
            Order your tea premixes, cold iced teas, and roasted coffees directly with doorstep delivery.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="gold" size="lg" className="gap-2 text-[#143425]">
                <span>Shop Full Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
