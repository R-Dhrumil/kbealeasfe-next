import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBrandBySlug, getBrands } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const brands = await getBrands();
  const slugs = brands.map((b) => ({
    slug: b.slug,
  }));
  slugs.push({ slug: "coco-joy" });
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

  const brandProducts = await getProductsByBrand(brand.id);

  return (
    <div className="space-y-12 pb-20">
      {/* Brand Hero Banner */}
      <div className="bg-[#143425] text-white py-16 md:py-20 border-b border-[#1C4834]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-xs text-[#C89B3C] hover:underline mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>All Brand Collections</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-serif font-bold text-2xl tracking-widest text-[#F9F6F0] shrink-0">
              {brand.logo}
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C89B3C] font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{brand.tagline}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                {brand.name}
              </h1>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {brand.story}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Products List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#143425]">
              {brand.name} Catalog
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {brandProducts.length} signature recipes
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C]"
          >
            Explore Other Brands →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {brandProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
