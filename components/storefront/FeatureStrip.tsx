import React from "react";
import Image from "next/image";
import { Truck, ShieldCheck, Leaf, Sparkles } from "lucide-react";

interface FeatureItem {
  icon: string;
  badgeImg?: string;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: "Truck",
    badgeImg: "/assets/badges/badge-shipping.png",
    title: "Free India Shipping",
    description: "On all prepaid orders over ₹499",
  },
  {
    icon: "Leaf",
    badgeImg: "/assets/badges/badge-natural.png",
    title: "100% Natural Leaves",
    description: "Zero chemical preservatives or fillers",
  },
  {
    icon: "ShieldCheck",
    badgeImg: "/assets/badges/badge-aroma.png",
    title: "Aroma-Lock Technology",
    description: "Multi-barrier foil keeps volatile oils fresh",
  },
  {
    icon: "Sparkles",
    badgeImg: "/assets/badges/badge-origin.png",
    title: "Single-Origin Estates",
    description: "Directly sourced Assam & Western Ghats",
  },
];

export function FeatureStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-[#FAF7F2] rounded-2xl p-4 sm:p-6 border border-[#E8DED1]">
        {FEATURES.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 p-3 rounded-xl bg-white/70 hover:bg-white border border-[#E8DED1]/60 hover:border-[#C89B3C]/40 transition-all shadow-2xs group"
          >
            <div className="relative h-12 w-12 shrink-0 rounded-xl bg-[#F2ECE1] p-1 flex items-center justify-center overflow-hidden border border-[#D9CBB8]/50 group-hover:scale-105 transition-transform">
              {item.badgeImg ? (
                <Image
                  src={item.badgeImg}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <div className="h-6 w-6 text-[#143425]">
                  {item.icon === "Truck" && <Truck className="h-6 w-6 text-[#143425]" />}
                  {item.icon === "Leaf" && <Leaf className="h-6 w-6 text-[#143425]" />}
                  {item.icon === "ShieldCheck" && <ShieldCheck className="h-6 w-6 text-[#143425]" />}
                  {item.icon === "Sparkles" && <Sparkles className="h-6 w-6 text-[#143425]" />}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#143425] font-serif">
                {item.title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-tight">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
