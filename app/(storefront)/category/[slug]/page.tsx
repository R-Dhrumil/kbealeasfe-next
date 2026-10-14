import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { getCategoryBySlug, getCategories } from "@/service/categories";
import { getProducts } from "@/service/products";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const slugs = categories.map((cat) => ({
    slug: cat.slug,
  }));
  slugs.push({ slug: "plant-based-specialties" });
  slugs.push({ slug: "chocolate" });
  return slugs;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | KB Beverage" };
  }

  return {
    title: `${category.name} | KB Beverage`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const allProducts = await getProducts();
  const cSlug = category.slug.toLowerCase().replace(/[\s-]+/g, "");
  const cName = category.name.toLowerCase().replace(/[\s-]+/g, "");

  const categoryProducts = allProducts.filter((p) => {
    const pCName = (p.categoryName || "").toLowerCase().replace(/[\s-]+/g, "");
    const pCSlug = (p.categorySlug || "").toLowerCase().replace(/[\s-]+/g, "");

    return (
      p.categoryId === category.id ||
      pCName.includes(cSlug) ||
      cSlug.includes(pCName) ||
      pCSlug.includes(cSlug) ||
      pCName.includes(cName) ||
      (cSlug.includes("chocolate") && (pCName.includes("chocolate") || p.brandName.toLowerCase().includes("coco"))) ||
      (cSlug.includes("tea") && pCName.includes("tea") && !pCName.includes("iced") && !cSlug.includes("iced")) ||
      (cSlug.includes("iced") && pCName.includes("iced")) ||
      (cSlug.includes("coffee") && pCName.includes("coffee"))
    );
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Category Hero Banner */}
      <div className="relative bg-[#143425] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <SafeImage
            src={category.image}
            alt={category.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-xs text-[#C89B3C] hover:underline mb-4 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Brands</span>
          </Link>

          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#C89B3C] font-semibold tracking-wider uppercase">
              <Sparkles className="h-3 w-3" /> Signature Category
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
              {category.name}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Category Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#143425]">
              {category.name} Selection
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {categoryProducts.length} authentic handcrafted varieties
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] transition-colors"
          >
            Browse All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
