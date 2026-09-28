"use client";

import React, { useState } from "react";
import { HERO_CONTENT } from "@/data/homepage";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Sparkles, Layers, Sliders, LayoutTemplate } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function AdminContentPage() {
  const [heroBadge, setHeroBadge] = useState(HERO_CONTENT.badgeText);
  const [heroTitle, setHeroTitle] = useState(HERO_CONTENT.title);
  const [heroHighlight, setHeroHighlight] = useState(HERO_CONTENT.highlightText);
  const [heroDesc, setHeroDesc] = useState(HERO_CONTENT.description);
  const [bannerText, setBannerText] = useState(
    "Free nationwide delivery on orders over ₹499 • Crafted with pure natural ingredients"
  );
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/catalog/banners", {
        method: "POST",
        body: JSON.stringify({
          title: heroTitle,
          subtitle: heroDesc,
          badgeText: heroBadge,
          imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
          linkUrl: "/shop",
          placement: "HomeHero",
          isActive: true
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save content", err);
      alert("Failed to save banner content.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
          <LayoutTemplate className="h-3 w-3 text-[#A87E28]" />
          <span>Storefront CMS Control Interface</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#143425]">
          Homepage & Content Management
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure editorial hero messaging, promotional announcement banners, and brand pillar highlights.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Homepage editorial copy updated successfully in mock store!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Top Announcement Bar Editor */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
          <h2 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#A87E28]" />
            <span>Top Announcement Strip</span>
          </h2>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
              Announcement Message
            </label>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
            />
          </div>
        </div>

        {/* Hero Section Copy Editor */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
          <h2 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#A87E28]" />
            <span>Storefront Hero Section</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                Top Badge Tagline
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                Italic Highlight Accent Text
              </label>
              <input
                type="text"
                value={heroHighlight}
                onChange={(e) => setHeroHighlight(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
              Hero Main Headline
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
              Hero Editorial Paragraph
            </label>
            <textarea
              rows={3}
              value={heroDesc}
              onChange={(e) => setHeroDesc(e.target.value)}
              className="w-full p-3 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
            />
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-3 shadow-2xs">
          <h2 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#A87E28]" />
            <span>Homepage Section Sequence</span>
          </h2>

          <div className="space-y-2 text-xs text-stone-700">
            {[
              "1. Full-Width Hero Section",
              "2. The Four Primary Categories Grid",
              "3. Featured Products Showcase",
              "4. Brand Portfolio Grid (Vrinda, Sangam, Urban Roast, CocoJoy)",
              "5. Craftsmanship & Purity Science Pillars",
              "6. Editorial About Teaser",
              "7. Final Commerce Call-to-Action",
            ].map((section, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between"
              >
                <span className="font-medium">{section}</span>
                <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Visible
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" type="submit">
            Save CMS Modifications
          </Button>
        </div>
      </form>
    </div>
  );
}
