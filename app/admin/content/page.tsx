"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutTemplate,
  Layers,
  Sparkles,
  Megaphone,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Palette,
  X,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  badgeText?: string | null;
  imageUrl?: string | null;
  linkUrl: string;
  brandId?: string | null;
  brandName?: string | null;
  placement: string;
  themeColor?: string | null;
  displayOrder: number;
  isActive: boolean;
}

const COLOR_PRESETS = [
  { name: "Forest Emerald", hex: "#143425" },
  { name: "Artisan Gold", hex: "#A87E28" },
  { name: "Sapphire Botanical", hex: "#0E4D7A" },
  { name: "Velvet Charcoal", hex: "#1A1D1A" },
  { name: "Warm Sand", hex: "#FAF7F2" },
  { name: "Decadent Cocoa", hex: "#4A2810" }
];

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "promo" | "announcement" | "heritage">("hero");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State for Hero & Promo Banners
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form Fields for Modal
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formLinkUrl, setFormLinkUrl] = useState("/shop");
  const [formThemeColor, setFormThemeColor] = useState("#143425");
  const [formDisplayOrder, setFormDisplayOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formPlacement, setFormPlacement] = useState("HomeHero");

  // Announcement Bar Dedicated Form State
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("/shop");
  const [announcementLinkText, setAnnouncementLinkText] = useState("Shop Now →");
  const [announcementTheme, setAnnouncementTheme] = useState("#143425");
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementId, setAnnouncementId] = useState<string | null>(null);
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);

  // Heritage Story Form State
  const [heritageBadge, setHeritageBadge] = useState("Our Craftsmanship & Heritage");
  const [heritageTitle, setHeritageTitle] = useState("Single-Origin Purity, Masterfully Blended");
  const [heritageDesc, setHeritageDesc] = useState("We source directly from heritage tea gardens in Assam and spice hills of Idukki to craft instant authentic beverages without artificial additives.");
  const [heritageImage, setHeritageImage] = useState("/assets/banners/banner-master-blend.png");
  const [heritageId, setHeritageId] = useState<string | null>(null);
  const [isSavingHeritage, setIsSavingHeritage] = useState(false);

  // Fetch all banners from API
  const loadBanners = async () => {
    try {
      setIsLoading(true);
      const data: Banner[] = await fetchApi("/catalog/banners?activeOnly=false");
      if (Array.isArray(data)) {
        setBanners(data);

        // Populate Announcement Bar if exists
        const ann = data.find((b) => b.placement === "AnnouncementBar");
        if (ann) {
          setAnnouncementId(ann.id);
          setAnnouncementText(ann.title);
          setAnnouncementLink(ann.linkUrl || "/shop");
          setAnnouncementLinkText(ann.subtitle || "Shop Now →");
          setAnnouncementTheme(ann.themeColor || "#143425");
          setAnnouncementActive(ann.isActive);
        } else {
          setAnnouncementText("Free nationwide delivery on orders over ₹499 • Crafted with pure natural ingredients");
          setAnnouncementLink("/shop");
          setAnnouncementLinkText("Shop Now →");
          setAnnouncementTheme("#143425");
          setAnnouncementActive(true);
        }

        // Populate Heritage Story if exists
        const heritage = data.find((b) => b.placement === "HeritageStory");
        if (heritage) {
          setHeritageId(heritage.id);
          setHeritageTitle(heritage.title);
          setHeritageDesc(heritage.subtitle || "");
          setHeritageBadge(heritage.badgeText || "Our Craftsmanship & Heritage");
          setHeritageImage(heritage.imageUrl || "/assets/banners/banner-master-blend.png");
        }
      }
    } catch (err: any) {
      console.error("Failed to load CMS banners:", err);
      setStatusMessage({ type: "error", text: "Failed to load banners. Please refresh the page." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Open Modal for New Banner
  const handleOpenCreateModal = (placement: "HomeHero" | "PromoBanner") => {
    setEditingBanner(null);
    setFormPlacement(placement);
    setFormTitle("");
    setFormSubtitle("");
    setFormBadge(placement === "HomeHero" ? "Signature Blend" : "Special Offer");
    setFormImageUrl(placement === "HomeHero" ? "/assets/HeroSlider_images/vrinda_tea.png" : "/assets/banners/banner-master-blend.png");
    setFormLinkUrl("/shop");
    setFormThemeColor("#143425");
    const count = banners.filter((b) => b.placement === placement).length;
    setFormDisplayOrder(count + 1);
    setFormIsActive(true);
    setModalOpen(true);
  };

  // Open Modal for Editing Banner
  const handleOpenEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormPlacement(banner.placement);
    setFormTitle(banner.title);
    setFormSubtitle(banner.subtitle || "");
    setFormBadge(banner.badgeText || "");
    setFormImageUrl(banner.imageUrl || "");
    setFormLinkUrl(banner.linkUrl || "/shop");
    setFormThemeColor(banner.themeColor || "#143425");
    setFormDisplayOrder(banner.displayOrder);
    setFormIsActive(banner.isActive);
    setModalOpen(true);
  };

  // Upload image to backend
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await fetchApi("/catalog/upload-image", {
        method: "POST",
        body: formData,
      });
      if (res && res.url) {
        setFormImageUrl(res.url);
        showStatus("success", "Image uploaded successfully!");
      }
    } catch (err: any) {
      console.error("Upload error", err);
      showStatus("error", err?.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Save Banner (Create or Update)
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showStatus("error", "Please provide a title for the banner.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || null,
      badgeText: formBadge.trim() || null,
      imageUrl: formImageUrl.trim() || null,
      linkUrl: formLinkUrl.trim() || "/shop",
      placement: formPlacement,
      themeColor: formThemeColor,
      displayOrder: formDisplayOrder,
      isActive: formIsActive,
    };

    try {
      if (editingBanner) {
        await fetchApi(`/catalog/banners/${editingBanner.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showStatus("success", "Banner updated successfully!");
      } else {
        await fetchApi("/catalog/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showStatus("success", "New banner published successfully!");
      }
      setModalOpen(false);
      await loadBanners();
    } catch (err: any) {
      console.error("Failed to save banner", err);
      showStatus("error", err?.message || "Failed to save banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Banner Active/Inactive directly
  const handleToggleActive = async (banner: Banner) => {
    try {
      await fetchApi(`/catalog/banners/${banner.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: banner.title,
          subtitle: banner.subtitle,
          badgeText: banner.badgeText,
          imageUrl: banner.imageUrl,
          linkUrl: banner.linkUrl,
          brandId: banner.brandId,
          placement: banner.placement,
          themeColor: banner.themeColor,
          displayOrder: banner.displayOrder,
          isActive: !banner.isActive,
        }),
      });
      showStatus("success", `Banner ${!banner.isActive ? "activated" : "deactivated"} successfully!`);
      await loadBanners();
    } catch (err: any) {
      showStatus("error", "Failed to update banner status.");
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this banner?")) return;

    try {
      await fetchApi(`/catalog/banners/${id}`, { method: "DELETE" });
      showStatus("success", "Banner deleted successfully!");
      await loadBanners();
    } catch (err: any) {
      showStatus("error", "Failed to delete banner.");
    }
  };

  // Save Announcement Bar
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) {
      showStatus("error", "Announcement text cannot be empty.");
      return;
    }

    setIsSavingAnnouncement(true);
    const payload = {
      title: announcementText.trim(),
      subtitle: announcementLinkText.trim() || null,
      imageUrl: null,
      linkUrl: announcementLink.trim() || "/shop",
      placement: "AnnouncementBar",
      themeColor: announcementTheme,
      displayOrder: 1,
      isActive: announcementActive,
    };

    try {
      if (announcementId) {
        await fetchApi(`/catalog/banners/${announcementId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetchApi("/catalog/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res && res.id) setAnnouncementId(res.id);
      }
      showStatus("success", "Announcement bar settings saved and live on storefront!");
      await loadBanners();
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to save announcement bar.");
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  // Save Heritage Story
  const handleSaveHeritage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHeritage(true);
    const payload = {
      title: heritageTitle.trim(),
      subtitle: heritageDesc.trim(),
      badgeText: heritageBadge.trim(),
      imageUrl: heritageImage.trim(),
      linkUrl: "/about",
      placement: "HeritageStory",
      displayOrder: 1,
      isActive: true,
    };

    try {
      if (heritageId) {
        await fetchApi(`/catalog/banners/${heritageId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetchApi("/catalog/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res && res.id) setHeritageId(res.id);
      }
      showStatus("success", "Brand Heritage story updated successfully!");
      await loadBanners();
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to update heritage story.");
    } finally {
      setIsSavingHeritage(false);
    }
  };

  const heroBanners = banners.filter((b) => b.placement === "HomeHero");
  const promoBanners = banners.filter((b) => b.placement === "PromoBanner");

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
            <LayoutTemplate className="h-3.5 w-3.5 text-[#A87E28]" />
            <span>Storefront Content Management Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
            Storefront CMS & Marketing Banners
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage live hero sliders, promotional campaign grids, top announcement tickers, and brand storytelling.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-[#143425] shadow-2xs transition-colors self-start sm:self-auto"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
        </Link>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap border-b border-stone-200 gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === "hero"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Hero Carousel Slides</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
            {heroBanners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("promo")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === "promo"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Promotional Banners</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
            {promoBanners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("announcement")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === "announcement"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Megaphone className="h-4 w-4" />
          <span>Top Announcement Bar</span>
          <span className={`h-2 w-2 rounded-full ${announcementActive ? "bg-emerald-500" : "bg-stone-300"}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("heritage")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === "heritage"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Brand Heritage Story</span>
        </button>
      </div>

      {/* TAB 1: HERO CAROUSEL SLIDES */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
            <div>
              <h2 className="font-serif text-base font-bold text-[#143425]">
                Homepage Hero Carousel Slides
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                These slides cycle automatically on the storefront hero section. Customers click through to products or category collections.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleOpenCreateModal("HomeHero")}
              className="gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Hero Slide</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#143425]" />
              <p className="text-xs text-stone-500 font-medium">Loading hero slides...</p>
            </div>
          ) : heroBanners.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
              <Layers className="h-10 w-10 mx-auto text-stone-300" />
              <p className="font-bold text-sm text-stone-700">No Custom Hero Slides Yet</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                The storefront is currently showing the default fallback slides (Vrinda, Sangam, Urban Roast, CocoJoy). Click below to create your first dynamic slide!
              </p>
              <Button variant="primary" size="sm" onClick={() => handleOpenCreateModal("HomeHero")}>
                Create First Hero Slide
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {heroBanners.map((slide) => (
                <div
                  key={slide.id}
                  className={`bg-white rounded-3xl border p-5 shadow-2xs space-y-4 transition-all ${
                    slide.isActive ? "border-stone-200/80 hover:border-[#143425]/40" : "border-stone-200 bg-stone-50/50 opacity-70"
                  }`}
                >
                  {/* Image & Badges Preview */}
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                    {slide.imageUrl ? (
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-stone-400 text-xs">
                        No image uploaded
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {slide.badgeText && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                          {slide.badgeText}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/90 text-stone-700 shadow-2xs">
                        Order #{slide.displayOrder}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <span
                        className="h-4 w-4 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: slide.themeColor || "#143425" }}
                        title={`Theme: ${slide.themeColor}`}
                      />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-[#143425] line-clamp-1">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {slide.subtitle || "No secondary description provided."}
                    </p>
                  </div>

                  {/* Actions & Status Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(slide)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] transition-colors ${
                          slide.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-stone-200 text-stone-600 border border-stone-300"
                        }`}
                      >
                        {slide.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{slide.isActive ? "Active on Store" : "Draft / Inactive"}</span>
                      </button>

                      <span className="text-[11px] text-stone-400 font-mono">
                        {slide.linkUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(slide)}
                        className="p-2 rounded-xl text-stone-500 hover:text-[#143425] hover:bg-stone-100 transition-colors"
                        title="Edit Slide"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(slide.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROMOTIONAL CAMPAIGN BANNERS */}
      {activeTab === "promo" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
            <div>
              <h2 className="font-serif text-base font-bold text-[#143425]">
                Promotional Campaign Banners
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Banners displayed in the homepage marketing grid (Signature Blends, Botanical Iced Teas, Season Specials).
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleOpenCreateModal("PromoBanner")}
              className="gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Promo Banner</span>
            </Button>
          </div>

          {promoBanners.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
              <Sparkles className="h-10 w-10 mx-auto text-stone-300" />
              <p className="font-bold text-sm text-stone-700">No Custom Promo Banners</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                The storefront is using default promotional assets. You can add seasonal banners to promote limited editions or category offers.
              </p>
              <Button variant="primary" size="sm" onClick={() => handleOpenCreateModal("PromoBanner")}>
                Create Promo Banner
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {promoBanners.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-4"
                >
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                    {promo.imageUrl ? (
                      <Image
                        src={promo.imageUrl}
                        alt={promo.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-stone-400 text-xs">
                        No image uploaded
                      </div>
                    )}
                    {promo.badgeText && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                        {promo.badgeText}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold text-[#143425] line-clamp-1">
                      {promo.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {promo.subtitle || "No description."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(promo)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        promo.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-stone-200 text-stone-600 border border-stone-300"
                      }`}
                    >
                      {promo.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      <span>{promo.isActive ? "Active" : "Inactive"}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(promo)}
                        className="p-2 rounded-xl text-stone-500 hover:text-[#143425] hover:bg-stone-100 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(promo.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TOP ANNOUNCEMENT BAR */}
      {activeTab === "announcement" && (
        <form onSubmit={handleSaveAnnouncement} className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-2xs">
            <div>
              <h2 className="font-serif text-base font-bold text-[#143425] flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-[#A87E28]" />
                <span>Store-Wide Top Announcement Strip</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Renders prominently at the top of every storefront page above the navigation header. Perfect for free shipping notices, coupon codes, and festival announcements.
              </p>
            </div>

            {/* Live Visual Preview */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Live Storefront Preview
              </label>
              <div
                className="p-3 rounded-2xl text-center text-xs font-medium transition-all shadow-sm"
                style={{
                  backgroundColor: announcementTheme,
                  color: announcementTheme === "#FAF7F2" ? "#143425" : "#ffffff",
                }}
              >
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
                    <span>{announcementText || "Sample Announcement Text"}</span>
                  </span>
                  <span className="underline font-semibold ml-1 cursor-pointer">
                    {announcementLinkText || "Shop Now →"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Announcement Message Text
                </label>
                <input
                  type="text"
                  required
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Free nationwide delivery on orders over ₹499 • Use code KBWELCOME10"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Call-to-Action Link Text
                </label>
                <input
                  type="text"
                  value={announcementLinkText}
                  onChange={(e) => setAnnouncementLinkText(e.target.value)}
                  placeholder="e.g. Shop Now → or Claim Offer"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Target Destination URL
                </label>
                <input
                  type="text"
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  placeholder="/shop or /collections"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              {/* Theme Color Picker */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Background Color Theme
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setAnnouncementTheme(preset.hex)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        announcementTheme === preset.hex
                          ? "border-[#143425] ring-2 ring-[#143425]/20 bg-stone-50"
                          : "border-stone-200 hover:border-stone-400 bg-white"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="text-stone-700">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility Switch */}
              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="h-4 w-4 rounded text-[#143425] focus:ring-[#143425]"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">
                      Enable Announcement Strip on Storefront
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Uncheck to immediately hide the top announcement strip without losing your copy.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="primary" size="lg" type="submit" disabled={isSavingAnnouncement}>
                {isSavingAnnouncement ? "Saving Changes..." : "Publish Announcement Settings"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: BRAND HERITAGE & STORY */}
      {activeTab === "heritage" && (
        <form onSubmit={handleSaveHeritage} className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-2xs">
            <div>
              <h2 className="font-serif text-base font-bold text-[#143425] flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#A87E28]" />
                <span>Homepage Editorial Heritage Story</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Controls the artisan craftsmanship section on the homepage, highlighting purity standards, single-origin sourcing, and brand mission.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Top Eyebrow Tagline
                </label>
                <input
                  type="text"
                  value={heritageBadge}
                  onChange={(e) => setHeritageBadge(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={heritageTitle}
                  onChange={(e) => setHeritageTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Editorial Story Narrative
                </label>
                <textarea
                  rows={4}
                  value={heritageDesc}
                  onChange={(e) => setHeritageDesc(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Showcase Image URL or Path
                </label>
                <input
                  type="text"
                  value={heritageImage}
                  onChange={(e) => setHeritageImage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="primary" size="lg" type="submit" disabled={isSavingHeritage}>
                {isSavingHeritage ? "Saving..." : "Save Brand Story"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* MODAL: CREATE / EDIT BANNER (Hero & Promo) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-[#143425]">
                {editingBanner
                  ? `Edit ${formPlacement === "HomeHero" ? "Hero Slide" : "Promo Banner"}`
                  : `Add New ${formPlacement === "HomeHero" ? "Hero Slide" : "Promo Banner"}`}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Image Upload Zone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Banner Imagery
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/70 hover:border-[#143425]/40 transition-colors">
                  {formImageUrl ? (
                    <div className="relative h-20 w-32 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                      <Image src={formImageUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-20 w-32 rounded-xl border border-dashed border-stone-300 flex items-center justify-center text-stone-400 shrink-0">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <p className="text-xs font-bold text-stone-800">
                      Upload from device or enter URL
                    </p>
                    <p className="text-[11px] text-stone-400">
                      PNG, JPG, WEBP, or SVG up to 10MB
                    </p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-1.5 text-xs h-8"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>{isUploading ? "Uploading..." : "Choose Image"}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="Or paste direct image URL (/assets/HeroSlider_images/...)"
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Main Title / Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Royal Cardamom & Saffron Chai"
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Badge Tagline
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. 15% Off First Order"
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Display Order (1 = first)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="Brief description of the blend or campaign..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Call-to-Action Link URL
                  </label>
                  <input
                    type="text"
                    value={formLinkUrl}
                    onChange={(e) => setFormLinkUrl(e.target.value)}
                    placeholder="/shop or /brands/vrinda"
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                {/* Theme Color Presets */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                    Accent Color Theme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setFormThemeColor(preset.hex)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          formThemeColor === preset.hex
                            ? "border-[#143425] ring-2 ring-[#143425]/20 bg-stone-50"
                            : "border-stone-200 bg-white"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-[11px] text-stone-700">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="h-4 w-4 rounded text-[#143425] focus:ring-[#143425]"
                    />
                    <span className="text-xs font-semibold text-stone-700">
                      Publish and make active on live storefront
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : editingBanner ? "Save Changes" : "Create Slide"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
