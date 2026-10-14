import { redirect } from "next/navigation";
import { getCollectionByIdOrSlug } from "@/service/collections";

interface CollectionSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionSlugPage({ params }: CollectionSlugPageProps) {
  const { slug } = await params;
  const clean = (slug || "").toLowerCase().trim();

  const col = getCollectionByIdOrSlug(clean);
  if (col) {
    redirect(`/brands/${col.brandSlug}`);
  }

  // If slug matches coco, redirect to cocojoy brand page
  if (clean.includes("coco")) {
    redirect("/brands/cocojoy");
  }

  // Default redirect to brands overview
  redirect("/brands");
}
