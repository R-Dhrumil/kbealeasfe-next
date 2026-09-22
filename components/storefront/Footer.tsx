import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { BRANDS } from "@/data/brands";

export function Footer() {
  return (
    <footer className="bg-[#143425] text-[#F9F6F0] pt-16 pb-12 border-t border-[#1C4834]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#C89B3C] text-[#143425] font-serif font-bold text-xl flex items-center justify-center">
                KB
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white block leading-none">
                  KB BEVERAGE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C89B3C] font-semibold block mt-1">
                  Pure Taste, Every Time.
                </span>
              </div>
            </div>

            <p className="text-stone-300 text-sm max-w-sm leading-relaxed">
              Crafting authentic Indian tea premixes, invigorating iced teas, and artisan roasted beverages with unyielding dedication to purity, hygiene, and natural origin.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#C89B3C]">
              <Sparkles className="h-4 w-4" />
              <span>Certified Processing • Vacuum Aroma Retention</span>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C] mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C] mb-4">
              Brand Portfolio
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              {BRANDS.map((brand) => (
                <li key={brand.id}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-[#C89B3C] hover:underline inline-flex items-center gap-1 text-xs font-medium pt-1"
                >
                  View All Products <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate & Support Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C] mb-4">
              Contact & Inquiries
            </h3>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C89B3C] shrink-0 mt-0.5" />
                <span>KB Beverage Ltd., Industrial Park, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#C89B3C] shrink-0" />
                <span>+91 (020) 2580-4900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C89B3C] shrink-0" />
                <span>care@kbbeverage.com</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-block text-xs font-semibold bg-[#1C4834] text-white px-3 py-1.5 rounded-lg hover:bg-[#255D43] transition-colors border border-stone-700"
                >
                  B2B Distribution Inquiries
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} KB Beverage. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-stone-200 transition-colors">
              About Heritage
            </Link>
            <Link href="/contact" className="hover:text-stone-200 transition-colors">
              Support
            </Link>
            <Link href="/admin" className="text-[#C89B3C] hover:underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
