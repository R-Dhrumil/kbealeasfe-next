"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, CheckCircle2 } from "lucide-react";
import { getTestimonials, TestimonialItem } from "@/service/cms";

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "def-1",
    reviewerName: "Aditi Roy",
    reviewerSubtext: "Verified Buyer • Kolkata",
    quote: "The Royal Cardamom chai is unparalleled. The aroma of freshly crushed green cardamom and Kashmiri saffron fills the kitchen within seconds. Easily the best instant tea premix I've ever tasted.",
    rating: 5,
    brandName: "Vrinda",
    avatarImageUrl: null,
    displayOrder: 1,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "def-2",
    reviewerName: "Vikram Malhotra",
    reviewerSubtext: "Food & Hospitality Critic • Delhi",
    quote: "KB Beverage brings authentic artisanal tea garden purity to instant beverages. No synthetic artificial aftertaste—just clean, rich botanical flavors that dissolve effortlessly in chilled water.",
    rating: 5,
    brandName: "Sangam",
    avatarImageUrl: null,
    displayOrder: 2,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "def-3",
    reviewerName: "Sneha Nair",
    reviewerSubtext: "Verified Buyer • Bengaluru",
    quote: "Urban Roast 100% Arabica instant coffee dissolves seamlessly with a thick, velvety crema. It has completely replaced my morning cafe routine with zero compromise on aroma.",
    rating: 5,
    brandName: "Urban Roast",
    avatarImageUrl: null,
    displayOrder: 3,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "def-4",
    reviewerName: "Chef Karan Singhania",
    reviewerSubtext: "Executive Pastry Chef • Mumbai",
    quote: "CocoJoy Dutch dark cocoa is extraordinary. Rich 22% natural cocoa butter fat content gives hot beverages and chocolate treats a deep, velvety European decadence.",
    rating: 5,
    brandName: "CocoJoy",
    avatarImageUrl: null,
    displayOrder: 4,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  }
];

const BRAND_THEMES: Record<string, { bg: string; text: string; border: string }> = {
  Vrinda: { bg: "bg-emerald-950/40", text: "text-emerald-300", border: "border-emerald-500/30" },
  Sangam: { bg: "bg-sky-950/40", text: "text-sky-300", border: "border-sky-500/30" },
  "Urban Roast": { bg: "bg-amber-950/40", text: "text-amber-300", border: "border-amber-500/30" },
  CocoJoy: { bg: "bg-stone-900/60", text: "text-[#D4AF37]", border: "border-[#D4AF37]/30" },
};

export function TestimonialSlider() {
  const [items, setItems] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getTestimonials().then((data) => {
      if (isMounted && data && data.length > 0) {
        setItems(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Smooth switch with micro-fade
  const changeSlide = (newIndex: number) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 180);
  };

  const nextSlide = () => {
    changeSlide((currentIndex + 1) % items.length);
  };

  const prevSlide = () => {
    changeSlide((currentIndex - 1 + items.length) % items.length);
  };

  // Autoplay with hover pause
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, items.length]);

  const current = items[currentIndex] || items[0];
  const brandStyle = current.brandName && BRAND_THEMES[current.brandName]
    ? BRAND_THEMES[current.brandName]
    : { bg: "bg-[#C89B3C]/15", text: "text-[#C89B3C]", border: "border-[#C89B3C]/30" };

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-3xl bg-gradient-to-br from-[#143425] via-[#102D20] to-[#0D241A] text-white p-7 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-[#1C4834]">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#C89B3C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0E4D7A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-center">
          {/* Eyebrow Header with Counter */}
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#C89B3C] text-xs font-semibold uppercase tracking-wider border border-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Patron & Sommelier Accolades</span>
            </div>

            <span className="text-[11px] font-mono font-bold tracking-widest text-stone-400">
              0{currentIndex + 1} / 0{items.length}
            </span>
          </div>

          {/* Star Rating Strip */}
          <div className="flex items-center justify-center gap-1.5 text-[#C89B3C]">
            {[...Array(current.rating || 5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#C89B3C]" />
            ))}
          </div>

          {/* Quotation Body with Fade Transition */}
          <div className={`relative min-h-[140px] sm:min-h-[110px] flex items-center justify-center transition-opacity duration-200 ${isFading ? "opacity-0 scale-98" : "opacity-100 scale-100"}`}>
            <Quote className="h-12 w-12 text-white/5 absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none" />
            <blockquote className="font-serif text-lg sm:text-2xl md:text-3xl text-[#FAF7F2] font-normal leading-relaxed italic relative z-10 px-2 sm:px-6">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
          </div>

          {/* Reviewer Details Box */}
          <div className={`space-y-3 pt-2 transition-opacity duration-200 ${isFading ? "opacity-0" : "opacity-100"}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Avatar Photo or Monogram */}
              {current.avatarImageUrl ? (
                <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-[#C89B3C]/50 shadow-md">
                  <Image src={current.avatarImageUrl} alt={current.reviewerName} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#C89B3C] to-[#E5C378] text-[#143425] flex items-center justify-center font-serif font-bold text-sm shadow-md border-2 border-white/20">
                  {current.reviewerName.charAt(0)}
                </div>
              )}

              <div className="text-center sm:text-left space-y-0.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="font-serif font-bold text-base sm:text-lg text-white">
                    {current.reviewerName}
                  </span>

                  {current.brandName && (
                    <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${brandStyle.bg} ${brandStyle.text} ${brandStyle.border}`}>
                      {current.brandName}
                    </span>
                  )}
                </div>

                {current.reviewerSubtext && (
                  <p className="text-xs text-stone-300 font-sans tracking-wide flex items-center justify-center sm:justify-start gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#C89B3C] shrink-0" />
                    <span>{current.reviewerSubtext}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Navigation Controls */}
          {items.length > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 max-w-sm mx-auto">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous review"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Slider Pills */}
              <div className="flex items-center gap-2">
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => changeSlide(idx)}
                    aria-label={`Go to review by ${item.reviewerName}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-8 bg-[#C89B3C]" : "w-2 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next review"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
