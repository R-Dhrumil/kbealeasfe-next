import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { getCustomPage } from "@/service/cms";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);

  if (!page || !page.isPublished) {
    return {
      title: "Page Not Found | KB Beverage",
    };
  }

  return {
    title: `${page.title} | KB Beverage`,
    description: page.metaDescription || `${page.title} - Official charter and policy of KB Beverage.`,
    openGraph: {
      title: `${page.title} | KB Beverage`,
      description: page.metaDescription || undefined,
    },
  };
}

export default async function CustomPageView({ params }: Props) {
  const { slug } = await params;
  const page = await getCustomPage(slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  const formattedDate = new Date(page.updatedAt).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#143425] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Storefront</span>
          </Link>

          <span className="flex items-center gap-1 text-[11px] text-stone-400">
            <Clock className="h-3.5 w-3.5 text-[#A87E28]" />
            <span>Last Updated: {formattedDate}</span>
          </span>
        </div>

        {/* Page Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DED1] shadow-2xs space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#143425] text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-[#A87E28]" />
            <span>Official Policy & Legal Charter</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#143425] tracking-tight">
            {page.title}
          </h1>

          {page.metaDescription && (
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-2xl">
              {page.metaDescription}
            </p>
          )}
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DED1] shadow-2xs">
          <article
            className="prose prose-stone prose-sm sm:prose-base max-w-none text-stone-700 leading-relaxed
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#143425]
              prose-h2:text-lg sm:prose-h2:text-xl prose-h2:border-b prose-h2:border-stone-100 prose-h2:pb-2.5 prose-h2:mt-8
              prose-h3:text-base prose-h3:mt-6
              prose-p:text-xs sm:prose-p:text-sm prose-p:leading-relaxed prose-p:text-stone-600
              prose-li:text-xs sm:prose-li:text-sm prose-li:text-stone-600
              prose-strong:text-[#143425] prose-strong:font-bold
              prose-a:text-[#143425] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#A87E28]"
            dangerouslySetInnerHTML={{ __html: page.htmlContent || "" }}
          />

          {/* Footer Quality Verification Strip */}
          <div className="mt-12 pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#143425]" />
              <span>KB Beverage Operations LLP • Certified Standards & Hygiene</span>
            </div>
            <Link
              href="/contact"
              className="text-[#143425] hover:text-[#A87E28] font-semibold underline transition-colors"
            >
              Need Clarification? Contact Concierge &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
