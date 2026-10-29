import { API_BASE_URL } from "@/lib/api";

export interface CustomPageItem {
  id: string;
  title: string;
  slug: string;
  htmlContent?: string;
  metaDescription?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationTreeItem {
  id: string;
  menuLocation: string;
  label: string;
  url: string;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
  children?: NavigationTreeItem[];
}

export interface TestimonialItem {
  id: string;
  reviewerName: string;
  reviewerSubtext?: string | null;
  quote: string;
  rating: number;
  avatarImageUrl?: string | null;
  brandName?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeoSettingsMap {
  [key: string]: string;
}

// 1. Fetch Single Custom Page for Storefront
export async function getCustomPage(slug: string): Promise<CustomPageItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/content/pages/${encodeURIComponent(slug)}`, {
      next: { tags: ["pages", `page-${slug}`], revalidate: 60 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Error fetching custom page /${slug}:`, err);
    return null;
  }
}

// 2. Fetch Navigation Tree for Header / Footer
export async function getNavigationTree(location: string): Promise<NavigationTreeItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/content/navigation/tree/${encodeURIComponent(location)}?activeOnly=true`, {
      next: { tags: ["navigation", `nav-${location.toLowerCase()}`], revalidate: 60 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(`Error fetching navigation for ${location}:`, err);
    return [];
  }
}

// 3. Fetch Testimonials for Storefront Slider
export async function getTestimonials(brand?: string): Promise<TestimonialItem[]> {
  try {
    const params = new URLSearchParams();
    if (brand) params.append("brand", brand);

    const res = await fetch(`${API_BASE_URL}/content/testimonials?${params.toString()}`, {
      next: { tags: ["testimonials"], revalidate: 60 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    return [];
  }
}

// 4. Fetch Global SEO Settings for layout
export async function getSeoSettings(): Promise<SeoSettingsMap> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings/seo`, {
      next: { tags: ["seo"], revalidate: 120 }
    });
    if (!res.ok) return {};
    return await res.json();
  } catch (err) {
    console.error("Error fetching SEO settings:", err);
    return {};
  }
}

// Client helper to trigger instant revalidation after Admin changes
export async function triggerRevalidate(tag: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag })
    });
    return res.ok;
  } catch {
    return false;
  }
}
