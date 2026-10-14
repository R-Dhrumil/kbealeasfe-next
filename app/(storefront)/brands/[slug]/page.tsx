import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBrandBySlug, getBrands } from "@/service/brands";
import { getProductsByBrand } from "@/service/products";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";

import { SafeImage } from "@/components/ui/SafeImage";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const brands = await getBrands();
  const slugs = brands.map((b) => ({
    slug: b.slug,
  }));
  slugs.push({ slug: "cocojoy" });
  slugs.push({ slug: "coco-joy" });
  slugs.push({ slug: "urban-roast" });
  slugs.push({ slug: "vrinda" });
  slugs.push({ slug: "sangam" });
  return slugs;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand Not Found | KB Beverage" };
  }

  return {
    title: `${brand.name} — ${brand.tagline} | KB Beverage`,
    description: brand.description,
  };
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  let brandProducts = await getProductsByBrand(brand.id);
  if (brandProducts.length === 0 && brand.slug) {
    brandProducts = await getProductsByBrand(brand.slug);
  }
  if (brandProducts.length === 0) {
    brandProducts = await getProductsByBrand(slug);
  }

  const isImagePath = typeof brand.logo === "string" && (brand.logo.startsWith("/") || brand.logo.startsWith("http"));

  return (
    <div className="space-y-12 pb-20">
      {/* Brand Hero Banner with connected theme */}
      <div
        className="relative text-white py-16 md:py-24 border-b overflow-hidden transition-colors"
        style={{ backgroundColor: brand.themeColor || "#143425", borderColor: `${brand.themeColor || "#143425"}40` }}
      >
        {brand.heroImageUrl && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <SafeImage
              src={brand.heroImageUrl}
              alt=""
              fill
              className="object-cover"
              fallbackSrc="/assets/HeroSlider_images/vrinda_tea.png"
            />
          </div>
        )}

        {/* Soft background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#C89B3C]/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-[#FAF7F2] text-xs font-medium backdrop-blur-xs transition-colors mb-8 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-[#C89B3C]" />
            <span>All Brands Portfolio</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="relative h-24 w-24 rounded-3xl bg-white p-2.5 shadow-xl border border-white/90 flex items-center justify-center shrink-0 overflow-hidden">
              {isImagePath ? (
                <SafeImage
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain p-1.5"
                  fallbackSrc="/assets/HeroSlider_images/vrinda_tea.png"
                />
              ) : (
                <span className="font-serif font-bold text-2xl tracking-widest text-[#143425]">
                  {brand.logo || brand.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-widest text-[#C89B3C] border border-[#C89B3C]/30">
                <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
                <span>{brand.tagline}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                {brand.name}
              </h1>
              <p className="text-[#FAF7F2]/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                {brand.story}
              </p>

              {/* Brand Trust Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-medium text-stone-200">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  100% Natural Extract
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  Aroma-Lock Foil Sealed
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  Ready in 10 Seconds
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Products List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DED1]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143425]">
                {brand.name} Signature Blends
              </h2>
              <span className="text-xs font-mono font-medium text-[#A87E28] bg-[#FAF7F2] border border-[#E8DED1] px-2.5 py-0.5 rounded-full">
                {brandProducts.length} {brandProducts.length === 1 ? "recipe" : "recipes"}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Gourmet instant beverage premixes curated specifically under the {brand.name} label.
            </p>
          </div>

          <Link
            href="/brands"
            className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] inline-flex items-center gap-1 transition-colors"
          >
            <span>Explore Other Brands</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {brandProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {brandProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FAF7F2] rounded-3xl border border-[#E8DED1] mt-8 p-8 space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#143425]">
              {brand.name} Recipes Crafting Soon
            </h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto">
              Our master tea blenders and roasters are currently preparing the next batch of {brand.name} premixes.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#143425] text-white text-xs font-semibold hover:bg-[#1C4834] transition-colors"
            >
              <span>Explore All Available Beverages</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
