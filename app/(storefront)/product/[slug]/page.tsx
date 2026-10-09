import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getProducts, getProductsByCategory } from "@/service/products";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | KB Beverage" };
  }

  return {
    title: `${product.name} — ${product.brandName} | KB Beverage`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProductsByCategory(product.categoryId))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 flex-wrap">
        <Link href="/" className="hover:text-[#143425] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-stone-400" />
        <Link href="/shop" className="hover:text-[#143425] transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3 text-stone-400" />
        <Link
          href={`/category/${product.categoryId.replace("cat-", "")}`}
          className="hover:text-[#143425] transition-colors"
        >
          {product.categoryName}
        </Link>
        <ChevronRight className="h-3 w-3 text-stone-400" />
        <span className="text-stone-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Client Component */}
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </div>
  );
}
