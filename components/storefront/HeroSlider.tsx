"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Clock, Award } from "lucide-react";

export interface SlideItem {
  id: string;
  brand: string;
  title: string;
  highlightText: string;
  description: string;
  priceTag: string;
  offerText: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  image: string;
  themeColor: string;
  trustPill: {
    icon: "ShieldCheck" | "Clock" | "Award";
    title: string;
    desc: string;
  };
}

const HERO_SLIDES: SlideItem[] = [
  {
    id: "slide-vrinda",
    brand: "VRINDA HERITAGE",
    title: "Royal Cardamom & Saffron",
    highlightText: "Authentic Indian Chai.",
    description:
      "Crafted with crushed Idukki green cardamom pods, pure Kashmiri saffron, and single-origin Assam CTC tea. Experience timeless richness in 10 seconds.",
    priceTag: "Starting at ₹440",
    offerText: "15% Off First Order",
    primaryCtaText: "Shop Chai Premixes",
    primaryCtaHref: "/shop?category=cat-tea-premixes",
    secondaryCtaText: "Explore Collection",
    secondaryCtaHref: "#categories",
    image: "/assets/hero/hero-vrinda-chai.png",
    themeColor: "#143425",
    trustPill: {
      icon: "ShieldCheck",
      title: "KB Purity Pledge",
      desc: "Zero chemical preservatives & multi-foil sealed",
    },
  },
  {
    id: "slide-sangam",
    brand: "SANGAM BOTANICALS",
    title: "Crisp Sun-Ripened Lemon",
    highlightText: "Botanical Iced Tea.",
    description:
      "A soothing fusion of handpicked black tea extracts, sun-drenched lemons, and refreshing mint. Dissolves instantly in chilled water without shaking.",
    priceTag: "Starting at ₹360",
    offerText: "Special 500g Pack",
    primaryCtaText: "Shop Iced Teas",
    primaryCtaHref: "/shop?category=cat-iced-teas",
    secondaryCtaText: "All Flavors",
    secondaryCtaHref: "/shop",
    image: "/assets/hero/hero-sangam-iced-tea.png",
    themeColor: "#0E4D7A",
    trustPill: {
      icon: "Clock",
      title: "Instant Chill",
      desc: "Dissolves in cold water in 10 seconds",
    },
  },
  {
    id: "slide-urban-roast",
    brand: "URBAN ROAST",
    title: "Bold & Aromatic 100% Arabica",
    highlightText: "Artisan Coffee Blend.",
    description:
      "Estate-harvested beans from the misty slopes of Chikmagalur. Roasted in small batches to preserve dark cocoa notes and a velvety, lingering crema.",
    priceTag: "Starting at ₹580",
    offerText: "Whole Bean & Grounds",
    primaryCtaText: "Explore Coffee",
    primaryCtaHref: "/shop?category=cat-coffees",
    secondaryCtaText: "Brewing Guide",
    secondaryCtaHref: "/about",
    image: "/assets/hero/hero-urban-roast.png",
    themeColor: "#1E2638",
    trustPill: {
      icon: "Award",
      title: "Estate Certified",
      desc: "100% Shade-grown Arabica from Western Ghats",
    },
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative overflow-hidden pt-4 sm:pt-6 pb-8 md:pb-12 bg-gradient-to-b from-[#FAF7F2] to-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Promotions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-white border border-[#E8DED1]/70 shadow-sm p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-700">
          {/* Subtle Ambient Background Glow */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
            style={{ backgroundColor: slide.themeColor }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-5 md:space-y-6">
              {/* Badges strip */}
              {/* <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#F2ECE1] text-[#143425] border border-[#D9CBB8]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
                  <span>{slide.badge}</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#C89B3C]/15 text-[#A87E28]">
                  {slide.offerText}
                </span>
              </div> */}

              {/* Title & Tagline */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#A87E28]">
                  {slide.brand}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#143425] tracking-tight leading-[1.15]">
                  {slide.title}{" "}
                  <span className="italic block text-[#A87E28] font-normal">
                    {slide.highlightText}
                  </span>
                </h1>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
                  {slide.description}
                </p>
              </div>

              {/* Price Callout */}
              {/* <div className="flex items-baseline gap-3 pt-1">
              
                <span className="text-xs text-[#143425] bg-[#E8F2EC] px-2 py-0.5 rounded font-semibold">
                   {slide.priceTag}
                </span>
              </div> */}

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href={slide.primaryCtaHref}
                  className="h-12 px-7 rounded-xl bg-[#143425] hover:bg-[#1C4834] text-white text-sm font-medium transition-all shadow-sm active:scale-98 inline-flex items-center gap-2 group"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href={slide.secondaryCtaHref}
                  className="h-12 px-6 rounded-xl border border-[#D9CBB8] bg-white text-[#143425] text-sm font-medium hover:bg-[#F2ECE1] transition-colors inline-flex items-center"
                >
                  {slide.secondaryCtaText}
                </Link>
              </div>

              {/* Trust Indicators in Slide */}
              <div className="pt-5 border-t border-[#E8DED1] grid grid-cols-3 gap-3 text-stone-600 text-xs">
                <div>
                  <p className="font-serif text-base sm:text-lg font-bold text-[#143425]">
                    100%
                  </p>
                  <p className="text-[11px] text-stone-500">Pure Extracts</p>
                </div>
                <div>
                  <p className="font-serif text-base sm:text-lg font-bold text-[#143425]">
                    10 Sec
                  </p>
                  <p className="text-[11px] text-stone-500">Instant Brew</p>
                </div>
                <div>
                  <p className="font-serif text-base sm:text-lg font-bold text-[#143425]">
                    Aroma-Lock
                  </p>
                  <p className="text-[11px] text-stone-500">Multi-Foil Seal</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 bg-[#F7F4EE]">
                <Image
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-all duration-700 hover:scale-105"
                />

                {/* Floating Guarantee Badge Pill */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#143425] text-[#C89B3C] flex items-center justify-center shrink-0">
                    {slide.trustPill.icon === "ShieldCheck" && <ShieldCheck className="h-5 w-5" />}
                    {slide.trustPill.icon === "Clock" && <Clock className="h-5 w-5" />}
                    {slide.trustPill.icon === "Award" && <Award className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#143425]">
                      {slide.trustPill.title}
                    </p>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      {slide.trustPill.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows & Dot Indicators */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-100">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-8 bg-[#143425]"
                      : "w-2.5 bg-stone-300 hover:bg-stone-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="h-9 w-9 rounded-lg border border-stone-300 hover:border-[#143425] bg-white text-[#143425] flex items-center justify-center transition-colors shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="h-9 w-9 rounded-lg border border-stone-300 hover:border-[#143425] bg-white text-[#143425] flex items-center justify-center transition-colors shadow-2xs"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
