import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, ShieldCheck } from "lucide-react";

export function DealBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="rounded-3xl bg-[#143425] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xl">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C89B3C] border border-white/15 text-xs font-semibold uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5" />
              <span>Limited Reserve Batch</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight leading-tight">
                The Master Chai Discovery Box
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Experience all three signature premixes in one bespoke tasting pack: Royal Cardamom Saffron Chai, 7-Spice Authentic Masala, and Zesty Adrak Ginger.
              </p>
            </div>

            {/* Special Discount Code Callout */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 max-w-lg">
              <div>
                <p className="text-xs text-stone-400">Exclusive Introductory Coupon</p>
                <p className="text-base font-mono font-bold text-[#C89B3C] tracking-wider">
                  DISCOVERKB20
                </p>
              </div>
              <span className="text-xs text-stone-300 bg-white/10 px-3 py-1.5 rounded-lg font-medium">
                Save 20% on Checkout
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="h-12 px-8 rounded-xl bg-[#C89B3C] hover:bg-[#D6AD53] text-[#143425] text-sm font-bold transition-all shadow-md active:scale-98 inline-flex items-center gap-2"
              >
                <span>Claim Offer</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#C89B3C]" />
                100% Satisfaction Guarantee
              </span>
            </div>
          </div>

          {/* Right Packshot Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-64 sm:w-80 aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/5 backdrop-blur-xs p-4 flex items-center justify-center">
              <Image
                src="/assets/products/vrinda-cardamom-pouch.png"
                alt="Master Chai Discovery Box"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-2 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
