import { API_BASE_URL } from "@/lib/api";

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  badgeText?: string | null;
  imageUrl?: string | null;
  linkUrl: string;
  brandId?: string | null;
  brandName?: string | null;
  placement: string; // HomeHero, PromoBanner, AnnouncementBar, BrandBanner, HeritageStory
  themeColor?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export async function getBanners(placement?: string, activeOnly: boolean = true): Promise<BannerItem[]> {
  try {
    const params = new URLSearchParams();
    if (placement) params.append("placement", placement);
    params.append("activeOnly", String(activeOnly));

    const res = await fetch(`${API_BASE_URL}/catalog/banners?${params.toString()}`, {
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      console.warn(`Failed to fetch banners for placement: ${placement}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching banners:", err);
    return [];
  }
}
