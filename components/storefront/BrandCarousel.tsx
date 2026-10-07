import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/types/brand";
import { getBrands, BRANDS } from "@/data/brands";

const CERTIFICATIONS = [
  { name: "100% Natural", img: "/assets/badges/badge-natural.png" },
  { name: "Single Origin", img: "/assets/badges/badge-origin.png" },
  { name: "Aroma-Lock", img: "/assets/badges/badge-aroma.png" },
  { name: "FSSAI Safety", img: "/assets/badges/badge-fssai.png" },
  { name: "Fast Dispatch", img: "/assets/badges/badge-shipping.png" },
];

interface BrandCarouselProps {
  initialBrands?: Brand[];
}

export async function BrandCarousel({ initialBrands }: BrandCarouselProps = {}) {
  const brands = initialBrands && initialBrands.length > 0 
    ? initialBrands 
    : (await getBrands().catch(() => BRANDS)) || BRANDS;

  return (
    <section className="bg-[#FAF7F2] py-14 border-y border-[#E8DED1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-[#A87E28] font-semibold">
            Our Brand Architecture & Quality Standards
          </p>
          <h3 className="text-xl sm:text-2xl font-serif text-[#143425] mt-1">
            Four Specialized Brands. One Uncompromising Standard.
          </h3>
        </div>

        {/* Brand Line Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug || brand.id}`}
              className="p-5 rounded-2xl bg-white border border-[#E8DED1]/70 hover:border-[#C89B3C] shadow-2xs hover:shadow-sm transition-all text-center group"
            >
              <h4 className="font-serif text-lg font-bold text-[#143425] group-hover:text-[#A87E28] transition-colors">
                {brand.name}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                {brand.tagline}
              </p>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C89B3C] mt-2 block">
                {brand.productCount} Products &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Certifications strip */}
        <div className="pt-6 border-t border-[#E8DED1]/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {CERTIFICATIONS.map((cert, idx) => (
            <div key={idx} className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity">
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src={cert.img}
                  alt={cert.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-stone-700 tracking-wide">
                {cert.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
