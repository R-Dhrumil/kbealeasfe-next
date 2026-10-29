"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import { getTestimonials, TestimonialItem } from "@/service/cms";

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "def-1",
    reviewerName: "Aditi Roy",
    reviewerSubtext: "Verified Buyer • Vrinda Chai",
    quote: "The Royal Cardamom chai is unparalleled. The aroma of freshly crushed green cardamom and Kashmiri saffron fills the kitchen within seconds. Easily the best instant tea premix I've ever tasted.",
    rating: 5,
    brandName: "Vrinda",
    displayOrder: 1,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "def-2",
    reviewerName: "Vikram Malhotra",
    reviewerSubtext: "Food & Hospitality Critic",
    quote: "KB Beverage brings authentic artisanal tea garden purity to instant beverages. No synthetic artificial aftertaste—just clean, rich botanical flavors that dissolve effortlessly.",
    rating: 5,
    brandName: "Sangam",
    displayOrder: 2,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "def-3",
    reviewerName: "Sneha Nair",
    reviewerSubtext: "Verified Buyer • Urban Roast",
    quote: "Urban Roast 100% Arabica instant coffee dissolves seamlessly with a thick, velvety crema. It has completely replaced my morning cafe routine with zero compromise on aroma.",
    rating: 5,
    brandName: "Urban Roast",
    displayOrder: 3,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "def-4",
    reviewerName: "Chef Karan Singhania",
    reviewerSubtext: "Executive Pastry Chef",
    quote: "CocoJoy Dutch dark cocoa is extraordinary. Rich 22% natural cocoa butter fat content gives hot beverages and chocolate treats a deep, velvety European decadence.",
    rating: 5,
    brandName: "CocoJoy",
    displayOrder: 4,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  }
];

export function TestimonialSlider() {
  const [items, setItems] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    getTestimonials().then((data) => {
      if (isMounted && data && data.length > 0) {
        setItems(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const current = items[currentIndex] || items[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="relative rounded-3xl bg-[#143425] text-white p-8 sm:p-14 overflow-hidden shadow-xl border border-[#1C4834]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0E4D7A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#C89B3C] text-xs font-semibold uppercase tracking-wider mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Patron & Critic Accolades</span>
          </div>

          {/* Stars */}
          <div className="flex items-center justify-center gap-1.5 text-[#C89B3C]">
            {[...Array(current.rating || 5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#C89B3C]" />
            ))}
          </div>

          {/* Quote */}
          <div className="relative">
            <Quote className="h-10 w-10 text-white/10 absolute -top-6 left-1/2 -translate-x-1/2 -z-0" />
            <blockquote className="font-serif text-lg sm:text-2xl md:text-3xl text-[#FAF7F2] font-normal leading-relaxed italic relative z-10">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
          </div>

          {/* Reviewer Meta */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="font-serif font-bold text-base sm:text-lg text-white">
                {current.reviewerName}
              </span>
              {current.brandName && (
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/30">
                  {current.brandName}
                </span>
              )}
            </div>
            {current.reviewerSubtext && (
              <p className="text-xs text-stone-300 font-sans tracking-wide">
                {current.reviewerSubtext}
              </p>
            )}
          </div>

          {/* Controls */}
          {items.length > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? "w-6 bg-[#C89B3C]" : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
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
